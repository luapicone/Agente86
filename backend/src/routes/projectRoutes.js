const express = require('express')
const { generateProject, generateChatTurn } = require('../controllers/projectController')

const router = express.Router()

router.post('/generate', generateProject)
router.post('/chat-turn', generateChatTurn)

module.exports = router
