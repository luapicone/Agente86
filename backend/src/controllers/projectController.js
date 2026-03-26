const { buildProjectProposal } = require('../services/projectService')

const generateProject = (req, res) => {
  try {
    const proposal = buildProjectProposal(req.body)
    return res.status(200).json(proposal)
  } catch (error) {
    return res.status(400).json({
      message: 'No se pudo generar la propuesta del proyecto.',
      error: error.message,
    })
  }
}

module.exports = {
  generateProject,
}
