const fs = require('fs')
const path = require('path')

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'marketplace-materials.json')

function readListings() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8')
  return JSON.parse(raw)
}

function writeListings(listings) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(listings, null, 2))
}

function normalizeText(value = '') {
  return value.toString().trim().toLowerCase()
}

function getMarketplaceListings(filters = {}) {
  const listings = readListings()
  const search = normalizeText(filters.search)
  const requestedLocation = normalizeText(filters.location)
  const requestedZone = normalizeText(filters.zone)
  const requestedMaterial = normalizeText(filters.materialKey)
  const requestedSort = normalizeText(filters.sort)
  const minPrice = Number(filters.minPrice || 0)
  const maxPrice = Number(filters.maxPrice || 0)

  const filtered = listings.filter((item) => {
    const itemLocation = normalizeText(item.location)
    const itemZone = normalizeText(item.zone)
    const itemMaterial = normalizeText(item.materialKey)
    const textBlob = normalizeText(
      [item.materialName, item.description, item.architect, item.location, item.zone, item.materialKey].join(' '),
    )

    const matchesSearch = search ? textBlob.includes(search) : true
    const matchesLocation = requestedLocation ? itemLocation.includes(requestedLocation) : true
    const matchesZone = requestedZone ? itemZone.includes(requestedZone) : true
    const matchesMaterial = requestedMaterial ? itemMaterial === requestedMaterial : true
    const matchesMinPrice = minPrice ? Number(item.discountPrice) >= minPrice : true
    const matchesMaxPrice = maxPrice ? Number(item.discountPrice) <= maxPrice : true

    return (
      matchesSearch &&
      matchesLocation &&
      matchesZone &&
      matchesMaterial &&
      matchesMinPrice &&
      matchesMaxPrice
    )
  })

  const sorted = [...filtered]

  switch (requestedSort) {
    case 'price_asc':
      sorted.sort((a, b) => a.discountPrice - b.discountPrice)
      break
    case 'price_desc':
      sorted.sort((a, b) => b.discountPrice - a.discountPrice)
      break
    case 'stock_desc':
      sorted.sort((a, b) => b.stock - a.stock)
      break
    case 'recent':
    default:
      sorted.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
      break
  }

  return sorted
}

function createMarketplaceListing(payload = {}) {
  const listings = readListings()

  const newItem = {
    id: `mat-${Date.now()}`,
    materialKey: payload.materialKey,
    materialName: payload.materialName,
    architect: payload.architect,
    stock: Number(payload.stock || 0),
    unit: payload.unit,
    price: Number(payload.price || 0),
    discountPrice: Number(payload.discountPrice || 0),
    location: payload.location || 'Sin ubicación',
    zone: payload.zone || 'Sin zona',
    imageUrl:
      payload.imageUrl ||
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    description: payload.description || 'Publicación generada desde el marketplace MVP.',
    condition: payload.condition || 'Excelente',
    publishedAt: new Date().toISOString(),
  }

  listings.push(newItem)
  writeListings(listings)
  return newItem
}

function getArchitectOffers(materialKey, neededQuantity, location) {
  const localMatches = getMarketplaceListings({ materialKey, location }).filter((item) => item.stock > 0)
  const fallbackMatches = localMatches.length ? [] : getMarketplaceListings({ materialKey }).filter((item) => item.stock > 0)
  const source = localMatches.length ? localMatches : fallbackMatches

  if (!source.length) {
    return []
  }

  let remaining = Number(neededQuantity || 0)

  return source
    .sort((a, b) => a.discountPrice - b.discountPrice)
    .reduce((offers, item) => {
      if (remaining <= 0) {
        return offers
      }

      const applicableQuantity = Math.min(item.stock, remaining)
      remaining -= applicableQuantity

      offers.push({
        ...item,
        applicableQuantity,
        coverage: neededQuantity ? Math.round((applicableQuantity / neededQuantity) * 100) : 0,
        isFallbackLocation: !localMatches.length,
      })

      return offers
    }, [])
}

function getMarketplaceFacets() {
  const listings = readListings()

  const materials = [...new Set(listings.map((item) => item.materialKey))].sort()
  const locations = [...new Set(listings.map((item) => item.location))].sort()
  const zones = [...new Set(listings.map((item) => item.zone).filter(Boolean))].sort()
  const prices = listings.map((item) => Number(item.discountPrice || 0)).filter(Boolean)

  return {
    materials,
    locations,
    zones,
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
  }
}

module.exports = {
  getMarketplaceListings,
  createMarketplaceListing,
  getArchitectOffers,
  getMarketplaceFacets,
}
