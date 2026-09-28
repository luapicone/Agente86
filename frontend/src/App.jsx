import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { generateProjectProposal } from './services/api'
import { generateFloorPlan, generateRender } from './services/renderApi'
import { generateRenderWithPuter } from './services/puterRender'
import EnvironmentCarousel from './components/EnvironmentCarousel'
import ImageEditStudio from './components/ImageEditStudio'
import ImageLightbox from './components/ImageLightbox'
import LandingHome from './components/LandingHome'
import ProjectChatbot from './components/ProjectChatbot'
import ConceptFloorPlan from './components/ConceptFloorPlan'
import MarketplaceView from './components/MarketplaceView'
import { downloadProjectPdf } from './components/ProjectPdfSummary'
import {
  buildEnvironmentPrompt,
  buildMasterHousePrompt,
  expandEnvironmentViews,
  getEnvironmentDefinitions,
} from './utils/environmentPrompts'

const initialAnswers = {}

const VIEW_PATHS = {
  home: '/',
  generator: '/configurador',
  marketplace: '/marketplace',
}

function getViewFromPath(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'

  return Object.entries(VIEW_PATHS).find(([, path]) => path === normalizedPath)?.[0] || 'home'
}

function normalizeBooleanAnswer(value) {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 'si' || value === 'sí') return true
  if (value === 'false' || value === 'no') return false
  return Boolean(value)
}

function normalizeProjectAnswers(answers) {
  return {
    ...answers,
    propertyType: answers.propertyType || 'casa',
    squareMeters: Number(answers.squareMeters || 0),
    bedrooms: Number(answers.bedrooms || 0),
    bathrooms: Number(answers.bathrooms || 0),
    budget: Number(answers.budget || 0),
    floors: Number(answers.floors || 1),
    hasSuiteBathroom: normalizeBooleanAnswer(answers.hasSuiteBathroom),
    hasPool: normalizeBooleanAnswer(answers.hasPool),
    hasGarage: normalizeBooleanAnswer(answers.hasGarage),
    hasQuincho: normalizeBooleanAnswer(answers.hasQuincho),
    hasGrill: normalizeBooleanAnswer(answers.hasGrill),
  }
}

