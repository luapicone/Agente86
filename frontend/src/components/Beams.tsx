type BeamsProps = {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
}

export default function Beams({
  beamNumber = 10,
  lightColor = '#60a5fa',
  rotation = 0,
}: BeamsProps) {
  return (
    <div className="beams-container" style={{ transform: `rotate(${rotation}deg)` }}>
      {Array.from({ length: beamNumber }).map((_, index) => (
        <span
          key={index}
          className="beams-stripe"
          style={{
            '--beam-index': index,
            '--beam-color': lightColor,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
import type { CSSProperties } from 'react'
