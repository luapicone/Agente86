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

function normalizeLocation(value = '') {
  return value.toString().trim().toLowerCase()
}

function getMarketplaceListings(filters = {}) {
  const listings = readListings()
  const requestedLocation = normalizeLocation(filters.location)

  return listings.filter((item) => {
    const itemLocation = normalizeLocation(item.location)
    const matchesLocation = requestedLocation ? itemLocation.includes(requestedLocation) : true
    const matchesMaterial = filters.materialKey ? item.materialKey === filters.materialKey : true

    return matchesLocation && matchesMaterial
  })
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

module.exports = {
  getMarketplaceListings,
  createMarketplaceListing,
  getArchitectOffers,
}
