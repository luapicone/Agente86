const { buildProjectProposal } = require('../services/projectService')
const { generateRenderImage } = require('../services/renderService')
const { editWithFal, generateWithFal } = require('../services/renderProviders/falProvider')
const { buildFloorPlanPrompt, getFloorCount } = require('../services/floorPlanPromptService')

const generateRender = async (req, res) => {
  try {
    const hasDirectPrompt = typeof req.body?.prompt === 'string' && req.body.prompt.trim().length > 0
    const projectProposal = hasDirectPrompt ? null : buildProjectProposal(req.body)

    const renderResult = await generateRenderImage({
      prompt: hasDirectPrompt ? req.body.prompt.trim() : projectProposal.imagePrompt,
      negativePrompt: hasDirectPrompt ? req.body.negativePrompt : projectProposal.negativePrompt,
      styleLabel: hasDirectPrompt ? req.body.styleLabel : projectProposal.imageStyle,
      imageSize: req.body?.imageSize,
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

const generateFloorPlan = async (req, res) => {
  try {
    const floorCount = getFloorCount(req.body)
    const floorNumber = Math.min(floorCount, Math.max(1, Number(req.body?.floorNumber || 1)))
    const prompt = buildFloorPlanPrompt(req.body, floorNumber)
    const render = await generateWithFal({
      prompt,
      imageSize: 'landscape_4_3',
      styleLabel: `Plano arquitectónico · planta ${floorNumber}`,
    })

    return res.status(200).json({
      floorPlan: {
        ...render,
        floorNumber,
        floorCount,
        title: floorCount === 1 ? 'Planta general' : `Planta ${floorNumber}`,
      },
    })
  } catch (error) {
    return res.status(502).json({
      message: 'No se pudo generar el plano con fal.ai.',
      error: error.message,
    })
  }
}

const editRender = async (req, res) => {
  try {
    const instruction = String(req.body?.instruction || '').trim()
    const imageUrl = String(req.body?.imageUrl || '').trim()

    if (instruction.length < 3) {
      return res.status(400).json({ message: 'Describí la modificación que querés realizar.' })
    }

    const prompt = [
      'Edit the provided architectural interior image.',
      `Requested change: ${instruction}`,
      'Preserve the same room, camera angle, architecture, proportions, openings, lighting logic and every element not explicitly mentioned. Produce a photorealistic professional architectural visualization. No text, no watermark.',
    ].join(' ')
    const render = await editWithFal({
      prompt,
      imageUrl,
      styleLabel: req.body?.title || 'Edición de ambiente',
    })

    return res.status(200).json({ render })
  } catch (error) {
    return res.status(502).json({
      message: 'No se pudo modificar la imagen con fal.ai.',
      error: error.message,
    })
  }
}

module.exports = {
  editRender,
  generateFloorPlan,
  generateRender,
}
