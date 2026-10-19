const numberFormat = new Intl.NumberFormat('en-US')

function KpiCards({ totals }) {
  const efficiency = totals.Target ? (totals.Produced / totals.Target) * 100 : 0
  const dhu = totals.Produced ? (totals.Defects / totals.Produced) * 100 : 0
  const cards = [
    { label: 'Total target', value: numberFormat.format(totals.Target), note: 'Pieces planned', symbol: '◎' },
    { label: 'Total produced', value: numberFormat.format(totals.Produced), note: 'Valid output pieces', symbol: '↗' },
    { label: 'Efficiency', value: `${efficiency.toFixed(1)}%`, note: 'Produced / target', symbol: '◷' },
    { label: 'Defect rate · DHU', value: `${dhu.toFixed(2)}%`, note: 'Defects / produced', symbol: '◇' },
  ]

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <article className="kpi-card" key={card.label}>
          <div className="kpi-label">
            {card.label}
            <span className="kpi-symbol" aria-hidden="true">{card.symbol}</span>
          </div>
          <p className="kpi-value">{card.value}</p>
          <p className="kpi-footnote">{card.note}</p>
        </article>
      ))}
    </div>
  )
}

export default KpiCards
