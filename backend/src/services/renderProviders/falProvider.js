const FAL_ENDPOINT = 'https://fal.run/fal-ai/flux-2-pro'
const DEFAULT_TIMEOUT_MS = 120000

function buildFalPrompt(prompt, negativePrompt) {
  const exclusions = String(negativePrompt || '').trim()

  if (!exclusions) {
    return prompt
  }

  return `${prompt}\n\nAvoid: ${exclusions}.`
}

async function generateWithFal({ prompt, negativePrompt, styleLabel }) {
  const apiKey = process.env.FAL_KEY

  if (!apiKey) {
    throw new Error('FAL_KEY no configurada.')
  }

  const response = await fetch(FAL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: buildFalPrompt(prompt, negativePrompt),
      image_size: 'landscape_16_9',
      num_images: 1,
      output_format: 'jpeg',
      enable_safety_checker: true,
    }),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  })

  if (!response.ok) {
    let message = `fal.ai respondió con estado ${response.status}.`

    try {
      const data = await response.json()
      const providerMessage = data?.detail?.[0]?.msg || data?.detail || data?.message

      if (typeof providerMessage === 'string' && providerMessage.trim()) {
        message = `fal.ai: ${providerMessage.trim()}`
      }
    } catch (_error) {
      // Keep the status-only message so provider responses cannot leak unexpected data.
    }

    throw new Error(message)
  }

  const data = await response.json()
  const imageUrl = data?.images?.[0]?.url || data?.data?.images?.[0]?.url || null

  if (!imageUrl) {
    throw new Error('fal.ai no devolvió URL de imagen.')
  }

  return {
    provider: 'fal',
    status: 'ready',
    imageUrl,
    prompt,
    negativePrompt,
    styleLabel,
    requestId: data?.request_id || null,
    note: 'Render generado con FLUX.2 Pro mediante fal.ai.',
  }
}

module.exports = {
  FAL_ENDPOINT,
  buildFalPrompt,
  generateWithFal,
}
