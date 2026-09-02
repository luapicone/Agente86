const { buildProjectProposal } = require('../services/projectService')
const { generateConversationalTurn } = require('../services/chatConversationService')

const generateProject = (req, res) => {
  try {
    const proposal = buildProjectProposal(req.body)
    return res.status(200).json(proposal)
  } catch (error) {
    console.error('generateProject error', { message: error.message, stack: error.stack, body: req.body })
    return res.status(400).json({
      message: 'No se pudo generar la propuesta del proyecto.',
      error: error.message,
      details: error.details || null,
    })
  }
}

const generateChatTurn = async (req, res) => {
  try {
    const turn = await generateConversationalTurn(req.body || {})
    return res.status(200).json(turn)
  } catch (error) {
    console.error('generateChatTurn error', { message: error.message, stack: error.stack, body: req.body })
    return res.status(error.statusCode || 500).json({
      message: 'No se pudo generar el siguiente mensaje conversacional.',
      error: error.message,
    })
  }
}

module.exports = {
  generateProject,
  generateChatTurn,
}
