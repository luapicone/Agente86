const express = require('express')
const { getListings } = require('../controllers/marketplaceController')

const router = express.Router()

router.get('/materials', getListings)

module.exports = router
