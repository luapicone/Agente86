function isImageContentType(response) {
  const contentType = response.headers.get('content-type') || ''
  return contentType.startsWith('image/') || contentType.includes('octet-stream')
}

async function validateImageUrl(imageUrl) {
  if (!imageUrl) {
    return false
  }

  try {
    const headResponse = await fetch(imageUrl, {
      method: 'HEAD',
      redirect: 'follow',
    })

    if (headResponse.ok && isImageContentType(headResponse)) {
      return true
    }
  } catch (_error) {
    // Fall through to a regular GET when HEAD is not supported or blocked.
  }

  try {
    const getResponse = await fetch(imageUrl, {
      method: 'GET',
      redirect: 'follow',
    })

    if (!getResponse.ok) {
      return false
    }

    return isImageContentType(getResponse)
  } catch (_error) {
    return false
  }
}

module.exports = {
  validateImageUrl,
}
