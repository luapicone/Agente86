function ConceptFloorPlan({ plan }) {
  if (!plan) {
    return null
  }

  const scaleX = 100 / plan.canvas.width
  const scaleY = 100 / plan.canvas.height

  return (
    <section className="floorplan-section mt-4">
      <div className="result-card shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="section-kicker">Plano preliminar</span>
            <h2 className="section-title mb-0">Distribución conceptual de la vivienda</h2>
          </div>
          <span className="text-muted small">Plano orientativo, no reemplaza documentación profesional</span>
        </div>

        <div className="floorplan-canvas">
          {plan.rooms.map((room) => (
            <div
              key={`${room.name}-${room.x}-${room.y}`}
              className="floorplan-room"
              style={{
                left: `${room.x * scaleX}%`,
                top: `${room.y * scaleY}%`,
                width: `${room.width * scaleX}%`,
                height: `${room.height * scaleY}%`,
              }}
            >
              <strong>{room.name}</strong>
              <span>{room.area} m²</span>
            </div>
          ))}
        </div>

        <ul className="result-list mt-3 mb-0">
          {plan.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ConceptFloorPlan
