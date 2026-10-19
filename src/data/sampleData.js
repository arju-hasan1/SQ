const lines = ['Line 01', 'Line 02', 'Line 03', 'Line 04', 'Line 05']
const buyers = ['Northstar', 'Everlane', 'Morrow & Co.']
const styles = ['ST-2401 · Classic Tee', 'ST-2402 · Everyday Polo', 'ST-2403 · Relaxed Shirt']
const dates = ['2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-11', '2025-04-12']

export const sampleData = lines.flatMap((line, lineIndex) =>
  dates.map((Date, dayIndex) => {
    const Target = 960 + ((lineIndex * 73 + dayIndex * 41) % 180)
    const Produced = Math.round(Target * (0.78 + ((lineIndex + dayIndex) % 5) * 0.055))
    const Defects = Math.round(Produced * (0.012 + ((lineIndex * 2 + dayIndex) % 4) * 0.003))
    const row = {
      Date,
      Line: line,
      Buyer: buyers[(lineIndex + dayIndex) % buyers.length],
      Style: styles[(lineIndex * 2 + dayIndex) % styles.length],
      Target,
      Produced,
      Defects,
    }

    if (lineIndex === 2 && dayIndex === 2) return { ...row, Defects: Produced + 16 }
    if (lineIndex === 4 && dayIndex === 5) return { ...row, Target: 0 }
    return row
  }),
)
