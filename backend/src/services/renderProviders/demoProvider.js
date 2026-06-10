const fs = require('fs')
const path = require('path')

const DEMO_FILES = {
  mainHouse: path.join(__dirname, '../../../../frontend/src/assets/before-after/house-after.webp'),
}

const REMOTE_IMAGES = {
  living: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  ],
  bedroom: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&sat=-10',
    'https://images.unsplash.com/photo-1505693536318-65e2c1f11c9a?auto=format&fit=crop&w=1200&q=80',
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  ],
}

const EXTERIOR_VARIANTS = [
  { x: -40, y: -20, width: 690, height: 460, tone: '#0f172a', opacity: 0.12, label: 'Fachada principal' },
  { x: -130, y: -10, width: 760, height: 480, tone: '#1d4ed8', opacity: 0.1, label: 'Vista acceso' },
  { x: -10, y: -50, width: 640, height: 430, tone: '#065f46', opacity: 0.1, label: 'Toma panoramica' },
  { x: -70, y: -35, width: 720, height: 470, tone: '#7c2d12', opacity: 0.09, label: 'Perspectiva lateral' },
  { x: -95, y: -25, width: 700, height: 450, tone: '#312e81', opacity: 0.08, label: 'Jardin frontal' },
  { x: -25, y: -5, width: 660, height: 445, tone: '#0f766e', opacity: 0.08, label: 'Relacion casa-entorno' },
]

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

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
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

function extractViewNumber(prompt = '') {
  const titleMatch = String(prompt).match(/Specific environment to render:\s*([^,]+)/i)

  if (!titleMatch) {
    return 0
  }

  const numberMatch = titleMatch[1].match(/·\s*(\d+)/)
  return numberMatch ? Math.max(Number(numberMatch[1]) - 1, 0) : 0
}

function extractEnvironmentLabel(prompt = '') {
  const titleMatch = String(prompt).match(/Specific environment to render:\s*([^,]+)/i)

  if (!titleMatch) {
    return ''
  }

  return titleMatch[1].replace(/·\s*\d+/, '').trim().toLowerCase()
}

function buildExteriorVariantImage({ prompt, styleLabel }) {
  const source = getLocalDataUrl(DEMO_FILES.mainHouse)
  const viewNumber = extractViewNumber(prompt)
  const variantIndex = (hashString(prompt) + viewNumber) % EXTERIOR_VARIANTS.length
  const variant = EXTERIOR_VARIANTS[variantIndex]
  const badge = escapeXml(styleLabel || variant.label)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.22" />
        </filter>
      </defs>
      <rect width="1200" height="800" fill="#e5e7eb" />
      <image href="${source}" x="${variant.x}" y="${variant.y}" width="${variant.width}" height="${variant.height}" preserveAspectRatio="xMidYMid slice" />
      <rect width="1200" height="800" fill="${variant.tone}" opacity="${variant.opacity}" />
      <g filter="url(#shadow)">
        <rect x="58" y="600" width="460" height="120" rx="28" fill="#ffffff" opacity="0.92" />
      </g>
      <text x="92" y="652" font-size="34" font-family="Arial, sans-serif" font-weight="700" fill="#0f172a">${badge}</text>
      <text x="92" y="694" font-size="22" font-family="Arial, sans-serif" fill="#334155">Demo visual consistente de la misma casa</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function getInteriorOptions(scene) {
  return REMOTE_IMAGES[scene] || REMOTE_IMAGES.living
}

async function generateWithDemo({ prompt, negativePrompt, styleLabel }) {
  const scene = detectScene(prompt)

  if (scene === 'exterior') {
    return {
      provider: 'demo',
      status: 'ready',
      imageUrl: buildExteriorVariantImage({ prompt, styleLabel }),
      prompt,
      negativePrompt,
      styleLabel,
      note:
        'Render demo gratuito con variantes visuales de la misma casa para presentaciones y reuniones.',
    }
  }

  const options = getInteriorOptions(scene)
  const viewNumber = extractViewNumber(prompt)
  const environmentLabel = extractEnvironmentLabel(prompt)
  const selectedImage = options[(hashString(`${scene}:${environmentLabel}`) + viewNumber) % options.length]

  return {
    provider: 'demo',
    status: 'ready',
    imageUrl: selectedImage,
    prompt,
    negativePrompt,
    styleLabel,
    note:
      'Render demo gratuito con variedad de ambientes para pruebas, sin API keys ni costos.',
  }
}

module.exports = {
  generateWithDemo,
}
