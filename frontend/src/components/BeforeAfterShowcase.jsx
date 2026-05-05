import { useRef, useState } from 'react'
import beforeImage from '../assets/before-after/house-before.webp'
import afterImage from '../assets/before-after/house-after.webp'

function BeforeAfterShowcase() {
  const [position, setPosition] = useState(52)
  const frameRef = useRef(null)

  const updatePositionFromClientX = (clientX) => {
    const frame = frameRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, next)))
  }

  const startDrag = (event) => {
    event.preventDefault()

    const move = (moveEvent) => updatePositionFromClientX(moveEvent.clientX)
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }

    updatePositionFromClientX(event.clientX)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }

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
          <div ref={frameRef} className="before-after-frame" style={{ '--before-after-position': `${position}%` }}>
            <img className="before-after-image" src={beforeImage} alt="Exterior de casa antes de la remodelación" />
            <div className="before-after-overlay" style={{ width: `${position}%` }}>
              <img className="before-after-image" src={afterImage} alt="Exterior de casa después de la remodelación" />
            </div>
            <div className="before-after-divider" style={{ left: `${position}%` }}>
              <button
                type="button"
                className="before-after-handle"
                onPointerDown={startDrag}
                aria-label="Mover comparador antes y después"
              >
                ↔
              </button>
            </div>
            <div className="before-after-label before-label">Antes</div>
            <div className="before-after-label after-label">Después</div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default BeforeAfterShowcase
