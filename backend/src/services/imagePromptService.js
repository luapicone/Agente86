const MATERIAL_DESCRIPTIONS = {
  'madera-reciclada': 'recycled wood modular structure with warm natural textures',
  'hormigon-verde': 'green concrete modular construction with sustainable insulated panels',
  'acero-reciclado': 'recycled steel modular structure with lightweight modern finishes',
}

const PRIORITY_DESCRIPTIONS = {
  sostenibilidad: 'focused on sustainability, passive climate strategies and eco friendly design',
  eficiencia: 'focused on energy efficiency, thermal envelope optimization and smart solar control',
  costo: 'focused on cost optimization, simple modular geometry and efficient construction resources',
}

const CLIMATE_DESCRIPTIONS = {
  templado: 'temperate climate with balanced natural light and comfortable outdoor integration',
  calido: 'warm climate with solar protection, cross ventilation and shaded exterior areas',
  frio: 'cold climate with compact envelope, insulation and protected openings',
  humedo: 'humid climate with elevated ventilation, resistant materials and breathable facades',
}

function buildImagePrompt(payload = {}, projectData = {}) {
  const squareMeters = Number(payload.squareMeters || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const bathrooms = Number(payload.bathrooms || 0)
  const material = MATERIAL_DESCRIPTIONS[payload.material] || 'sustainable modular construction'
  const priority = PRIORITY_DESCRIPTIONS[payload.priority] || 'focused on sustainable living'
  const climate = CLIMATE_DESCRIPTIONS[payload.climate] || 'temperate climate with natural lighting'

  const prompt = [
    'Photorealistic architectural render of a sustainable modular house',
    `${squareMeters} square meters`,
    `${bedrooms} bedrooms`,
    `${bathrooms} bathrooms`,
    `${payload.terrainType || 'urban'} site`,
    climate,
    material,
    priority,
    'contemporary architecture, realistic exterior visualization, high detail, natural lighting, clean composition, landscaping, architectural presentation render',
  ].join(', ')

  const negativePrompt =
    'low quality, blurry, distorted geometry, extra windows, unrealistic proportions, text, watermark, duplicated elements, deformed facade, poor lighting'

  return {
    prompt,
    negativePrompt,
    styleLabel: projectData.modularType || 'Arquitectura modular sostenible',
  }
}

module.exports = {
  buildImagePrompt,
}
