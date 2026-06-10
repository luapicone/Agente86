const { buildProjectProposal } = require('../services/projectService')
const { generateRenderImage } = require('../services/renderService')

const generateRender = async (req, res) => {
  try {
    const hasDirectPrompt = typeof req.body?.prompt === 'string' && req.body.prompt.trim().length > 0
    const projectProposal = hasDirectPrompt ? null : buildProjectProposal(req.body)

    const renderResult = await generateRenderImage({
      prompt: hasDirectPrompt ? req.body.prompt.trim() : projectProposal.imagePrompt,
      negativePrompt: hasDirectPrompt ? req.body.negativePrompt : projectProposal.negativePrompt,
      styleLabel: hasDirectPrompt ? req.body.styleLabel : projectProposal.imageStyle,
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
