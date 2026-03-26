import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
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

  return (
    <div className="habitat-app">
      <nav className="navbar navbar-expand-lg navbar-dark habitat-navbar sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#inicio">
            HabitatIA
          </a>
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
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#propuesta">
                  Propuesta
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#impacto">
                  Triple impacto
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#equipo">
                  Equipo
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header id="inicio" className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center min-vh-75 g-4">
            <div className="col-lg-7 text-start">
              <span className="badge habitat-badge mb-3">PropTech + IA + Sustentabilidad</span>
              <h1 className="display-4 fw-bold text-white mb-4">
                Diseñamos viviendas sostenibles y modulares con apoyo de inteligencia artificial.
              </h1>
              <p className="lead text-white-50 mb-4 hero-text">
                HabitatIA es una plataforma web orientada a facilitar el acceso a diseños habitacionales eficientes,
                optimizando materiales, costos e impacto ambiental desde el inicio del proyecto.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#propuesta" className="btn btn-success btn-lg px-4">
                  Conocer la propuesta
                </a>
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
                  La plataforma será desarrollada con frontend en React + Bootstrap y backend en Node.js,
                  dejando preparada la integración con servicios de inteligencia artificial y cloud computing.
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
    </div>
  )
}

export default App
