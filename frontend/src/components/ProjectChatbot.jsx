import { useEffect, useMemo, useState } from 'react'
import { formatAnswerLabel, getAnswerAcknowledgement, getQuestionPrompt, getVisibleQuestions } from '../utils/chatFlow'
import { generateChatTurn } from '../services/api'

function ProjectChatbot({ initialAnswers, onComplete, isSubmitting }) {
  const [answers, setAnswers] = useState(initialAnswers)
  const [draft, setDraft] = useState('')
  const [assistantMessage, setAssistantMessage] = useState('')
  const [isAssistantThinking, setIsAssistantThinking] = useState(false)

  useEffect(() => {
    setAnswers(initialAnswers)
  }, [initialAnswers])

  const questions = useMemo(() => getVisibleQuestions(answers), [answers])
  const currentQuestion = questions.find((question) => answers[question.key] === undefined)
  const canGenerate = !currentQuestion && questions.length >= 10
  const answeredQuestions = useMemo(
    () => questions.filter((question) => answers[question.key] !== undefined),
    [answers, questions],
  )
  const progress = Math.round((answeredQuestions.length / questions.length) * 100)
  useEffect(() => {
    let cancelled = false

    const latestAnsweredQuestion = answeredQuestions[answeredQuestions.length - 1]
    const answeredValue = latestAnsweredQuestion ? answers[latestAnsweredQuestion.key] : null

    const fallbackMessage = currentQuestion
      ? `${latestAnsweredQuestion ? `${getAnswerAcknowledgement(latestAnsweredQuestion, answeredValue, answers)} ` : ''}${getQuestionPrompt(currentQuestion, answers)}`
      : 'Ya tengo una base bastante clara del proyecto. Si querés, ahora genero una propuesta adaptada a todo lo que me contaste.'

    const loadAssistantTurn = async () => {
      setIsAssistantThinking(true)

      try {
        const response = await generateChatTurn({
          answers,
          answeredQuestion: latestAnsweredQuestion
            ? {
                key: latestAnsweredQuestion.key,
                label: latestAnsweredQuestion.label,
                value: answeredValue,
                labelValue: formatAnswerLabel(latestAnsweredQuestion, answeredValue),
              }
            : null,
          nextQuestion: currentQuestion
            ? {
                key: currentQuestion.key,
                label: currentQuestion.label,
                question: currentQuestion.question,
                type: currentQuestion.type,
                options: currentQuestion.options || [],
              }
            : null,
        })

        if (!cancelled) {
          setAssistantMessage(response.message || fallbackMessage)
        }
      } catch (_error) {
        if (!cancelled) {
          setAssistantMessage(fallbackMessage)
        }
      } finally {
        if (!cancelled) {
          setIsAssistantThinking(false)
        }
      }
    }

    loadAssistantTurn()

    return () => {
      cancelled = true
    }
  }, [answers, answeredQuestions, currentQuestion])

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
          <span className="section-kicker text-white-50">Asistente de proyecto</span>
          <h1 className="chatbot-title">Configurá tu vivienda conversando paso a paso</h1>
          <p className="chatbot-subtitle mb-0">
            Respondé una pregunta a la vez. Al final generamos tu propuesta completa.
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
              {assistantMessage || 'Hola, soy HabitatIA. Estoy preparando las preguntas iniciales para entender mejor tu proyecto.'}
            </div>
          </div>

          {answeredQuestions.map((question) => (
            <div key={question.key}>
              <div className="message message-user">
                <div className="message-bubble user-bubble">
                  {formatAnswerLabel(question, answers[question.key])}
                </div>
              </div>
            </div>
          ))}

          {isAssistantThinking ? (
            <div className="message message-bot current-question">
              <div className="message-bubble message-bubble-muted">HabitatIA está pensando la mejor siguiente pregunta para este caso...</div>
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
              {isSubmitting ? 'Generando proyecto...' : 'Generar proyecto'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProjectChatbot
