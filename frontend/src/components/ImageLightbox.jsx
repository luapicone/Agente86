function ImageLightbox({ item, onClose }) {
  if (!item) {
    return null
  }

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose}>
          ×
        </button>
        <img src={item.imageUrl} alt={item.title} className="lightbox-image" />
        <div className="lightbox-caption">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox
