import { useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { generateProjectProposal } from './services/api'
import { generateRender } from './services/renderApi'
import { generateRenderWithPuter } from './services/puterRender'
import EnvironmentCarousel from './components/EnvironmentCarousel'
import ImageLightbox from './components/ImageLightbox'
import {
  buildEnvironmentPrompt,
  expandEnvironmentViews,
  getEnvironmentDefinitions,
} from './utils/environmentPrompts'

const initialForm = {
  projectName: '',
  propertyType: 'casa',
  squareMeters: '',
  bedrooms: '2',
  bathrooms: '1',
  terrainType: 'urbano',
  budget: '',
  priority: 'sostenibilidad',
  location: '',
  climate: 'templado',
  material: 'madera-reciclada',
  floors: '1',
  hasSuiteBathroom: false,
  hasPool: false,
  hasGarage: false,
  hasQuincho: false,
  hasGrill: false,
}

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [formData, setFormData] = useState(initialForm)
  const [generatedProject, setGeneratedProject] = useState(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const [lightboxItem, setLightboxItem] = useState(null)

  const features = [
    {
      title: 'Diseño inteligente',
      description:
        'Generación de propuestas habitacionales modulares en base a superficie, presupuesto y necesidades familiares.',
    },
    {
      title: 'Construcción sostenible',
      description:
        'Selección de materiales ecológicos y estrategias para reducir impacto ambiental y consumo energético.',
    },
    {
      title: 'Optimización de costos',
      description:
        'Estimaciones iniciales para minimizar desperdicios y mejorar la viabilidad económica del proyecto.',
    },
  ]

  const impacts = [
    {
      title: 'Impacto social',
      description:
        'Acerca soluciones habitacionales accesibles y de calidad a familias de ingresos medios y bajos.',
    },
    {
      title: 'Impacto ambiental',
      description:
        'Promueve eficiencia energética y uso responsable de materiales reciclables o de bajo impacto.',
    },
    {
      title: 'Impacto económico',
      description:
        'Reduce errores de planificación y optimiza el presupuesto desde las primeras etapas del proyecto.',
    },
  ]

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const generateEnvironmentGallery = async (project) => {
    const environments = getEnvironmentDefinitions(formData)
    const images = []

    for (const environment of environments) {
      const views = expandEnvironmentViews(environment)

      for (const view of views) {
        const prompt = buildEnvironmentPrompt(view, project)

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

  const handleGenerate = async (event) => {
    event.preventDefault()
    setFormError('')
    setImageLoadFailed(false)
    setIsSubmitting(true)
    setIsGeneratingImage(true)
    setCurrentView('generator')

    try {
      const normalizedPayload = {
        ...formData,
        squareMeters: Number(formData.squareMeters || 0),
        bedrooms: Number(formData.bedrooms || 0),
        bathrooms: Number(formData.bathrooms || 0),
        budget: Number(formData.budget || 0),
        floors: Number(formData.floors || 1),
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

      const environmentGallery = await generateEnvironmentGallery(generated)

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
            aria-controls="mainNavbar"
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
                  Generador
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-success ms-lg-2" onClick={() => setCurrentView('generator')}>
                  Probar demo
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
                    Diseñamos viviendas sostenibles y modulares con apoyo de inteligencia artificial.
                  </h1>
                  <p className="lead text-white-50 mb-4 hero-text">
                    HabitatIA es una plataforma web orientada a facilitar el acceso a diseños habitacionales
                    eficientes, optimizando materiales, costos e impacto ambiental desde el inicio del proyecto.
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <button className="btn btn-success btn-lg px-4" onClick={() => setCurrentView('generator')}>
                      Crear propuesta
                    </button>
                    <a href="#impacto" className="btn btn-outline-light btn-lg px-4">
                      Ver triple impacto
                    </a>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="hero-card shadow-lg">
                    <h2 className="h4 fw-bold mb-3">¿Qué resuelve HabitatIA?</h2>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3">• Genera propuestas de viviendas según presupuesto y necesidades.</li>
                      <li className="mb-3">• Sugiere materiales sostenibles para reducir la huella de carbono.</li>
                      <li>• Calcula métricas iniciales de eficiencia energética y optimización de costos.</li>
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
                  <h2 className="section-title">Una plataforma pensada para planificar mejor</h2>
                  <p className="section-text mx-auto">
                    Combinamos criterios de diseño modular, construcción sostenible y automatización inteligente para
                    simplificar el desarrollo de soluciones habitacionales más accesibles.
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
                  <h2 className="section-title">Tecnología aplicada a una vivienda más digna y eficiente</h2>
                  <p className="section-text mx-auto">
                    HabitatIA busca generar valor real desde una mirada social, ambiental y económica.
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
                    <h2 className="section-title text-start">Tecnologías base del proyecto</h2>
                    <p className="section-text text-start mx-0 mb-4">
                      La plataforma fue planteada con frontend en React + Bootstrap y backend en Node.js, dejando
                      preparada la integración con servicios de inteligencia artificial y cloud computing.
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
                        Construir una primera versión capaz de presentar el producto, capturar requerimientos de una
                        vivienda y devolver una propuesta inicial sostenible con métricas orientativas.
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
                <div className="generator-card shadow-sm">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                    <div>
                      <span className="section-kicker">Generador de viviendas</span>
                      <h1 className="section-title mb-2">Configurá tu proyecto</h1>
                      <p className="text-muted mb-0">
                        Ingresá los datos principales para simular una propuesta habitacional modular y sostenible.
                      </p>
                    </div>
                    <button className="btn btn-outline-success" onClick={() => setCurrentView('home')}>
                      Volver al inicio
                    </button>
                  </div>

                  <form onSubmit={handleGenerate}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nombre del proyecto</label>
                        <input
                          type="text"
                          className="form-control"
                          name="projectName"
                          value={formData.projectName}
                          onChange={handleChange}
                          placeholder="Ej: Vivienda familiar zona sur"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tipo de proyecto</label>
                        <select className="form-select" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                          <option value="casa">Casa</option>
                          <option value="departamento">Departamento</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Ubicación</label>
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Ej: Córdoba, Argentina"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Metros cuadrados</label>
                        <input
                          type="number"
                          min="20"
                          className="form-control"
                          name="squareMeters"
                          value={formData.squareMeters}
                          onChange={handleChange}
                          placeholder="70"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Dormitorios</label>
                        <select className="form-select" name="bedrooms" value={formData.bedrooms} onChange={handleChange}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Baños</label>
                        <select className="form-select" name="bathrooms" value={formData.bathrooms} onChange={handleChange}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      {formData.propertyType === 'casa' ? (
                        <div className="col-md-4">
                          <label className="form-label">Cantidad de pisos</label>
                          <select className="form-select" name="floors" value={formData.floors} onChange={handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        </div>
                      ) : null}
                      <div className="col-md-6">
                        <label className="form-label">Tipo de terreno</label>
                        <select className="form-select" name="terrainType" value={formData.terrainType} onChange={handleChange}>
                          <option value="urbano">Urbano</option>
                          <option value="suburbano">Suburbano</option>
                          <option value="rural">Rural</option>
                          <option value="pendiente">Con pendiente</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Presupuesto estimado (USD)</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="60000"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Prioridad</label>
                        <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
                          <option value="sostenibilidad">Mayor sostenibilidad</option>
                          <option value="costo">Menor costo</option>
                          <option value="eficiencia">Eficiencia energética</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Clima</label>
                        <select className="form-select" name="climate" value={formData.climate} onChange={handleChange}>
                          <option value="templado">Templado</option>
                          <option value="calido">Cálido</option>
                          <option value="frio">Frío</option>
                          <option value="humedo">Húmedo</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Material preferido</label>
                        <select className="form-select" name="material" value={formData.material} onChange={handleChange}>
                          <option value="madera-reciclada">Madera reciclada</option>
                          <option value="hormigon-verde">Hormigón verde</option>
                          <option value="acero-reciclado">Acero reciclado</option>
                        </select>
                      </div>
                    </div>

                    {formData.propertyType === 'casa' ? (
                      <div className="house-options-panel mt-4">
                        <h3 className="h5 fw-bold mb-3">Detalles adicionales para casa</h3>
                        <div className="row g-3">
                          <div className="col-md-6 col-lg-4">
                            <div className="form-check option-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="hasSuiteBathroom"
                                name="hasSuiteBathroom"
                                checked={formData.hasSuiteBathroom}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="hasSuiteBathroom">
                                Habitación principal con baño en suite
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-4">
                            <div className="form-check option-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="hasPool"
                                name="hasPool"
                                checked={formData.hasPool}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="hasPool">
                                Pileta
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-4">
                            <div className="form-check option-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="hasGarage"
                                name="hasGarage"
                                checked={formData.hasGarage}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="hasGarage">
                                Garage
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-4">
                            <div className="form-check option-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="hasQuincho"
                                name="hasQuincho"
                                checked={formData.hasQuincho}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="hasQuincho">
                                Quincho
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-4">
                            <div className="form-check option-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="hasGrill"
                                name="hasGrill"
                                checked={formData.hasGrill}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="hasGrill">
                                Parrilla
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {formError ? <div className="alert alert-danger mt-4 mb-0">{formError}</div> : null}

                    <div className="d-flex flex-wrap gap-3 mt-4">
                      <button type="submit" className="btn btn-success btn-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Generando...' : 'Generar propuesta'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => {
                          setFormData(initialForm)
                          setGeneratedProject(null)
                          setFormError('')
                          setImageLoadFailed(false)
                        }}
                      >
                        Limpiar formulario
                      </button>
                    </div>
                  </form>
                </div>
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
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <p className="text-muted mb-3">
                        Completá el formulario para generar una propuesta inicial de vivienda sostenible.
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
                        Al generar la propuesta, acá se mostrará una visualización conceptual de la vivienda según
                        los parámetros ingresados por el usuario.
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
