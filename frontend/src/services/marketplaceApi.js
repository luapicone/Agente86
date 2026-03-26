const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function fetchMarketplaceMaterials(location) {
  const query = location ? `?location=${encodeURIComponent(location)}` : ''
  const response = await fetch(`${API_BASE_URL}/marketplace/materials${query}`)

  if (!response.ok) {
    throw new Error('No se pudo obtener el marketplace de materiales.')
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
