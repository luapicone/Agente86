function ConceptFloorPlan({ aiPlans = [], expectedCount = 1, isRetrying = false, onRetry, plan }) {
  if (!plan) {
    return null
  }

  const scaleX = 100 / plan.canvas.width
  const scaleY = 100 / plan.canvas.height
  const wallThicknessX = (plan.canvas.wallThickness || 0.18) * scaleX
  const wallThicknessY = (plan.canvas.wallThickness || 0.18) * scaleY

  return (
    <section className="floorplan-section mt-4">
      <div className="result-card shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="section-kicker">Planos generados con fal.ai</span>
            <h2 className="section-title mb-0">Diseño de todas las plantas</h2>
          </div>
          <span className="text-muted small">Anteproyecto visual, no reemplaza documentación profesional</span>
        </div>

        {aiPlans.length ? (
          <div className="ai-floorplan-grid">
            {aiPlans.map((floorPlan) => (
              <article className="ai-floorplan-card" key={floorPlan.floorNumber}>
                <div className="ai-floorplan-image-wrap">
                  <img src={floorPlan.imageUrl} alt={`${floorPlan.title} generada con fal.ai`} />
                  <span>fal.ai · FLUX.2 Pro</span>
                </div>
                <div className="ai-floorplan-caption">
                  <strong>{floorPlan.title}</strong>
                  <small>Vista arquitectónica cenital generada para este proyecto</small>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {aiPlans.length < expectedCount ? (
          <div className="alert alert-warning floorplan-generation-status">
            <div>
              <strong>
                {aiPlans.length
                  ? `fal.ai completó ${aiPlans.length} de ${expectedCount} plantas.`
                  : 'fal.ai no pudo completar los planos visuales en este intento.'}
              </strong>
              <span> El esquema paramétrico queda disponible como respaldo.</span>
            </div>
            {onRetry ? (
              <button className="btn btn-outline-success" type="button" onClick={onRetry} disabled={isRetrying}>
                {isRetrying ? 'Reintentando…' : 'Generar planos faltantes'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="floorplan-complete-status">
            {expectedCount === 1
              ? 'Plano generado correctamente con fal.ai.'
              : `${expectedCount} plantas generadas correctamente con fal.ai.`}
          </div>
        )}

        <div className="floorplan-backup-label">
          <span>Esquema técnico de respaldo</span>
          <small>Geometría calculada por HabitatIA</small>
        </div>

        <div className="floorplan-shell">
          <div className="floorplan-canvas floorplan-canvas--architectural">
            <div className="floorplan-paper-grid"></div>
            <div className="floorplan-outline"></div>
            <div className="floorplan-title-block">
              <span>HabitatIA</span>
              <strong>Planta esquemática</strong>
            </div>

            {plan.hallway ? (
              <div
                className="floorplan-hallway"
                style={{
                  left: `${plan.hallway.x * scaleX}%`,
                  top: `${plan.hallway.y * scaleY}%`,
                  width: `${plan.hallway.width * scaleX}%`,
                  height: `${plan.hallway.height * scaleY}%`,
                }}
              />
            ) : null}

            {plan.rooms.map((room) => (
              <div
                key={`${room.name}-${room.x}-${room.y}`}
                className="floorplan-room floorplan-room--architectural"
                style={{
                  left: `${room.x * scaleX}%`,
                  top: `${room.y * scaleY}%`,
                  width: `${room.width * scaleX}%`,
                  height: `${room.height * scaleY}%`,
                }}
              >
                <div className="floorplan-room-label">
                  <strong>{room.name}</strong>
                  <span>{room.area} m²</span>
                </div>
              </div>
            ))}

            {(plan.windows || []).map((window, index) => (
              <div
                key={`window-${index}`}
                className={`floorplan-window floorplan-window--${window.orientation || 'horizontal'}`}
                style={{
                  left: `${window.x * scaleX}%`,
                  top: `${window.y * scaleY}%`,
                  width:
                    window.orientation === 'vertical'
                      ? `${Math.max(wallThicknessX, 0.7)}%`
                      : `${window.width * scaleX}%`,
                  height:
                    window.orientation === 'vertical'
                      ? `${window.width * scaleY}%`
                      : `${Math.max(wallThicknessY, 0.7)}%`,
                }}
              />
            ))}

            {(plan.doors || []).flatMap((door, index) => {
              const isVertical = (door.orientation || 'horizontal') === 'vertical'

              return [
                <div
                  key={`door-${index}`}
                  className={`floorplan-door floorplan-door--${door.orientation || 'horizontal'}`}
                  style={{
                    left: `${door.x * scaleX}%`,
                    top: `${door.y * scaleY}%`,
                    width: isVertical ? `${Math.max(wallThicknessX, 0.8)}%` : `${door.width * scaleX}%`,
                    height: isVertical ? `${door.width * scaleY}%` : `${Math.max(wallThicknessY, 0.8)}%`,
                  }}
                />,
                <div
                  key={`door-swing-${index}`}
                  className={`floorplan-door-swing floorplan-door-swing--${door.orientation || 'horizontal'}`}
                  style={{
                    left: `${(isVertical ? door.x : door.x + 0.1) * scaleX}%`,
                    top: `${(isVertical ? door.y + 0.1 : door.y) * scaleY}%`,
                    width: `${door.width * scaleX}%`,
                    height: `${door.width * scaleY}%`,
                  }}
                />,
              ]
            })}
          </div>
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
