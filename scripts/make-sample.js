import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as XLSX from 'xlsx'
import { sampleData } from '../src/data/sampleData.js'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(scriptDirectory, '../public/sample-production.xlsx')
const worksheet = XLSX.utils.json_to_sheet(sampleData, {
  header: ['Date', 'Line', 'Buyer', 'Style', 'Target', 'Produced', 'Defects'],
})
worksheet['!cols'] = [
  { wch: 13 }, { wch: 12 }, { wch: 18 }, { wch: 27 },
  { wch: 12 }, { wch: 12 }, { wch: 12 },
]
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'Production')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
XLSX.writeFile(workbook, outputPath)
console.log(`Created ${outputPath}`)
