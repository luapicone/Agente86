import { useEffect, useMemo, useState } from 'react'
import { createMarketplaceMaterial, fetchMarketplaceFilters, fetchMarketplaceMaterials } from '../services/marketplaceApi'

const initialForm = {
  materialKey: 'cemento',
  materialName: '',
  architect: '',
  stock: '',
  unit: 'unidad',
  price: '',
  discountPrice: '',
  location: '',
  zone: '',
  imageUrl: '',
  description: '',
  condition: 'Excelente',
}

function MarketplaceView() {
  const [mode, setMode] = useState('chooser')
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    materialKey: '',
    location: '',
    zone: '',
    minPrice: '',
    maxPrice: '',
    sort: 'recent',
  })
  const [facets, setFacets] = useState({ materials: [], locations: [], zones: [], priceRange: { min: 0, max: 0 } })
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState('')

  const loadMarketplace = async (activeFilters = filters) => {
    setLoading(true)
    setError('')

    try {
      const [itemsResponse, filtersResponse] = await Promise.all([
        fetchMarketplaceMaterials(activeFilters),
        fetchMarketplaceFilters(),
      ])

      setItems(itemsResponse.items || [])
      setFacets(filtersResponse)
    } catch (loadError) {
      setError(loadError.message || 'No se pudieron cargar las publicaciones del marketplace.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'buyer') {
      loadMarketplace()
    }
  }, [mode])

  const handleFilterChange = ({ target }) => {
    const { name, value } = target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    await loadMarketplace(filters)
  }

  const handleClearFilters = async () => {
    const cleared = {
      search: '',
      materialKey: '',
      location: '',
      zone: '',
      minPrice: '',
      maxPrice: '',
      sort: 'recent',
    }

    setFilters(cleared)
    await loadMarketplace(cleared)
  }

  const handleFormChange = ({ target }) => {
    const { name, value } = target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePublish = async (event) => {
    event.preventDefault()
    setError('')
    setPublishSuccess('')

    try {
      await createMarketplaceMaterial(form)
      setForm(initialForm)
      setPublishSuccess('La publicación se cargó correctamente en el marketplace.')
    } catch (publishError) {
      setError(publishError.message || 'No se pudo publicar el material.')
    }
  }

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter((value) => value && value !== 'recent').length,
    [filters],
  )

  return (
    <main className="marketplace-page py-5">
      <div className="container">
        <section className="result-card shadow-sm mb-4 marketplace-hero-card">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <span className="section-kicker">Marketplace HabitatIA</span>
              <h1 className="section-title mb-3">Conectá oferta y demanda de materiales remanentes</h1>
              <p className="section-text mb-0">
                Elegí si querés publicar materiales como vendedor o explorar oportunidades como comprador.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="marketplace-entry-actions">
                <button className="marketplace-entry-card" type="button" onClick={() => setMode('buyer')}>
                  <span className="marketplace-entry-kicker">Comprador</span>
                  <strong>Ver marketplace</strong>
                  <small>Explorar publicaciones, filtrar por material, zona y precio.</small>
                </button>
                <button className="marketplace-entry-card" type="button" onClick={() => setMode('seller')}>
                  <span className="marketplace-entry-kicker">Vendedor</span>
                  <strong>Publicar material</strong>
                  <small>Cargar remanentes con imagen, precio, ubicación y stock disponible.</small>
                </button>
              </div>
            </div>
          </div>
        </section>

        {mode === 'chooser' ? null : (
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="marketplace-mode-pill-wrap">
              <span className="marketplace-mode-pill">Modo actual: {mode === 'buyer' ? 'Comprador' : 'Vendedor'}</span>
            </div>
            <button className="btn btn-outline-light" type="button" onClick={() => setMode('chooser')}>
              Volver a elegir
            </button>
          </div>
        )}

        {mode === 'buyer' ? (
          <>
            <section className="result-card shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <span className="section-kicker">Explorar materiales</span>
                  <h2 className="h4 fw-bold mb-0">Marketplace de publicaciones</h2>
                </div>
                <div className="marketplace-summary-grid compact">
                  <div className="metric-box">
                    <span className="metric-label">Publicaciones activas</span>
                    <strong>{items.length}</strong>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Filtros activos</span>
                    <strong>{activeFiltersCount}</strong>
                  </div>
                </div>
              </div>

              <form className="row g-3 align-items-end" onSubmit={handleSearch}>
                <div className="col-lg-4">
                  <label className="form-label">Buscar</label>
                  <div className="marketplace-search-wrap">
                    <span className="marketplace-search-icon">🔎</span>
                    <input
                      className="form-control marketplace-search-input"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Ej: cemento, hierro, ventana, Córdoba"
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label">Material</label>
                  <select className="form-select" name="materialKey" value={filters.materialKey} onChange={handleFilterChange}>
                    <option value="">Todos</option>
                    {facets.materials.map((material) => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label">Zona</label>
                  <select className="form-select" name="zone" value={filters.zone} onChange={handleFilterChange}>
                    <option value="">Todas</option>
                    {facets.zones.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label">Ciudad</label>
                  <select className="form-select" name="location" value={filters.location} onChange={handleFilterChange}>
                    <option value="">Todas</option>
                    {facets.locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label">Ordenar</label>
                  <select className="form-select" name="sort" value={filters.sort} onChange={handleFilterChange}>
                    <option value="recent">Más recientes</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="stock_desc">Mayor stock</option>
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label">Precio mín.</label>
                  <input className="form-control" name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" />
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label">Precio máx.</label>
                  <input className="form-control" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} placeholder={`${facets.priceRange.max || 0}`} />
                </div>
                <div className="col-md-6 col-lg-4 d-flex gap-2">
                  <button className="btn btn-success flex-grow-1" type="submit">Aplicar filtros</button>
                  <button className="btn btn-outline-light flex-grow-1" type="button" onClick={handleClearFilters}>Limpiar</button>
                </div>
              </form>
            </section>

            <section className="marketplace-grid-section">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {loading ? (
                <div className="result-card shadow-sm">
                  <p className="mb-0 text-muted">Cargando publicaciones...</p>
                </div>
              ) : (
                <div className="row g-4">
                  {items.map((item) => {
                    const savings = Number(item.price) - Number(item.discountPrice)
                    return (
                      <div className="col-md-6 col-xl-4" key={item.id}>
                        <article className="marketplace-product-card h-100">
                          <div className="marketplace-product-image-wrap">
                            <img src={item.imageUrl} alt={item.materialName} className="marketplace-product-image" />
                            <span className="marketplace-badge">{item.condition || 'Disponible'}</span>
                          </div>
                          <div className="marketplace-product-body">
                            <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                              <div>
                                <h3 className="marketplace-product-title">{item.materialName}</h3>
                                <p className="marketplace-product-architect mb-0">{item.architect}</p>
                              </div>
                              <span className="marketplace-product-key">{item.materialKey}</span>
                            </div>

                            <p className="marketplace-product-description">{item.description}</p>

                            <div className="marketplace-price-row">
                              <div>
                                <span className="marketplace-price-label">Precio regular</span>
                                <strong className="marketplace-price-old">USD {Number(item.price).toLocaleString()}</strong>
                              </div>
                              <div>
                                <span className="marketplace-price-label">Oferta</span>
                                <strong className="marketplace-price-new">USD {Number(item.discountPrice).toLocaleString()}</strong>
                              </div>
                            </div>

                            <ul className="marketplace-meta-list">
                              <li><strong>Ubicación:</strong> {item.location}</li>
                              <li><strong>Zona:</strong> {item.zone || 'Sin especificar'}</li>
                              <li><strong>Stock:</strong> {item.stock} {item.unit}</li>
                              <li><strong>Ahorro por unidad:</strong> USD {savings.toLocaleString()}</li>
                            </ul>
                          </div>
                        </article>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        ) : null}

        {mode === 'seller' ? (
          <section className="result-card shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <span className="section-kicker">Publicar material</span>
                <h2 className="h4 fw-bold mb-0">Carga rápida para arquitectos y estudios</h2>
              </div>
            </div>

            {error ? <div className="alert alert-danger">{error}</div> : null}
            {publishSuccess ? <div className="alert alert-success">{publishSuccess}</div> : null}

            <form className="row g-3" onSubmit={handlePublish}>
              <div className="col-md-4">
                <input className="form-control" name="architect" value={form.architect} onChange={handleFormChange} placeholder="Nombre del arquitecto / estudio" required />
              </div>
              <div className="col-md-4">
                <input className="form-control" name="materialName" value={form.materialName} onChange={handleFormChange} placeholder="Nombre del material" required />
              </div>
              <div className="col-md-4">
                <input className="form-control" name="imageUrl" value={form.imageUrl} onChange={handleFormChange} placeholder="URL de imagen" />
              </div>
              <div className="col-md-2">
                <input className="form-control" name="materialKey" value={form.materialKey} onChange={handleFormChange} placeholder="Clave material" required />
              </div>
              <div className="col-md-2">
                <input className="form-control" name="stock" type="number" value={form.stock} onChange={handleFormChange} placeholder="Stock" required />
              </div>
              <div className="col-md-2">
                <input className="form-control" name="unit" value={form.unit} onChange={handleFormChange} placeholder="Unidad" required />
              </div>
              <div className="col-md-2">
                <input className="form-control" name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="Precio base" required />
              </div>
              <div className="col-md-2">
                <input className="form-control" name="discountPrice" type="number" value={form.discountPrice} onChange={handleFormChange} placeholder="Precio oferta" required />
              </div>
              <div className="col-md-2">
                <input className="form-control" name="condition" value={form.condition} onChange={handleFormChange} placeholder="Estado" />
              </div>
              <div className="col-md-3">
                <input className="form-control" name="location" value={form.location} onChange={handleFormChange} placeholder="Ciudad" required />
              </div>
              <div className="col-md-3">
                <input className="form-control" name="zone" value={form.zone} onChange={handleFormChange} placeholder="Zona / barrio" />
              </div>
              <div className="col-md-6">
                <input className="form-control" name="description" value={form.description} onChange={handleFormChange} placeholder="Descripción breve del remanente" />
              </div>
              <div className="col-12 d-grid d-md-flex justify-content-md-end">
                <button className="btn btn-success" type="submit">Publicar artículo</button>
              </div>
            </form>
          </section>
        ) : null}
      </div>
    </main>
  )
}

export default MarketplaceView
