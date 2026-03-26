function ArchitectMarketplace({ items }) {
  if (!items?.length) {
    return null
  }

  return (
    <section className="marketplace-section mt-4">
      <div className="result-card shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="section-kicker">Marketplace de remanentes</span>
            <h2 className="section-title mb-0">Materiales publicados por arquitectos</h2>
          </div>
          <span className="text-muted small">Ofertas disponibles para abaratar costos de obra</span>
        </div>

        <div className="row g-3">
          {items.map((item) => (
            <div className="col-md-6 col-xl-4" key={item.id}>
              <div className="marketplace-card h-100">
                <h3>{item.materialName}</h3>
                <p className="marketplace-architect">Publicado por: {item.architect}</p>
                <ul className="result-list mb-0">
                  <li>Stock: {item.stock} {item.unit}</li>
                  <li>Precio regular: USD {item.price}</li>
                  <li>Precio remanente: USD {item.discountPrice}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArchitectMarketplace
