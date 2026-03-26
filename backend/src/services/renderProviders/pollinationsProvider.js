function buildPollinationsImageUrl({ prompt }) {
  const encodedPrompt = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&model=flux&nologo=true`
}

async function generateWithPollinations({ prompt, negativePrompt, styleLabel }) {
  return {
    provider: 'pollinations',
    status: 'ready',
    imageUrl: buildPollinationsImageUrl({ prompt }),
    prompt,
    negativePrompt,
    styleLabel,
    note: 'Imagen generada mediante URL pública de Pollinations como fallback gratuito.',
  }
}

module.exports = {
  generateWithPollinations,
}
