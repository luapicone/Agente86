const assert = require('node:assert/strict')
const { test } = require('node:test')

const {
  buildFloorPlanPrompt,
  distributeAcrossFloors,
  getFloorCount,
} = require('../src/services/floorPlanPromptService')

test('getFloorCount limits houses to three floors and apartments to one', () => {
  assert.equal(getFloorCount({ propertyType: 'departamento', floors: 3 }), 1)
  assert.equal(getFloorCount({ propertyType: 'casa', floors: 2 }), 2)
  assert.equal(getFloorCount({ propertyType: 'casa', floors: 8 }), 3)
})

test('distributeAcrossFloors allocates the complete room program', () => {
  assert.deepEqual(distributeAcrossFloors(5, 2), [3, 2])
  assert.deepEqual(distributeAcrossFloors(1, 2), [1, 0])
  assert.equal(distributeAcrossFloors(5, 2).reduce((sum, amount) => sum + amount, 0), 5)
})

test('buildFloorPlanPrompt creates a distinct coordinated program for every floor', () => {
  const payload = {
    propertyType: 'casa',
    floors: 3,
    squareMeters: 180,
    bedrooms: 5,
    bathrooms: 3,
    location: 'Córdoba, Argentina',
    hasGarage: true,
    garageCapacity: '2',
    hasSuiteBathroom: true,
    bedroomProgram: 'principal para dos personas y dos dormitorios para dos chicos cada uno',
    suiteDetails: 'dormitorio principal con baño privado',
    spaceNeeds: 'escritorio y lavadero independiente',
  }

  const groundFloor = buildFloorPlanPrompt(payload, 1)
  const middleFloor = buildFloorPlanPrompt(payload, 2)
  const topFloor = buildFloorPlanPrompt(payload, 3)

  assert.match(groundFloor, /floor 1 of 3/)
  assert.match(groundFloor, /garage/)
  assert.match(groundFloor, /2 vehicles/)
  assert.match(groundFloor, /bedroom occupancy and use/i)
  assert.match(groundFloor, /escritorio y lavadero independiente/i)
  assert.match(middleFloor, /3 bedrooms and 1 private bathroom/)
  assert.match(topFloor, /2 bedrooms and 1 private bathroom/)
  assert.match(topFloor, /en-suite primary bedroom/)
  assert.match(topFloor, /Spanish room labels/)
})
