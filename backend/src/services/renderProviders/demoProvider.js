const fs = require('fs')
const path = require('path')

const DEMO_FILES = {
  exteriorPrimary: path.join(__dirname, '../../../../frontend/src/assets/before-after/house-after.webp'),
  exteriorSecondary: path.join(__dirname, '../../../../frontend/src/assets/before-after/house-before.webp'),
}

const REMOTE_IMAGES = {
  kitchen: [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
  ],
  bedroom: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  ],
  living: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  ],
}

const localDataUrlCache = new Map()

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase()

  if (extension === '.webp') return 'image/webp'
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  return 'application/octet-stream'
}

function getLocalDataUrl(filePath) {
  if (localDataUrlCache.has(filePath)) {
    return localDataUrlCache.get(filePath)
  }

  const base64 = fs.readFileSync(filePath).toString('base64')
  const dataUrl = `data:${getMimeType(filePath)};base64,${base64}`
  localDataUrlCache.set(filePath, dataUrl)
  return dataUrl
}

function detectScene(prompt = '') {
  const normalized = String(prompt).toLowerCase()

  if (normalized.includes('kitchen') || normalized.includes('cocina')) return 'kitchen'
  if (normalized.includes('bathroom') || normalized.includes('baño')) return 'bathroom'
  if (normalized.includes('bedroom') || normalized.includes('dormitorio')) return 'bedroom'
  if (normalized.includes('living') || normalized.includes('comedor') || normalized.includes('estar')) return 'living'
  return 'exterior'
}

function hashString(value = '') {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

function getDemoOptions(scene) {
  if (scene === 'exterior') {
    return [
      getLocalDataUrl(DEMO_FILES.exteriorPrimary),
      getLocalDataUrl(DEMO_FILES.exteriorSecondary),
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    ]
  }

  return REMOTE_IMAGES[scene] || REMOTE_IMAGES.living
}

async function generateWithDemo({ prompt, negativePrompt, styleLabel }) {
  const scene = detectScene(prompt)
  const options = getDemoOptions(scene)
  const selectedImage = options[hashString(prompt) % options.length]

  return {
    provider: 'demo',
    status: 'ready',
    imageUrl: selectedImage,
    prompt,
    negativePrompt,
    styleLabel,
    note:
      'Imagen demo gratuita seleccionada automaticamente para reuniones y pruebas, sin API keys ni costos.',
  }
}

module.exports = {
  generateWithDemo,
}
