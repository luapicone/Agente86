import { useEffect, useMemo, useRef, useState } from 'react'
import {
  formatAnswerLabel,
  getAnswerAcknowledgement,
  getQuestionPrompt,
  getVisibleQuestions,
  normalizeConversationalAnswer,
} from '../utils/chatFlow'
import { generateChatTurn } from '../services/api'

function ProjectChatbot({ initialAnswers, onComplete, isSubmitting }) {
  const [answers, setAnswers] = useState(initialAnswers)
  const [draft, setDraft] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [isAssistantThinking, setIsAssistantThinking] = useState(false)
  const [inputError, setInputError] = useState('')
  const lastAssistantTurnRef = useRef('')
  const threadEndRef = useRef(null)

  useEffect(() => {
    setAnswers(initialAnswers)
    setDraft('')
    setChatMessages([])
    setIsAssistantThinking(false)
    setInputError('')
    lastAssistantTurnRef.current = ''
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
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chatMessages, isAssistantThinking])

  useEffect(() => {
    let cancelled = false

    const latestAnsweredQuestion = answeredQuestions[answeredQuestions.length - 1]
    const answeredValue = latestAnsweredQuestion ? answers[latestAnsweredQuestion.key] : null
    const turnSignature = JSON.stringify({
      answeredCount: answeredQuestions.length,
      latestAnsweredKey: latestAnsweredQuestion?.key || null,
      latestAnsweredValue: answeredValue,
      nextQuestionKey: currentQuestion?.key || null,
    })

    const fallbackMessage = currentQuestion
      ? `${latestAnsweredQuestion ? `${getAnswerAcknowledgement(latestAnsweredQuestion, answeredValue, answers)} ` : ''}${getQuestionPrompt(currentQuestion, answers)}`
      : 'Ya tengo una base bastante clara del proyecto. Si querés, ahora genero una propuesta adaptada a todo lo que me contaste.'

    if (lastAssistantTurnRef.current === turnSignature) {
      return undefined
    }

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
                rawValue: chatMessages.filter((message) => message.role === 'user').at(-1)?.text || null,
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
          const nextMessage = response.message || fallbackMessage
          setChatMessages((prev) => [
            ...prev,
            {
              id: `assistant-${answeredQuestions.length}`,
              role: 'assistant',
              text: nextMessage,
            },
          ])
          lastAssistantTurnRef.current = turnSignature
        }
      } catch (_error) {
        if (!cancelled) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: `assistant-${answeredQuestions.length}`,
              role: 'assistant',
              text: fallbackMessage,
            },
          ])
          lastAssistantTurnRef.current = turnSignature
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

  const submitAnswer = (rawValue) => {
    if (!currentQuestion) {
      return
    }

    const normalizedAnswer = normalizeConversationalAnswer(currentQuestion, rawValue)

    if (!normalizedAnswer.isValid) {
      setInputError(normalizedAnswer.error)
      return
    }

    setInputError('')

    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${currentQuestion.key}`,
        role: 'user',
        text: normalizedAnswer.displayText,
      },
    ])
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: normalizedAnswer.value,
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
          {chatMessages.map((message) => (
            <div key={message.id} className={`message ${message.role === 'assistant' ? 'message-bot' : 'message-user'}`}>
              <div className={`message-bubble ${message.role === 'user' ? 'user-bubble' : ''}`}>
                {message.text}
              </div>
            </div>
          ))}

          {isAssistantThinking ? (
            <div className="message message-bot current-question">
              <div className="message-bubble message-bubble-muted">HabitatIA está pensando la mejor siguiente pregunta para este caso...</div>
            </div>
          ) : null}
          <div ref={threadEndRef} />
        </div>

        {currentQuestion ? (
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
                placeholder={currentQuestion.placeholder || 'Escribí tu respuesta'}
              />
              <button type="submit" className="btn btn-success">
                Enviar
              </button>
            </form>
            {inputError ? <div className="chat-input-error">{inputError}</div> : null}
            {currentQuestion.options?.length ? (
              <div className="chat-suggestions">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="btn btn-outline-success chat-suggestion-btn"
                    onClick={() => submitAnswer(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
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
