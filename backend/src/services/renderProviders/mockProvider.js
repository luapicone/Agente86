function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function extractNumber(prompt, pattern, fallback) {
  const match = prompt.match(pattern)
  return match ? Number(match[1]) : fallback
}

function detectScene(prompt) {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('kitchen') || normalized.includes('cocina')) return 'kitchen'
  if (normalized.includes('living') || normalized.includes('comedor')) return 'living'
  if (normalized.includes('bedroom') || normalized.includes('dormitorio')) return 'bedroom'
  if (normalized.includes('bathroom') || normalized.includes('baño')) return 'bathroom'
  if (normalized.includes('garage')) return 'garage'
  if (normalized.includes('quincho')) return 'quincho'
  if (normalized.includes('grill') || normalized.includes('parrilla')) return 'grill'
  if (normalized.includes('pool') || normalized.includes('pileta')) return 'pool'
  if (normalized.includes('backyard') || normalized.includes('patio') || normalized.includes('garden')) return 'backyard'
  return 'exterior'
}

function getPalette(prompt) {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('steel') || normalized.includes('acero')) {
    return {
      sky: '#dbeafe',
      ground: '#d1d5db',
      main: '#475569',
      accent: '#0f172a',
      panel: '#94a3b8',
      detail: '#e2e8f0',
    }
  }

  if (normalized.includes('concrete') || normalized.includes('hormig')) {
    return {
      sky: '#e0f2fe',
      ground: '#d6d3d1',
      main: '#78716c',
      accent: '#44403c',
      panel: '#a8a29e',
      detail: '#f5f5f4',
    }
  }

  return {
    sky: '#dcfce7',
    ground: '#d9f99d',
    main: '#8b5e3c',
    accent: '#3f2a1d',
    panel: '#c8a97e',
    detail: '#fef7ed',
  }
}

function buildExteriorScene(prompt, palette) {
  const floors = Math.max(1, extractNumber(prompt, /(\d+)\s+floor house/i, 1))
  const bedrooms = Math.max(1, extractNumber(prompt, /(\d+)\s+bedrooms?/i, 2))
  const hasGarage = /garage/i.test(prompt)
  const hasPool = /pool|pileta/i.test(prompt)
  const hasQuincho = /quincho/i.test(prompt)
  const hasGrill = /grill|parrilla/i.test(prompt)
  const houseHeight = floors > 1 ? 260 : 180
  const upperLevel = floors > 1
    ? `<rect x="355" y="245" width="250" height="125" rx="20" fill="${palette.panel}" opacity="0.92" />
       <rect x="390" y="275" width="58" height="42" rx="10" fill="${palette.detail}" />
       <rect x="468" y="275" width="58" height="42" rx="10" fill="${palette.detail}" />`
    : ''
  const garage = hasGarage
    ? `<rect x="620" y="370" width="180" height="115" rx="18" fill="${palette.panel}" />
       <rect x="650" y="398" width="120" height="70" rx="12" fill="${palette.detail}" opacity="0.86" />`
    : ''
  const pool = hasPool
    ? `<rect x="130" y="530" width="220" height="70" rx="26" fill="#67e8f9" opacity="0.95" />
       <path d="M150 565 C180 548 220 580 260 560 C300 542 320 578 340 564" stroke="#ecfeff" stroke-width="6" fill="none" opacity="0.8" />`
    : ''
  const terrace = hasQuincho
    ? `<rect x="610" y="508" width="170" height="34" rx="14" fill="${palette.accent}" opacity="0.82" />
       <rect x="635" y="465" width="118" height="48" rx="12" fill="${palette.panel}" opacity="0.9" />`
    : ''
  const grill = hasGrill
    ? `<rect x="785" y="452" width="46" height="92" rx="10" fill="#57534e" />
       <rect x="795" y="434" width="26" height="28" rx="8" fill="#ef4444" opacity="0.7" />`
    : ''

  return `
    <rect x="0" y="0" width="1024" height="768" fill="url(#sky)" />
    <rect x="0" y="515" width="1024" height="253" fill="${palette.ground}" />
    <circle cx="860" cy="120" r="55" fill="#fde68a" opacity="0.9" />
    <rect x="250" y="${floors > 1 ? 305 : 385}" width="470" height="${houseHeight}" rx="28" fill="${palette.main}" />
    ${upperLevel}
    <polygon points="220,${floors > 1 ? 315 : 385} 500,${floors > 1 ? 145 : 255} 780,${floors > 1 ? 315 : 385}" fill="${palette.accent}" />
    <rect x="435" y="${floors > 1 ? 420 : 445}" width="85" height="120" rx="18" fill="${palette.detail}" />
    <rect x="300" y="${floors > 1 ? 405 : 435}" width="82" height="54" rx="12" fill="${palette.detail}" opacity="0.92" />
    <rect x="540" y="${floors > 1 ? 405 : 435}" width="82" height="54" rx="12" fill="${palette.detail}" opacity="0.92" />
    <rect x="540" y="${floors > 1 ? 480 : 505}" width="82" height="54" rx="12" fill="${palette.detail}" opacity="0.92" />
    <path d="M160 540 C250 505 350 510 430 540 C530 578 660 584 825 540" stroke="#65a30d" stroke-width="20" fill="none" opacity="0.42" />
    ${garage}
    ${pool}
    ${terrace}
    ${grill}
    <text x="72" y="102" font-size="52" font-family="Arial, sans-serif" font-weight="700" fill="#0f172a">HabitatIA Render</text>
    <text x="72" y="150" font-size="24" font-family="Arial, sans-serif" fill="#334155">${bedrooms} dormitorios · ${floors} piso${floors > 1 ? 's' : ''} · propuesta visual automática</text>
  `
}

