const { generateWithPollinations } = require('./renderProviders/pollinationsProvider')
const { generateWithMock } = require('./renderProviders/mockProvider')

const providerHandlers = {
  pollinations: generateWithPollinations,
  mock: generateWithMock,
}

function getConfiguredProviders() {
  const providers = (process.env.RENDER_PROVIDER_ORDER || 'pollinations,mock')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return providers.length ? providers : ['pollinations', 'mock']
}

async function generateRenderImage(payload) {
  const providers = getConfiguredProviders()
  const errors = []

  for (const providerName of providers) {
    const handler = providerHandlers[providerName]

    if (!handler) {
      errors.push({ provider: providerName, message: 'Proveedor no implementado.' })
      continue
    }

    try {
      const result = await handler(payload)
      return {
        success: true,
        providerUsed: providerName,
        providersTried: providers,
        ...result,
      }
    } catch (error) {
      errors.push({ provider: providerName, message: error.message })
    }
  }

  return {
    success: false,
    providerUsed: null,
    providersTried: providers,
    errors,
  }
}

module.exports = {
  generateRenderImage,
  getConfiguredProviders,
}
