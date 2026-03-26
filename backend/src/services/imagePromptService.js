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

const QUALITY_DESCRIPTIONS = {
  bajo: 'low-cost construction, modest finishes, simple geometry, practical spaces, realistic affordable materials, slightly precarious but dignified housing',
  medio: 'balanced construction quality, functional finishes, solid materials, modest but well resolved architecture',
  alto: 'high construction quality, refined finishes, better materials, more complete architectural detailing',
}

function buildExtraHouseFeatures(payload = {}) {
  if (payload.propertyType !== 'casa') {
    return 'apartment layout optimized for vertical building living'
  }

  const extras = [
    `${Number(payload.floors || 1)} floor house`,
    payload.hasSuiteBathroom ? 'master bedroom with ensuite bathroom' : null,
    payload.hasPool ? 'swimming pool integrated with outdoor area' : null,
    payload.hasGarage ? 'covered garage for vehicles' : null,
    payload.hasQuincho ? 'quincho / covered social barbecue area' : null,
    payload.hasGrill ? 'dedicated outdoor grill area' : null,
  ].filter(Boolean)

  return extras.join(', ')
}

function buildImagePrompt(payload = {}, projectData = {}) {
  const squareMeters = Number(payload.squareMeters || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const bathrooms = Number(payload.bathrooms || 0)
  const material = MATERIAL_DESCRIPTIONS[payload.material] || 'sustainable modular construction'
  const priority = PRIORITY_DESCRIPTIONS[payload.priority] || 'focused on sustainable living'
  const climate = CLIMATE_DESCRIPTIONS[payload.climate] || 'temperate climate with natural lighting'
  const propertyType = payload.propertyType === 'departamento' ? 'apartment' : 'house'
  const extras = buildExtraHouseFeatures(payload)
  const quality = QUALITY_DESCRIPTIONS[payload.qualityLevel] || QUALITY_DESCRIPTIONS.bajo

  const prompt = [
    `Photorealistic architectural render of a sustainable modular ${propertyType}`,
    `${squareMeters} square meters`,
    `${bedrooms} bedrooms`,
    `${bathrooms} bathrooms`,
    `${payload.terrainType || 'urban'} site`,
    climate,
    material,
    priority,
    quality,
    extras,
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
