const {
  createMarketplaceListing,
  getMarketplaceListings,
} = require('../services/materialMarketplaceService')

function getListings(req, res) {
  const { location, materialKey } = req.query

  return res.status(200).json({
    items: getMarketplaceListings({ location, materialKey }),
  })
}

function createListing(req, res) {
  try {
    const item = createMarketplaceListing(req.body)
    return res.status(201).json(item)
  } catch (error) {
    return res.status(400).json({
      message: 'No se pudo publicar el material remanente.',
      error: error.message,
    })
  }
}

module.exports = {
  getListings,
  createListing,
}
