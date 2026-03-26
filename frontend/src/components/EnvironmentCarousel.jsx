function EnvironmentCarousel({ items, onOpen }) {
  if (!items?.length) {
    return null
  }

  return (
    <div id="environmentCarousel" className="carousel slide environment-carousel" data-bs-ride="false">
      <div className="carousel-indicators">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-bs-target="#environmentCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner rounded-4 overflow-hidden shadow-sm">
        {items.map((item, index) => (
          <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <button
              type="button"
              className="environment-slide-button"
              onClick={() => onOpen(item)}
            >
              <img src={item.imageUrl} className="d-block w-100 environment-image" alt={item.title} />
              <div className="carousel-caption-custom">
                <span className="environment-chip">{item.environmentLabel}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#environmentCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#environmentCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      ) : null}
    </div>
  )
}

export default EnvironmentCarousel
