export const chatQuestions = [
  {
    key: 'projectName',
    label: 'Nombre del proyecto',
    question: 'Hola, soy HabitatIA. Para empezar, ¿cómo te gustaría llamar a tu proyecto?',
    type: 'text',
    placeholder: 'Ej: Casa familiar zona sur',
  },
  {
    key: 'propertyType',
    label: 'Tipo de vivienda',
    question: '¿Qué tipo de vivienda estás buscando?',
    type: 'select',
    options: [
      { value: 'casa', label: 'Casa' },
      { value: 'departamento', label: 'Departamento' },
    ],
  },
  {
    key: 'familyMembers',
    label: 'Integrantes de la familia',
    question: '¿Cuántas personas van a vivir en la vivienda?',
    type: 'select',
    options: [
      { value: '1', label: '1 persona' },
      { value: '2', label: '2 personas' },
      { value: '3', label: '3 personas' },
      { value: '4', label: '4 personas' },
      { value: '5', label: '5 personas' },
      { value: '6', label: '6 o más personas' },
    ],
  },
  {
    key: 'bedrooms',
    label: 'Dormitorios',
    question: '¿Cuántos dormitorios necesitás?',
    type: 'select',
    options: [
      { value: '1', label: '1 dormitorio' },
      { value: '2', label: '2 dormitorios' },
      { value: '3', label: '3 dormitorios' },
      { value: '4', label: '4 dormitorios' },
    ],
  },
  {
    key: 'bathrooms',
    label: 'Baños',
    question: '¿Cuántos baños querés que tenga?',
    type: 'select',
    options: [
      { value: '1', label: '1 baño' },
      { value: '2', label: '2 baños' },
      { value: '3', label: '3 baños' },
    ],
  },
  {
    key: 'squareMeters',
    label: 'Metros cuadrados',
    question: '¿Cuántos metros cuadrados aproximados te gustaría que tenga la vivienda?',
    type: 'number',
    placeholder: 'Ej: 70',
  },
  {
    key: 'budget',
    label: 'Presupuesto',
    question: '¿Cuál es el presupuesto máximo disponible para construir?',
    type: 'number',
    placeholder: 'Ej: 60000',
  },
  {
    key: 'hasLand',
    label: 'Terreno',
    question: '¿Ya contás con un terreno?',
    type: 'select',
    options: [
      { value: 'si', label: 'Sí' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'urgency',
    label: 'Urgencia',
    question: '¿Qué nivel de urgencia tiene resolver esta vivienda?',
    type: 'select',
    options: [
      { value: 'alta', label: 'Alta' },
      { value: 'media', label: 'Media' },
      { value: 'baja', label: 'Baja' },
    ],
  },
  {
    key: 'priority',
    label: 'Prioridad',
    question: '¿Qué querés priorizar más en esta propuesta?',
    type: 'select',
    options: [
      { value: 'costo', label: 'Menor costo' },
      { value: 'eficiencia', label: 'Menor gasto de mantenimiento' },
      { value: 'sostenibilidad', label: 'Construcción más sostenible' },
    ],
  },
  {
    key: 'qualityLevel',
    label: 'Nivel de calidad',
    question: '¿Qué nivel de calidad buscás para la vivienda?',
    type: 'select',
    options: [
      { value: 'bajo', label: 'Bajo' },
      { value: 'medio', label: 'Medio' },
      { value: 'alto', label: 'Alto' },
    ],
  },
  {
    key: 'location',
    label: 'Ubicación',
    question: '¿En qué zona o ciudad estaría ubicada la vivienda?',
    type: 'text',
    placeholder: 'Ej: Córdoba, Argentina',
  },
  {
    key: 'climate',
    label: 'Clima',
    question: '¿Cómo es el clima donde pensás construir?',
    type: 'select',
    options: [
      { value: 'templado', label: 'Templado' },
      { value: 'calido', label: 'Cálido' },
      { value: 'frio', label: 'Frío' },
      { value: 'humedo', label: 'Húmedo' },
    ],
  },
  {
    key: 'terrainType',
    label: 'Tipo de terreno',
    question: '¿Qué tipo de terreno tenés o estimás que tendrá la vivienda?',
    type: 'select',
    showIf: (answers) => answers.hasLand === 'si',
    options: [
      { value: 'urbano', label: 'Urbano' },
      { value: 'suburbano', label: 'Suburbano' },
      { value: 'rural', label: 'Rural' },
      { value: 'pendiente', label: 'Con pendiente' },
    ],
  },
  {
    key: 'material',
    label: 'Material preferido',
    question: '¿Tenés alguna preferencia de material para la construcción?',
    type: 'select',
    options: [
      { value: 'madera-reciclada', label: 'Madera reciclada' },
      { value: 'hormigon-verde', label: 'Hormigón verde' },
      { value: 'acero-reciclado', label: 'Acero reciclado' },
    ],
  },
  {
    key: 'floors',
    label: 'Pisos',
    question: 'Si la vivienda es una casa, ¿cuántos pisos te gustaría que tenga?',
    type: 'select',
    showIf: (answers) => answers.propertyType === 'casa',
    options: [
      { value: '1', label: '1 piso' },
      { value: '2', label: '2 pisos' },
      { value: '3', label: '3 pisos' },
    ],
  },
  {
    key: 'hasSuiteBathroom',
    label: 'Suite',
    question: '¿Querés que el dormitorio principal tenga baño en suite?',
    type: 'select',
    showIf: (answers) => answers.propertyType === 'casa',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasPool',
    label: 'Pileta',
    question: '¿Te gustaría que la casa tenga pileta?',
    type: 'select',
    showIf: (answers) => answers.propertyType === 'casa',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasGarage',
    label: 'Garage',
    question: '¿Querés incluir garage?',
    type: 'select',
    showIf: (answers) => answers.propertyType === 'casa',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasQuincho',
    label: 'Quincho',
    question: '¿Querés que tenga quincho?',
    type: 'select',
    showIf: (answers) => answers.propertyType === 'casa',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasGrill',
    label: 'Parrilla',
    question: '¿Querés agregar parrilla?',
    type: 'select',
    showIf: (answers) => answers.propertyType === 'casa',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'extraNotes',
    label: 'Aclaraciones finales',
    question:
      'Última pregunta: ¿hay alguna especificación, preferencia o aclaración especial que quieras agregar?',
    type: 'text',
    placeholder: 'Ej: quiero que la cocina esté integrada, necesito espacio para trabajar en casa, etc.',
  },
]

export function getVisibleQuestions(answers) {
  return chatQuestions.filter((question) => (question.showIf ? question.showIf(answers) : true))
}

export function formatAnswerLabel(question, value) {
  if (question.type === 'select') {
    return question.options?.find((option) => option.value === value)?.label || value
  }

  return value
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function parseNumberAnswer(rawValue) {
  const normalized = normalizeText(rawValue).replace(/,/g, '.')
  const digits = normalized.match(/\d+(?:\.\d+)?/)

  if (!digits) {
    const numberWords = [
      ['uno', '1'],
      ['dos', '2'],
      ['tres', '3'],
      ['cuatro', '4'],
      ['cinco', '5'],
      ['seis', '6'],
      ['siete', '7'],
      ['ocho', '8'],
      ['nueve', '9'],
      ['diez', '10'],
    ]

    const matchedWord = numberWords.find(([word]) => new RegExp(`\\b${word}\\b`).test(normalized))
    return matchedWord ? matchedWord[1] : null
  }

  return digits[0]
}

function parseBooleanLike(rawValue) {
  const normalized = normalizeText(rawValue)

  if (/^(si|sí|s|yes|ok|dale|claro|obvio)$/.test(normalized) || normalized.includes('tengo') || normalized.includes('quiero')) {
    return 'true'
  }

  if (/^(no|n|nope)$/.test(normalized) || normalized.includes('no tengo') || normalized.includes('sin ')) {
    return 'false'
  }

  return null
}

function parseFamilyMembersAnswer(rawValue) {
  const parsedNumber = parseNumberAnswer(rawValue)

  if (!parsedNumber) {
    return null
  }

  const value = Number(parsedNumber)
  if (value >= 6) return '6'
  if (value >= 1 && value <= 5) return String(value)
  return null
}

function parseBoundedNumericAnswer(rawValue, allowedValues) {
  const parsedNumber = parseNumberAnswer(rawValue)

  if (!parsedNumber) {
    return null
  }

  const numericValue = String(Number(parsedNumber))
  return allowedValues.includes(numericValue) ? numericValue : null
}

function parseFloorsAnswer(rawValue) {
  const normalized = normalizeText(rawValue)
  const parsedNumber = parseBoundedNumericAnswer(rawValue, ['1', '2', '3'])

  if (parsedNumber) {
    return parsedNumber
  }

  if (
    normalized.includes('una planta') ||
    normalized.includes('planta unica') ||
    normalized.includes('planta única') ||
    normalized.includes('planta baja') ||
    normalized.includes('un solo piso') ||
    normalized.includes('solo un piso') ||
    normalized.includes('todo en una planta')
  ) {
    return '1'
  }

  if (
    normalized.includes('dos plantas') ||
    normalized.includes('dos pisos') ||
    normalized.includes('doble planta') ||
    normalized.includes('dos niveles')
  ) {
    return '2'
  }

  if (
    normalized.includes('tres plantas') ||
    normalized.includes('tres pisos') ||
    normalized.includes('tres niveles')
  ) {
    return '3'
  }

  if (
    normalized.includes('mas de un piso') ||
    normalized.includes('más de un piso') ||
    normalized.includes('mas de una planta') ||
    normalized.includes('más de una planta') ||
    normalized.includes('varios pisos') ||
    normalized.includes('varias plantas')
  ) {
    return '2'
  }

  if (
    (normalized.includes('presupuesto') || normalized.includes('se pueda') || normalized.includes('segun convenga')) &&
    (normalized.includes('piso') || normalized.includes('planta') || normalized.includes('nivel'))
  ) {
    return '2'
  }

  return null
}

function parseSelectAnswer(question, rawValue) {
  const normalized = normalizeText(rawValue)

  if (!normalized) {
    return null
  }

  switch (question.key) {
    case 'propertyType':
      if (normalized.includes('depa') || normalized.includes('departa') || normalized.includes('apart')) return 'departamento'
      if (normalized.includes('casa')) return 'casa'
      return null
    case 'familyMembers':
      return parseFamilyMembersAnswer(rawValue)
    case 'bedrooms':
      return parseBoundedNumericAnswer(rawValue, ['1', '2', '3', '4'])
    case 'bathrooms':
      return parseBoundedNumericAnswer(rawValue, ['1', '2', '3'])
    case 'hasLand':
      if (normalized.includes('no')) return 'no'
      if (normalized.includes('si') || normalized.includes('sí') || normalized.includes('tengo')) return 'si'
      return null
    case 'urgency':
      if (normalized.includes('alta') || normalized.includes('urgente') || normalized.includes('ya')) return 'alta'
      if (normalized.includes('media') || normalized.includes('normal') || normalized.includes('intermedia')) return 'media'
      if (normalized.includes('baja') || normalized.includes('tranqui') || normalized.includes('sin apuro')) return 'baja'
      return null
    case 'priority':
      if (normalized.includes('costo') || normalized.includes('barato') || normalized.includes('ahorro') || normalized.includes('presupuesto')) return 'costo'
      if (normalized.includes('eficien') || normalized.includes('mantenimiento') || normalized.includes('consumo')) return 'eficiencia'
      if (normalized.includes('sosten') || normalized.includes('ecolog') || normalized.includes('ambient') || normalized.includes('sustent')) return 'sostenibilidad'
      return null
    case 'qualityLevel':
      if (normalized.includes('alto') || normalized.includes('premium') || normalized.includes('alta')) return 'alto'
      if (normalized.includes('medio') || normalized.includes('intermedio') || normalized.includes('equilibrado')) return 'medio'
      if (normalized.includes('bajo') || normalized.includes('basico') || normalized.includes('econ')) return 'bajo'
      return null
    case 'climate':
      if (normalized.includes('templ')) return 'templado'
      if (normalized.includes('calido') || normalized.includes('calor') || normalized.includes('caluroso')) return 'calido'
      if (normalized.includes('frio') || normalized.includes('frío')) return 'frio'
      if (normalized.includes('humedo') || normalized.includes('húmedo') || normalized.includes('humedad')) return 'humedo'
      return null
    case 'terrainType':
      if (normalized.includes('pendiente') || normalized.includes('desnivel')) return 'pendiente'
      if (normalized.includes('rural') || normalized.includes('campo')) return 'rural'
      if (normalized.includes('suburb')) return 'suburbano'
      if (normalized.includes('urban') || normalized.includes('ciudad') || normalized.includes('barrio')) return 'urbano'
      return null
    case 'material':
      if (normalized.includes('madera')) return 'madera-reciclada'
      if (normalized.includes('hormigon') || normalized.includes('hormigón') || normalized.includes('cemento')) return 'hormigon-verde'
      if (normalized.includes('acero') || normalized.includes('metal')) return 'acero-reciclado'
      return null
    case 'floors':
      return parseFloorsAnswer(rawValue)
    case 'hasSuiteBathroom':
    case 'hasPool':
    case 'hasGarage':
    case 'hasQuincho':
    case 'hasGrill': {
      const parsedBoolean = parseBooleanLike(rawValue)
      return parsedBoolean
    }
    default:
      break
  }

  const matchedOption = question.options?.find((option) => {
    const optionLabel = normalizeText(option.label)
    return normalized === normalizeText(option.value) || normalized === optionLabel || normalized.includes(optionLabel)
  })

  return matchedOption?.value || null
}

export function normalizeConversationalAnswer(question, rawValue) {
  const trimmedValue = String(rawValue || '').trim()

  if (!trimmedValue) {
    return { isValid: false, error: 'Escribí una respuesta para continuar.' }
  }

  if (question.type === 'number') {
    const parsedNumber = parseNumberAnswer(trimmedValue)

    if (!parsedNumber) {
      return { isValid: false, error: 'Necesito un número aproximado para seguir.' }
    }

    return {
      isValid: true,
      value: parsedNumber,
      displayText: trimmedValue,
    }
  }

  if (question.type === 'select') {
    const parsedValue = parseSelectAnswer(question, trimmedValue)

    if (!parsedValue) {
      const customError =
        question.key === 'floors'
          ? 'Contame aunque sea aproximado si la imaginás de 1, 2 o 3 pisos.'
          : null

      return {
        isValid: false,
        error:
          customError ||
          'No terminé de interpretar esa respuesta. Escribila más directa o usá una de las sugerencias.',
      }
    }

    return {
      isValid: true,
      value: parsedValue,
      displayText: trimmedValue,
    }
  }

  return {
    isValid: true,
    value: trimmedValue,
    displayText: trimmedValue,
  }
}

function formatPropertyType(value) {
  if (value === 'casa') return 'una casa'
  if (value === 'departamento') return 'un departamento'
  return 'la vivienda'
}

function formatUrgency(value) {
  if (value === 'alta') return 'con bastante urgencia'
  if (value === 'media') return 'con una urgencia intermedia'
  if (value === 'baja') return 'sin apuro inmediato'
  return 'con el ritmo que te resulte mejor'
}

function formatPriority(value) {
  if (value === 'costo') return 'cuidar al máximo el presupuesto'
  if (value === 'eficiencia') return 'bajar gastos de mantenimiento'
  if (value === 'sostenibilidad') return 'lograr una solución más sostenible'
  return 'definir una prioridad clara'
}

function formatQualityLevel(value) {
  if (value === 'bajo') return 'una resolución simple y bien cuidada'
  if (value === 'medio') return 'un equilibrio entre costo y calidad'
  if (value === 'alto') return 'una terminación más completa y exigente'
  return 'el nivel de terminación'
}

export function getQuestionPrompt(question, answers) {
  switch (question.key) {
    case 'propertyType':
      return `Perfecto. Para ${answers.projectName || 'tu proyecto'}, ¿estás pensando en ${formatPropertyType('casa')} o en ${formatPropertyType('departamento')}?`
    case 'familyMembers':
      return `Bien. Así adapto mejor la distribución de ${formatPropertyType(answers.propertyType)}, ¿cuántas personas van a vivir ahí?`
    case 'bedrooms':
      return `Con eso en mente, ¿cuántos dormitorios necesitás para que ${answers.projectName || 'el proyecto'} funcione bien?`
    case 'bathrooms':
      return '¿Y cuántos baños te gustaría incluir para que la propuesta quede cómoda?'
    case 'squareMeters':
      return `Hasta acá voy entendiendo la base. ¿Qué superficie aproximada te imaginás para ${answers.projectName || 'la vivienda'}?`
    case 'budget':
      return 'Clave para orientarte bien: ¿cuál es el presupuesto máximo que te gustaría destinar a la construcción?'
    case 'hasLand':
      return 'Antes de seguir con la parte técnica, necesito saber si ya contás con un terreno o si eso todavía no está resuelto.'
    case 'urgency':
      return 'Entiendo. ¿Qué nivel de urgencia tiene hoy este proyecto para vos o tu familia?'
    case 'priority':
      return 'Si tuvieras que elegir un criterio principal para esta primera propuesta, ¿qué querés priorizar más?'
    case 'qualityLevel':
      return `Perfecto. Y en términos de terminaciones, ¿te imaginás ${formatQualityLevel('bajo')}, ${formatQualityLevel('medio')} o una opción más alta?`
    case 'location':
      return '¿En qué ciudad o zona estaría ubicada la vivienda? Eso me ayuda a contextualizar mejor la propuesta.'
    case 'climate':
      return `Bien, ya tengo la ubicación general. ¿Cómo describirías el clima de esa zona?`
    case 'terrainType':
      return 'Como ya tenés terreno, decime qué tipo de lote es o cómo lo describirías mejor.'
    case 'material':
      return `¿Tenés alguna preferencia de material o querés que priorice lo que mejor se adapte a ${formatPriority(answers.priority)}?`
    case 'floors':
      return 'Como estamos hablando de una casa, ¿te gustaría resolverla en una planta o pensás en más de un piso?'
    case 'hasSuiteBathroom':
      return '¿Querés que el dormitorio principal tenga baño en suite?'
    case 'hasPool':
      return '¿Te interesa sumar pileta o preferís concentrar la inversión en la vivienda principal?'
    case 'hasGarage':
      return '¿Querés incluir garage dentro de la propuesta?'
    case 'hasQuincho':
      return '¿Te gustaría sumar quincho como parte del proyecto?'
    case 'hasGrill':
      return '¿Y parrilla? Puede ser importante si querés reforzar el uso social del espacio.'
    case 'extraNotes':
      return 'Última parte: si hay alguna preferencia especial, restricción o detalle importante para tu familia, contámelo ahora y lo sumo al criterio de la propuesta.'
    default:
      return question.question
  }
}

export function getAnswerAcknowledgement(question, value) {
  const label = formatAnswerLabel(question, value)

  switch (question.key) {
    case 'projectName':
      return `Perfecto, voy a tomar "${label}" como nombre base del proyecto.`
    case 'propertyType':
      return `Buenísimo. Entonces voy a pensar la propuesta como ${formatPropertyType(value)}.`
    case 'familyMembers':
      return `Anotado: una vivienda para ${label.toLowerCase()}.`
    case 'bedrooms':
      return `Bien, ya tomo ${label.toLowerCase()} como punto de partida.`
    case 'bathrooms':
      return `Perfecto, eso me ayuda a ajustar mejor la comodidad general.`
    case 'squareMeters':
      return `Genial. Voy a orientar la propuesta alrededor de ${label} m² aproximados.`
    case 'budget':
      return `Entendido. Voy a usar ese presupuesto como marco principal para evitar proponerte algo fuera de escala.`
    case 'hasLand':
      return value === 'si'
        ? 'Eso simplifica bastante la etapa inicial porque ya podemos pensar la propuesta sobre una base más concreta.'
        : 'Perfecto. Entonces voy a pensar la propuesta sin asumir un lote ya definido.'
    case 'urgency':
      return `Bien, lo tomo como un proyecto ${formatUrgency(value)}.`
    case 'priority':
      return `Perfecto. Voy a orientar la propuesta para ${formatPriority(value)}.`
    case 'qualityLevel':
      return `Entendido, voy a trabajar con ${formatQualityLevel(value)} como referencia de calidad.`
    case 'location':
      return `Buen dato. La ubicación en ${label} me sirve para contextualizar mejor la propuesta.`
    case 'climate':
      return `Perfecto, el clima ${label.toLowerCase()} también condiciona decisiones importantes.`
    case 'terrainType':
      return `Anotado. Ese tipo de terreno puede influir bastante en la lógica del proyecto.`
    case 'material':
      return `Bien, tomo ${label.toLowerCase()} como preferencia inicial de material.`
    case 'floors':
      return `Perfecto, ya tengo claro cómo querés resolver la altura de la vivienda.`
    case 'hasSuiteBathroom':
      return value === 'true'
        ? 'Buenísimo, entonces sumo suite en el dormitorio principal.'
        : 'Perfecto, dejamos el dormitorio principal sin baño en suite.'
    case 'hasPool':
      return value === 'true'
        ? 'Entendido, voy a contemplar pileta dentro del concepto general.'
        : 'Perfecto, así concentramos el presupuesto en lo más importante.'
    case 'hasGarage':
      return value === 'true'
        ? 'Bien, entonces incluyo garage dentro del planteo.'
        : 'Perfecto, dejo el garage fuera de esta primera propuesta.'
    case 'hasQuincho':
      return value === 'true'
        ? 'Buenísimo, sumo quincho como parte del uso social del proyecto.'
        : 'Perfecto, por ahora dejamos el quincho afuera.'
    case 'hasGrill':
      return value === 'true'
        ? 'Entendido, incorporo parrilla dentro de los extras.'
        : 'Perfecto, no sumamos parrilla en esta versión inicial.'
    case 'extraNotes':
      return 'Excelente. Esa aclaración extra me ayuda a personalizar mejor la propuesta final.'
    default:
      return `Perfecto, tomo ${label} como parte del proyecto.`
  }
}
