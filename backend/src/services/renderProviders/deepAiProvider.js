async function generateWithDeepAI({ prompt, styleLabel }) {
  const apiKey = process.env.DEEPAI_API_KEY

  if (!apiKey) {
    throw new Error('DEEPAI_API_KEY no configurada.')
  }

  const response = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: `${prompt}. Architectural style: ${styleLabel}`,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepAI error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const imageUrl = data?.output_url || data?.id || null

  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
    throw new Error('DeepAI no devolvió una URL de imagen válida.')
  }

  return {
    provider: 'deepai',
    status: 'ready',
    imageUrl,
    prompt,
    styleLabel,
    note: 'Render generado por DeepAI directamente embebible en la web.',
  }
}

module.exports = {
  generateWithDeepAI,
}
