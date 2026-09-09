import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import beforeImage from '../assets/before-after/house-before.webp'
import afterImage from '../assets/before-after/house-after.webp'

type BeforeAfterShowcaseProps = {
  className?: string
}

export default function BeforeAfterShowcase({ className = '' }: BeforeAfterShowcaseProps) {
  const [position, setPosition] = useState(52)
  const frameRef = useRef<HTMLDivElement | null>(null)

  const updatePositionFromClientX = (clientX: number) => {
    const frame = frameRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, next)))
  }

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const move = (moveEvent: PointerEvent) => updatePositionFromClientX(moveEvent.clientX)
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }

    updatePositionFromClientX(event.clientX)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }

  return (
    <section className={`section before-after-section ${className}`.trim()} id="antes-despues">
      <div className="section-content">
        <div className="section-header before-after-header">
          <div className="section-heading-block">
            <div className="section-eyebrow">Antes y después</div>
            <h2 className="section-title">Antes Y Despues usando HabitatIA</h2>
          </div>
          <p className="section-description">
            Con IA generativa y una planificación más precisa, HabitatIA ayuda a visualizar mejoras de fachada,
            optimizar decisiones de obra y detectar oportunidades concretas de ahorro en materiales, tiempos y etapas de construcción.
          </p>
        </div>

        <div className="before-after-shell mx-auto">
          <div ref={frameRef} className="before-after-frame" style={{ ['--before-after-position' as string]: `${position}%` }}>
            <img className="before-after-image" src={beforeImage} alt="Vivienda antes de la propuesta visual de HabitatIA" />
            <div className="before-after-overlay" style={{ width: `${position}%` }}>
              <img className="before-after-image" src={afterImage} alt="Vivienda después de la propuesta visual de HabitatIA" />
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

          <p className="before-after-caption">
            <strong>Visualización asistida:</strong> una referencia clara del salto estético y funcional que puede lograrse con mejores decisiones de diseño, ahorro y ejecución.
          </p>
        </div>
      </div>
    </section>
  )
}
