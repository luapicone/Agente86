function round(value) {
  return Math.round(value * 100) / 100
}

function normalizeDimension(value, min = 2.2) {
  return Math.max(min, round(value))
}

function createRoom(name, x, y, width, height) {
  return {
    name,
    x: round(x),
    y: round(y),
    width: round(width),
    height: round(height),
    area: round(width * height),
  }
}

function pushDoor(doors, x, y, width, orientation = 'horizontal') {
  doors.push({ x: round(x), y: round(y), width: round(width), orientation })
}

function generateConceptFloorPlan(payload = {}) {
  const propertyType = payload.propertyType === 'departamento' ? 'departamento' : 'casa'
  const squareMeters = Number(payload.squareMeters || 0)
  const bedrooms = Math.max(1, Number(payload.bedrooms || 1))
  const bathrooms = Math.max(1, Number(payload.bathrooms || 1))
  const floors = propertyType === 'casa' ? Math.max(1, Number(payload.floors || 1)) : 1
  const hasGarage = propertyType === 'casa' && Boolean(payload.hasGarage)
  const hasQuincho = propertyType === 'casa' && Boolean(payload.hasQuincho)

  const canvasWidth = propertyType === 'departamento' ? 16 : 18
  const livingHeight = normalizeDimension(squareMeters >= 90 ? 4.4 : 3.8, 3.4)
  const serviceHeight = 3.2
  const bedroomRows = Math.max(1, Math.ceil(bedrooms / 2))
  const bedroomHeight = 3.4
  const extraRowHeight = hasGarage || hasQuincho ? 3.2 : 0
  const canvasHeight = round(livingHeight + serviceHeight + bedroomRows * bedroomHeight + extraRowHeight + 1)

  const wallThickness = 0.18
  const hallwayWidth = propertyType === 'departamento' ? 1.4 : 1.6
  const sideBlockWidth = normalizeDimension((canvasWidth - hallwayWidth) / 2, 5.8)
  const rightBlockX = round(sideBlockWidth + hallwayWidth)

  const rooms = []
  const doors = []
  const windows = []
  const labels = []

  rooms.push(createRoom('Living / Comedor', 0, 0, canvasWidth, livingHeight))
  pushDoor(doors, canvasWidth / 2 - 0.6, livingHeight - wallThickness / 2, 1.2)

  const kitchenWidth = sideBlockWidth
  const bathWidth = normalizeDimension(sideBlockWidth * 0.7, 3.1)
  const bathX = round(canvasWidth - bathWidth)
  const kitchenY = livingHeight
  const bathY = livingHeight

  rooms.push(createRoom('Cocina', 0, kitchenY, kitchenWidth, serviceHeight))
  rooms.push(createRoom('Baño principal', bathX, bathY, bathWidth, serviceHeight))

  pushDoor(doors, kitchenWidth - wallThickness / 2, kitchenY + serviceHeight / 2 - 0.45, 0.9, 'vertical')
  pushDoor(doors, bathX - wallThickness / 2, bathY + serviceHeight / 2 - 0.45, 0.9, 'vertical')

  const hallway = {
    x: sideBlockWidth,
    y: livingHeight,
    width: hallwayWidth,
    height: round(serviceHeight + bedroomRows * bedroomHeight + extraRowHeight),
  }

  let bedroomIndex = 0
  let currentY = livingHeight + serviceHeight

  for (let row = 0; row < bedroomRows; row += 1) {
    const leftName = bedroomIndex === 0 ? 'Dormitorio principal' : `Dormitorio ${bedroomIndex + 1}`
    rooms.push(createRoom(leftName, 0, currentY, sideBlockWidth, bedroomHeight))
    pushDoor(doors, sideBlockWidth - wallThickness / 2, currentY + bedroomHeight / 2 - 0.45, 0.9, 'vertical')
    bedroomIndex += 1

    if (bedroomIndex < bedrooms) {
      rooms.push(createRoom(`Dormitorio ${bedroomIndex + 1}`, rightBlockX, currentY, sideBlockWidth, bedroomHeight))
      pushDoor(doors, rightBlockX - wallThickness / 2, currentY + bedroomHeight / 2 - 0.45, 0.9, 'vertical')
      bedroomIndex += 1
    }

    currentY += bedroomHeight
  }

  if (bathrooms > 1) {
    const secondBathWidth = normalizeDimension(sideBlockWidth * 0.58, 2.6)
    const secondBathHeight = 2.4
    const secondBathX = rightBlockX
    const secondBathY = livingHeight + serviceHeight + 0.5
    rooms.push(createRoom('Baño secundario', secondBathX, secondBathY, secondBathWidth, secondBathHeight))
    pushDoor(doors, secondBathX - wallThickness / 2, secondBathY + secondBathHeight / 2 - 0.35, 0.7, 'vertical')
  }

  if (hasGarage || hasQuincho) {
    const extraY = canvasHeight - extraRowHeight - 0.4

    if (hasGarage) {
      rooms.push(createRoom('Garage', 0, extraY, sideBlockWidth, extraRowHeight))
      pushDoor(doors, sideBlockWidth / 2 - 0.8, extraY + extraRowHeight - wallThickness / 2, 1.6)
    }

    if (hasQuincho) {
      rooms.push(createRoom('Quincho', rightBlockX, extraY, sideBlockWidth, extraRowHeight))
      pushDoor(doors, rightBlockX + sideBlockWidth / 2 - 0.7, extraY - wallThickness / 2, 1.4)
    }
  }

  rooms.forEach((room) => {
    const isWide = room.width >= 4.5
    windows.push({
      x: round(room.x + (isWide ? room.width * 0.25 : room.width * 0.15)),
      y: round(room.y + room.height - wallThickness / 2),
      width: round(Math.min(room.width * 0.35, 1.8)),
      orientation: 'horizontal',
    })

    labels.push({
      text: room.name,
      x: round(room.x + 0.35),
      y: round(room.y + 0.45),
      area: `${room.area} m²`,
    })
  })

  const notes = [
    'Planta preliminar generada automáticamente con criterio distributivo orientativo.',
    'La organización interior sugiere circulación, muros y aberturas de referencia.',
    'No reemplaza plano municipal, cómputo técnico ni documentación profesional ejecutiva.',
  ]

  return {
    type: propertyType,
    floors,
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
      wallThickness,
    },
    hallway,
    rooms,
    doors,
    windows,
    labels,
    notes,
  }
}

module.exports = {
  generateConceptFloorPlan,
}
