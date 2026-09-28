const QUESTION_LIMITS = {
  softMin: 6,
  hardMax: 10,
}

const CORE_FIELDS = ['projectName', 'familyMembers', 'bedrooms', 'bathrooms', 'squareMeters', 'budget', 'location']
const SECONDARY_FIELDS = ['hasLand', 'terrainType', 'priority', 'qualityLevel', 'climate', 'material', 'floors']

const EMPTY_ANSWER_SHAPE = {
  projectName: null,
  propertyType: null,
  familyMembers: null,
  bedrooms: null,
  bathrooms: null,
  squareMeters: null,
  budget: null,
  hasLand: null,
  urgency: null,
  priority: null,
  qualityLevel: null,
  location: null,
  climate: null,
  terrainType: null,
  material: null,
  floors: null,
  hasSuiteBathroom: null,
  hasPool: null,
  hasGarage: null,
  hasQuincho: null,
  hasGrill: null,
  extraNotes: null,
}

const ANSWER_FIELD_GUIDE = `
- projectName: nombre breve del proyecto si el usuario ya lo dijo.
- propertyType: fijar "casa" salvo que el usuario contradiga explicitamente el contexto.
- familyMembers: cantidad de personas, como string numerico.
- bedrooms: cantidad de dormitorios, como string numerico.
- bathrooms: cantidad de banos, como string numerico.
- squareMeters: metros cuadrados aproximados, como string numerico.
- budget: presupuesto aproximado en USD o numero neutral sin simbolos, como string numerico.
- hasLand: "si" o "no".
- urgency: "alta", "media" o "baja".
- priority: "costo", "eficiencia" o "sostenibilidad".
- qualityLevel: "bajo", "medio" o "alto".
- location: ciudad o zona.
- climate: "templado", "calido", "frio" o "humedo".
- terrainType: "urbano", "suburbano", "rural" o "pendiente".
- material: "madera-reciclada", "hormigon-verde" o "acero-reciclado".
- floors: "1", "2" o "3".
- hasSuiteBathroom, hasPool, hasGarage, hasQuincho, hasGrill: "true" o "false".
- extraNotes: preferencias abiertas relevantes.
`.trim()

const HABITATIA_CHAT_INSTRUCTIONS = `
Sos HabitatIA, un asistente conversacional para relevar una casa desde cero.

Objetivo:
- conducir una entrevista breve, natural y util;
- adaptar la profundidad segun lo bien o mal que responda la persona;
- hacer menos preguntas si el usuario responde con mucho detalle;
- hacer mas preguntas si faltan datos importantes;
- nunca convertir la charla en un formulario rigido;
- nunca hacer preguntas infinitas.

Reglas de comportamiento:
- siempre hablas en espanol;
- haces una sola pregunta por turno;
- no ofreces opciones tipo multiple choice salvo dentro de una frase natural;
- no preguntas el tipo de vivienda: asumimos una casa desde cero;
- reconoces lo que la persona acaba de responder antes de avanzar;
- si el usuario ya dio varios datos en una sola respuesta, los aprovechas y no los vuelves a preguntar;
- priorizas comprender familia, tamano, presupuesto, terreno, ubicacion y prioridades;
- puedes saltear detalles secundarios si ya hay base suficiente para generar una propuesta inicial;
- intentas cerrar entre 6 y 9 preguntas del asistente cuando ya hay buen contexto;
- nunca superas 10 preguntas del asistente;
- no prometes precision tecnica, aprobaciones municipales ni reemplazo profesional.

Decision de cierre:
- shouldComplete = true cuando ya haya suficiente contexto para una primera propuesta coherente;
- si assistantQuestionCount es menor que ${QUESTION_LIMITS.softMin}, evita cerrar demasiado pronto salvo que la persona ya haya dado una descripcion muy completa;
- si assistantQuestionCount es mayor o igual a ${QUESTION_LIMITS.hardMax}, debes cerrar aunque falten detalles menores;
- si hasLand es "no", no hace falta insistir con terrainType;
- si la persona no sabe un dato exacto, aceptas aproximaciones.

Extraccion:
- actualizas solo los campos que puedan inferirse con confianza de la conversacion;
- si un campo no esta claro, devuelvelo en null;
- no inventes datos;
- propertyType debe quedar en "casa".

Debes responder SIEMPRE en JSON valido con esta forma exacta:
{
  "message": "texto corto en espanol",
  "shouldComplete": false,
  "extractedAnswers": {
    "projectName": null,
    "propertyType": "casa",
    "familyMembers": null,
    "bedrooms": null,
    "bathrooms": null,
    "squareMeters": null,
    "budget": null,
    "hasLand": null,
    "urgency": null,
    "priority": null,
    "qualityLevel": null,
    "location": null,
    "climate": null,
    "terrainType": null,
    "material": null,
    "floors": null,
    "hasSuiteBathroom": null,
    "hasPool": null,
    "hasGarage": null,
    "hasQuincho": null,
    "hasGrill": null,
    "extraNotes": null
  }
}
`.trim()

