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
  /** Shown in the summary table */
  photo: string
  /** Base64 data URL from the app (embedded in appendix when present) */
  photoDataUrl?: string | null
}

function safeFileSegment(s: string) {
  return s.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-').trim() || 'report'
}

/** Load `public/app-logo.jpeg` (respects Vite `base` for GitHub Pages). */
async function fetchLogoAsDataUrl(): Promise<string | null> {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  try {
    const res = await fetch(`${base}app-logo.jpeg`)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onloadend = () => resolve(r.result as string)
      r.onerror = () => reject(new Error('read failed'))
      r.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function formatFromDataUrl(dataUrl: string): 'JPEG' | 'PNG' | 'WEBP' {
  if (dataUrl.startsWith('data:image/png')) return 'PNG'
  if (dataUrl.startsWith('data:image/webp')) return 'WEBP'
  return 'JPEG'
}

/** Append images after the checklist table, with labels and page breaks as needed. */
function appendPhotoEvidence(
  doc: jsPDF,
  margin: number,
  items: { category: string; question: string; dataUrl: string }[],
) {
  if (items.length === 0) return

  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxW = pageWidth - 2 * margin

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const last = (doc as any).lastAutoTable
  let y = last ? last.finalY + 14 : margin

  if (y > pageHeight - 50) {
    doc.addPage()
    y = margin
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Photo evidence', margin, y)
  y += 8
  doc.setFont('helvetica', 'normal')

  let index = 1
  for (const item of items) {
    const title = `${index}. [${item.category}] ${item.question}`
    const titleLines = doc.splitTextToSize(title, maxW)
    const titleH = titleLines.length * 4.2

    let displayH = 0
    let displayW = maxW
    try {
      const props = doc.getImageProperties(item.dataUrl)
      displayW = maxW
      displayH = (props.height * displayW) / props.width
      const maxH = 110
      if (displayH > maxH) {
        displayH = maxH
        displayW = (props.width * displayH) / props.height
      }
    } catch {
      displayH = 8
    }

    const blockH = titleH + displayH + 12
    if (y + blockH > pageHeight - margin) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(8.5)
    doc.setTextColor(30, 41, 59)
    doc.text(titleLines, margin, y)
    y += titleH + 2

    try {
      const fmt = formatFromDataUrl(item.dataUrl)
      doc.addImage(item.dataUrl, fmt, margin, y, displayW, displayH)
      y += displayH + 10
    } catch {
      doc.setFontSize(9)
      doc.setTextColor(180, 0, 0)
      doc.text('(This image could not be embedded in the PDF.)', margin, y + 4)
      doc.setTextColor(0, 0, 0)
      y += 12
    }

    index += 1
  }
}

/** Builds a downloadable inspection report PDF in the browser (no server). */
export async function exportInspectionPdf(
  meta: PdfMeta,
  rows: PdfRow[],
  stats: { yes: number; no: number; unanswered: number },
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = margin

  const logoData = await fetchLogoAsDataUrl()
  if (logoData) {
    try {
      const maxLogoW = 40
      const props = doc.getImageProperties(logoData)
      const logoW = maxLogoW
      const logoH = (props.height * logoW) / props.width
      const x = (pageWidth - logoW) / 2
      doc.addImage(logoData, formatFromDataUrl(logoData), x, y, logoW, logoH)
      y += logoH + 6
    } catch {
      y = margin + 4
    }
  } else {
    y = margin + 4
  }

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const title = 'Store Inspection Report'
  const titleW = doc.getTextWidth(title)
  doc.text(title, (pageWidth - titleW) / 2, y)
  doc.setFont('helvetica', 'normal')
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

  const hasPhotos = rows.some((r) => r.photoDataUrl)
  if (hasPhotos) {
    doc.setFontSize(8)
    doc.setTextColor(66, 66, 66)
    doc.text('* Full-size images for rows marked Yes* are in the “Photo evidence” section after the table.', margin, y)
    y += 6
    doc.setTextColor(0, 0, 0)
  }

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

  const photoItems = rows
    .filter((r) => r.photoDataUrl && r.photoDataUrl.startsWith('data:image'))
    .map((r) => ({
      category: r.category,
      question: r.question,
      dataUrl: r.photoDataUrl as string,
    }))

  appendPhotoEvidence(doc, margin, photoItems)

  const base = [meta.brand, meta.location, meta.date].filter(Boolean).map(safeFileSegment).join('-') || 'store-inspection'
  doc.save(`${base}.pdf`)
}
