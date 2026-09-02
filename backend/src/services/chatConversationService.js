const HABITATIA_CHAT_INSTRUCTIONS = `
Sos HabitatIA, un asistente conversacional para definir proyectos de vivienda en espanol.

Tu tarea en este endpoint es conducir una entrevista breve y natural:
- reconoces lo que la persona acaba de responder, si existe una respuesta nueva;
- haces una sola pregunta por vez;
- adaptas el tono y la formulacion a lo ya respondido;
- no hablas como formulario ni como soporte tecnico;
- no prometes precision tecnica, aprobaciones municipales ni reemplazo profesional;
- mantienes mensajes cortos, claros y utiles.

Debes responder SIEMPRE en JSON valido con esta forma exacta:
{
  "message": "texto corto en espanol"
}

El campo "message" debe:
- tener entre 1 y 3 frases;
- incluir acknowledgement si hay respuesta previa;
- cerrar con la siguiente pregunta si todavia falta informacion;
- si ya no faltan preguntas, indicar que ya hay informacion suficiente para generar la propuesta.
`.trim()

function buildConversationSnapshot(answers) {
  const filled = Object.entries(answers || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')

  if (filled.length === 0) {
    return 'Todavia no hay respuestas cargadas.'
  }

  return filled.map(([key, value]) => `- ${key}: ${value}`).join('\n')
}

async function generateConversationalTurn({ answers = {}, answeredQuestion = null, nextQuestion = null }) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    const error = new Error('Falta configurar OPENAI_API_KEY para el chat conversacional.')
    error.statusCode = 500
    throw error
  }

  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-5-mini'

  const input = [
    {
      role: 'system',
      content: [{ type: 'input_text', text: HABITATIA_CHAT_INSTRUCTIONS }],
    },
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `
Estado actual del cliente:
${buildConversationSnapshot(answers)}

Ultima respuesta recibida:
${answeredQuestion ? `- clave: ${answeredQuestion.key}
- etiqueta: ${answeredQuestion.label}
- valor: ${answeredQuestion.value}
- valor visible: ${answeredQuestion.labelValue}` : 'No hubo respuesta previa; este es el primer turno.'}

Siguiente pregunta estructural que debe cubrir HabitatIA:
${nextQuestion ? `- clave: ${nextQuestion.key}
- etiqueta: ${nextQuestion.label}
- pregunta base: ${nextQuestion.question}
- tipo: ${nextQuestion.type}
- opciones: ${nextQuestion.options?.map((option) => option.label).join(', ') || 'sin opciones'}` : 'No quedan preguntas pendientes.'}

Genera solamente el JSON pedido.
          `.trim(),
        },
      ],
    },
  ]

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: 'habitatia_chat_turn',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
      },
    }),
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(body?.error?.message || 'No se pudo consultar OpenAI para el chat.')
    error.statusCode = response.status
    throw error
  }

  const parsed = body?.output_text ? JSON.parse(body.output_text) : null

  if (!parsed?.message) {
    throw new Error('La respuesta del modelo no devolvio un mensaje valido.')
  }

  return {
    message: parsed.message,
    model,
  }
}

module.exports = {
  generateConversationalTurn,
}