function buildConversationSnapshot(answers) {
  const filled = Object.entries(answers || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')

  if (filled.length === 0) {
    return 'Todavia no hay respuestas estructuradas cargadas.'
  }

  return filled.map(([key, value]) => `- ${key}: ${value}`).join('\n')
}

function buildTranscript(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Todavia no hay historial del chat.'
  }

  return messages
    .slice(-12)
    .map((message) => `- ${message.role === 'assistant' ? 'HabitatIA' : 'Usuario'}: ${message.text}`)
    .join('\n')
}

function sanitizeExtractedAnswers(rawAnswers = {}) {
  const sanitized = { ...EMPTY_ANSWER_SHAPE, propertyType: 'casa' }

  Object.entries(rawAnswers || {}).forEach(([key, value]) => {
    if (!(key in sanitized) || value === undefined || value === null || value === '') {
      return
    }

    sanitized[key] = typeof value === 'string' ? value.trim() : String(value)
  })

  sanitized.propertyType = 'casa'
  return sanitized
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function extractBudget(rawText) {
  const normalized = normalizeText(rawText)
  const rangeMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(mil|k)?\s*(?:usd|u\$s|dolares?)?.{0,20}?(?:y|a|-|entre)\s*(\d+(?:[.,]\d+)?)\s*(mil|k)?/)

  if (rangeMatch) {
    const inferredThousands = Boolean(rangeMatch[2] || rangeMatch[4])
    const firstValue = Number(rangeMatch[1].replace(',', '.')) * (rangeMatch[2] || inferredThousands ? 1000 : 1)
    const secondValue = Number(rangeMatch[3].replace(',', '.')) * (rangeMatch[4] || inferredThousands ? 1000 : 1)
    return String(Math.round((firstValue + secondValue) / 2))
  }

  const singleMatch =
    normalized.match(/(\d+(?:[.,]\d+)?)\s*(mil|k)?\s*(?:usd|u\$s|dolares?)/) ||
    normalized.match(/(?:presupuesto|aprox|aproximado|maximo|hasta)\D{0,18}(\d+(?:[.,]\d+)?)\s*(mil|k)?/)

  if (!singleMatch) {
    return null
  }

  const numericValue = Number(singleMatch[1].replace(',', '.')) * (singleMatch[2] ? 1000 : 1)
  return String(Math.round(numericValue))
}

function extractHasLand(rawText) {
  const normalized = normalizeText(rawText)

  if (/\b(no|sin)\b.{0,20}\bterreno\b/.test(normalized)) {
    return 'no'
  }

  if (/\b(contamos|tenemos|tengo|con|poseemos)\b.{0,20}\bterreno\b/.test(normalized)) {
    return 'si'
  }

  return null
}

function extractNumber(rawText) {
  const normalized = normalizeText(rawText).replace(/,/g, '.')
  const digitMatch = normalized.match(/\d+(?:\.\d+)?/)

  if (digitMatch) {
    return Number(digitMatch[0])
  }

  const numberWords = [
    ['uno', 1],
    ['una', 1],
    ['dos', 2],
    ['tres', 3],
    ['cuatro', 4],
    ['cinco', 5],
    ['seis', 6],
    ['siete', 7],
    ['ocho', 8],
    ['nueve', 9],
    ['diez', 10],
  ]

  const matchedWord = numberWords.find(([word]) => new RegExp(`\\b${word}\\b`).test(normalized))
  return matchedWord ? matchedWord[1] : null
}

