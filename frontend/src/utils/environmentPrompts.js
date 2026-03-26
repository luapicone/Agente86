const QUALITY_VISUAL_GUIDANCE = {
  bajo: 'humble affordable house, modest finishes, simpler construction details, realistic low-income housing, dignified but slightly precarious appearance',
  medio: 'moderate construction quality, simple but solid finishes, affordable middle-quality house',
  alto: 'higher quality finishes, more refined construction, better materials and detailing',
}

function buildProjectDesignBrief(formData, project) {
  const propertyType = formData.propertyType === 'departamento' ? 'apartment' : 'house'
  const floorsText = formData.propertyType === 'casa' ? `${formData.floors} floors` : 'single apartment unit'
  const extras = []

  if (formData.propertyType === 'casa') {
    if (formData.hasSuiteBathroom) extras.push('master suite with ensuite bathroom')
    if (formData.hasPool) extras.push('outdoor swimming pool')
    if (formData.hasGarage) extras.push('garage integrated into the architecture')
    if (formData.hasQuincho) extras.push('covered quincho social area')
    if (formData.hasGrill) extras.push('built-in barbecue grill area')
  }

  return [
    `Consistent photorealistic ${propertyType} project`,
    `${project.projectName}`,
    `${project.propertyType}`,
    `${floorsText}`,
    `${formData.squareMeters} square meters total built area`,
    `${formData.bedrooms} bedrooms`,
    `${formData.bathrooms} bathrooms`,
    `material palette: ${project.recommendedMaterial}`,
    `architectural language: contemporary sustainable architecture`,
    QUALITY_VISUAL_GUIDANCE[formData.qualityLevel] || QUALITY_VISUAL_GUIDANCE.bajo,
    `same exact house model, same colors, same facade materials, same windows, same doors, same interior finishes, same design language across all renders`,
    `maintain visual continuity and consistency between all scenes`,
    extras.join(', '),
  ]
    .filter(Boolean)
    .join(', ')
}

export function buildMasterHousePrompt(formData, project) {
  const designBrief = buildProjectDesignBrief(formData, project)

  return [
    designBrief,
    'master reference render of the full house',
    'generate the full architectural concept of the house as a single coherent project',
    'this image defines the colors, materials, architectural language, proportions and overall identity for all future room renders',
    'ultra realistic architectural photography',
    'photorealistic render, natural light, realistic materials, realistic shadows, realistic proportions',
    'not illustration, not sketch, not cartoon, not hand-drawn',
  ].join(', ')
}

const baseEnvironments = {
  exterior: {
    title: 'Fachada principal',
    description: 'Main exterior facade of the same house project, clearly showing the full house volume and architectural identity.',
    views: [
      'front elevation view showing the complete facade of the same house',
      'angled exterior perspective from street level of the same house',
      'wide exterior shot showing facade, access and landscaping of the same house',
    ],
  },
  living: {
    title: 'Living comedor',
    description: 'Main living and dining room interior of the same house, open social space with furniture, lighting and circulation.',
    views: [
      'wide interior shot of the living room and dining area of the same house',
      'interior perspective from seating area toward dining area of the same house',
    ],
  },
  kitchen: {
    title: 'Cocina',
    description: 'Kitchen interior of the same house only, showing counters, cabinetry, appliances and work surfaces.',
    views: [
      'main kitchen perspective of the same house showing cabinets and countertop',
      'secondary angle of the same house kitchen showing island, sink or cooking area',
    ],
  },
  bedroom: {
    title: 'Dormitorio principal',
    description: 'Master bedroom interior of the same house only, showing bed, side tables, textures and calm residential atmosphere.',
    views: [
      'main perspective of the master bedroom of the same house centered on the bed',
      'secondary perspective of the same house bedroom showing windows, circulation and furniture',
    ],
  },
  bathroom: {
    title: 'Baño',
    description: 'Bathroom interior of the same house only, showing vanity, mirror, shower or bathtub and realistic finishes.',
    views: [
      'main bathroom shot of the same house showing vanity and mirror',
      'secondary bathroom shot of the same house showing shower, bathtub or enclosure',
    ],
  },
  backyard: {
    title: 'Patio / jardín',
    description: 'Backyard or garden exterior space of the same house integrated to the architecture.',
    views: [
      'wide backyard shot of the same house showing lawn, vegetation and relation with the house',
      'outdoor perspective of the same house showing patio expansion and recreational area',
    ],
  },
  pool: {
    title: 'Pileta',
    description: 'Swimming pool area of the same house only, clearly visible and integrated with the exterior design.',
    views: [
      'main pool perspective of the same house showing water, deck and surrounding architecture',
      'secondary angle from the pool area toward the same house',
    ],
  },
  garage: {
    title: 'Garage',
    description: 'Garage or car access area of the same house only, showing vehicle space and architectural integration.',
    views: [
      'garage exterior or semi-covered access shot of the same house',
      'garage interior angle of the same house showing parking and circulation space',
    ],
  },
  quincho: {
    title: 'Quincho',
    description: 'Quincho or covered social area of the same house only, designed for gatherings and outdoor living.',
    views: [
      'main quincho perspective of the same house with table, seating and roofed area',
      'secondary angle of the same house quincho showing relationship with backyard or grill area',
    ],
  },
  grill: {
    title: 'Parrilla',
    description: 'Built-in barbecue grill area of the same house only, showing fire zone, counter and social use context.',
    views: [
      'main barbecue grill shot of the same house centered on the grill and support counter',
      'secondary angle of the same house grill integrated into outdoor social area',
    ],
  },
}

export function getEnvironmentDefinitions(formData) {
  const environments = ['exterior', 'living', 'kitchen', 'bathroom']

  if (formData.propertyType === 'casa') {
    environments.push('bedroom', 'backyard')

    if (formData.hasPool) environments.push('pool')
    if (formData.hasGarage) environments.push('garage')
    if (formData.hasQuincho) environments.push('quincho')
    if (formData.hasGrill) environments.push('grill')
  } else {
    environments.push('bedroom')
  }

  return environments.map((key, index) => ({
    id: `${key}-${index}`,
    key,
    ...baseEnvironments[key],
  }))
}

export function expandEnvironmentViews(environment) {
  return (environment.views || ['main view']).map((view, index) => ({
    id: `${environment.id}-view-${index}`,
    key: environment.key,
    title: `${environment.title} · ${index + 1}`,
    description: environment.description,
    view,
  }))
}

export function buildEnvironmentPrompt(environmentView, project, formData, masterPrompt) {
  const designBrief = buildProjectDesignBrief(formData, project)

  return [
    designBrief,
    `Master architectural concept reference: ${masterPrompt}`,
    `Specific environment to render: ${environmentView.title}`,
    environmentView.description,
    `Camera instruction: ${environmentView.view}`,
    'this environment must belong to the exact same house defined in the master reference render',
    'preserve the same materials, same colors, same level of quality, same architecture and same visual identity',
    'ultra realistic architectural photography',
    'photorealistic interior design render',
    'physically accurate materials',
    'real lighting, real shadows, realistic proportions',
    'highly detailed, premium realism, no sketch style, no illustration style, no watercolor, no cartoon, no hand drawn look',
    'show only the requested environment and make sure the rendered scene matches exactly the environment title',
  ].join(', ')
}
