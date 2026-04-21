const express = require('express')
const { getListings, getFilters, createListing } = require('../controllers/marketplaceController')

const router = express.Router()

router.get('/materials', getListings)
router.get('/filters', getFilters)
router.post('/materials', createListing)

module.exports = router