function extractFamilyMembers(rawText) {
  const normalized = normalizeText(rawText)
  const explicitFamilyMatch = normalized.match(/\bfamilia\s+de\s+(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/)
  const hasFamilyContext = /\b(familia|personas?|integrantes?|vivir|viviriamos|seriamos)\b/.test(normalized)
  const value = extractNumber(explicitFamilyMatch?.[1] || rawText)

  if (!value) {
    return null
  }

  if (!explicitFamilyMatch && !hasFamilyContext) {
    return null
  }

  if (value >= 6) return '6'
  if (value >= 1 && value <= 5) return String(value)
  return null
}

function extractBoundedNumber(rawText, allowedValues) {
  const value = extractNumber(rawText)

  if (!value) {
    return null
  }

  const normalizedValue = String(value)
  return allowedValues.includes(normalizedValue) ? normalizedValue : null
}

function extractFloors(rawText) {
  const normalized = normalizeText(rawText)
  const boundedNumber = extractBoundedNumber(rawText, ['1', '2', '3'])

  if (boundedNumber) {
    return boundedNumber
  }

  if (
    normalized.includes('una planta') ||
    normalized.includes('planta unica') ||
    normalized.includes('planta baja') ||
    normalized.includes('un solo piso') ||
    normalized.includes('todo en una planta')
  ) {
    return '1'
  }

  if (normalized.includes('dos plantas') || normalized.includes('dos pisos') || normalized.includes('dos niveles')) {
    return '2'
  }

  if (normalized.includes('tres plantas') || normalized.includes('tres pisos') || normalized.includes('tres niveles')) {
    return '3'
  }

  if (normalized.includes('mas de un piso') || normalized.includes('varios pisos') || normalized.includes('varias plantas')) {
    return '2'
  }

  return null
}

function extractProjectName(rawText) {
  const trimmed = String(rawText || '').trim()

  if (!trimmed) {
    return null
  }

  const normalized = normalizeText(trimmed)

  if (trimmed.length > 40 || !/[a-záéíóúñ]/i.test(trimmed)) {
    return null
  }

  if (/\b(familia|terreno|presupuesto|dolares|usd|casa|construir)\b/.test(normalized)) {
    return null
  }

  return trimmed
}

function extractContextualAnswer(questionText, rawText) {
  const question = normalizeText(questionText)
  const answer = normalizeText(rawText)
  const trimmedAnswer = String(rawText || '').trim()
  const extracted = {}

  if (/\b(dormitorios?|habitaciones?|cuartos?)\b/.test(question)) {
    extracted.bedrooms = extractBoundedNumber(rawText, ['1', '2', '3', '4'])
  } else if (/\b(personas?|familia|integrantes?)\b/.test(question)) {
    extracted.familyMembers = extractBoundedNumber(rawText, ['1', '2', '3', '4', '5', '6'])
  } else if (/\b(banos?)\b/.test(question)) {
    extracted.bathrooms = extractBoundedNumber(rawText, ['1', '2', '3'])
  } else if (/\bmetros? cuadrados?\b/.test(question)) {
    const squareMeters = extractNumber(rawText)
    extracted.squareMeters = squareMeters ? String(squareMeters) : null
  } else if (/\bpresupuesto\b/.test(question)) {
    const budget = extractBudget(rawText) || extractNumber(rawText)
    extracted.budget = budget ? String(budget) : null
  } else if (/\b(nombre|identificar)\b/.test(question) && /\bproyecto\b/.test(question)) {
    extracted.projectName = extractProjectName(rawText)
  } else if (/\b(ciudad|zona)\b/.test(question) && trimmedAnswer) {
    extracted.location = trimmedAnswer.slice(0, 120)
  } else if (/\bterreno\b/.test(question) && /\b(urbano|suburbano|rural|pendiente)\b/.test(question)) {
    if (answer.includes('pendiente') || answer.includes('desnivel')) extracted.terrainType = 'pendiente'
    else if (answer.includes('rural') || answer.includes('campo')) extracted.terrainType = 'rural'
    else if (answer.includes('suburb')) extracted.terrainType = 'suburbano'
    else if (answer.includes('urban') || answer.includes('ciudad') || answer.includes('barrio')) extracted.terrainType = 'urbano'
  } else if (/\bterreno\b/.test(question)) {
    if (/^(si|s|claro|tenemos?|cuento|contamos)\b/.test(answer)) extracted.hasLand = 'si'
    else if (/^(no|n|todavia no|aun no)\b/.test(answer)) extracted.hasLand = 'no'
  } else if (/\b(una planta|piso|pisos)\b/.test(question)) {
    extracted.floors = extractFloors(rawText)
  } else if (/\b(costo|eficiencia|sostenibilidad)\b/.test(question)) {
    if (/costo|barato|ahorro|presupuesto/.test(answer)) extracted.priority = 'costo'
    else if (/eficien|mantenimiento|consumo/.test(answer)) extracted.priority = 'eficiencia'
    else if (/sosten|ecolog|ambient|sustent/.test(answer)) extracted.priority = 'sostenibilidad'
  } else if (/\b(terminacion|basica|intermedia|alta)\b/.test(question)) {
    if (/alta|premium/.test(answer)) extracted.qualityLevel = 'alto'
    else if (/media|medio|intermedia|equilibr/.test(answer)) extracted.qualityLevel = 'medio'
    else if (/baja|bajo|basica|econom/.test(answer)) extracted.qualityLevel = 'bajo'
  } else if (/\bclima\b/.test(question)) {
    if (/templ/.test(answer)) extracted.climate = 'templado'
    else if (/calido|calor|caluroso/.test(answer)) extracted.climate = 'calido'
    else if (/frio/.test(answer)) extracted.climate = 'frio'
    else if (/humed|humedad/.test(answer)) extracted.climate = 'humedo'
  } else if (/\b(madera|hormigon|acero|material)\b/.test(question)) {
    if (answer.includes('madera')) extracted.material = 'madera-reciclada'
    else if (/hormigon|cemento/.test(answer)) extracted.material = 'hormigon-verde'
    else if (/acero|metal/.test(answer)) extracted.material = 'acero-reciclado'
  }

  return Object.fromEntries(Object.entries(extracted).filter(([, value]) => value !== null && value !== ''))
}

function extractFallbackAnswersFromMessages(messages = [], currentAnswers = {}) {
  const lastUserIndex = [...messages].map((message) => message?.role).lastIndexOf('user')
  const lastUserMessage = lastUserIndex >= 0 ? messages[lastUserIndex]?.text : null

  if (!lastUserMessage) {
    return currentAnswers
  }

  const previousAssistantMessage = messages
    .slice(0, lastUserIndex)
    .reverse()
    .find((message) => message?.role === 'assistant' && message?.text)?.text
  const contextualAnswers = extractContextualAnswer(previousAssistantMessage, lastUserMessage)

  const extracted = {
    ...contextualAnswers,
    projectName: currentAnswers.projectName || contextualAnswers.projectName,
    familyMembers: currentAnswers.familyMembers || extractFamilyMembers(lastUserMessage),
    budget: currentAnswers.budget || extractBudget(lastUserMessage),
    hasLand: currentAnswers.hasLand || extractHasLand(lastUserMessage),
  }

  const normalized = normalizeText(lastUserMessage)

  if (!currentAnswers.bedrooms && /\b(dormitorio|habitacion|habitaciones|cuarto|cuartos)\b/.test(normalized)) {
    extracted.bedrooms = extractBoundedNumber(lastUserMessage, ['1', '2', '3', '4'])
  }

  if (!currentAnswers.bathrooms && /\b(bano|banos)\b/.test(normalized)) {
    extracted.bathrooms = extractBoundedNumber(lastUserMessage, ['1', '2', '3'])
  }

  if (!currentAnswers.floors && /\b(piso|pisos|planta|plantas|nivel|niveles)\b/.test(normalized)) {
    extracted.floors = extractFloors(lastUserMessage)
  }

  return sanitizeExtractedAnswers({ ...currentAnswers, ...extracted, ...contextualAnswers })
}

function extractResponseText(body) {
  if (typeof body?.output_text === 'string' && body.output_text.trim()) {
    return body.output_text
  }

  for (const item of body?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && typeof content.text === 'string' && content.text.trim()) {
        return content.text
      }
    }
  }

  return null
}

