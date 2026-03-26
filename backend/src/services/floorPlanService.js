function buildRoom(name, area, width, height, x, y) {
  return { name, area, width, height, x, y }
}

function generateConceptFloorPlan(payload = {}) {
  const propertyType = payload.propertyType === 'departamento' ? 'departamento' : 'casa'
  const squareMeters = Number(payload.squareMeters || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const bathrooms = Number(payload.bathrooms || 0)
  const floors = propertyType === 'casa' ? Number(payload.floors || 1) : 1

  const width = propertyType === 'departamento' ? 12 : 14
  const height = Math.max(9, Math.round(squareMeters / width))

  const rooms = []
  let cursorY = 0

  rooms.push(buildRoom('Living / Comedor', Math.round(squareMeters * 0.28), width, 3, 0, cursorY))
  cursorY += 3
  rooms.push(buildRoom('Cocina', Math.round(squareMeters * 0.14), Math.round(width * 0.45), 2, 0, cursorY))
  rooms.push(buildRoom('Baño principal', Math.round(squareMeters * 0.06), Math.round(width * 0.25), 2, Math.round(width * 0.55), cursorY))
  cursorY += 2

  for (let index = 0; index < bedrooms; index += 1) {
    rooms.push(
      buildRoom(
        index === 0 ? 'Dormitorio principal' : `Dormitorio ${index + 1}`,
        Math.round(squareMeters * (index === 0 ? 0.16 : 0.12)),
        Math.round(width * 0.45),
        3,
        index % 2 === 0 ? 0 : Math.round(width * 0.55),
        cursorY,
      ),
    )

    if (index % 2 === 1 || index === bedrooms - 1) {
      cursorY += 3
    }
  }

  if (propertyType === 'casa' && payload.hasGarage) {
    rooms.push(buildRoom('Garage', Math.round(squareMeters * 0.12), Math.round(width * 0.4), 2, 0, cursorY))
  }

  if (propertyType === 'casa' && payload.hasQuincho) {
    rooms.push(buildRoom('Quincho', Math.round(squareMeters * 0.1), Math.round(width * 0.4), 2, Math.round(width * 0.5), cursorY))
  }

  const notes = [
    'Plano conceptual preliminar para distribución orientativa.',
    'No reemplaza documentación técnica profesional ni plano municipal.',
  ]

  return {
    type: propertyType,
    floors,
    canvas: {
      width,
      height: Math.max(height, cursorY + 3),
    },
    rooms,
    notes,
  }
}

module.exports = {
  generateConceptFloorPlan,
}
