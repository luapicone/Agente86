const { buildProjectProposal } = require('../services/projectService')
const { generateRenderImage } = require('../services/renderService')

const generateRender = async (req, res) => {
  try {
    const hasDirectPrompt = typeof req.body?.prompt === 'string' && req.body.prompt.trim().length > 0
    const projectProposal = hasDirectPrompt ? null : buildProjectProposal(req.body)
    const renderInput = hasDirectPrompt
      ? {
          prompt: req.body.prompt.trim(),
          negativePrompt: req.body?.negativePrompt || '',
          styleLabel: req.body?.styleLabel || 'Render directo',
        }
      : {
          prompt: projectProposal.imagePrompt,
          negativePrompt: projectProposal.negativePrompt,
          styleLabel: projectProposal.imageStyle,
        }

    const renderResult = await generateRenderImage(renderInput)

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
