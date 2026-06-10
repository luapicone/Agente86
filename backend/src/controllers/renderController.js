const { buildProjectProposal } = require('../services/projectService')
const { generateRenderImage } = require('../services/renderService')

const generateRender = async (req, res) => {
  try {
    const projectProposal = buildProjectProposal(req.body)

    const renderResult = await generateRenderImage({
      prompt: projectProposal.imagePrompt,
      negativePrompt: projectProposal.negativePrompt,
      styleLabel: projectProposal.imageStyle,
    })

    if (!renderResult.success) {
      return res.status(502).json({
        message: 'No se pudo generar el render con los proveedores configurados.',
        details: renderResult,
      })
    }

    return res.status(200).json({
      project: projectProposal,
      render: renderResult,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'No se pudo generar el render.',
      error: error.message,
    })
  }
}

module.exports = {
  generateRender,
}
