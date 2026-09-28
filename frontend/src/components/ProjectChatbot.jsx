import { useEffect, useRef, useState } from 'react'
import { generateChatTurn } from '../services/api'
import { extractStructuredAnswersFromText } from '../utils/chatFlow'

const initialStructuredAnswers = {
  propertyType: 'casa',
}

function mergeAnswers(currentAnswers, extractedAnswers = {}) {
  const nextAnswers = { ...currentAnswers, propertyType: 'casa' }

  Object.entries(extractedAnswers || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    nextAnswers[key] = value
  })

  nextAnswers.propertyType = 'casa'
  return nextAnswers
}

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
  }
}

function ProjectChatbot({ initialAnswers, onComplete, isSubmitting }) {
  const [answers, setAnswers] = useState({ ...initialStructuredAnswers, ...initialAnswers })
  const [draft, setDraft] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [assistantQuestionCount, setAssistantQuestionCount] = useState(0)
  const [isAssistantThinking, setIsAssistantThinking] = useState(false)
  const [inputError, setInputError] = useState('')
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)
  const threadEndRef = useRef(null)

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chatMessages, isAssistantThinking])

  useEffect(() => {
    const bootAnswers = { ...initialStructuredAnswers, ...initialAnswers }
    let cancelled = false

    setAnswers(bootAnswers)
    setDraft('')
    setChatMessages([])
    setAssistantQuestionCount(0)
    setIsAssistantThinking(false)
    setInputError('')
    setIsInterviewComplete(false)

    const startInterview = async () => {
      setIsAssistantThinking(true)

      try {
        const response = await generateChatTurn({
          answers: bootAnswers,
          messages: [],
          assistantQuestionCount: 0,
        })

        if (cancelled) {
          return
        }

        setAnswers((prev) => mergeAnswers(prev, response.extractedAnswers))
        setChatMessages([createMessage('assistant', response.message)])
        setIsInterviewComplete(Boolean(response.shouldComplete))
        setAssistantQuestionCount(response.shouldComplete ? 0 : 1)
      } catch {
        if (!cancelled) {
          setChatMessages([
            createMessage(
              'assistant',
              'Arranquemos por una base general: contame para quién sería la casa, si ya tienen terreno y qué presupuesto aproximado imaginan para construir.',
            ),
          ])
          setAssistantQuestionCount(1)
        }
      } finally {
        if (!cancelled) {
          setIsAssistantThinking(false)
        }
      }
    }

    startInterview()

    return () => {
      cancelled = true
    }
  }, [initialAnswers])

  const submitAnswer = async () => {
    const trimmedValue = draft.trim()

    if (!trimmedValue) {
      setInputError('Escribí una respuesta para continuar.')
      return
    }

    const userMessage = createMessage('user', trimmedValue)
    const nextMessages = [...chatMessages, userMessage]
    const previousAssistantMessage = [...chatMessages]
      .reverse()
      .find((message) => message.role === 'assistant')
    const currentAnswers = mergeAnswers(
      answers,
      extractStructuredAnswersFromText(trimmedValue, answers, previousAssistantMessage?.text),
    )
    const currentQuestionCount = assistantQuestionCount

    setInputError('')
    setDraft('')
    setChatMessages(nextMessages)
    setAnswers(currentAnswers)
    setIsAssistantThinking(true)

    try {
      const response = await generateChatTurn({
        answers: currentAnswers,
        messages: nextMessages,
        assistantQuestionCount: currentQuestionCount,
      })

      const mergedAnswers = mergeAnswers(currentAnswers, response.extractedAnswers)

      setAnswers(mergedAnswers)
      setChatMessages((prev) => [...prev, createMessage('assistant', response.message)])
      setIsInterviewComplete(Boolean(response.shouldComplete))
      setAssistantQuestionCount(response.shouldComplete ? currentQuestionCount : currentQuestionCount + 1)
    } catch {
      setChatMessages((prev) => [
        ...prev,
        createMessage(
          'assistant',
          'Seguí contándome un poco más de la casa: tamaño aproximado, cantidad de ambientes, ubicación o presupuesto, y con eso avanzo.',
        ),
      ])
      setAssistantQuestionCount((prev) => prev + 1)
    } finally {
      setIsAssistantThinking(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isAssistantThinking) {
      submitAnswer()
    }
  }

  const progress = Math.min(100, Math.round((assistantQuestionCount / 10) * 100))

  return (
    <div className="chatbot-shell shadow-sm">
      <div className="chatbot-header">
        <div>
          <span className="section-kicker text-white-50">Asistente de proyecto</span>
          <h1 className="chatbot-title">Contame tu casa ideal y HabitatIA adapta la entrevista</h1>
          <p className="chatbot-subtitle mb-0">
            No seguís un formulario fijo: la conversación profundiza solo donde hace falta.
          </p>
        </div>
        <div className="chatbot-progress-wrapper">
          <span className="chatbot-progress-label">Entrevista</span>
          <div className="progress chatbot-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <small>{assistantQuestionCount} / 10 preguntas máximas</small>
        </div>
      </div>

      <div className="chatbot-body">
        <div className="chat-thread">
          {chatMessages.map((message) => (
            <div key={message.id} className={`message ${message.role === 'assistant' ? 'message-bot' : 'message-user'}`}>
              <div className={`message-bubble ${message.role === 'user' ? 'user-bubble' : ''}`}>{message.text}</div>
            </div>
          ))}

          {isAssistantThinking ? (
            <div className="message message-bot current-question">
              <div className="message-bubble message-bubble-muted">HabitatIA está pensando cómo seguir esta conversación...</div>
            </div>
          ) : null}
          <div ref={threadEndRef} />
        </div>

        {!isInterviewComplete ? (
          <div className="chat-input-panel">
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className="form-control"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value)
                  if (inputError) {
                    setInputError('')
                  }
                }}
                placeholder="Respondé como si estuvieras charlando con un asesor"
                disabled={isAssistantThinking}
              />
              <button type="submit" className="btn btn-success" disabled={isAssistantThinking}>
                Enviar
              </button>
            </form>
            {inputError ? <div className="chat-input-error">{inputError}</div> : null}
          </div>
        ) : (
          <div className="chat-complete-panel">
            <button className="btn btn-success btn-lg" onClick={() => onComplete(answers)} disabled={isSubmitting}>
              {isSubmitting ? 'Generando proyecto...' : 'Generar proyecto'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectChatbot
