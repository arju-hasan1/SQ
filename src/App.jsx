import { useMemo, useState } from 'react'
import UploadBar from './components/UploadBar'
import KpiCards from './components/KpiCards'
import Filters from './components/Filters'
import PivotTable from './components/PivotTable'
import BarChart from './components/BarChart'
import ValidationTable from './components/ValidationTable'
import { sampleData } from './data/sampleData'
import { validateRows } from './utils/validate'
import { buildPivot } from './utils/pivot'
import { exportCsv } from './utils/exportCsv'

function App() {
  const [rows, setRows] = useState(sampleData)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [lineFilter, setLineFilter] = useState('All')
  const [buyerFilter, setBuyerFilter] = useState('All')
  const [groupBy, setGroupBy] = useState('Line')
  const [theme, setTheme] = useState('system')

  const validated = useMemo(() => validateRows(rows), [rows])
  const lines = useMemo(
    () => [...new Set(rows.map((row) => row.Line).filter(Boolean))].sort(),
    [rows],
  )
  const buyers = useMemo(
    () => [...new Set(rows.map((row) => row.Buyer).filter(Boolean))].sort(),
    [rows],
  )
  const filteredRows = useMemo(
    () =>
      validated.validRows.filter(
        (row) =>
          (lineFilter === 'All' || row.Line === lineFilter) &&
          (buyerFilter === 'All' || row.Buyer === buyerFilter),
      ),
    [validated.validRows, lineFilter, buyerFilter],
  )
  const pivotRows = useMemo(
    () => buildPivot(filteredRows, groupBy),
    [filteredRows, groupBy],
  )
  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (sum, row) => ({
          Target: sum.Target + row.Target,
          Produced: sum.Produced + row.Produced,
          Defects: sum.Defects + row.Defects,
        }),
        { Target: 0, Produced: 0, Defects: 0 },
      ),
    [filteredRows],
  )

  async function handleFile(file) {
    if (!file) return
    setError('')
    try {
      const { parseExcel } = await import('./utils/parseExcel.js')
      const parsedRows = await parseExcel(file)
      setRows(parsedRows)
      setFileName(file.name)
      setLineFilter('All')
      setBuyerFilter('All')
    } catch (uploadError) {
      setError(uploadError.message)
    }
  }

  function handleExport() {
    exportCsv(pivotRows, groupBy, totals)
  }

  function toggleTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const activeDark = theme === 'dark' || (theme === 'system' && prefersDark)
    setTheme(activeDark ? 'light' : 'dark')
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Threadline home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>THREADLINE<span className="brand-sub">PRODUCTION INTELLIGENCE</span></span>
        </a>
        <div className="topbar-actions">
          <span className="report-period"><span className="status-dot" /> LIVE REPORT</span>
          <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label="Toggle light and dark theme">
            {theme === 'dark' ? '☼' : '◐'}
          </button>
        </div>
      </header>

      <main className="dashboard">
        <section className="page-intro">
          <div>
            <p className="eyebrow">OPERATIONS / SEWING FLOOR</p>
            <h1>Garments Production Report</h1>
            <p className="intro-copy">A clear view of output, efficiency, and quality across your production lines.</p>
          </div>
          <button className="button button-outline print-button" type="button" onClick={() => window.print()}>
            <span aria-hidden="true">⎙</span> Print report
          </button>
        </section>

        <UploadBar onFile={handleFile} fileName={fileName} />
        {error && <div className="error-banner" role="alert">{error}</div>}

        <section className="section-heading kpi-heading">
          <div>
            <p className="eyebrow">AT A GLANCE</p>
            <h2>Production overview</h2>
          </div>
          <span className="data-note">{fileName ? `SOURCE: ${fileName}` : 'SAMPLE DATA · 30 RECORDS'}</span>
        </section>
        <KpiCards totals={totals} />

        <Filters
          lines={lines}
          buyers={buyers}
          lineFilter={lineFilter}
          buyerFilter={buyerFilter}
          groupBy={groupBy}
          onLineChange={setLineFilter}
          onBuyerChange={setBuyerFilter}
          onGroupByChange={setGroupBy}
        />

        <section className="report-grid">
          <div className="panel pivot-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">PIVOT SUMMARY</p>
                <h2>Production by {groupBy.toLowerCase()}</h2>
              </div>
              <button className="button button-quiet export-button" type="button" onClick={handleExport}>
                <span aria-hidden="true">⇩</span> Export CSV
              </button>
            </div>
            <PivotTable rows={pivotRows} groupBy={groupBy} totals={totals} />
          </div>
          <div className="panel validation-panel">
            <div className="panel-heading validation-heading">
              <div>
                <p className="eyebrow">EXCEL-STYLE CHECKS</p>
                <h2>Data validation</h2>
              </div>
              <span className={`validation-badge ${validated.invalidRows.length ? 'has-errors' : 'is-valid'}`}>
                {validated.invalidRows.length ? `${validated.invalidRows.length} ISSUES` : 'ALL VALID'}
              </span>
            </div>
            <ValidationTable rows={validated.invalidRows} />
          </div>
        </section>

        <section className="chart-grid">
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">OUTPUT PERFORMANCE</p>
                <h2>Efficiency by group</h2>
              </div>
              <span className="chart-unit">EFFICIENCY %</span>
            </div>
            <BarChart rows={pivotRows} type="efficiency" />
          </div>
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">PLAN VS ACTUAL</p>
                <h2>Target vs produced</h2>
              </div>
              <div className="chart-legend"><span><i className="legend-target" /> Target</span><span><i className="legend-produced" /> Produced</span></div>
            </div>
            <BarChart rows={pivotRows} type="comparison" />
          </div>
        </section>

        <footer className="footer">
          <span>THREADLINE <span className="footer-divider">/</span> PRODUCTION REPORTING</span>
          <span>Only valid records are included in totals and summaries.</span>
        </footer>
      </main>
    </div>
  )
}

export default App
