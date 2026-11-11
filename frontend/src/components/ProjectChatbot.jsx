import { useEffect, useMemo, useRef, useState } from 'react'
import { formatAnswerLabel, getVisibleQuestions } from '../utils/chatFlow'

const baseAnswers = {
  propertyType: 'casa',
}

function hasAnswer(answers, key) {
  return Object.prototype.hasOwnProperty.call(answers, key) && answers[key] !== ''
}

function ProjectChatbot({ initialAnswers, onComplete, isSubmitting }) {
  const [answers, setAnswers] = useState(() => ({ ...baseAnswers, ...initialAnswers }))
  const [draft, setDraft] = useState('')
  const [inputError, setInputError] = useState('')
  const threadEndRef = useRef(null)

  const questions = useMemo(() => getVisibleQuestions(answers), [answers])
  const answeredQuestions = questions.filter((question) => hasAnswer(answers, question.key))
  const currentQuestion = questions.find((question) => !hasAnswer(answers, question.key))
  const isInterviewComplete = !currentQuestion
  const progress = questions.length
    ? Math.round((answeredQuestions.length / questions.length) * 100)
    : 0

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [answeredQuestions.length, currentQuestion?.key])

  const submitAnswer = (value) => {
    if (!currentQuestion || isSubmitting) return

    const normalizedValue = String(value ?? '').trim()

    if (!normalizedValue) {
      setInputError('Completá una respuesta para continuar.')
      return
    }

    if (currentQuestion.type === 'number') {
      const numericValue = Number(normalizedValue)

      if (!Number.isFinite(numericValue) || numericValue < (currentQuestion.min ?? 0)) {
        setInputError(currentQuestion.error || 'Ingresá un número válido para continuar.')
        return
      }
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.key]: normalizedValue,
    }))
    setDraft('')
    setInputError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitAnswer(draft)
  }

  return (
    <div className="chatbot-shell">
      <div className="chatbot-header">
        <div className="chatbot-brand-row">
          <div className="chatbot-identity">
            <span className="chatbot-brand-mark" aria-hidden="true">H</span>
            <div>
              <strong>HabitatIA</strong>
              <span>Asistente de proyecto</span>
            </div>
          </div>
          <span className="chatbot-online-status">
            <span aria-hidden="true"></span>
            En línea
          </span>
        </div>

        <div className="chatbot-heading-block">
          <span className="chatbot-eyebrow">Diseñemos paso a paso</span>
          <h1 className="chatbot-title">Definí tu casa con una entrevista clara</h1>
          <p className="chatbot-subtitle mb-0">
            Respondé una pregunta por vez. El recorrido es fijo y cada dato se solicita una sola vez.
          </p>
        </div>

        <div className="chatbot-progress-wrapper">
          <div className="chatbot-progress-copy">
            <span className="chatbot-progress-label">Avance de la entrevista</span>
            <small>{answeredQuestions.length} de {questions.length}</small>
          </div>
          <div
            className="progress chatbot-progress"
            role="progressbar"
            aria-label="Avance de la entrevista"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="chatbot-body">
        <div className="chat-thread" aria-live="polite">
          {answeredQuestions.map((question) => (
            <div key={question.key} className="chat-question-pair">
              <div className="message message-bot">
                <span className="message-avatar" aria-hidden="true">H</span>
                <div className="message-content">
                  <span className="message-author">HabitatIA</span>
                  <div className="message-bubble">{question.question}</div>
                </div>
              </div>
              <div className="message message-user">
                <div className="message-content">
                  <span className="message-author">Vos</span>
                  <div className="message-bubble user-bubble">
                    {formatAnswerLabel(question, answers[question.key])}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {currentQuestion ? (
            <div className="message message-bot current-question">
              <span className="message-avatar" aria-hidden="true">H</span>
              <div className="message-content">
                <span className="message-author">HabitatIA</span>
                <div className="message-bubble">{currentQuestion.question}</div>
              </div>
            </div>
          ) : (
            <div className="message message-bot current-question">
              <span className="message-avatar" aria-hidden="true">H</span>
              <div className="message-content">
                <span className="message-author">HabitatIA</span>
                <div className="message-bubble">
                  Ya tengo toda la información necesaria para preparar tu propuesta.
                </div>
              </div>
            </div>
          )}
          <div ref={threadEndRef} />
        </div>

        {currentQuestion ? (
          <div className="chat-input-panel">
            <span className="chat-input-label">Tu respuesta</span>
            {currentQuestion.type === 'select' ? (
              <div className="chat-options-grid" role="group" aria-label={currentQuestion.question}>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="chat-option-button"
                    onClick={() => submitAnswer(option.value)}
                    disabled={isSubmitting}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                  type={currentQuestion.type}
                  min={currentQuestion.min}
                  className="form-control"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value)
                    if (inputError) setInputError('')
                  }}
                  placeholder={currentQuestion.placeholder || 'Escribí tu respuesta'}
                  disabled={isSubmitting}
                  aria-label={currentQuestion.label}
                  autoFocus
                />
                <button type="submit" className="chat-send-button" disabled={isSubmitting}>
                  <span>Continuar</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            )}
            {inputError ? <div className="chat-input-error">{inputError}</div> : null}
          </div>
        ) : null}

        {isInterviewComplete ? (
          <div className="chat-complete-panel">
            <div>
              <span className="chat-input-label">Entrevista completa</span>
              <strong>La información está lista para generar el anteproyecto conceptual.</strong>
            </div>
            <button
              className="chat-send-button chat-generate-button"
              onClick={() => onComplete(answers)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generando proyecto...' : 'Generar proyecto'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProjectChatbot
