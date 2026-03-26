function imageElementToDataUrl(imageElement) {
  return new Promise((resolve, reject) => {
    const img = imageElement instanceof HTMLImageElement ? imageElement : null

    if (!img) {
      reject(new Error('Puter no devolvió una imagen válida.'))
      return
    }

    const convert = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || img.width || 1024
        canvas.height = img.naturalHeight || img.height || 768

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch (error) {
        reject(error)
      }
    }

    if (img.complete) {
      convert()
      return
    }

    img.onload = convert
    img.onerror = () => reject(new Error('No se pudo procesar la imagen de Puter.'))
  })
}

export async function generateRenderWithPuter({ prompt, negativePrompt }) {
  if (!window.puter?.ai?.txt2img) {
    throw new Error('Puter no está disponible en el navegador.')
  }

  const imageElement = await window.puter.ai.txt2img(prompt, {
    model: 'stabilityai/stable-diffusion-xl-base-1.0',
    width: 1024,
    height: 768,
    steps: 30,
    negative_prompt: negativePrompt,
  })

  const dataUrl = await imageElementToDataUrl(imageElement)

  return {
    provider: 'puter',
    imageUrl: dataUrl,
    note: 'Render generado gratis en cliente con Puter.js.',
  }
}
