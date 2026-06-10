import { useEffect, useMemo, useState } from 'react'
import { formatAnswerLabel, getVisibleQuestions } from '../utils/chatFlow'

function ProjectChatbot({ initialAnswers, onComplete, isSubmitting }) {
  const [answers, setAnswers] = useState(initialAnswers)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    setAnswers(initialAnswers)
  }, [initialAnswers])

  const questions = useMemo(() => getVisibleQuestions(answers), [answers])
  const currentQuestion = questions.find((question) => answers[question.key] === undefined)
  const canGenerate = !currentQuestion && questions.length >= 10
  const answeredQuestions = questions.filter((question) => answers[question.key] !== undefined)
  const progress = Math.round((answeredQuestions.length / questions.length) * 100)

  const submitAnswer = (value) => {
    if (!currentQuestion || value === '' || value === undefined || value === null) {
      return
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: value,
    }))
    setDraft('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitAnswer(draft.trim())
  }

  const normalizedAnswers = useMemo(() => {
    const toBoolean = (value) => value === true || value === 'true'

    return {
      ...answers,
      hasSuiteBathroom: toBoolean(answers.hasSuiteBathroom),
      hasPool: toBoolean(answers.hasPool),
      hasGarage: toBoolean(answers.hasGarage),
      hasQuincho: toBoolean(answers.hasQuincho),
      hasGrill: toBoolean(answers.hasGrill),
    }
  }, [answers])

  return (
    <div className="chatbot-shell shadow-sm">
      <div className="chatbot-header">
        <div>
          <span className="section-kicker text-white-50">Chat de relevamiento</span>
          <h1 className="chatbot-title">Describí el proyecto y generamos el render</h1>
          <p className="chatbot-subtitle mb-0">
            Respondé una pregunta a la vez. Al final armamos el prompt y generamos la imagen.
          </p>
        </div>
        <div className="chatbot-progress-wrapper">
          <span className="chatbot-progress-label">Avance</span>
          <div className="progress chatbot-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <small>{answeredQuestions.length} / {questions.length}</small>
        </div>
      </div>

      <div className="chatbot-body">
        <div className="chat-thread">
          <div className="message message-bot">
            <div className="message-bubble">
              Hola, soy Agente86. Te voy a hacer preguntas concretas para entender el proyecto y renderizarlo.
            </div>
          </div>

          {answeredQuestions.map((question) => (
            <div key={question.key}>
              <div className="message message-bot">
                <div className="message-bubble">{question.question}</div>
              </div>
              <div className="message message-user">
                <div className="message-bubble user-bubble">
                  {formatAnswerLabel(question, answers[question.key])}
                </div>
              </div>
            </div>
          ))}

          {currentQuestion ? (
            <div className="message message-bot current-question">
              <div className="message-bubble">{currentQuestion.question}</div>
            </div>
          ) : canGenerate ? (
            <div className="message message-bot">
              <div className="message-bubble">
                Ya tengo la base del proyecto. Si querés, genero el render ahora.
              </div>
            </div>
          ) : null}
        </div>

        {currentQuestion ? (
          <div className="chat-input-panel">
            {currentQuestion.type === 'select' ? (
              <div className="chat-options-grid">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="btn btn-outline-success chat-option-btn"
                    onClick={() => submitAnswer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                  type={currentQuestion.type === 'number' ? 'number' : 'text'}
                  className="form-control"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={currentQuestion.placeholder || 'Escribí tu respuesta'}
                />
                <button type="submit" className="btn btn-success">
                  Enviar
                </button>
              </form>
            )}
          </div>
        ) : canGenerate ? (
          <div className="chat-complete-panel">
            <button className="btn btn-success btn-lg" onClick={() => onComplete(normalizedAnswers)} disabled={isSubmitting}>
              {isSubmitting ? 'Generando render...' : 'Generar render'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProjectChatbot
