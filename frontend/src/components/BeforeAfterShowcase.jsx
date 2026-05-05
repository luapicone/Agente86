import { useEffect, useState } from 'react'
import beforeImage from '../assets/before-after/house-before.webp'
import afterImage from '../assets/before-after/house-after.webp'

function BeforeAfterShowcase() {
  const [position, setPosition] = useState(52)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    if (isInteracting) return undefined

    let value = 52
    let direction = 1

    const interval = window.setInterval(() => {
      value += direction * 1.2
      if (value >= 84) {
        value = 84
        direction = -1
      }
      if (value <= 16) {
        value = 16
        direction = 1
      }
      setPosition(value)
    }, 70)

    return () => window.clearInterval(interval)
  }, [isInteracting])

  return (
    <section id="antes-despues" className="py-5 section-light scene-section" data-scene="before-after">
      <div className="section-atmosphere" aria-hidden="true"><span></span><span></span></div>
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-kicker">Antes y después</span>
          <h2 className="section-title">Cómo puede cambiar por completo la percepción exterior de una vivienda</h2>
          <p className="section-text mx-auto">
            Sumamos una referencia visual de remodelación exterior para mostrar el tipo de transformación que una propuesta
            bien planificada puede generar en fachada, volumen y presencia general.
          </p>
        </div>

        <div className="before-after-shell scene-card floating-panel mx-auto">
          <div className="before-after-frame" style={{ '--before-after-position': `${position}%` }}>
            <img className="before-after-image" src={beforeImage} alt="Exterior de casa antes de la remodelación" />
            <div className="before-after-overlay" style={{ width: `${position}%` }}>
              <img className="before-after-image" src={afterImage} alt="Exterior de casa después de la remodelación" />
            </div>
            <div className="before-after-divider" style={{ left: `${position}%` }}>
              <span className="before-after-handle">↔</span>
            </div>
            <div className="before-after-label before-label">Antes</div>
            <div className="before-after-label after-label">Después</div>
          </div>

          <div className="before-after-controls">
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              onPointerDown={() => setIsInteracting(true)}
              onPointerUp={() => setIsInteracting(false)}
              onMouseDown={() => setIsInteracting(true)}
              onMouseUp={() => setIsInteracting(false)}
              onTouchStart={() => setIsInteracting(true)}
              onTouchEnd={() => setIsInteracting(false)}
              aria-label="Comparar antes y después de la vivienda"
              className="before-after-range"
            />
            <div className="before-after-caption">
              <strong>Deslizá la barra</strong>
              <span>La secuencia se anima sola, pero también la podés controlar manualmente.</span>
            </div>
          </div>
          <p className="before-after-source mb-0">
            Referencia visual externa utilizada para inspiración de remodelación exterior. Fuente: HGTV / River Brook Design.
          </p>
        </div>
      </div>
    </section>
  )
}

export default BeforeAfterShowcase