function getMissingFields(answers = {}) {
  const normalized = { ...answers, propertyType: 'casa' }
  const terrainRelevant = normalized.hasLand === 'si'
  const secondaryFields = terrainRelevant ? SECONDARY_FIELDS : SECONDARY_FIELDS.filter((field) => field !== 'terrainType')

  return [...CORE_FIELDS, ...secondaryFields].filter((field) => !normalized[field])
}

function buildFallbackQuestion(answers = {}, assistantQuestionCount = 0) {
  const missing = getMissingFields(answers)
  const firstTurn = assistantQuestionCount === 0

  if (firstTurn) {
    return {
      message:
        'Arranquemos por una base general: contame para quien seria la casa, si ya tienen terreno y que presupuesto aproximado imaginan para construir.',
      shouldComplete: false,
    }
  }

  if (assistantQuestionCount >= QUESTION_LIMITS.hardMax) {
    return {
      message:
        'Perfecto, con esto ya tengo una base suficiente para armar una propuesta inicial de la casa y darte una primera estimacion.',
      shouldComplete: true,
    }
  }

  const nextField = missing[0]

  switch (nextField) {
    case 'projectName':
      return { message: 'Si querés, ahora decime con qué nombre te gustaría identificar este proyecto.', shouldComplete: false }
    case 'familyMembers':
      return { message: 'Para dimensionarla bien, ¿cuántas personas van a vivir en la casa?', shouldComplete: false }
    case 'bedrooms':
      return { message: '¿Cuántos dormitorios te imaginás como punto de partida?', shouldComplete: false }
    case 'bathrooms':
      return { message: '¿Y cuántos baños te gustaría resolver desde la etapa inicial?', shouldComplete: false }
    case 'squareMeters':
      return { message: 'Aunque sea aproximado, ¿de cuántos metros cuadrados te gustaría que fuera la casa?', shouldComplete: false }
    case 'budget':
      return { message: '¿Con qué presupuesto aproximado querés pensar esta casa?', shouldComplete: false }
    case 'location':
      return { message: '¿En qué ciudad o zona pensás construirla?', shouldComplete: false }
    case 'hasLand':
      return { message: '¿Ya cuentan con terreno o todavía no definieron eso?', shouldComplete: false }
    case 'terrainType':
      return { message: '¿Cómo es ese terreno: más urbano, suburbano, rural o con pendiente?', shouldComplete: false }
    case 'priority':
      return { message: 'A la hora de decidir, ¿qué te importa más: bajar costo, ganar eficiencia o priorizar sostenibilidad?', shouldComplete: false }
    case 'qualityLevel':
      return { message: '¿Buscás una terminación más básica, intermedia o alta?', shouldComplete: false }
    case 'climate':
      return { message: '¿Cómo describirías el clima de la zona donde querés construir?', shouldComplete: false }
    case 'material':
      return { message: 'Si tenés una preferencia, ¿te inclinás más por madera, hormigón o acero como base constructiva?', shouldComplete: false }
    case 'floors':
      return { message: '¿La pensás en una planta o con más de un piso?', shouldComplete: false }
    default:
      if (assistantQuestionCount >= QUESTION_LIMITS.softMin && missing.length <= 2) {
        return {
          message:
            'Buenísimo, ya tengo bastante contexto para una primera propuesta. Si querés, con esto avanzo a la generación de la casa.',
          shouldComplete: true,
        }
      }

      return {
        message:
          'Con lo que me venís contando ya estamos bastante cerca. ¿Hay algún detalle importante de la casa que todavía no te haya preguntado?',
        shouldComplete: false,
      }
  }
}

