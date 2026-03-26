import { useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { generateProjectProposal } from './services/api'
import { generateRender } from './services/renderApi'
import { generateRenderWithPuter } from './services/puterRender'
import EnvironmentCarousel from './components/EnvironmentCarousel'
import ImageLightbox from './components/ImageLightbox'
import ProjectChatbot from './components/ProjectChatbot'
import {
  buildEnvironmentPrompt,
  expandEnvironmentViews,
  getEnvironmentDefinitions,
} from './utils/environmentPrompts'

const initialAnswers = {}

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [generatedProject, setGeneratedProject] = useState(null)
  const [chatAnswers, setChatAnswers] = useState(initialAnswers)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const [lightboxItem, setLightboxItem] = useState(null)

  const features = [
    {
      title: 'Vivienda accesible',
      description:
        'Propuestas pensadas para familias que necesitan una solución habitacional posible de construir y ampliar.',
    },
    {
      title: 'Menor costo de obra',
      description:
        'Estimaciones orientadas a reducir materiales innecesarios y aprovechar mejor el presupuesto disponible.',
    },
    {
      title: 'Diseño para crecer',
      description:
        'Opciones modulares que permiten arrancar con lo esencial y ampliar la vivienda en el futuro.',
    },
  ]

  const impacts = [
    {
      title: 'Impacto social',
      description:
        'Apunta a acercar una vivienda digna y funcional a familias que hoy tienen presupuestos ajustados.',
    },
    {
      title: 'Impacto ambiental',
      description:
        'Promueve materiales y estrategias que ayudan a ahorrar energía y reducir desperdicios.',
    },
    {
      title: 'Impacto económico',
      description:
        'Ayuda a tomar decisiones más claras para construir con menos errores y menos gasto innecesario.',
    },
  ]

  const generateEnvironmentGallery = async (project, answers) => {
    const environments = getEnvironmentDefinitions(answers)
    const images = []

    for (const environment of environments) {
      const views = expandEnvironmentViews(environment)

      for (const view of views) {
        const prompt = buildEnvironmentPrompt(view, project, answers)

        try {
          const puterRender = await generateRenderWithPuter({
            prompt,
            negativePrompt: project.negativePrompt,
          })

          images.push({
            ...view,
            environmentLabel: environment.title,
            imageUrl: puterRender.imageUrl,
            provider: puterRender.provider,
          })
        } catch (_error) {
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

  const handleGenerateFromChat = async (answers) => {
    setFormError('')
    setImageLoadFailed(false)
    setIsSubmitting(true)
    setIsGeneratingImage(true)
    setCurrentView('generator')
    setChatAnswers(answers)

    try {
      const normalizedPayload = {
        ...answers,
        squareMeters: Number(answers.squareMeters || 0),
        bedrooms: Number(answers.bedrooms || 0),
        bathrooms: Number(answers.bathrooms || 0),
        budget: Number(answers.budget || 0),
        floors: Number(answers.floors || 1),
      }

      const generated = await generateProjectProposal(normalizedPayload)

      let renderResponse = null
      let puterRender = null

      try {
        puterRender = await generateRenderWithPuter({
          prompt: generated.imagePrompt,
          negativePrompt: generated.negativePrompt,
        })
      } catch (_puterError) {
        puterRender = null
      }

      if (!puterRender) {
        try {
          renderResponse = await generateRender(normalizedPayload)
        } catch (_renderError) {
          renderResponse = null
        }
      }

      const environmentGallery = await generateEnvironmentGallery(generated, normalizedPayload)

      setGeneratedProject({
        ...generated,
        imageStatus: 'ready',
        imageDescription:
          puterRender?.note ||
          renderResponse?.render?.note ||
          'Vista conceptual lista para usar como base de render o integración con proveedores externos.',
        imageUrl: puterRender?.imageUrl || renderResponse?.render?.imageUrl || null,
        renderProvider: puterRender?.provider || renderResponse?.render?.provider || null,
        environmentGallery,
      })
    } catch (error) {
      setGeneratedProject(null)
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
      setIsGeneratingImage(false)
    }
  }

  const stats = useMemo(
    () => [
      { label: 'Diseños modulares', value: '100%' },
      { label: 'Enfoque sostenible', value: 'Triple impacto' },
      { label: 'Tecnología base', value: 'React + Node.js' },
    ],
    [],
  )

  return (
    <div className="habitat-app">
      <nav className="navbar navbar-expand-lg navbar-dark habitat-navbar sticky-top">
        <div className="container">
          <button
            type="button"
            className="navbar-brand fw-bold border-0 bg-transparent text-white"
            onClick={() => setCurrentView('home')}
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
                <button className="nav-link btn btn-link" onClick={() => setCurrentView('home')}>
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => setCurrentView('generator')}>
                  Configurador
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-success ms-lg-2" onClick={() => setCurrentView('generator')}>
                  Empezar ahora
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {currentView === 'home' ? (
        <>
          <header id="inicio" className="hero-section">
            <div className="container py-5">
              <div className="row align-items-center min-vh-75 g-4">
                <div className="col-lg-7 text-start">
                  <span className="badge habitat-badge mb-3">PropTech + IA + Sustentabilidad</span>
                  <h1 className="display-4 fw-bold text-white mb-4">
                    Pensamos viviendas accesibles para familias que necesitan construir con bajo presupuesto.
                  </h1>
                  <p className="lead text-white-50 mb-4 hero-text">
                    HabitatIA ayuda a planificar una vivienda simple, funcional y sostenible, priorizando el costo,
                    el aprovechamiento de materiales y la posibilidad de crecer por etapas.
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <button className="btn btn-success btn-lg px-4" onClick={() => setCurrentView('generator')}>
                      Iniciar conversación
                    </button>
                    <a href="#impacto" className="btn btn-outline-light btn-lg px-4">
                      Ver triple impacto
                    </a>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="hero-card shadow-lg">
                    <h2 className="h4 fw-bold mb-3">¿Para qué sirve HabitatIA?</h2>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3">• Ayuda a pensar una vivienda posible según el dinero disponible.</li>
                      <li className="mb-3">• Sugiere opciones para construir por etapas y crecer más adelante.</li>
                      <li>• Orienta sobre materiales, espacios y decisiones básicas para gastar mejor.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main>
            <section className="py-4 stats-strip">
              <div className="container">
                <div className="row g-3">
                  {stats.map((stat) => (
                    <div className="col-md-4" key={stat.label}>
                      <div className="stat-card">
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="propuesta" className="py-5 section-light">
              <div className="container">
                <div className="text-center mb-5">
                  <span className="section-kicker">Nuestra propuesta</span>
                  <h2 className="section-title">Una herramienta pensada para viviendas posibles y reales</h2>
                  <p className="section-text mx-auto">
                    Combinamos planificación simple, criterios de ahorro y diseño modular para acercar soluciones
                    habitacionales a familias que necesitan construir con recursos limitados.
                  </p>
                </div>

                <div className="row g-4">
                  {features.map((feature) => (
                    <div className="col-md-4" key={feature.title}>
                      <div className="card feature-card h-100 border-0 shadow-sm">
                        <div className="card-body p-4">
                          <h3 className="h5 fw-bold mb-3">{feature.title}</h3>
                          <p className="text-muted mb-0">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="impacto" className="py-5 section-green">
              <div className="container">
                <div className="text-center mb-5">
                  <span className="section-kicker text-success-emphasis">Triple impacto</span>
                  <h2 className="section-title">Tecnología aplicada a una vivienda digna, accesible y eficiente</h2>
                  <p className="section-text mx-auto">
                    HabitatIA busca que más familias puedan proyectar una casa posible de construir y mejorar con el tiempo.
                  </p>
                </div>

                <div className="row g-4">
                  {impacts.map((impact) => (
                    <div className="col-md-4" key={impact.title}>
                      <div className="card impact-card h-100 border-0">
                        <div className="card-body p-4">
                          <h3 className="h5 fw-bold mb-3">{impact.title}</h3>
                          <p className="mb-0 text-secondary">{impact.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-5 section-light">
              <div className="container">
                <div className="row g-4 align-items-center">
                  <div className="col-lg-6">
                    <h2 className="section-title text-start">Tecnología base del proyecto</h2>
                    <p className="section-text text-start mx-0 mb-4">
                      La plataforma fue pensada para dar una primera orientación clara sobre qué vivienda conviene,
                      cuánto podría costar y cómo se podría construir de forma progresiva.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="tech-pill">React</span>
                      <span className="tech-pill">Bootstrap</span>
                      <span className="tech-pill">Node.js</span>
                      <span className="tech-pill">API REST</span>
                      <span className="tech-pill">Cloud Computing</span>
                      <span className="tech-pill">IA Generativa</span>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="info-panel shadow-sm">
                      <h3 className="h5 fw-bold mb-3">Objetivo del MVP</h3>
                      <p className="mb-0 text-muted">
                        Construir una primera versión capaz de orientar a una familia sobre una vivienda accesible,
                        priorizando costo, funcionalidad y posibilidad de ampliación futura.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="equipo" className="py-5 team-section">
              <div className="container text-center">
                <span className="section-kicker text-white-50">Equipo</span>
                <h2 className="section-title text-white">Integrantes del proyecto</h2>
                <div className="row g-4 justify-content-center mt-2">
                  {[
                    'Luca Picone',
                    'Ignacio Sanguinetti',
                    'Aquiles Luzuriaga',
                    'Antonio Cocca',
                    'Felipe Villares',
                  ].map((member) => (
                    <div className="col-sm-6 col-lg-4" key={member}>
                      <div className="team-card">
                        <p className="mb-0 fw-semibold">{member}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </>
      ) : (
        <main className="generator-page py-5">
          <div className="container">
            <div className="row g-4 align-items-start">
              <div className="col-lg-7">
                <ProjectChatbot initialAnswers={initialAnswers} onComplete={handleGenerateFromChat} isSubmitting={isSubmitting} />
                {formError ? <div className="alert alert-danger mt-4">{formError}</div> : null}
              </div>

              <div className="col-lg-5">
                <div className="result-card shadow-sm mb-4">
                  <h2 className="h4 fw-bold mb-3">Resultado estimado</h2>

                  {generatedProject ? (
                    <>
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

                      <div>
                        <h3 className="h6 fw-bold">Recomendaciones</h3>
                        <ul className="result-list mb-0">
                          {generatedProject.recommendations.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                          <li>Evaluar construcción por etapas para empezar con lo esencial y ampliar después.</li>
                          <li>Priorizar los espacios más necesarios para la familia según el presupuesto real.</li>
                        </ul>
                      </div>
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

                <div className="result-card shadow-sm image-card mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
                    <h2 className="h4 fw-bold mb-0">Visualización conceptual</h2>
                    {generatedProject ? <span className="image-badge">Modo demo IA</span> : null}
                  </div>

                  {generatedProject ? (
                    <>
                      <div className="image-preview-box mb-3">
                        {isGeneratingImage ? (
                          <div className="image-loading-state">
                            <div className="spinner-border text-success mb-3" role="status" />
                            <p className="mb-0 fw-semibold">Generando visualización conceptual...</p>
                          </div>
                        ) : generatedProject.imageUrl && !imageLoadFailed ? (
                          <>
                            <div className="image-preview-header mb-3">
                              <span className="preview-tag">Render generado</span>
                              <span className="preview-tag preview-tag-light">{generatedProject.modularType}</span>
                              {generatedProject.renderProvider ? (
                                <span className="preview-tag preview-tag-provider">{generatedProject.renderProvider}</span>
                              ) : null}
                            </div>
                            <img
                              src={generatedProject.imageUrl}
                              alt="Render conceptual de la vivienda propuesta"
                              className="generated-render-image"
                              onError={() => setImageLoadFailed(true)}
                            />
                          </>
                        ) : (
                          <>
                            <div className="image-preview-header mb-3">
                              <span className="preview-tag">Render conceptual</span>
                              <span className="preview-tag preview-tag-light">{generatedProject.modularType}</span>
                              {imageLoadFailed ? <span className="preview-tag preview-tag-warning">fallback visual</span> : null}
                            </div>
                            {imageLoadFailed ? (
                              <div className="render-warning-box mb-3">
                                No se pudo visualizar la imagen remota del proveedor. Se muestra una vista conceptual de respaldo.
                              </div>
                            ) : null}
                            <div className="image-scene">
                              <div className="scene-sky"></div>
                              <div className="scene-sun"></div>
                              <div className="scene-ground"></div>
                              <div className="scene-house-body"></div>
                              <div className="scene-house-roof"></div>
                              <div className="scene-house-door"></div>
                              <div className="scene-house-window window-left"></div>
                              <div className="scene-house-window window-right"></div>
                              <div className="scene-tree tree-left"></div>
                              <div className="scene-tree tree-right"></div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mb-3">
                        <h3 className="h6 fw-bold">Prompt generado</h3>
                        <p className="text-muted mb-2">{generatedProject.imagePrompt}</p>
                        <h3 className="h6 fw-bold">Modelo arquitectónico común</h3>
                        <p className="text-muted mb-2">
                          Todas las imágenes deben mantener la misma casa, mismos materiales, misma lógica espacial y mismo lenguaje visual.
                        </p>
                        <h3 className="h6 fw-bold">Estilo visual</h3>
                        <p className="text-muted mb-2">{generatedProject.imageStyle}</p>
                        <h3 className="h6 fw-bold">Negative prompt</h3>
                        <p className="text-muted mb-0">{generatedProject.negativePrompt}</p>
                      </div>

                      {!isGeneratingImage && generatedProject.imageDescription ? (
                        <div className="result-highlight mb-0">
                          <p className="mb-0 text-muted">{generatedProject.imageDescription}</p>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="empty-state">
                      <p className="text-muted mb-0">
                        Una vez generada la propuesta, acá vas a ver la imagen principal de la vivienda.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                    onOpen={(item) => setLightboxItem(item)}
                  />
                </div>
              </section>
            ) : null}
          </div>
        </main>
      )}

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  )
}

export default App
