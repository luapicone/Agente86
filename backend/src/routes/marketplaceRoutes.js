const express = require('express')
const { getListings, createListing } = require('../controllers/marketplaceController')

const router = express.Router()

router.get('/materials', getListings)
router.post('/materials', createListing)

module.exports = router
