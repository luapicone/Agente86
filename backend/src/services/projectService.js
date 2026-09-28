const { buildImagePrompt } = require('./imagePromptService')
const { estimateMaterials } = require('./materialEstimationService')
const { generateConceptFloorPlan } = require('./floorPlanService')

const MATERIAL_LABELS = {
  'madera-reciclada': 'Madera reciclada tratada + panelería modular',
  'hormigon-verde': 'Hormigón verde + paneles aislantes',
  'acero-reciclado': 'Acero reciclado + cerramientos livianos',
}

const PRIORITY_SCORES = {
  sostenibilidad: 92,
  eficiencia: 84,
  costo: 76,
}

const CLIMATE_STRATEGIES = {
  templado: 'Aislamiento balanceado + ventilación natural cruzada',
  calido: 'Alta ventilación cruzada + protección solar pasiva',
  frio: 'Aislamiento térmico reforzado + aperturas controladas',
  humedo: 'Materiales resistentes a humedad + circulación de aire constante',
}

function parseBooleanFlag(value) {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 'si' || value === 'sí') return true
  if (value === 'false' || value === 'no') return false
  return Boolean(value)
}

function buildProjectProposal(payload = {}) {
  const squareMeters = Number(payload.squareMeters || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const bathrooms = Number(payload.bathrooms || (bedrooms >= 3 ? 2 : 1))
  const budget = Number(payload.budget || 0)
  const floors = Number(payload.floors || 1)
  const propertyType = payload.propertyType === 'departamento' ? 'Departamento' : 'Casa'
  const hasSuiteBathroom = parseBooleanFlag(payload.hasSuiteBathroom)
  const hasPool = parseBooleanFlag(payload.hasPool)
  const hasGarage = parseBooleanFlag(payload.hasGarage)
  const hasQuincho = parseBooleanFlag(payload.hasQuincho)
  const hasGrill = parseBooleanFlag(payload.hasGrill)

  const validationErrors = []

  if (!payload.projectName) validationErrors.push('Falta el nombre del proyecto.')
  if (!payload.propertyType) validationErrors.push('Falta el tipo de vivienda.')
  if (!payload.familyMembers) validationErrors.push('Falta la cantidad de integrantes.')
  if (!bedrooms) validationErrors.push('Falta la cantidad de dormitorios.')
  if (!squareMeters || squareMeters < 20) validationErrors.push('Los metros cuadrados deben ser mayores o iguales a 20.')
  if (!payload.location) validationErrors.push('Falta la ubicación del proyecto.')

  if (validationErrors.length) {
    const error = new Error(validationErrors[0])
    error.details = validationErrors
    throw error
  }

  const estimatedCost =
    budget || Math.round(squareMeters * 850 + bedrooms * 3500 + bathrooms * 2200 + floors * 1800)

  const priority = payload.priority || 'costo'
  const qualityLevel = payload.qualityLevel || 'medio'
  const climate = payload.climate || 'templado'
  const terrainType = payload.terrainType || (payload.hasLand === 'si' ? 'urbano' : 'suburbano')
  const material = payload.material || 'hormigon-verde'
  const materialPreference = payload.materialPreferences || null
  const sustainabilityScore = PRIORITY_SCORES[priority] || 80
  const carbonReduction = `${Math.max(18, Math.round(squareMeters * 0.35))}%`

  const houseExtras = []
  if (payload.propertyType === 'casa') {
    if (hasSuiteBathroom) houseExtras.push(payload.suiteDetails ? `Suite: ${payload.suiteDetails}` : 'Dormitorio principal con baño en suite')
    if (hasPool) houseExtras.push(payload.poolDetails ? `Pileta: ${payload.poolDetails}` : 'Pileta')
    if (hasGarage) houseExtras.push(payload.garageCapacity ? `Garage para ${payload.garageCapacity} vehículo(s)` : 'Garage')
    if (hasQuincho) houseExtras.push(payload.quinchoDetails ? `Quincho: ${payload.quinchoDetails}` : 'Quincho')
    if (hasGrill) houseExtras.push('Parrilla')
  }

  const normalizedPayload = {
    ...payload,
    priority,
    qualityLevel,
    climate,
    terrainType,
    material,
    bathrooms,
  }

  const projectData = {
    projectName: payload.projectName || 'Proyecto HabitatIA',
    summary: `${propertyType} modular de ${squareMeters} m² pensada para ${bedrooms} dormitorio(s), ${bathrooms} baño(s), ${payload.propertyType === 'casa' ? `${floors} piso(s)` : 'tipología en edificio'} y nivel de calidad ${qualityLevel}.`,
    modularType: squareMeters >= 90 ? 'Modelo familiar expandible' : 'Modelo compacto modular',
    recommendedMaterial:
      materialPreference || MATERIAL_LABELS[material] || 'Madera reciclada tratada + panelería modular',
    estimatedCost,
    estimatedSavings: Math.round(estimatedCost * 0.12),
    sustainabilityScore,
    energyEfficiency:
      CLIMATE_STRATEGIES[climate] || 'Aislamiento balanceado + ventilación natural cruzada',
    carbonReduction,
    propertyType,
    floors,
    qualityLevel,
    selectedFeatures: houseExtras,
    recommendedLayout: [
      bedrooms >= 3
        ? 'Área social integrada + bloque privado + expansión futura lateral.'
        : 'Núcleo central eficiente + espacios flexibles multiuso.',
      payload.bedroomProgram ? `Dormitorios: ${payload.bedroomProgram}.` : null,
      payload.spaceNeeds ? `Ambientes adicionales: ${payload.spaceNeeds}.` : null,
      payload.futureNeeds ? `Previsión futura: ${payload.futureNeeds}.` : null,
    ].filter(Boolean).join(' '),
    recommendations: [
      'Priorizar orientación solar y ventilación natural para reducir consumo energético.',
      'Incorporar materiales de baja huella de carbono y aislación térmica adecuada.',
      'Planificar módulos constructivos para permitir ampliaciones futuras sin rehacer la obra base.',
    ],
  }

  const imagePromptData = buildImagePrompt(normalizedPayload, projectData)
  const materialEstimation = estimateMaterials(normalizedPayload)
  const conceptFloorPlan = generateConceptFloorPlan(normalizedPayload)

  return {
    ...projectData,
    imagePrompt: imagePromptData.prompt,
    negativePrompt: imagePromptData.negativePrompt,
    imageStyle: imagePromptData.styleLabel,
    materialEstimate: materialEstimation,
    conceptFloorPlan,
    renderProviders: ['deepai', 'huggingface', 'pollinations', 'replicate'],
  }
}

module.exports = {
  buildProjectProposal,
}
