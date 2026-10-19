# Garments Production Report Dashboard

A responsive React dashboard for garment production reporting. It demonstrates Excel and CSV imports, data validation, pivot-style aggregation, KPI calculations, plain-CSS charts, and report export.

## Setup

```bash
npm install
npm run dev
```

To build the production bundle, run `npm run build`. To regenerate the downloadable example workbook, run `npm run make:sample`.

## Excel / CSV format

The first worksheet (or the first CSV row) must contain these columns. Header matching is case-insensitive and ignores surrounding spaces:

| Column | Expected values |
| --- | --- |
| Date | Excel date, JavaScript-readable date, or `yyyy-mm-dd` |
| Line | Sewing line name |
| Buyer | Buyer name |
| Style | Garment style |
| Target | Numeric planned quantity greater than zero |
| Produced | Numeric quantity greater than or equal to zero |
| Defects | Numeric quantity greater than or equal to zero and no greater than Produced |

The dashboard converts Excel dates to `yyyy-mm-dd`. Rows with invalid Target, Produced, or Defects values are listed in Data Validation and excluded from KPIs, pivot summaries, and charts. Additional columns are ignored.

## Features

- Built-in sample report with five sewing lines, six days, three buyers, three styles, and two intentionally invalid records.
- Excel (`.xlsx`, `.xls`) and CSV upload, with required-column feedback.
- Downloadable sample workbook at `public/sample-production.xlsx`.
- Total Target, Total Produced, Efficiency, and Defect Rate (DHU) KPIs.
- Line and Buyer filters with Line, Buyer, Style, and Date pivot grouping.
- Click-to-sort pivot table with weighted totals and efficiency highlighting.
- Pure HTML/CSS efficiency and Target vs Produced charts.
- Current pivot export to CSV, print-friendly report, and light/dark theme toggle that follows the system preference until toggled.
- Responsive layout with independently scrollable data tables.

## Project structure

```text
src/
  components/   Dashboard sections and tables
  data/         Built-in report sample
  utils/        Spreadsheet parsing, validation, pivot, and CSV export
  App.jsx
  main.jsx
  index.css
scripts/
  make-sample.js
public/
  sample-production.xlsx
```
