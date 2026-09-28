function ConceptFloorPlan({ aiPlans = [], expectedCount = 1, isRetrying = false, onRetry }) {
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
              <span> Reintentá para generar los planos faltantes.</span>
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

      </div>
    </section>
  )
}

export default ConceptFloorPlan
