async function generateWithMock({ prompt, negativePrompt, styleLabel }) {
  return {
    provider: 'mock',
    status: 'ready',
    imageUrl: null,
    prompt,
    negativePrompt,
    styleLabel,
    note: 'Proveedor mock de respaldo. Útil mientras no haya credenciales externas configuradas.',
  }
}

module.exports = {
  generateWithMock,
}
