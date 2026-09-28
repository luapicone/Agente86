const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

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

async function postRenderAction(path, payload, fallbackMessage) {
  const response = await fetch(`${API_BASE_URL}/renders/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || errorBody.message || fallbackMessage)
  }

  return response.json()
}

export function generateFloorPlan(payload) {
  return postRenderAction('floor-plan', payload, 'No se pudo generar el plano con fal.ai.')
}

export function editRender(payload) {
  return postRenderAction('edit', payload, 'No se pudo modificar la imagen con fal.ai.')
}
