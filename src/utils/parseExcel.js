import * as XLSX from 'xlsx'

const REQUIRED_COLUMNS = ['Date', 'Line', 'Buyer', 'Style', 'Target', 'Produced', 'Defects']

function formatExcelDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value)
    if (!date) return ''
    return `${String(date.y).padStart(4, '0')}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
  }
  if (typeof value === 'string' && value.trim()) {
    const text = value.trim()
    const isoDate = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
    if (isoDate) {
      return `${isoDate[1]}-${isoDate[2].padStart(2, '0')}-${isoDate[3].padStart(2, '0')}`
    }
    const parsed = new Date(text)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  }
  return value == null ? '' : String(value)
}

// Read the first sheet, normalize its required headers, and convert spreadsheet dates to ISO strings.
export async function parseExcel(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) throw new Error('The selected file does not contain a worksheet.')
  const sheet = workbook.Sheets[firstSheetName]
  const values = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true, blankrows: false })
  if (!values.length) throw new Error('The first worksheet is empty.')

  const headerIndexes = new Map(
    values[0].map((header, index) => [String(header ?? '').trim().toLowerCase(), index]),
  )
  const missing = REQUIRED_COLUMNS.filter((column) => !headerIndexes.has(column.toLowerCase()))
  if (missing.length) {
    throw new Error(`Missing required columns: ${missing.join(', ')}. Required: ${REQUIRED_COLUMNS.join(', ')}.`)
  }

  return values.slice(1)
    .filter((cells) => REQUIRED_COLUMNS.some((column) => cells[headerIndexes.get(column.toLowerCase())] != null && cells[headerIndexes.get(column.toLowerCase())] !== ''))
    .map((cells) => Object.fromEntries(REQUIRED_COLUMNS.map((column) => {
      const value = cells[headerIndexes.get(column.toLowerCase())]
      const normalized = column === 'Date'
        ? formatExcelDate(value)
        : ['Line', 'Buyer', 'Style'].includes(column) && typeof value === 'string'
          ? value.trim()
          : value
      return [column, normalized]
    })))
}
