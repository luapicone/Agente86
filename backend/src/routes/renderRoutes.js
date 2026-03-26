const express = require('express')
const { generateRender } = require('../controllers/renderController')

const router = express.Router()

router.post('/generate', generateRender)

module.exports = router