async function requestOpenAIChatTurn({ answers = {}, messages = [], assistantQuestionCount = 0 }) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      ...buildFallbackQuestion(answers, assistantQuestionCount),
      extractedAnswers: sanitizeExtractedAnswers(answers),
      model: 'fallback-no-api-key',
      usedFallback: true,
    }
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
assistantQuestionCount: ${assistantQuestionCount}

Estado estructurado actual:
${buildConversationSnapshot(answers)}

Historial reciente del chat:
${buildTranscript(messages)}

Campos importantes que puedes completar si aparecen:
${ANSWER_FIELD_GUIDE}

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
          name: 'habitatia_adaptive_chat_turn',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              message: { type: 'string' },
              shouldComplete: { type: 'boolean' },
              extractedAnswers: {
                type: 'object',
                additionalProperties: false,
                properties: Object.fromEntries(
                  Object.keys(EMPTY_ANSWER_SHAPE).map((key) => [key, { type: ['string', 'null'] }]),
                ),
                required: Object.keys(EMPTY_ANSWER_SHAPE),
              },
            },
            required: ['message', 'shouldComplete', 'extractedAnswers'],
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

  const responseText = extractResponseText(body)
  const parsed = responseText ? JSON.parse(responseText) : null

  if (!parsed?.message || typeof parsed.shouldComplete !== 'boolean' || !parsed.extractedAnswers) {
    throw new Error('La respuesta del modelo no devolvio un turno valido.')
  }

  return {
    message: parsed.message,
    shouldComplete: parsed.shouldComplete,
    extractedAnswers: sanitizeExtractedAnswers(parsed.extractedAnswers),
    model,
    usedFallback: false,
  }
}

async function generateConversationalTurn(payload = {}) {
  const baseAnswers = sanitizeExtractedAnswers(payload.answers || {})
  const messages = Array.isArray(payload.messages) ? payload.messages : []
  const assistantQuestionCount = Number(payload.assistantQuestionCount || 0)
  const answers = extractFallbackAnswersFromMessages(messages, baseAnswers)

  try {
    return await requestOpenAIChatTurn({ answers, messages, assistantQuestionCount })
  } catch (error) {
    console.error('generateConversationalTurn fallback', { message: error.message, stack: error.stack })

    return {
      ...buildFallbackQuestion(answers, assistantQuestionCount),
      extractedAnswers: answers,
      model: 'fallback-error',
      usedFallback: true,
    }
  }
}

module.exports = {
  generateConversationalTurn,
}
