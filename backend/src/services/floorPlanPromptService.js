function getFloorCount(payload = {}) {
  if (payload.propertyType === 'departamento') return 1
  return Math.min(3, Math.max(1, Number(payload.floors || 1)))
}

function distributeAcrossFloors(total, floorCount) {
  const safeTotal = Math.max(0, Number(total || 0))
  const safeFloorCount = Math.max(1, Number(floorCount || 1))
  const baseAmount = Math.floor(safeTotal / safeFloorCount)
  const remainder = safeTotal % safeFloorCount

  return Array.from(
    { length: safeFloorCount },
    (_, index) => baseAmount + (index < remainder ? 1 : 0),
  )
}

function getFloorProgram(payload, floorNumber, floorCount) {
  const bedrooms = Math.max(1, Number(payload.bedrooms || 1))
  const bathrooms = Math.max(1, Number(payload.bathrooms || 1))

  if (floorCount === 1) {
    return `Include living-dining room, kitchen, ${bedrooms} bedrooms, ${bathrooms} bathrooms${payload.hasGarage ? ', garage' : ''}${payload.hasQuincho ? ', quincho' : ''}${payload.hasPool ? ', pool and outdoor deck' : ''}.`
  }

  if (floorNumber === 1) {
    return `Ground floor program: entrance, living-dining room, kitchen, one social bathroom, stairs${payload.hasGarage ? ', garage' : ''}${payload.hasQuincho ? ', quincho with grill' : ''}${payload.hasPool ? ', pool and outdoor deck' : ''}. Prioritize fluid social circulation and garden connection.`
  }

  const privateFloorCount = floorCount - 1
  const privateFloorIndex = floorNumber - 2
  const bedroomsOnFloor = distributeAcrossFloors(bedrooms, privateFloorCount)[privateFloorIndex]
  const privateBathrooms = Math.max(0, bathrooms - 1)
  const bathroomsOnFloor = distributeAcrossFloors(privateBathrooms, privateFloorCount)[privateFloorIndex]
  const bedroomProgram = bedroomsOnFloor
    ? `${bedroomsOnFloor} bedroom${bedroomsOnFloor === 1 ? '' : 's'}`
    : 'a flexible studio or family room'
  const bathroomProgram = bathroomsOnFloor
    ? ` and ${bathroomsOnFloor} private bathroom${bathroomsOnFloor === 1 ? '' : 's'}`
    : ''

  if (floorNumber === floorCount) {
    return `Top floor program: ${bedroomProgram}${bathroomProgram}, landing and stairs${payload.hasSuiteBathroom && bedroomsOnFloor ? ', with an en-suite primary bedroom' : ''}. Prioritize privacy, daylight and efficient circulation.`
  }

  return `Intermediate floor program: ${bedroomProgram}${bathroomProgram}, flexible family area, landing and stairs. Coordinate vertical circulation precisely with the floors above and below.`
}

function buildFloorPlanPrompt(payload = {}, floorNumber = 1) {
  const floorCount = getFloorCount(payload)
  const squareMeters = Math.max(20, Number(payload.squareMeters || 20))
  const approximateFloorArea = Math.round(squareMeters / floorCount)
  const floorLabel = floorCount === 1 ? 'single floor' : `floor ${floorNumber} of ${floorCount}`

  return [
    `Professional architectural floor plan for a ${payload.propertyType === 'departamento' ? 'residential apartment' : 'modular sustainable house'} in ${payload.location || 'Argentina'}.`,
    `${floorLabel}, approximately ${approximateFloorArea} square meters on this level, total project area ${squareMeters} square meters.`,
    getFloorProgram(payload, floorNumber, floorCount),
    'Strict orthographic top-down 2D blueprint, complete building visible and centered, coherent room adjacency, realistic wall thicknesses, doors with swing arcs, windows, stairs where applicable, furniture symbols, circulation and exterior dimensions.',
    'Clean black architectural ink on warm white paper, subtle pale green zoning accents, crisp high-resolution technical presentation, Spanish room labels, metric dimensions, title block for HabitatIA.',
    'No perspective, no axonometric view, no 3D walls, no photorealism, no exterior elevation, no people, no decorative illustration, no cropped edges, no watermark.',
  ].join(' ')
}

module.exports = {
  buildFloorPlanPrompt,
  distributeAcrossFloors,
  getFloorCount,
}