function buildInteriorScene(scene, palette) {
  const sceneLabels = {
    kitchen: ['Cocina', 'Mobiliario lineal', 'Superficie de trabajo y luz natural'],
    living: ['Living comedor', 'Area social integrada', 'Estar flexible para la familia'],
    bedroom: ['Dormitorio principal', 'Ambiente de descanso', 'Cama, guardado y circulacion'],
    bathroom: ['Baño', 'Vanitory y ducha', 'Materialidad simple y funcional'],
    garage: ['Garage', 'Acceso vehicular', 'Espacio cubierto y guardado'],
    quincho: ['Quincho', 'Area social exterior', 'Mesa, sombra y encuentro'],
    grill: ['Parrilla', 'Sector de asado', 'Apoyo y expansion al exterior'],
    pool: ['Pileta', 'Area recreativa', 'Solarium y relacion con la casa'],
    backyard: ['Patio y jardin', 'Expansion verde', 'Uso exterior de la vivienda'],
  }

  const [title, subtitle, description] = sceneLabels[scene] || sceneLabels.living
  const featureShapes = {
    kitchen: `
      <rect x="140" y="420" width="300" height="90" rx="18" fill="${palette.panel}" />
      <rect x="140" y="362" width="240" height="42" rx="14" fill="${palette.detail}" />
      <rect x="470" y="360" width="130" height="170" rx="16" fill="${palette.main}" opacity="0.9" />
    `,
    living: `
      <rect x="150" y="432" width="230" height="88" rx="28" fill="${palette.panel}" />
      <rect x="435" y="450" width="168" height="76" rx="18" fill="${palette.detail}" />
      <rect x="655" y="392" width="150" height="128" rx="18" fill="${palette.main}" opacity="0.88" />
    `,
    bedroom: `
      <rect x="170" y="410" width="290" height="120" rx="24" fill="${palette.panel}" />
      <rect x="210" y="380" width="210" height="44" rx="16" fill="${palette.detail}" />
      <rect x="625" y="388" width="142" height="140" rx="18" fill="${palette.main}" opacity="0.9" />
    `,
    bathroom: `
      <rect x="180" y="388" width="140" height="150" rx="18" fill="${palette.detail}" />
      <rect x="380" y="400" width="190" height="128" rx="22" fill="${palette.panel}" />
      <rect x="640" y="360" width="126" height="184" rx="22" fill="${palette.main}" opacity="0.86" />
    `,
    garage: `
      <rect x="150" y="430" width="350" height="88" rx="18" fill="${palette.panel}" />
      <rect x="555" y="360" width="250" height="160" rx="22" fill="${palette.main}" opacity="0.88" />
      <circle cx="620" cy="542" r="26" fill="#1f2937" />
      <circle cx="748" cy="542" r="26" fill="#1f2937" />
    `,
    quincho: `
      <rect x="150" y="460" width="330" height="30" rx="10" fill="${palette.accent}" />
      <rect x="190" y="376" width="250" height="94" rx="20" fill="${palette.panel}" />
      <rect x="575" y="410" width="240" height="120" rx="26" fill="${palette.detail}" />
    `,
    grill: `
      <rect x="170" y="372" width="180" height="170" rx="22" fill="#44403c" />
      <rect x="225" y="330" width="74" height="62" rx="14" fill="#ef4444" opacity="0.72" />
      <rect x="430" y="430" width="360" height="90" rx="18" fill="${palette.panel}" />
    `,
    pool: `
      <rect x="120" y="420" width="370" height="118" rx="36" fill="#67e8f9" />
      <rect x="540" y="430" width="240" height="92" rx="28" fill="${palette.detail}" />
      <path d="M160 474 C220 446 292 502 360 472 C412 450 440 490 476 474" stroke="#ecfeff" stroke-width="8" fill="none" opacity="0.82" />
    `,
    backyard: `
      <rect x="120" y="420" width="760" height="122" rx="28" fill="${palette.ground}" />
      <circle cx="230" cy="390" r="54" fill="#4d7c0f" opacity="0.88" />
      <circle cx="760" cy="392" r="58" fill="#65a30d" opacity="0.82" />
      <rect x="390" y="430" width="220" height="86" rx="18" fill="${palette.detail}" />
    `,
  }

  return `
    <rect x="0" y="0" width="1024" height="768" fill="url(#sky)" />
    <rect x="0" y="560" width="1024" height="208" fill="#cbd5e1" opacity="0.55" />
    <rect x="96" y="96" width="832" height="576" rx="38" fill="#ffffff" opacity="0.92" />
    <rect x="126" y="126" width="772" height="516" rx="28" fill="${palette.detail}" opacity="0.7" />
    ${featureShapes[scene] || featureShapes.living}
    <text x="146" y="174" font-size="50" font-family="Arial, sans-serif" font-weight="700" fill="#0f172a">${escapeXml(title)}</text>
    <text x="146" y="222" font-size="26" font-family="Arial, sans-serif" fill="#334155">${escapeXml(subtitle)}</text>
    <text x="146" y="266" font-size="22" font-family="Arial, sans-serif" fill="#475569">${escapeXml(description)}</text>
    <text x="146" y="616" font-size="18" font-family="Arial, sans-serif" fill="#64748b">Fallback visual generado automaticamente a partir del chat</text>
  `
}

function buildSvgMarkup({ prompt, styleLabel }) {
  const palette = getPalette(prompt)
  const scene = detectScene(prompt)
  const title = escapeXml(styleLabel || 'HabitatIA')
  const promptPreview = escapeXml(prompt.slice(0, 140))
  const sceneMarkup = scene === 'exterior' ? buildExteriorScene(prompt, palette) : buildInteriorScene(scene, palette)

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.sky}" />
          <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>
      </defs>
      ${sceneMarkup}
      <rect x="56" y="676" width="912" height="52" rx="16" fill="#0f172a" opacity="0.74" />
      <text x="78" y="709" font-size="18" font-family="Arial, sans-serif" fill="#e2e8f0">${promptPreview}</text>
    </svg>
  `
}

function buildMockImageUrl(payload) {
  const svg = buildSvgMarkup(payload)
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

async function generateWithMock({ prompt, negativePrompt, styleLabel }) {
  return {
    provider: 'mock',
    status: 'ready',
    imageUrl: buildMockImageUrl({ prompt, styleLabel }),
    prompt,
    negativePrompt,
    styleLabel,
    note: 'Vista visual automática generada localmente como respaldo mientras no haya credenciales externas configuradas.',
  }
}

module.exports = {
  generateWithMock,
}
