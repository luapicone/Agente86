import { startTransition, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import ProjectChatbot from './components/ProjectChatbot'
import ImageLightbox from './components/ImageLightbox'
import { generateProjectProposal } from './services/api'
import { generateRender } from './services/renderApi'
import { generateRenderWithPuter } from './services/puterRender'
import { buildMasterHousePrompt } from './utils/environmentPrompts'

const CHATBOT_EMPTY_STATE = {}

const SUMMARY_FIELDS = [
  { key: 'propertyType', label: 'Tipología' },
  { key: 'squareMeters', label: 'Superficie' },
  { key: 'bedrooms', label: 'Dormitorios' },
  { key: 'bathrooms', label: 'Baños' },
  { key: 'qualityLevel', label: 'Calidad' },
  { key: 'location', label: 'Ubicación' },
]

function formatSummaryValue(key, value, project) {
  if (value === undefined || value === null || value === '') {
    return 'No definido'
  }

  if (key === 'propertyType') {
    return project?.propertyType || (value === 'departamento' ? 'Departamento' : 'Casa')
  }

  if (key === 'squareMeters') {
    return `${value} m²`
  }

  return String(value)
}

async function generateChatRender({ prompt, negativePrompt, styleLabel }) {
  let backendError = null

  try {
    const response = await generateRender({
      prompt,
      negativePrompt,
      styleLabel,
    })

    if (response?.render?.imageUrl) {
      return {
        provider: response.render.provider || response.render.providerUsed || 'backend',
        imageUrl: response.render.imageUrl,
        note: response.render.note || 'Render generado por el backend.',
      }
    }

    throw new Error(response?.render?.note || response?.message || 'El backend no devolvió una imagen usable.')
  } catch (error) {
    backendError = error
  }

  try {
    return await generateRenderWithPuter({ prompt, negativePrompt })
  } catch (puterError) {
    const backendMessage = backendError?.message ? ` Backend: ${backendError.message}.` : ''
    throw new Error(`No se pudo generar el render.${backendMessage} Puter: ${puterError.message}.`)
  }
}

function App() {
  const [chatbotKey, setChatbotKey] = useState(0)
  const [generatedProject, setGeneratedProject] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [lightboxItem, setLightboxItem] = useState(null)

  const resetFlow = () => {
    setGeneratedProject(null)
    setFormError('')
    setChatbotKey((current) => current + 1)
  }

  const handleGenerateFromChat = async (answers) => {
    setFormError('')
    setIsSubmitting(true)

    try {
      const normalizedPayload = {
        ...answers,
        squareMeters: Number(answers.squareMeters || 0),
        bedrooms: Number(answers.bedrooms || 0),
        bathrooms: Number(answers.bathrooms || 0),
        budget: Number(answers.budget || 0),
        floors: Number(answers.floors || 1),
      }

      const project = await generateProjectProposal(normalizedPayload)
      const masterPrompt = buildMasterHousePrompt(normalizedPayload, project)
      const render = await generateChatRender({
        prompt: masterPrompt,
        negativePrompt: project.negativePrompt,
        styleLabel: project.imageStyle,
      })

      startTransition(() => {
        setGeneratedProject({
          ...project,
          answers: normalizedPayload,
          masterPrompt,
          imageUrl: render.imageUrl,
          renderProvider: render.provider,
          renderNote: render.note,
        })
      })
    } catch (error) {
      setGeneratedProject(null)
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="agente86-shell">
      <div className="background-orb orb-a" aria-hidden="true"></div>
      <div className="background-orb orb-b" aria-hidden="true"></div>

      <main className="container py-4 py-lg-5">
        <section className="app-hero">
          <div>
            <span className="hero-kicker">Agente86</span>
            <h1 className="hero-title">Chat adentro, render afuera.</h1>
            <p className="hero-copy mb-0">
              Esta versión queda enfocada únicamente en relevar el proyecto por chat y devolver una imagen arquitectónica lista para revisar.
            </p>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn-outline-light" onClick={resetFlow} disabled={isSubmitting}>
              Reiniciar
            </button>
          </div>
        </section>

        {formError ? (
          <div className="alert alert-danger render-alert" role="alert">
            {formError}
          </div>
        ) : null}

        <section className="main-grid">
          <div className="chat-column">
            <ProjectChatbot
              key={chatbotKey}
              initialAnswers={CHATBOT_EMPTY_STATE}
              onComplete={handleGenerateFromChat}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="result-column">
            {generatedProject ? (
              <article className="result-card">
                <div className="result-header">
                  <div>
                    <span className="section-kicker">Render generado</span>
                    <h2 className="result-title">{generatedProject.projectName}</h2>
                  </div>
                  <span className="provider-pill">{generatedProject.renderProvider}</span>
                </div>

                <button type="button" className="render-stage" onClick={() => setLightboxItem({
                  title: generatedProject.projectName,
                  description: generatedProject.summary,
                  imageUrl: generatedProject.imageUrl,
                })}>
                  <img src={generatedProject.imageUrl} alt={generatedProject.projectName} className="render-image" />
                </button>

                <p className="result-summary">{generatedProject.summary}</p>

                <div className="summary-grid">
                  {SUMMARY_FIELDS.map((field) => (
                    <div key={field.key} className="summary-item">
                      <span className="summary-label">{field.label}</span>
                      <strong className="summary-value">
                        {formatSummaryValue(field.key, generatedProject.answers?.[field.key], generatedProject)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="note-card">
                  <span className="section-kicker">Motor usado</span>
                  <p className="mb-0">{generatedProject.renderNote}</p>
                </div>

                <details className="prompt-card">
                  <summary>Ver prompt maestro</summary>
                  <pre>{generatedProject.masterPrompt}</pre>
                </details>
              </article>
            ) : (
              <article className="empty-state-card">
                <span className="section-kicker">Salida</span>
                <h2>El render aparece acá cuando terminás el chat.</h2>
                <p>
                  El flujo ahora es directo: relevamiento conversacional, armado del prompt maestro y generación de imagen.
                </p>
                <ul className="empty-state-list">
                  <li>El chat junta los datos necesarios del proyecto.</li>
                  <li>El backend arma el prompt arquitectónico.</li>
                  <li>Se intenta generar primero desde el servidor y, si falla, cae al fallback del navegador.</li>
                </ul>
              </article>
            )}
          </div>
        </section>
      </main>

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  )
}

export default App
