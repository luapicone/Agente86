const assert = require('node:assert/strict')
const { test } = require('node:test')

const {
  extractFallbackAnswersFromMessages,
  getMissingFields,
} = require('../src/services/chatConversationService')

test('architectural brief keeps decisive house fields pending before completion', () => {
  const missing = getMissingFields({
    propertyType: 'casa',
    hasLand: 'no',
    hasQuincho: 'false',
  })

  assert.ok(missing.includes('floors'))
  assert.ok(missing.includes('bedroomProgram'))
  assert.ok(missing.includes('hasSuiteBathroom'))
  assert.ok(missing.includes('hasPool'))
  assert.ok(missing.includes('hasGarage'))
  assert.ok(missing.includes('materialPreferences'))
  assert.ok(missing.includes('spaceNeeds'))
  assert.ok(!missing.includes('terrainType'))
  assert.ok(!missing.includes('hasGrill'))
})

test('suite and quincho details become conditional requirements', () => {
  const missing = getMissingFields({
    propertyType: 'casa',
    hasSuiteBathroom: 'true',
    hasQuincho: 'true',
  })

  assert.ok(missing.includes('suiteDetails'))
  assert.ok(missing.includes('hasGrill'))
})

test('architectural extraction understands a compound bedroom and social-area answer', () => {
  const answers = extractFallbackAnswersFromMessages([
    { role: 'assistant', text: 'Contame cómo sería cada dormitorio y qué espacios exteriores querés.' },
    {
      role: 'user',
      text: 'Quiero 3 dormitorios: el principal para dos en suite y dos para dos chicos cada uno; pileta, quincho con parrilla y garage para 2 autos.',
    },
  ], { propertyType: 'casa' })

  assert.equal(answers.bedrooms, '3')
  assert.match(answers.bedroomProgram, /principal para dos en suite/i)
  assert.equal(answers.hasSuiteBathroom, 'true')
  assert.equal(answers.hasPool, 'true')
  assert.equal(answers.hasQuincho, 'true')
  assert.equal(answers.hasGrill, 'true')
  assert.equal(answers.hasGarage, 'true')
  assert.equal(answers.garageCapacity, '2')
})
