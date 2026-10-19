function efficiencyClass(value) {
  if (value >= 90) return 'efficiency-good'
  if (value >= 80) return 'efficiency-warn'
  return 'efficiency-low'
}

function BarChart({ rows, type }) {
  if (!rows.length) return <div className="validation-empty"><p>No data to chart.</p></div>

  if (type === 'efficiency') {
    return (
      <div className="chart-list" role="img" aria-label="Horizontal bar chart showing efficiency by group">
        {rows.map((row) => (
          <div className="chart-row" key={row.Group}>
            <span className="chart-label" title={row.Group}>{row.Group}</span>
            <div className="chart-track"><div className={`chart-bar ${efficiencyClass(row.Efficiency)}`} style={{ width: `${Math.min(Math.max(row.Efficiency, 0), 100)}%` }} /></div>
            <span className="chart-value">{row.Efficiency.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="comparison-list" role="img" aria-label="Bar chart comparing target and produced quantities by group">
      {rows.map((row) => {
        const maxValue = Math.max(row.Target, row.Produced, 1)
        return (
          <div className="comparison-row" key={row.Group}>
            <span className="chart-label" title={row.Group}>{row.Group}</span>
            <div className="comparison-bars">
              <div className="comparison-track"><div className="comparison-bar target" style={{ width: `${(row.Target / maxValue) * 100}%` }} /></div>
              <div className="comparison-track"><div className="comparison-bar produced" style={{ width: `${(row.Produced / maxValue) * 100}%` }} /></div>
              <div className="comparison-values"><span>{row.Target.toLocaleString('en-US')}</span><span>{row.Produced.toLocaleString('en-US')}</span></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BarChart
