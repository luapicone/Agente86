async function generateWithHuggingFace({ prompt, negativePrompt, styleLabel }) {
  const apiKey = process.env.HUGGINGFACE_API_KEY

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY no configurada.')
  }

  const response = await fetch(
    'https://router.huggingface.co/fal-ai/fal-ai/flux/dev',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
        guidance_scale: 7.5,
        negative_prompt: negativePrompt,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Hugging Face error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const imageUrl = data?.images?.[0]?.url || data?.data?.[0]?.url || data?.image?.url || null

  if (!imageUrl) {
    throw new Error('Hugging Face no devolvió URL de imagen.')
  }

  return {
    provider: 'huggingface',
    status: 'ready',
    imageUrl,
    prompt,
    negativePrompt,
    styleLabel,
    note: 'Render generado por Hugging Face.',
  }
}

module.exports = {
  generateWithHuggingFace,
}
