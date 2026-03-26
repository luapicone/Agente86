const express = require('express')
const { generateProject } = require('../controllers/projectController')

const router = express.Router()

router.post('/generate', generateProject)

module.exports = router