function App() {
  const [currentView, setCurrentView] = useState(() => getViewFromPath(window.location.pathname))
  const [generatedProject, setGeneratedProject] = useState(null)
  const [chatAnswers, setChatAnswers] = useState(initialAnswers)
  const [, setIsGeneratingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const [lightboxItem, setLightboxItem] = useState(null)
  const [editableImage, setEditableImage] = useState(null)
  const [isRetryingFloorPlans, setIsRetryingFloorPlans] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateToView = (view) => {
    const nextPath = VIEW_PATHS[view] || VIEW_PATHS.home

    if (window.location.pathname !== nextPath) {
      window.history.pushState({ view }, '', nextPath)
    }

    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const requestRenderAsset = async ({ prompt, negativePrompt, payload }) => {
    try {
      const renderResponse = await generateRender(
        payload || {
          prompt,
          negativePrompt,
        },
      )

      if (renderResponse?.render?.imageUrl) {
        return {
          imageUrl: renderResponse.render.imageUrl,
          provider: renderResponse.render.providerUsed || renderResponse.render.provider || 'backend',
          note: renderResponse.render.note || 'Render generado desde el backend.',
        }
      }
    } catch {
      // Keep fallbacking to client-side generation when backend render is unavailable.
    }

    try {
      return await generateRenderWithPuter({ prompt, negativePrompt })
    } catch {
      return null
    }
  }

  const generateEnvironmentGallery = async (project, answers, masterPrompt) => {
    const environments = getEnvironmentDefinitions(answers)
    const images = []

    for (const environment of environments) {
      const views = expandEnvironmentViews(environment)

      for (const view of views) {
        const prompt = buildEnvironmentPrompt(view, project, answers, masterPrompt)

        try {
          const renderAsset = await requestRenderAsset({
            prompt,
            negativePrompt: project.negativePrompt,
          })

          images.push({
            ...view,
            environmentLabel: environment.title,
            imageUrl: renderAsset?.imageUrl || null,
            provider: renderAsset?.provider || 'fallback',
          })
        } catch {
          images.push({
            ...view,
            environmentLabel: environment.title,
            imageUrl: null,
            provider: 'fallback',
          })
        }
      }
    }

    return images
  }

  const generateAiFloorPlans = async (answers, existingPlans = []) => {
    const floorCount = answers.propertyType === 'departamento'
      ? 1
      : Math.min(3, Math.max(1, Number(answers.floors || 1)))
    const completedFloors = new Set(existingPlans.map((item) => item.floorNumber))
    const pendingFloors = Array.from({ length: floorCount }, (_, index) => index + 1)
      .filter((floorNumber) => !completedFloors.has(floorNumber))
    const requests = pendingFloors.map(async (floorNumber) => {
      try {
        const response = await generateFloorPlan({ ...answers, floorNumber })
        return response?.floorPlan || null
      } catch {
        return null
      }
    })

    const generatedPlans = (await Promise.all(requests)).filter(Boolean)
    return [...existingPlans, ...generatedPlans]
      .sort((first, second) => first.floorNumber - second.floorNumber)
  }

  const handleRetryFloorPlans = async () => {
    if (!generatedProject || isRetryingFloorPlans) return

    setIsRetryingFloorPlans(true)

    try {
      const normalizedPayload = normalizeProjectAnswers(chatAnswers)
      const floorPlans = await generateAiFloorPlans(normalizedPayload, generatedProject.floorPlans || [])
      setGeneratedProject((current) => current ? { ...current, floorPlans } : current)
    } finally {
      setIsRetryingFloorPlans(false)
    }
  }

  const handleEditedImage = (itemId, imageUrl) => {
    setGeneratedProject((current) => {
      if (!current) return current

      return {
        ...current,
        environmentGallery: current.environmentGallery.map((item) =>
          item.id === itemId
            ? { ...item, imageUrl, provider: 'fal-edit', edited: true }
            : item,
        ),
      }
    })
    setEditableImage((current) => current?.id === itemId ? { ...current, imageUrl } : current)
  }

  const handleGenerateFromChat = async (answers) => {
    setFormError('')
    setImageLoadFailed(false)
    setIsSubmitting(true)
    setIsGeneratingImage(true)
    navigateToView('generator')
    setChatAnswers(answers)

    try {
      const normalizedPayload = normalizeProjectAnswers(answers)

      const generated = await generateProjectProposal(normalizedPayload)

      const masterPrompt = buildMasterHousePrompt(normalizedPayload, generated)
      const mainRenderAsset = await requestRenderAsset({
        prompt: masterPrompt,
        negativePrompt: generated.negativePrompt,
        payload: normalizedPayload,
      })

      const [environmentGallery, floorPlans] = await Promise.all([
        generateEnvironmentGallery(generated, normalizedPayload, masterPrompt),
        generateAiFloorPlans(normalizedPayload),
      ])

      setGeneratedProject({
        ...generated,
        imageStatus: mainRenderAsset?.imageUrl ? 'ready' : 'unavailable',
        imageDescription:
          mainRenderAsset?.note ||
          'No se pudo generar la vista principal, pero la propuesta del proyecto sí quedó armada con la información del chat.',
        imageUrl: mainRenderAsset?.imageUrl || null,
        renderProvider: mainRenderAsset?.provider || null,
        masterPrompt,
        environmentGallery,
        floorPlans,
        floorPlanCount: normalizedPayload.propertyType === 'departamento'
          ? 1
          : Math.min(3, Math.max(1, Number(normalizedPayload.floors || 1))),
      })
    } catch (error) {
      setGeneratedProject(null)
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
      setIsGeneratingImage(false)
    }
  }

  return (
    <div className="habitat-app">
      {currentView !== 'home' ? <nav className="navbar navbar-expand-lg navbar-dark habitat-navbar sticky-top">
        <div className="container">
          <button
            type="button"
            className="navbar-brand fw-bold border-0 bg-transparent text-white"
            onClick={() => navigateToView('home')}
          >
            HabitatIA
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="#mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigateToView('home')}>
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigateToView('generator')}>
                  Configurador
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigateToView('marketplace')}>
                  Marketplace
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-success ms-lg-2" onClick={() => navigateToView('generator')}>
                  Empezar ahora
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav> : null}

      {currentView === 'home' ? (
        <LandingHome
          onStartProject={() => navigateToView('generator')}
          onOpenMarketplace={() => navigateToView('marketplace')}
        />
      ) : null}

      {currentView === 'generator' ? (
        <main className="generator-page py-5">
          <div className="container">
            <div className="row g-4 align-items-start compact-top-layout">
              <div className="col-lg-5">
                <ProjectChatbot initialAnswers={initialAnswers} onComplete={handleGenerateFromChat} isSubmitting={isSubmitting} />
                {formError ? <div className="alert alert-danger mt-4">{formError}</div> : null}
              </div>

              <div className="col-lg-7">
                <div className="result-card shadow-sm mb-4">
                  <h2 className="h4 fw-bold mb-3">Resultado estimado</h2>

                  {generatedProject ? (
                    <>
                      <div className="result-highlight mb-4">
                        <h3 className="h5 fw-bold mb-3">Render principal de la vivienda</h3>
                        {generatedProject.imageUrl ? (
                          <>
                            <button
                              type="button"
                              className="environment-slide-button w-100"
                              onClick={() =>
                                setLightboxItem({
                                  imageUrl: generatedProject.imageUrl,
                                  title: generatedProject.projectName,
                                  description: generatedProject.imageDescription,
                                })
                              }
                            >
                              <img
                                src={generatedProject.imageUrl}
                                alt={`Render principal de ${generatedProject.projectName}`}
                                className="d-block w-100 environment-image rounded-4"
                                onError={() => setImageLoadFailed(true)}
                              />
                            </button>
                            <p className="text-muted mt-3 mb-1">{generatedProject.imageDescription}</p>
                            <small className="text-muted">
                              {generatedProject.renderProvider
                                ? `Proveedor usado: ${generatedProject.renderProvider}`
                                : 'Render generado desde el flujo automático del proyecto.'}
                            </small>
                          </>
                        ) : (
                          <div className="empty-state">
                            <p className="text-muted mb-0">
                              No pudimos mostrar la imagen principal de la casa en este intento, pero la propuesta se generó
                              correctamente. Probá generar de nuevo para pedir otro render.
                            </p>
                          </div>
                        )}
                        {imageLoadFailed ? (
                          <div className="alert alert-warning mt-3 mb-0">
                            La imagen principal se generó pero no se pudo cargar en pantalla. Probá abrirla de nuevo o volver a generar el proyecto.
                          </div>
                        ) : null}
                      </div>

                      <div className="result-highlight mb-3">
                        <h3 className="h5 fw-bold mb-1">{generatedProject.projectName}</h3>
                        <p className="mb-0 text-muted">{generatedProject.summary}</p>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="metric-box">
                            <span className="metric-label">Costo estimado</span>
                            <strong>USD {generatedProject.estimatedCost.toLocaleString()}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="metric-box">
                            <span className="metric-label">Ahorro potencial</span>
                            <strong>USD {generatedProject.estimatedSavings.toLocaleString()}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="metric-box">
                            <span className="metric-label">Índice sustentable</span>
                            <strong>{generatedProject.sustainabilityScore}/100</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="metric-box">
                            <span className="metric-label">Reducción CO₂</span>
                            <strong>{generatedProject.carbonReduction}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3 className="h6 fw-bold">Tipo de solución</h3>
                        <p className="mb-2 text-muted">{generatedProject.modularType}</p>
                        <h3 className="h6 fw-bold">Material recomendado</h3>
                        <p className="mb-2 text-muted">{generatedProject.recommendedMaterial}</p>
                        <h3 className="h6 fw-bold">Estrategia energética</h3>
                        <p className="mb-0 text-muted">{generatedProject.energyEfficiency}</p>
                      </div>

                      <div className="mb-3">
                        <h3 className="h6 fw-bold">Distribución sugerida</h3>
                        <p className="mb-0 text-muted">{generatedProject.recommendedLayout}</p>
                      </div>

                      <div className="mb-3">
                        <h3 className="h6 fw-bold">Configuración elegida</h3>
                        <ul className="result-list mb-0">
                          <li>Tipo: {generatedProject.propertyType}</li>
                          {generatedProject.propertyType === 'Casa' ? <li>Pisos: {generatedProject.floors}</li> : null}
                          <li>Familia estimada: {chatAnswers.familyMembers} integrante(s)</li>
                          <li>Terreno disponible: {chatAnswers.hasLand === 'si' ? 'Sí' : 'No'}</li>
                          <li>Urgencia: {chatAnswers.urgency}</li>
                          <li>Nivel de calidad: {chatAnswers.qualityLevel}</li>
                          {generatedProject.selectedFeatures?.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-3">
                        <h3 className="h6 fw-bold">Recomendaciones</h3>
                        <ul className="result-list mb-0">
                          {generatedProject.recommendations.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                          <li>Evaluar construcción por etapas para empezar con lo esencial y ampliar después.</li>
                          <li>Priorizar los espacios más necesarios para la familia según el presupuesto real.</li>
                        </ul>
                      </div>

                      {generatedProject.materialEstimate ? (
                        <div className="material-estimate-box">
                          <h3 className="h6 fw-bold mb-3">Materiales optimizados para la obra</h3>
                          <div className="table-responsive">
                            <table className="table table-sm align-middle material-table">
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Cantidad</th>
                                  <th>Precio base</th>
                                  <th>Oferta arquitecto</th>
                                  <th>Ahorro</th>
                                </tr>
                              </thead>
                              <tbody>
                                {generatedProject.materialEstimate.materials.map((material) => (
                                  <tr key={material.key}>
                                    <td>{material.name}</td>
                                    <td>{material.quantity} {material.unit}</td>
                                    <td>USD {material.baseTotal.toLocaleString()}</td>
                                    <td>
                                      {material.architectOffers?.length ? (
                                        <div className="architect-offers-stack">
                                          {material.architectOffers.map((offer) => (
                                            <div key={`${material.key}-${offer.listingId}`} className="architect-offer-chip">
                                              <div className="architect-offer-name">{offer.architect}</div>
                                              <small>
                                                {offer.applicableQuantity} {material.unit} a USD {offer.discountPrice}
                                                {offer.location ? ` · ${offer.location}` : ''}
                                                {offer.isFallbackLocation ? ' · otra zona' : ''}
                                              </small>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="offer-empty">Sin oferta disponible</span>
                                      )}
                                    </td>
                                    <td>USD {material.architectSavings.toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="row g-3 mt-2">
                            <div className="col-md-6">
                              <div className="metric-box">
                                <span className="metric-label">Total materiales</span>
                                <strong>USD {generatedProject.materialEstimate.totals.optimizedMaterialTotal.toLocaleString()}</strong>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="metric-box">
                                <span className="metric-label">Descuento por compra a arquitectos</span>
                                <strong>USD {generatedProject.materialEstimate.totals.architectDiscountTotal.toLocaleString()}</strong>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="metric-box">
                                <span className="metric-label">Costo con descuento del marketplace</span>
                                <strong>USD {generatedProject.materialEstimate.totals.discountedMaterialTotal.toLocaleString()}</strong>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="metric-box">
                                <span className="metric-label">Presupuesto final de referencia</span>
                                <strong>USD {generatedProject.materialEstimate.totals.estimatedConstructionBudget.toLocaleString()}</strong>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="metric-box">
                                <span className="metric-label">Ahorro estimado por marketplace</span>
                                <strong>USD {generatedProject.materialEstimate.totals.finalDifference.toLocaleString()}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="empty-state">
                      <p className="text-muted mb-3">
                        Cuando termines de responder el chat, acá vas a ver la propuesta general del proyecto.
                      </p>
                      <ul className="result-list mb-0">
                        <li>Estimación de costo de construcción</li>
                        <li>Materiales sugeridos</li>
                        <li>Métricas de sustentabilidad</li>
                        <li>Diseño modular recomendado</li>
                      </ul>
                    </div>
                  )}
                </div>

                {generatedProject ? (
                  <div className="result-card shadow-sm mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                      <div>
                        <h2 className="h4 fw-bold mb-1">Resumen descargable</h2>
                        <p className="text-muted mb-0">Descargá o imprimí un resumen del proyecto con materiales y plano.</p>
                      </div>
                      <button className="btn btn-success" onClick={() => downloadProjectPdf(generatedProject, chatAnswers)}>
                        Descargar resumen PDF
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {generatedProject ? (
              <ConceptFloorPlan
                aiPlans={generatedProject.floorPlans}
                expectedCount={generatedProject.floorPlanCount}
                isRetrying={isRetryingFloorPlans}
                onRetry={handleRetryFloorPlans}
              />
            ) : null}

            {generatedProject?.environmentGallery?.length ? (
              <section className="environment-section mt-4">
                <div className="result-card shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <div>
                      <span className="section-kicker">Galería generada</span>
                      <h2 className="section-title mb-0">Ambientes del proyecto</h2>
                    </div>
                    <span className="text-muted small">Click en una imagen para verla en pantalla completa</span>
                  </div>

                  <EnvironmentCarousel
                    items={generatedProject.environmentGallery.filter((item) => item.imageUrl)}
                    onEdit={(item) => setEditableImage(item)}
                    onOpen={(item) => setLightboxItem(item)}
                  />

                  {editableImage ? (
                    <ImageEditStudio
                      key={editableImage.id}
                      item={editableImage}
                      onApply={handleEditedImage}
                      onClose={() => setEditableImage(null)}
                    />
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
        </main>
      ) : null}

      {currentView === 'marketplace' ? <MarketplaceView /> : null}

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  )
}

export default App
