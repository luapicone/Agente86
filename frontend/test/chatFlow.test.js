import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chatQuestions, getVisibleQuestions } from '../src/utils/chatFlow.js'

test('fixed interview defines every question only once', () => {
  const keys = chatQuestions.map((question) => question.key)

  assert.equal(new Set(keys).size, keys.length)
  assert.equal(keys.length, 22)
})

test('terrain question appears only when the user has land', () => {
  const withoutLand = getVisibleQuestions({ hasLand: 'no' }).map((question) => question.key)
  const withLand = getVisibleQuestions({ hasLand: 'si' }).map((question) => question.key)

  assert.equal(withoutLand.includes('terrainType'), false)
  assert.equal(withLand.includes('terrainType'), true)
})

test('grill question appears only when the user chooses a quincho', () => {
  const withoutQuincho = getVisibleQuestions({ hasQuincho: 'false' }).map((question) => question.key)
  const withQuincho = getVisibleQuestions({ hasQuincho: 'true' }).map((question) => question.key)

  assert.equal(withoutQuincho.includes('hasGrill'), false)
  assert.equal(withQuincho.includes('hasGrill'), true)
})
