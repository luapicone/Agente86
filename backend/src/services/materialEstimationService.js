const { getArchitectOffers } = require('./materialMarketplaceService')

function round(value) {
  return Math.round(value * 100) / 100
}

function estimateMaterials(payload = {}) {
  const squareMeters = Number(payload.squareMeters || 0)
  const bathrooms = Number(payload.bathrooms || 0)
  const bedrooms = Number(payload.bedrooms || 0)
  const floors = Number(payload.floors || 1)
  const qualityFactor = payload.qualityLevel === 'alto' ? 1.18 : payload.qualityLevel === 'medio' ? 1.05 : 0.92
  const wallFactor = payload.propertyType === 'departamento' ? 0.82 : 1.08
  const extrasFactor =
    1 +
    (payload.hasGarage ? 0.06 : 0) +
    (payload.hasQuincho ? 0.05 : 0) +
    (payload.hasGrill ? 0.02 : 0) +
    (payload.hasPool ? 0.08 : 0)

  const wallSurface = squareMeters * 2.7 * wallFactor * floors
  const openingAllowance = Math.max(8, bedrooms * 2 + bathrooms)
  const netWallSurface = Math.max(20, wallSurface - openingAllowance * 2)
  const floorSurface = squareMeters * floors
  const wetArea = bathrooms * 8 + (payload.hasPool ? 14 : 0)
  const roofSurface = payload.propertyType === 'casa' ? squareMeters * 1.08 : squareMeters * 0.35

  const materialPlan = [
    {
      key: 'cemento',
      name: 'Cemento Portland x bolsa 50kg',
      unit: 'bolsa',
      quantity: Math.ceil((floorSurface * 0.24 + netWallSurface * 0.08 + wetArea * 0.12) * qualityFactor * extrasFactor),
      unitPrice: 8,
    },
    {
      key: 'ladrillo',
      name: 'Ladrillo hueco 18x18x33',
      unit: 'unidad',
      quantity: Math.ceil(netWallSurface * 16.5 * qualityFactor),
      unitPrice: 0.95,
    },
    {
      key: 'hierro',
      name: 'Hierro de construcción 8mm',
      unit: 'barra',
      quantity: Math.ceil((floorSurface * 0.65 + floors * 8 + (payload.hasPool ? 14 : 0)) * qualityFactor),
      unitPrice: 12,
    },
    {
      key: 'abertura',
      name: 'Ventanas / aberturas estándar',
      unit: 'unidad',
      quantity: Math.max(4, bedrooms + bathrooms + floors + 3),
      unitPrice: 110,
    },
    {
      key: 'ceramica',
      name: 'Cerámica para pisos y baños',
      unit: 'm2',
      quantity: Math.ceil((floorSurface * 0.78 + wetArea * 1.1) * qualityFactor),
      unitPrice: 14,
    },
    {
      key: 'cubierta',
      name: 'Cubierta / techo liviano',
      unit: 'm2',
      quantity: Math.ceil(roofSurface * qualityFactor),
      unitPrice: 18,
    },
  ]

  let optimizedTotal = 0
  let architectDiscountTotal = 0
  let purchasedFromMarketplaceTotal = 0

  const materials = materialPlan.map((material) => {
    const baseTotal = round(material.quantity * material.unitPrice)
    optimizedTotal += baseTotal

    const architectOffers = getArchitectOffers(material.key, material.quantity, payload.location)

    if (!architectOffers.length) {
      return {
        ...material,
        baseTotal,
        architectOffers: [],
        architectOfferSummary: null,
        architectSavings: 0,
        optimizedPurchaseTotal: baseTotal,
        purchasedFromMarketplace: 0,
      }
    }

    const purchasedFromMarketplace = round(
      architectOffers.reduce((sum, offer) => sum + offer.applicableQuantity * offer.discountPrice, 0),
    )
    const totalMarketplaceUnits = architectOffers.reduce((sum, offer) => sum + offer.applicableQuantity, 0)
    const regularSubtotalRemaining = round((material.quantity - totalMarketplaceUnits) * material.unitPrice)
    const optimizedPurchaseTotal = round(purchasedFromMarketplace + regularSubtotalRemaining)
    const architectSavings = round(baseTotal - optimizedPurchaseTotal)
    architectDiscountTotal += architectSavings
    purchasedFromMarketplaceTotal += purchasedFromMarketplace

    return {
      ...material,
      baseTotal,
      architectOffers: architectOffers.map((offer) => ({
        listingId: offer.id,
        architect: offer.architect,
        applicableQuantity: offer.applicableQuantity,
        discountPrice: offer.discountPrice,
        location: offer.location,
        coverage: offer.coverage,
        isFallbackLocation: offer.isFallbackLocation,
      })),
      architectOfferSummary: {
        listingsUsed: architectOffers.length,
        totalMarketplaceUnits,
      },
      architectSavings,
      optimizedPurchaseTotal,
      purchasedFromMarketplace,
    }
  })

  const discountedTotal = round(optimizedTotal - architectDiscountTotal)
  const estimatedConstructionBudget = round(squareMeters * 850 + bedrooms * 3500 + bathrooms * 2200 + floors * 1800)
  const marketplaceSavings = architectDiscountTotal
  const materialsWeightOverBudget = estimatedConstructionBudget ? round((discountedTotal / estimatedConstructionBudget) * 100) : 0

  return {
    technicalBasis: {
      wallSurface: round(wallSurface),
      netWallSurface: round(netWallSurface),
      floorSurface: round(floorSurface),
      wetArea: round(wetArea),
      roofSurface: round(roofSurface),
    },
    materials,
    totals: {
      optimizedMaterialTotal: round(optimizedTotal),
      architectDiscountTotal: round(architectDiscountTotal),
      discountedMaterialTotal: discountedTotal,
      estimatedConstructionBudget,
      purchasedFromMarketplaceTotal: round(purchasedFromMarketplaceTotal),
      marketplaceSavings,
      finalDifference: marketplaceSavings,
      materialsWeightOverBudget,
    },
  }
}

module.exports = {
  estimateMaterials,
}
