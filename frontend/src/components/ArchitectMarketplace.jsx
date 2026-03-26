import { useState } from 'react'

function ArchitectMarketplace({ items, onPublish }) {
  const [form, setForm] = useState({
    materialKey: 'cemento',
    materialName: '',
    architect: '',
    stock: '',
    unit: 'bolsa',
    price: '',
    discountPrice: '',
    location: '',
  })

  const handleChange = ({ target }) => {
    const { name, value } = target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onPublish(form)
    setForm({
      materialKey: 'cemento',
      materialName: '',
      architect: '',
      stock: '',
      unit: 'bolsa',
      price: '',
      discountPrice: '',
      location: '',
    })
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

        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <input className="form-control" name="architect" value={form.architect} onChange={handleChange} placeholder="Nombre del arquitecto / estudio" required />
          </div>
          <div className="col-md-4">
            <input className="form-control" name="materialName" value={form.materialName} onChange={handleChange} placeholder="Nombre del material" required />
          </div>
          <div className="col-md-4">
            <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="Ubicación" required />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="materialKey" value={form.materialKey} onChange={handleChange} placeholder="Clave material" required />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="unit" value={form.unit} onChange={handleChange} placeholder="Unidad" required />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="price" type="number" value={form.price} onChange={handleChange} placeholder="Precio base" required />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="Precio remanente" required />
          </div>
          <div className="col-md-1 d-grid">
            <button className="btn btn-success" type="submit">Publicar</button>
          </div>
        </form>

        <div className="row g-3">
          {items.map((item) => (
            <div className="col-md-6 col-xl-4" key={item.id}>
              <div className="marketplace-card h-100">
                <h3>{item.materialName}</h3>
                <p className="marketplace-architect">Publicado por: {item.architect}</p>
                <ul className="result-list mb-0">
                  <li>Ubicación: {item.location}</li>
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
