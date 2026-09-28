const express = require('express')
const { editRender, generateFloorPlan, generateRender } = require('../controllers/renderController')

const router = express.Router()

router.post('/generate', generateRender)
router.post('/floor-plan', generateFloorPlan)
router.post('/edit', editRender)

module.exports = router
