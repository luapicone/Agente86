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

function buildProjectProposal(payload = {}) {
  const squareMeters = Number(payload.squareMeters || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const bathrooms = Number(payload.bathrooms || 0)
  const budget = Number(payload.budget || 0)
  const floors = Number(payload.floors || 1)
  const propertyType = payload.propertyType === 'departamento' ? 'Departamento' : 'Casa'

  const validationErrors = []

  if (!payload.projectName) validationErrors.push('Falta el nombre del proyecto.')
  if (!payload.propertyType) validationErrors.push('Falta el tipo de vivienda.')
  if (!payload.familyMembers) validationErrors.push('Falta la cantidad de integrantes.')
  if (!bedrooms) validationErrors.push('Falta la cantidad de dormitorios.')
  if (!bathrooms) validationErrors.push('Falta la cantidad de baños.')
  if (!squareMeters || squareMeters < 20) validationErrors.push('Los metros cuadrados deben ser mayores o iguales a 20.')
  if (!payload.priority) validationErrors.push('Falta la prioridad del proyecto.')
  if (!payload.qualityLevel) validationErrors.push('Falta el nivel de calidad.')
  if (!payload.location) validationErrors.push('Falta la ubicación del proyecto.')
  if (!payload.climate) validationErrors.push('Falta el clima.')
  if (!payload.terrainType) validationErrors.push('Falta el tipo de terreno.')
  if (!payload.material) validationErrors.push('Falta el material preferido.')

  if (validationErrors.length) {
    const error = new Error(validationErrors[0])
    error.details = validationErrors
    throw error
  }

  const estimatedCost =
    budget || Math.round(squareMeters * 850 + bedrooms * 3500 + bathrooms * 2200 + floors * 1800)

  const sustainabilityScore = PRIORITY_SCORES[payload.priority] || 80
  const carbonReduction = `${Math.max(18, Math.round(squareMeters * 0.35))}%`

  const houseExtras = []
  if (payload.propertyType === 'casa') {
    if (payload.hasSuiteBathroom) houseExtras.push('Dormitorio principal con baño en suite')
    if (payload.hasPool) houseExtras.push('Pileta')
    if (payload.hasGarage) houseExtras.push('Garage')
    if (payload.hasQuincho) houseExtras.push('Quincho')
    if (payload.hasGrill) houseExtras.push('Parrilla')
  }

  const qualityLevel = payload.qualityLevel || 'bajo'

  const projectData = {
    projectName: payload.projectName || 'Proyecto HabitatIA',
    summary: `${propertyType} modular de ${squareMeters} m² pensada para ${bedrooms} dormitorio(s), ${bathrooms} baño(s), ${payload.propertyType === 'casa' ? `${floors} piso(s)` : 'tipología en edificio'} y nivel de calidad ${qualityLevel}.`,
    modularType: squareMeters >= 90 ? 'Modelo familiar expandible' : 'Modelo compacto modular',
    recommendedMaterial:
      MATERIAL_LABELS[payload.material] || 'Madera reciclada tratada + panelería modular',
    estimatedCost,
    estimatedSavings: Math.round(estimatedCost * 0.12),
    sustainabilityScore,
    energyEfficiency:
      CLIMATE_STRATEGIES[payload.climate] || 'Aislamiento balanceado + ventilación natural cruzada',
    carbonReduction,
    propertyType,
    floors,
    qualityLevel,
    selectedFeatures: houseExtras,
    recommendedLayout:
      bedrooms >= 3
        ? 'Área social integrada + bloque privado + expansión futura lateral'
        : 'Núcleo central eficiente + espacios flexibles multiuso',
    recommendations: [
      'Priorizar orientación solar y ventilación natural para reducir consumo energético.',
      'Incorporar materiales de baja huella de carbono y aislación térmica adecuada.',
      'Planificar módulos constructivos para permitir ampliaciones futuras sin rehacer la obra base.',
    ],
  }

  const imagePromptData = buildImagePrompt(payload, projectData)
  const materialEstimation = estimateMaterials(payload)
  const conceptFloorPlan = generateConceptFloorPlan(payload)

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
