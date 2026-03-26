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
    `${formData.squareMeters} square meters`,
    `${formData.bedrooms} bedrooms`,
    `${formData.bathrooms} bathrooms`,
    `material palette: ${project.recommendedMaterial}`,
    `architectural language: contemporary sustainable architecture`,
    `same house model, same structure, same materials, same lighting conditions, same design language across all renders`,
    extras.join(', '),
  ]
    .filter(Boolean)
    .join(', ')
}

const baseEnvironments = {
  exterior: {
    title: 'Fachada principal',
    description: 'Main exterior facade of the project, clearly showing the full house volume and architectural identity.',
    views: [
      'front elevation view showing the complete facade',
      'angled exterior perspective from street level',
      'wide exterior shot showing facade, access and landscaping',
    ],
  },
  living: {
    title: 'Living comedor',
    description: 'Main living and dining room interior, open social space with furniture, lighting and circulation.',
    views: [
      'wide interior shot of the living room and dining area',
      'interior perspective from seating area toward dining area',
    ],
  },
  kitchen: {
    title: 'Cocina',
    description: 'Kitchen interior only, showing counters, cabinetry, appliances and work surfaces.',
    views: [
      'main kitchen perspective showing cabinets and countertop',
      'secondary angle showing island, sink or cooking area',
    ],
  },
  bedroom: {
    title: 'Dormitorio principal',
    description: 'Master bedroom interior only, showing bed, side tables, textures and calm residential atmosphere.',
    views: [
      'main perspective of the master bedroom centered on the bed',
      'secondary perspective showing windows, circulation and furniture',
    ],
  },
  bathroom: {
    title: 'Baño',
    description: 'Bathroom interior only, showing vanity, mirror, shower or bathtub and realistic finishes.',
    views: [
      'main bathroom shot showing vanity and mirror',
      'secondary bathroom shot showing shower, bathtub or enclosure',
    ],
  },
  backyard: {
    title: 'Patio / jardín',
    description: 'Backyard or garden exterior space integrated to the house architecture.',
    views: [
      'wide backyard shot showing lawn, vegetation and relation with the house',
      'outdoor perspective showing patio expansion and recreational area',
    ],
  },
  pool: {
    title: 'Pileta',
    description: 'Swimming pool area only, clearly visible and integrated with the exterior design.',
    views: [
      'main pool perspective showing water, deck and surrounding architecture',
      'secondary angle from the pool area toward the house',
    ],
  },
  garage: {
    title: 'Garage',
    description: 'Garage or car access area only, showing vehicle space and architectural integration.',
    views: [
      'garage exterior or semi-covered access shot',
      'garage interior angle showing parking and circulation space',
    ],
  },
  quincho: {
    title: 'Quincho',
    description: 'Quincho or covered social area only, designed for gatherings and outdoor living.',
    views: [
      'main quincho perspective with table, seating and roofed area',
      'secondary angle showing relationship with backyard or grill area',
    ],
  },
  grill: {
    title: 'Parrilla',
    description: 'Built-in barbecue grill area only, showing fire zone, counter and social use context.',
    views: [
      'main barbecue grill shot centered on the grill and support counter',
      'secondary angle showing grill integrated into outdoor social area',
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

export function buildEnvironmentPrompt(environmentView, project, formData) {
  const designBrief = buildProjectDesignBrief(formData, project)

  return [
    designBrief,
    `Specific environment to render: ${environmentView.title}`,
    environmentView.description,
    `Camera instruction: ${environmentView.view}`,
    'ultra realistic architectural photography',
    'photorealistic interior design render',
    'physically accurate materials',
    'real lighting, real shadows, realistic proportions',
    'highly detailed, premium realism, no sketch style, no illustration style, no watercolor, no cartoon, no hand drawn look',
    'show only the requested environment and make sure the rendered scene matches exactly the environment title',
  ].join(', ')
}
