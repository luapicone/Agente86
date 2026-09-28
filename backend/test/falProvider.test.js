const assert = require('node:assert/strict')
const { afterEach, test } = require('node:test')

const {
  FAL_ENDPOINT,
  buildFalPrompt,
  generateWithFal,
} = require('../src/services/renderProviders/falProvider')

const originalFetch = global.fetch
const originalFalKey = process.env.FAL_KEY

afterEach(() => {
  global.fetch = originalFetch

  if (originalFalKey === undefined) {
    delete process.env.FAL_KEY
  } else {
    process.env.FAL_KEY = originalFalKey
  }
})

test('buildFalPrompt preserves the prompt and appends exclusions', () => {
  assert.equal(buildFalPrompt('Modern house', ''), 'Modern house')
  assert.equal(
    buildFalPrompt('Modern house', 'text, watermark'),
    'Modern house\n\nAvoid: text, watermark.',
  )
})

test('generateWithFal requires a server-side API key', async () => {
  delete process.env.FAL_KEY

  await assert.rejects(
    () => generateWithFal({ prompt: 'house' }),
    /FAL_KEY no configurada/,
  )
})

test('generateWithFal calls FLUX.2 Pro and normalizes the result', async () => {
  process.env.FAL_KEY = 'test-key'
  global.fetch = async (url, options) => {
    assert.equal(url, FAL_ENDPOINT)
    assert.equal(options.headers.Authorization, 'Key test-key')

    const body = JSON.parse(options.body)
    assert.equal(body.image_size, 'landscape_16_9')
    assert.equal(body.num_images, 1)
    assert.equal(body.output_format, 'jpeg')
    assert.match(body.prompt, /Avoid: text/)

    return {
      ok: true,
      json: async () => ({
        images: [{ url: 'https://fal.media/files/render.jpeg' }],
        request_id: 'request-123',
      }),
    }
  }

  const result = await generateWithFal({
    prompt: 'Modern house',
    negativePrompt: 'text',
    styleLabel: 'Modern',
  })

  assert.equal(result.provider, 'fal')
  assert.equal(result.imageUrl, 'https://fal.media/files/render.jpeg')
  assert.equal(result.requestId, 'request-123')
})
