async function generateWithTogether({ prompt, negativePrompt, styleLabel }) {
  const apiKey = process.env.TOGETHER_API_KEY

  if (!apiKey) {
    throw new Error('TOGETHER_API_KEY no configurada.')
  }

  const response = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt,
      negative_prompt: negativePrompt,
      width: 1024,
      height: 768,
      steps: 4,
      n: 1,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Together error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const imageUrl = data?.data?.[0]?.url || data?.output?.[0]?.url || null

  if (!imageUrl) {
    throw new Error('Together no devolvió URL de imagen.')
  }

  return {
    provider: 'together',
    status: 'ready',
    imageUrl,
    prompt,
    negativePrompt,
    styleLabel,
    note: 'Render generado por Together.',
  }
}

module.exports = {
  generateWithTogether,
}
