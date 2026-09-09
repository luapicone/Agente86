import { useEffect, useState } from 'react'
import firstImage from '../assets/remodel-carousel/01-remodel.png'
import secondImage from '../assets/remodel-carousel/02-remodel.png'
import thirdImage from '../assets/remodel-carousel/03-remodel.png'

const slides = [
  {
    image: firstImage,
    alt: 'Primer paso del flujo de remodelación asistida con IA',
    label: 'Paso 1',
  },
  {
    image: secondImage,
    alt: 'Segundo paso del flujo de remodelación asistida con IA',
    label: 'Paso 2',
  },
  {
    image: thirdImage,
    alt: 'Tercer paso del flujo de remodelación asistida con IA',
    label: 'Paso 3',
  },
]

export default function RemodelCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [])

  const goTo = (index: number) => setActiveIndex(index)
  const goPrev = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  const goNext = () => setActiveIndex((current) => (current + 1) % slides.length)

  return (
    <div className="remodel-carousel">
      <div className="remodel-carousel-frame">
        <div className="remodel-carousel-track">
          {slides.map((slide, index) => (
            <figure
              key={slide.label}
              className={`remodel-carousel-slide ${index === activeIndex ? 'is-active' : ''}`.trim()}
              aria-hidden={index !== activeIndex}
            >
              <img className="remodel-carousel-image" src={slide.image} alt={slide.alt} />
            </figure>
          ))}
        </div>

        <div className="remodel-carousel-controls">
          <button type="button" className="remodel-carousel-arrow" onClick={goPrev} aria-label="Imagen anterior">
            ←
          </button>
          <button type="button" className="remodel-carousel-arrow" onClick={goNext} aria-label="Imagen siguiente">
            →
          </button>
        </div>
      </div>

      <div className="remodel-carousel-dots" aria-label="Indicadores del carrusel">
        {slides.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            className={`remodel-carousel-dot ${index === activeIndex ? 'is-active' : ''}`.trim()}
            onClick={() => goTo(index)}
            aria-label={`Ir a ${slide.label}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  )
}
