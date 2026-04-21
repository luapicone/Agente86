const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function buildMarketplaceQuery(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export async function fetchMarketplaceMaterials(params = {}) {
  const response = await fetch(`${API_BASE_URL}/marketplace/materials${buildMarketplaceQuery(params)}`)

  if (!response.ok) {
    throw new Error('No se pudo obtener el marketplace de materiales.')
  }

  return response.json()
}

export async function fetchMarketplaceFilters() {
  const response = await fetch(`${API_BASE_URL}/marketplace/filters`)

  if (!response.ok) {
    throw new Error('No se pudieron obtener los filtros del marketplace.')
  }

  return response.json()
}

export async function createMarketplaceMaterial(payload) {
  const response = await fetch(`${API_BASE_URL}/marketplace/materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('No se pudo publicar el material remanente.')
  }

  return response.json()
}
