const baseEnvironments = {
  exterior: {
    title: 'Fachada principal',
    description: 'Vista exterior general del proyecto con enfoque arquitectónico y paisajístico.',
  },
  living: {
    title: 'Living comedor',
    description: 'Ambiente social principal con iluminación natural y diseño contemporáneo.',
  },
  kitchen: {
    title: 'Cocina',
    description: 'Cocina funcional integrada al concepto general de la vivienda.',
  },
  bedroom: {
    title: 'Dormitorio principal',
    description: 'Habitación principal diseñada para confort y privacidad.',
  },
  bathroom: {
    title: 'Baño',
    description: 'Baño con terminaciones modernas y enfoque funcional.',
  },
  backyard: {
    title: 'Patio / jardín',
    description: 'Espacio exterior complementario de uso familiar y recreativo.',
  },
  pool: {
    title: 'Pileta',
    description: 'Área de piscina integrada al diseño general de la vivienda.',
  },
  garage: {
    title: 'Garage',
    description: 'Espacio cubierto o semicubierto para guardado de vehículos.',
  },
  quincho: {
    title: 'Quincho',
    description: 'Área social exterior preparada para reuniones y uso recreativo.',
  },
  grill: {
    title: 'Parrilla',
    description: 'Sector de parrilla incorporado al proyecto como espacio de encuentro.',
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

export function buildEnvironmentPrompt(environment, project) {
  return `${project.imagePrompt}. Specific view: ${environment.title}. ${environment.description}. Photorealistic interior and architectural render, highly detailed, realistic materials, premium composition.`
}
