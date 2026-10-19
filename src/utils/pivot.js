// Aggregate valid records into a group summary and calculate ratio metrics from the sums.
export function buildPivot(rows, groupBy) {
  const groups = new Map()
  for (const row of rows) {
    const label = row[groupBy] == null || row[groupBy] === '' ? '—' : String(row[groupBy])
    const totals = groups.get(label) ?? { Group: label, Target: 0, Produced: 0, Defects: 0 }
    totals.Target += row.Target
    totals.Produced += row.Produced
    totals.Defects += row.Defects
    groups.set(label, totals)
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      Efficiency: group.Target ? (group.Produced / group.Target) * 100 : 0,
      DHU: group.Produced ? (group.Defects / group.Produced) * 100 : 0,
    }))
    .sort((left, right) => left.Group.localeCompare(right.Group, undefined, { numeric: true }))
}
