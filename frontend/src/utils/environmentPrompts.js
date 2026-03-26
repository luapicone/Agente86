const baseEnvironments = {
  exterior: {
    title: 'Fachada principal',
    description: 'Vista exterior general del proyecto con enfoque arquitectónico y paisajístico.',
    views: ['vista frontal', 'vista en perspectiva', 'vista general del frente'],
  },
  living: {
    title: 'Living comedor',
    description: 'Ambiente social principal con iluminación natural y diseño contemporáneo.',
    views: ['vista amplia del ambiente', 'vista desde acceso principal'],
  },
  kitchen: {
    title: 'Cocina',
    description: 'Cocina funcional integrada al concepto general de la vivienda.',
    views: ['vista principal de la cocina', 'vista lateral de isla o mesada'],
  },
  bedroom: {
    title: 'Dormitorio principal',
    description: 'Habitación principal diseñada para confort y privacidad.',
    views: ['vista principal del dormitorio', 'vista complementaria hacia aberturas o suite'],
  },
  bathroom: {
    title: 'Baño',
    description: 'Baño con terminaciones modernas y enfoque funcional.',
    views: ['vista principal del baño', 'detalle del sector ducha o tocador'],
  },
  backyard: {
    title: 'Patio / jardín',
    description: 'Espacio exterior complementario de uso familiar y recreativo.',
    views: ['vista general del jardín', 'vista integrada con galería o expansión'],
  },
  pool: {
    title: 'Pileta',
    description: 'Área de piscina integrada al diseño general de la vivienda.',
    views: ['vista principal de la pileta', 'vista de la pileta con entorno'],
  },
  garage: {
    title: 'Garage',
    description: 'Espacio cubierto o semicubierto para guardado de vehículos.',
    views: ['vista del acceso vehicular', 'vista interna del garage'],
  },
  quincho: {
    title: 'Quincho',
    description: 'Área social exterior preparada para reuniones y uso recreativo.',
    views: ['vista amplia del quincho', 'vista del quincho con mobiliario'],
  },
  grill: {
    title: 'Parrilla',
    description: 'Sector de parrilla incorporado al proyecto como espacio de encuentro.',
    views: ['vista general de la parrilla', 'detalle de la zona de cocción y apoyo'],
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
  return (environment.views || ['vista principal']).map((view, index) => ({
    id: `${environment.id}-view-${index}`,
    key: environment.key,
    title: `${environment.title} · ${index + 1}`,
    description: `${environment.description} ${view}.`,
    view,
  }))
}

export function buildEnvironmentPrompt(environmentView, project) {
  return `${project.imagePrompt}. Specific environment: ${environmentView.title}. ${environmentView.description}. Camera framing: ${environmentView.view}. Photorealistic interior and architectural render, highly detailed, realistic materials, premium composition, isolated scene, single environment focus.`
}
