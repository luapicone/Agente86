const { getBestArchitectOffer } = require('./materialMarketplaceService')

function round(value) {
  return Math.round(value * 100) / 100
}

function estimateMaterials(payload = {}) {
  const squareMeters = Number(payload.squareMeters || 0)
  const bathrooms = Number(payload.bathrooms || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const qualityFactor = payload.qualityLevel === 'alto' ? 1.18 : payload.qualityLevel === 'medio' ? 1.05 : 0.92

  const materialPlan = [
    {
      key: 'cemento',
      name: 'Cemento Portland x bolsa 50kg',
      unit: 'bolsa',
      quantity: Math.ceil(squareMeters * 0.55),
      unitPrice: 8,
    },
    {
      key: 'ladrillo',
      name: 'Ladrillo hueco 18x18x33',
      unit: 'unidad',
      quantity: Math.ceil(squareMeters * 32),
      unitPrice: 0.95,
    },
    {
      key: 'hierro',
      name: 'Hierro de construcción 8mm',
      unit: 'barra',
      quantity: Math.ceil(squareMeters * 0.9),
      unitPrice: 12,
    },
    {
      key: 'abertura',
      name: 'Ventanas / aberturas estándar',
      unit: 'unidad',
      quantity: Math.max(4, bedrooms + bathrooms + 3),
      unitPrice: 110,
    },
    {
      key: 'ceramica',
      name: 'Cerámica para pisos y baños',
      unit: 'm2',
      quantity: Math.ceil(squareMeters * 0.7 + bathrooms * 6),
      unitPrice: 14,
    },
  ].map((item) => ({
    ...item,
    quantity: Math.ceil(item.quantity * qualityFactor),
  }))

  let optimizedTotal = 0
  let architectDiscountTotal = 0

  const materials = materialPlan.map((material) => {
    const baseTotal = round(material.quantity * material.unitPrice)
    optimizedTotal += baseTotal

    const architectOffer = getBestArchitectOffer(material.key, material.quantity)

    if (!architectOffer) {
      return {
        ...material,
        baseTotal,
        architectOffer: null,
        architectSavings: 0,
        optimizedPurchaseTotal: baseTotal,
      }
    }

    const architectSubtotal = round(architectOffer.applicableQuantity * architectOffer.discountPrice)
    const regularSubtotalRemaining = round((material.quantity - architectOffer.applicableQuantity) * material.unitPrice)
    const optimizedPurchaseTotal = round(architectSubtotal + regularSubtotalRemaining)
    const architectSavings = round(baseTotal - optimizedPurchaseTotal)
    architectDiscountTotal += architectSavings

    return {
      ...material,
      baseTotal,
      architectOffer: {
        listingId: architectOffer.id,
        architect: architectOffer.architect,
        applicableQuantity: architectOffer.applicableQuantity,
        discountPrice: architectOffer.discountPrice,
      },
      architectSavings,
      optimizedPurchaseTotal,
    }
  })

  const discountedTotal = round(optimizedTotal - architectDiscountTotal)
  const estimatedConstructionBudget = round(squareMeters * 850 + bedrooms * 3500 + bathrooms * 2200)
  const finalDifference = round(estimatedConstructionBudget - discountedTotal)

  return {
    materials,
    totals: {
      optimizedMaterialTotal: round(optimizedTotal),
      architectDiscountTotal: round(architectDiscountTotal),
      discountedMaterialTotal: discountedTotal,
      estimatedConstructionBudget,
      finalDifference,
    },
  }
}

module.exports = {
  estimateMaterials,
}
