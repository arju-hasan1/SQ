function UploadBar({ onFile, fileName }) {
  function handleChange(event) {
    const file = event.target.files?.[0]
    if (file) onFile(file)
    event.target.value = ''
  }

  return (
    <section className="upload-bar" aria-label="Upload production report">
      <div className="upload-icon" aria-hidden="true">↑</div>
      <div className="upload-copy">
        <p className="upload-title">{fileName || 'Import your production report'}</p>
        <p className="upload-help">Upload an Excel or CSV file to refresh this dashboard.</p>
      </div>
      <div className="upload-actions">
        <a className="sample-link" href="/sample-production.xlsx" download>Download sample Excel</a>
        <label className="upload-label">
          Choose file
          <input className="file-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleChange} />
        </label>
      </div>
    </section>
  )
}

export default UploadBar
