import { useState } from 'react'

function EnvironmentCarousel({ items, onOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items?.length) {
    return null
  }

  const currentItem = items[currentIndex]

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="environment-carousel-manual">
      <div className="carousel-indicators environment-indicators">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={index === currentIndex ? 'active' : ''}
            aria-current={index === currentIndex ? 'true' : undefined}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>

      <div className="rounded-4 overflow-hidden shadow-sm environment-frame">
        <button type="button" className="environment-slide-button" onClick={() => onOpen(currentItem)}>
          <img src={currentItem.imageUrl} className="d-block w-100 environment-image" alt={currentItem.title} />
        </button>
      </div>

      {items.length > 1 ? (
        <div className="environment-carousel-controls">
          <button className="btn btn-outline-success" type="button" onClick={goPrevious}>
            Anterior
          </button>
          <span className="environment-counter">
            {currentIndex + 1} / {items.length}
          </span>
          <button className="btn btn-success" type="button" onClick={goNext}>
            Siguiente
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default EnvironmentCarousel
