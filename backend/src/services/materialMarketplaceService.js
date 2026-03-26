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

function getMarketplaceListings(filters = {}) {
  const listings = readListings()

  return listings.filter((item) => {
    const matchesLocation = filters.location
      ? item.location?.toLowerCase().includes(filters.location.toLowerCase())
      : true
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

function getBestArchitectOffer(materialKey, neededQuantity, location) {
  const matches = getMarketplaceListings({ materialKey, location }).filter((item) => item.stock > 0)

  if (!matches.length) {
    return null
  }

  const best = matches.sort((a, b) => a.discountPrice - b.discountPrice)[0]
  const applicableQuantity = Math.min(best.stock, neededQuantity)

  return {
    ...best,
    applicableQuantity,
  }
}

module.exports = {
  getMarketplaceListings,
  createMarketplaceListing,
  getBestArchitectOffer,
}
