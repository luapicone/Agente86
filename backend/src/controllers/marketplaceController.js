const { getMarketplaceListings } = require('../services/materialMarketplaceService')

function getListings(_req, res) {
  return res.status(200).json({
    items: getMarketplaceListings(),
  })
}

module.exports = {
  getListings,
}
