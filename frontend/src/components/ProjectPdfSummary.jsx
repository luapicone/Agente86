function formatMoney(value) {
  return `USD ${Number(value || 0).toLocaleString()}`
}

function openPrintWindow(html) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800')
  if (!printWindow) return

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

export function downloadProjectPdf(project, answers) {
  if (!project) return

  const materialsRows = (project.materialEstimate?.materials || [])
    .map(
      (material) => `
      <tr>
        <td>${material.name}</td>
        <td>${material.quantity} ${material.unit}</td>
        <td>${formatMoney(material.baseTotal)}</td>
        <td>${material.architectOffer ? `${material.architectOffer.architect} (${material.architectOffer.applicableQuantity} ${material.unit})` : '-'}</td>
        <td>${formatMoney(material.architectSavings)}</td>
      </tr>
    `,
    )
    .join('')

  const roomsRows = (project.conceptFloorPlan?.rooms || [])
    .map((room) => `<li>${room.name} - ${room.area} m²</li>`)
    .join('')

  const html = `
    <html>
      <head>
        <title>Resumen HabitatIA</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #1d2d24; }
          h1, h2, h3 { color: #14532d; }
          .card { border: 1px solid #d9e7dc; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #dfe9e1; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #eef6f0; }
          ul { margin: 8px 0 0 18px; }
        </style>
      </head>
      <body>
        <h1>HabitatIA - Resumen del proyecto</h1>
        <div class="card">
          <h2>${project.projectName}</h2>
          <p>${project.summary}</p>
          <p><strong>Tipo:</strong> ${project.propertyType}</p>
          <p><strong>Familia estimada:</strong> ${answers.familyMembers || '-'}</p>
          <p><strong>Terreno:</strong> ${answers.hasLand === 'si' ? 'Sí' : 'No'}</p>
          <p><strong>Urgencia:</strong> ${answers.urgency || '-'}</p>
          <p><strong>Nivel de calidad:</strong> ${answers.qualityLevel || '-'}</p>
        </div>

        <div class="card">
          <h3>Plano conceptual</h3>
          <ul>${roomsRows}</ul>
        </div>

        <div class="card">
          <h3>Materiales optimizados</h3>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Total base</th>
                <th>Oferta arquitecto</th>
                <th>Ahorro</th>
              </tr>
            </thead>
            <tbody>${materialsRows}</tbody>
          </table>
          <p><strong>Total materiales:</strong> ${formatMoney(project.materialEstimate?.totals?.optimizedMaterialTotal)}</p>
          <p><strong>Descuento por compra a arquitectos:</strong> ${formatMoney(project.materialEstimate?.totals?.architectDiscountTotal)}</p>
          <p><strong>Total descontado:</strong> ${formatMoney(project.materialEstimate?.totals?.discountedMaterialTotal)}</p>
          <p><strong>Presupuesto final de referencia:</strong> ${formatMoney(project.materialEstimate?.totals?.estimatedConstructionBudget)}</p>
          <p><strong>Diferencia estimada:</strong> ${formatMoney(project.materialEstimate?.totals?.finalDifference)}</p>
        </div>
      </body>
    </html>
  `

  openPrintWindow(html)
}
