async function validateImageUrl(imageUrl) {
  if (!imageUrl) {
    return false
  }

  try {
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      redirect: 'follow',
    })

    if (!response.ok) {
      return false
    }

    const contentType = response.headers.get('content-type') || ''
    return contentType.startsWith('image/') || contentType.includes('octet-stream')
  } catch (_error) {
    return false
  }
}

module.exports = {
  validateImageUrl,
}
