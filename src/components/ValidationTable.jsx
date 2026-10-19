function ValidationTable({ rows }) {
  if (!rows.length) {
    return <div className="validation-empty"><span aria-hidden="true">✓</span><p>All records passed validation.</p></div>
  }

  return (
    <div className="table-wrap">
      <table className="validation-table">
        <thead>
          <tr><th scope="col">Row</th><th scope="col">Line</th><th scope="col">Date</th><th scope="col">Reason</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="invalid-row" key={row.rowNumber}>
              <td>{row.rowNumber}</td>
              <td>{row.Line || '—'}</td>
              <td>{row.Date || '—'}</td>
              <td>{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ValidationTable
