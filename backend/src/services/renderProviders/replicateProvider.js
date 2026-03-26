const Replicate = require('replicate')

async function generateWithReplicate({ prompt, negativePrompt, styleLabel }) {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN no configurado.')
  }

  const replicate = new Replicate({ auth: apiToken })

  const output = await replicate.run('black-forest-labs/flux-schnell', {
    input: {
      prompt,
      go_fast: true,
      megapixels: '1',
      num_outputs: 1,
      aspect_ratio: '4:3',
      output_format: 'png',
      output_quality: 80,
      negative_prompt: negativePrompt,
    },
  })

  const imageUrl = Array.isArray(output) ? output[0] : output?.url || null

  if (!imageUrl) {
    throw new Error('Replicate no devolvió URL de imagen.')
  }

  return {
    provider: 'replicate',
    status: 'ready',
    imageUrl,
    prompt,
    negativePrompt,
    styleLabel,
    note: 'Render generado por Replicate.',
  }
}

module.exports = {
  generateWithReplicate,
}
