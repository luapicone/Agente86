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
