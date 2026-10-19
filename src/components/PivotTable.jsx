import { useMemo, useState } from 'react'

const numberFormat = new Intl.NumberFormat('en-US')
const columns = [
  { key: 'Group', label: 'Group' },
  { key: 'Target', label: 'Target', numeric: true },
  { key: 'Produced', label: 'Produced', numeric: true },
  { key: 'Defects', label: 'Defects', numeric: true },
  { key: 'Efficiency', label: 'Efficiency %', numeric: true },
  { key: 'DHU', label: 'DHU %', numeric: true },
]

function efficiencyClass(value) {
  if (value >= 90) return 'efficiency-good'
  if (value >= 80) return 'efficiency-warn'
  return 'efficiency-low'
}

function PivotTable({ rows, groupBy, totals }) {
  const [sort, setSort] = useState({ key: 'Group', direction: 'asc' })
  const totalEfficiency = totals.Target ? (totals.Produced / totals.Target) * 100 : 0
  const totalDhu = totals.Produced ? (totals.Defects / totals.Produced) * 100 : 0
  const orderedRows = useMemo(() => {
    const sorted = [...rows].sort((left, right) => {
      const a = left[sort.key]
      const b = right[sort.key]
      if (typeof a === 'number' && typeof b === 'number') return a - b
      return String(a).localeCompare(String(b), undefined, { numeric: true })
    })
    return sort.direction === 'asc' ? sorted : sorted.reverse()
  }, [rows, sort])

  function sortBy(key) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.numeric ? 'numeric-heading' : ''} scope="col">
                <button className="sortable-heading" type="button" onClick={() => sortBy(column.key)} aria-label={`Sort by ${column.label}`}>
                  {column.label}{sort.key === column.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedRows.map((row) => (
            <tr key={row.Group}>
              <td className="group-name">{row.Group}</td>
              <td className="number-cell">{numberFormat.format(row.Target)}</td>
              <td className="number-cell">{numberFormat.format(row.Produced)}</td>
              <td className="number-cell">{numberFormat.format(row.Defects)}</td>
              <td className="number-cell"><span className={`efficiency-pill ${efficiencyClass(row.Efficiency)}`}>{row.Efficiency.toFixed(1)}%</span></td>
              <td className="number-cell">{row.DHU.toFixed(2)}%</td>
            </tr>
          ))}
          {orderedRows.length === 0 && (
            <tr><td colSpan={6}>No valid records match these filters.</td></tr>
          )}
          <tr className="total-row">
            <td>Total</td>
            <td className="number-cell">{numberFormat.format(totals.Target)}</td>
            <td className="number-cell">{numberFormat.format(totals.Produced)}</td>
            <td className="number-cell">{numberFormat.format(totals.Defects)}</td>
            <td className="number-cell"><span className={`efficiency-pill ${efficiencyClass(totalEfficiency)}`}>{totalEfficiency.toFixed(1)}%</span></td>
            <td className="number-cell">{totalDhu.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
      <span className="sr-only">Rows grouped by {groupBy}</span>
    </div>
  )
}

export default PivotTable
