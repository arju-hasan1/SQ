// Download the current pivot and its correctly weighted total row as a CSV file.
export function exportCsv(rows, groupBy, totals) {
  const efficiency = totals.Target ? (totals.Produced / totals.Target) * 100 : 0
  const dhu = totals.Produced ? (totals.Defects / totals.Produced) * 100 : 0
  const records = [
    [`Group by ${groupBy}`, 'Target', 'Produced', 'Defects', 'Efficiency %', 'DHU %'],
    ...rows.map((row) => [row.Group, row.Target, row.Produced, row.Defects, row.Efficiency.toFixed(2), row.DHU.toFixed(2)]),
    ['Total', totals.Target, totals.Produced, totals.Defects, efficiency.toFixed(2), dhu.toFixed(2)],
  ]
  const csv = records.map((record) => record.map((cell) => {
    const text = String(cell ?? '')
    return `"${text.replaceAll('"', '""')}"`
  }).join(',')).join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'garments-production-pivot.csv'
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
