const NUMERIC_FIELDS = ['Target', 'Produced', 'Defects']

// Check every row against the report's data-validation rules and split valid from invalid records.
export function validateRows(rows) {
  const validRows = []
  const invalidRows = []

  rows.forEach((row, index) => {
    const reasons = []
    for (const field of NUMERIC_FIELDS) {
      if (typeof row[field] !== 'number' || !Number.isFinite(row[field])) {
        reasons.push(`${field} must be a number`)
      }
    }
    if (typeof row.Target === 'number' && Number.isFinite(row.Target) && row.Target <= 0) {
      reasons.push('Target must be greater than 0')
    }
    if (typeof row.Produced === 'number' && Number.isFinite(row.Produced) && row.Produced < 0) {
      reasons.push('Produced cannot be negative')
    }
    if (typeof row.Defects === 'number' && Number.isFinite(row.Defects) && row.Defects < 0) {
      reasons.push('Defects cannot be negative')
    }
    if (
      typeof row.Defects === 'number' && Number.isFinite(row.Defects) &&
      typeof row.Produced === 'number' && Number.isFinite(row.Produced) &&
      row.Defects > row.Produced
    ) {
      reasons.push('Defects cannot exceed Produced')
    }

    if (reasons.length) {
      invalidRows.push({ ...row, rowNumber: index + 2, reason: reasons.join('; ') })
    } else {
      validRows.push(row)
    }
  })

  return { validRows, invalidRows }
}
