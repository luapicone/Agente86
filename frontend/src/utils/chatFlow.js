export const chatQuestions = [
  {
    key: 'projectName',
    label: 'Nombre del proyecto',
    question: 'Hola, soy HabitatIA. Para empezar, ¿cómo te gustaría llamar a tu proyecto?',
    type: 'text',
    placeholder: 'Ej: Casa familiar zona sur',
  },
  {
    key: 'familyMembers',
    label: 'Integrantes de la familia',
    question: '¿Cuántas personas van a vivir en la casa?',
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
    key: 'bedroomProgram',
    label: 'Uso de los dormitorios',
    question: '¿Quién usaría cada dormitorio y para cuántas personas sería?',
    type: 'text',
    placeholder: 'Ej: principal para 2 y dos dormitorios para los chicos',
  },
  {
    key: 'bathrooms',
    label: 'Baños',
    question: '¿Cuántos baños querés incluir?',
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
    question: '¿Qué superficie aproximada te gustaría que tenga la casa?',
    type: 'number',
    min: 20,
    error: 'La superficie debe ser de al menos 20 m².',
    placeholder: 'Ej: 90',
  },
  {
    key: 'budget',
    label: 'Presupuesto',
    question: '¿Cuál es el presupuesto máximo estimado para construir, en dólares?',
    type: 'number',
    min: 1,
    error: 'Ingresá un presupuesto mayor a cero.',
    placeholder: 'Ej: 80000',
  },
  {
    key: 'location',
    label: 'Ubicación',
    question: '¿En qué ciudad o zona pensás construir?',
    type: 'text',
    placeholder: 'Ej: Córdoba, Argentina',
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
    key: 'terrainType',
    label: 'Tipo de terreno',
    question: '¿Cómo describirías el terreno?',
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
    key: 'priority',
    label: 'Prioridad',
    question: '¿Qué querés priorizar en la propuesta?',
    type: 'select',
    options: [
      { value: 'costo', label: 'Menor costo' },
      { value: 'eficiencia', label: 'Eficiencia y mantenimiento' },
      { value: 'sostenibilidad', label: 'Construcción sostenible' },
    ],
  },
  {
    key: 'qualityLevel',
    label: 'Nivel de terminación',
    question: '¿Qué nivel de terminación buscás?',
    type: 'select',
    options: [
      { value: 'bajo', label: 'Económico' },
      { value: 'medio', label: 'Intermedio' },
      { value: 'alto', label: 'Alto' },
    ],
  },
  {
    key: 'climate',
    label: 'Clima',
    question: '¿Cómo es el clima predominante de la zona?',
    type: 'select',
    options: [
      { value: 'templado', label: 'Templado' },
      { value: 'calido', label: 'Cálido' },
      { value: 'frio', label: 'Frío' },
      { value: 'humedo', label: 'Húmedo' },
    ],
  },
  {
    key: 'material',
    label: 'Sistema constructivo',
    question: '¿Qué sistema constructivo preferís como punto de partida?',
    type: 'select',
    options: [
      { value: 'madera-reciclada', label: 'Madera y panelería' },
      { value: 'hormigon-verde', label: 'Hormigón y mampostería' },
      { value: 'acero-reciclado', label: 'Steel frame' },
    ],
  },
  {
    key: 'floors',
    label: 'Plantas',
    question: '¿Cuántas plantas querés que tenga la casa?',
    type: 'select',
    options: [
      { value: '1', label: '1 planta' },
      { value: '2', label: '2 plantas' },
      { value: '3', label: '3 plantas' },
    ],
  },
  {
    key: 'hasSuiteBathroom',
    label: 'Suite principal',
    question: '¿Querés que el dormitorio principal tenga baño en suite?',
    type: 'select',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasPool',
    label: 'Pileta',
    question: '¿Querés incorporar una pileta?',
    type: 'select',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasGarage',
    label: 'Garage',
    question: '¿Querés incluir garage o cochera?',
    type: 'select',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasQuincho',
    label: 'Quincho',
    question: '¿Querés sumar un quincho?',
    type: 'select',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'hasGrill',
    label: 'Parrilla',
    question: '¿Querés que el quincho tenga parrilla?',
    type: 'select',
    showIf: (answers) => answers.hasQuincho === 'true',
    options: [
      { value: 'true', label: 'Sí' },
      { value: 'false', label: 'No' },
    ],
  },
  {
    key: 'spaceNeeds',
    label: 'Otros ambientes',
    question: '¿Necesitás algún ambiente especial además de los anteriores?',
    type: 'text',
    placeholder: 'Ej: escritorio, lavadero y despensa',
  },
  {
    key: 'extraNotes',
    label: 'Aclaraciones finales',
    question: 'Para terminar, ¿hay alguna preferencia o restricción que debamos considerar?',
    type: 'text',
    placeholder: 'Ej: cocina integrada y posibilidad de ampliar a futuro',
  },
]

export function getVisibleQuestions(answers) {
  return chatQuestions.filter((question) => !question.showIf || question.showIf(answers))
}

export function formatAnswerLabel(question, value) {
  if (question.type === 'select') {
    return question.options.find((option) => option.value === value)?.label || value
  }

  if (question.key === 'squareMeters') return `${value} m²`
  if (question.key === 'budget') return `USD ${Number(value).toLocaleString('es-AR')}`
  return value
}
