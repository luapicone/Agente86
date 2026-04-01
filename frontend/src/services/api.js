const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function generateProjectProposal(payload) {
  const response = await fetch(`${API_BASE_URL}/projects/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || errorBody.message || 'No se pudo generar la propuesta.')
  }

  return response.json()
}
