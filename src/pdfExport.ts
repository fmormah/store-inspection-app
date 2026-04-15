import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export type PdfMeta = {
  brand: string
  location: string
  manager: string
  inspector: string
  date: string
}

export type PdfRow = {
  category: string
  question: string
  answer: string
  comments: string
  action: string
  photo: string
}

function safeFileSegment(s: string) {
  return s.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-').trim() || 'report'
}

/** Builds a downloadable inspection report PDF in the browser (no server). */
export function exportInspectionPdf(meta: PdfMeta, rows: PdfRow[], stats: { yes: number; no: number; unanswered: number }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 14
  let y = 18

  doc.setFontSize(18)
  doc.text('Store Inspection Report', margin, y)
  y += 10

  doc.setFontSize(10)
  doc.text(`Brand: ${meta.brand || '—'}`, margin, y)
  y += 5
  doc.text(`Location: ${meta.location || '—'}`, margin, y)
  y += 5
  doc.text(`Store Manager: ${meta.manager || '—'}`, margin, y)
  y += 5
  doc.text(`Inspected By: ${meta.inspector || '—'}`, margin, y)
  y += 5
  doc.text(`Date: ${meta.date || '—'}`, margin, y)
  y += 8

  doc.setFontSize(9)
  doc.text(`Summary — Yes: ${stats.yes}   No: ${stats.no}   Unanswered: ${stats.unanswered}`, margin, y)
  y += 6

  autoTable(doc, {
    startY: y,
    head: [['Category', 'Question', 'Answer', 'Comments', 'Action', 'Photo']],
    body: rows.map((r) => [r.category, r.question, r.answer, r.comments, r.action, r.photo]),
    styles: { fontSize: 7, cellPadding: 1.5, valign: 'top', overflow: 'linebreak' },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 52 },
      2: { cellWidth: 14 },
      3: { cellWidth: 32 },
      4: { cellWidth: 32 },
      5: { cellWidth: 12 },
    },
    margin: { left: margin, right: margin },
  })

  const base = [meta.brand, meta.location, meta.date].filter(Boolean).map(safeFileSegment).join('-') || 'store-inspection'
  doc.save(`${base}.pdf`)
}
