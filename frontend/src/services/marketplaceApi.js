const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function fetchMarketplaceMaterials() {
  const response = await fetch(`${API_BASE_URL}/marketplace/materials`)

  if (!response.ok) {
    throw new Error('No se pudo obtener el marketplace de materiales.')
  }

  return response.json()
}
