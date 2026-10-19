function Filters({
  lines,
  buyers,
  lineFilter,
  buyerFilter,
  groupBy,
  onLineChange,
  onBuyerChange,
  onGroupByChange,
}) {
  return (
    <section className="filters" aria-label="Report filters">
      <label className="filter-label">
        LINE
        <select value={lineFilter} onChange={(event) => onLineChange(event.target.value)}>
          <option value="All">All lines</option>
          {lines.map((line) => <option key={line} value={line}>{line}</option>)}
        </select>
      </label>
      <label className="filter-label">
        BUYER
        <select value={buyerFilter} onChange={(event) => onBuyerChange(event.target.value)}>
          <option value="All">All buyers</option>
          {buyers.map((buyer) => <option key={buyer} value={buyer}>{buyer}</option>)}
        </select>
      </label>
      <span className="filter-spacer" />
      <label className="filter-label">
        GROUP BY
        <select value={groupBy} onChange={(event) => onGroupByChange(event.target.value)}>
          {['Line', 'Buyer', 'Style', 'Date'].map((field) => <option key={field} value={field}>{field}</option>)}
        </select>
      </label>
      <span className="filter-count">{`${lines.length} lines · ${buyers.length} buyers`}</span>
    </section>
  )
}

export default Filters
