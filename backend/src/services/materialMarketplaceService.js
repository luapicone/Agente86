const architectListings = [
  {
    id: 'mat-001',
    materialKey: 'cemento',
    materialName: 'Cemento Portland x bolsa 50kg',
    architect: 'Estudio Verde Sur',
    stock: 40,
    unit: 'bolsa',
    price: 8,
    discountPrice: 6.5,
  },
  {
    id: 'mat-002',
    materialKey: 'ladrillo',
    materialName: 'Ladrillo hueco 18x18x33',
    architect: 'Arq. Módulo Urbano',
    stock: 1200,
    unit: 'unidad',
    price: 0.95,
    discountPrice: 0.68,
  },
  {
    id: 'mat-003',
    materialKey: 'hierro',
    materialName: 'Hierro de construcción 8mm',
    architect: 'Constructora Habitat Social',
    stock: 180,
    unit: 'barra',
    price: 12,
    discountPrice: 9.8,
  },
  {
    id: 'mat-004',
    materialKey: 'abertura',
    materialName: 'Ventana aluminio línea simple',
    architect: 'Arq. Reuso Norte',
    stock: 8,
    unit: 'unidad',
    price: 110,
    discountPrice: 84,
  },
  {
    id: 'mat-005',
    materialKey: 'ceramica',
    materialName: 'Cerámica piso pared 45x45',
    architect: 'Estudio Verde Sur',
    stock: 120,
    unit: 'm2',
    price: 14,
    discountPrice: 10.5,
  },
  {
    id: 'mat-006',
    materialKey: 'cubierta',
    materialName: 'Panel de cubierta liviana',
    architect: 'Arq. Reuso Norte',
    stock: 90,
    unit: 'm2',
    price: 18,
    discountPrice: 14.2,
  },
]

function getMarketplaceListings() {
  return architectListings
}

function getBestArchitectOffer(materialKey, neededQuantity) {
  const matches = architectListings.filter((item) => item.materialKey === materialKey && item.stock > 0)

  if (!matches.length) {
    return null
  }

  const best = matches.sort((a, b) => a.discountPrice - b.discountPrice)[0]
  const applicableQuantity = Math.min(best.stock, neededQuantity)

  return {
    ...best,
    applicableQuantity,
  }
}

module.exports = {
  getMarketplaceListings,
  getBestArchitectOffer,
}
