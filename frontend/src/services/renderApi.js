const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function generateRender(payload) {
  const response = await fetch(`${API_BASE_URL}/renders/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || errorBody.message || 'No se pudo generar el render.')
  }

  return response.json()
}
