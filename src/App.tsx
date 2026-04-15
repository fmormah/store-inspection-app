import { useState } from 'react'
import { exportInspectionPdf } from './pdfExport'

const IconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Camera({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
function Check({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
function Save({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}
function X({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
function MapPin({ className }: { className?: string }) {
  return (
    <svg className={className} {...IconProps}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const INSPECTION_CATEGORIES = [
  {
    id: 'lighting',
    title: 'Lighting',
    questions: [
      { id: 'l1', text: 'Are all lights on shop floor working?' },
      { id: 'l2', text: 'Are all window lights working?' },
      { id: 'l3', text: 'Are the display lights working?' },
      { id: 'l4', text: 'Is the colour temperature consistent?' },
      { id: 'l5', text: 'Is there any light flickering present?' },
      { id: 'l6', text: 'Is the back-office lighting working?' },
      { id: 'l7', text: 'Are the lighting controls and sensors working correctly?' },
    ],
  },
  {
    id: 'flooring',
    title: 'Flooring and Finishes',
    questions: [
      { id: 'f1', text: 'Is the floor free from dust, debris, stains or spill marks?' },
      { id: 'f2', text: 'Are there visible scratches, chips, cracks or worn patches in high-traffic areas?' },
      { id: 'f3', text: 'Are transitions between flooring types (wood to tile, tile to carpet) seamless and aligned?' },
      { id: 'f4', text: 'Are grout lines clean and consistent in colour?' },
      { id: 'f5', text: 'Are any tiles or planks misaligning, lifting or uneven?' },
      { id: 'f6', text: 'Are there any trip hazards, raised edges or uneven surfaces?' },
      { id: 'f7', text: 'Are mats or rugs secure, flat and positioned correctly?' },
      { id: 'f8', text: 'Are wet areas (entrance, fitting room, or back office) being monitored and dried promptly?' },
      { id: 'f9', text: 'Are there signs of water damage, swelling or warping near entrances or windows?' },
      { id: 'f10', text: 'Has the store reported any recurring flooring issues?' },
    ],
  },
  {
    id: 'windows_glass',
    title: 'Windows, Mirrors and Glass',
    questions: [
      { id: 'w1', text: 'Any visible damage to the windows?' },
      { id: 'w2', text: 'Are the window frames in good condition?' },
      { id: 'w3', text: 'Are there any cracks visible on mirrors or glass?' },
      { id: 'w4', text: 'Are there any smudges on the mirrors or glass?' },
      { id: 'w5', text: 'Any loose frames located in store?' },
      { id: 'w6', text: 'Are there any cracks or scratches on the display cases in store?' },
      { id: 'w7', text: 'Are glass elements (tops, shelves, cases) secure and free from cracks, chips or scratches?' },
      { id: 'w8', text: 'Has the store reported any recurring issues with their windows, mirrors and glass in store?' },
    ],
  },
  {
    id: 'doors',
    title: 'Doors',
    questions: [
      { id: 'd1', text: 'Do doors open and close smoothly?' },
      { id: 'd2', text: 'Any unusual noise (grinding, clicking or scraping)?' },
      { id: 'd3', text: 'Are door closers functioning correctly?' },
      { id: 'd4', text: 'Are soft close mechanisms working?' },
      { id: 'd5', text: 'Are the doors properly aligned with no gaps?' },
      { id: 'd6', text: 'Are thresholds clean and free of trip hazards?' },
      { id: 'd7', text: 'Are handles clean, secure and aligned?' },
      { id: 'd8', text: 'Are frames free from dents, scuffs, or peeling finish?' },
      { id: 'd9', text: 'Do hinges squeak or feel loose?' },
      { id: 'd10', text: 'Are locks and latches working properly?' },
      { id: 'd11', text: 'Any visible damage to frames, handles or finishes?' },
      { id: 'd12', text: 'Are kick plates secure and undamaged?' },
      { id: 'd13', text: 'Is the access control working correctly?' },
    ],
  },
  {
    id: 'furniture',
    title: 'Furniture and Fixtures',
    questions: [
      { id: 'ff1', text: 'Are all furniture pieces (seating, tables and display units) clean, scratch-free, and well maintained?' },
      { id: 'ff2', text: 'Any chips, dents, worn edges, or visible damage?' },
      { id: 'ff3', text: 'Are leather, fabric, or upholstered items free from stains, sagging, or fading?' },
      { id: 'ff4', text: 'Are there any wobbly table legs?' },
      { id: 'ff5', text: 'Is there any worn or damaged seating?' },
      { id: 'ff6', text: 'Is there any unstable shelving?' },
      { id: 'ff7', text: 'Are the shelving or display cases level?' },
      { id: 'ff8', text: 'Any loose screws on furniture?' },
      { id: 'ff9', text: 'Are heavy fixtures properly weighted or fixed to prevent tipping?' },
      { id: 'ff10', text: 'Are mirrors, frames and shelving aligned and flush with the wall?' },
      { id: 'ff11', text: 'Is there any sticky residue, stains or cleaning streaks?' },
    ],
  },
  {
    id: 'temperature',
    title: 'Temperature and Ambience',
    questions: [
      { id: 't1', text: 'Is the HVAC delivering consistent temperatures?' },
      { id: 't2', text: 'Is the HVAC too noisy and making any unusual noises?' },
      { id: 't3', text: 'Any active BMS alerts or error codes?' },
      { id: 't4', text: 'Does the system respond correctly when adjustments are made?' },
      { id: 't5', text: 'Are the vents blocked by any fixtures or merchandise?' },
      { id: 't6', text: 'Any recent issues with cooling or heating?' },
      { id: 't7', text: 'Is the comms room at a reasonable temperature?' },
      { id: 't8', text: 'Any noticeable cold or hot spots?' },
      { id: 't9', text: 'Any drafts near the entrance or elsewhere in store?' },
      { id: 't10', text: 'Are there any noticeable odours?' },
    ],
  },
  {
    id: 'walls',
    title: 'Walls',
    questions: [
      { id: 'wl1', text: 'Any visible cracks, scratches, chips or peeling paint?' },
      { id: 'wl2', text: 'Any visible bubbling on the paint?' },
      { id: 'wl3', text: 'Are there any areas where the paint looks faded or patchy?' },
      { id: 'wl4', text: 'Any marks from merchandise or furniture that needs cleaning or repainting?' },
      { id: 'wl5', text: 'Are there any signs of damp, mould or water staining?' },
      { id: 'wl6', text: 'Any sign of condensation or moisture near external walls?' },
      { id: 'wl7', text: 'Are wall mounted fixtures secure, level and free from damage?' },
      { id: 'wl8', text: 'Are there any holes from previous fixtures or signage?' },
      { id: 'wl9', text: 'Are electrical outlets, switches and trunking flush and properly installed?' },
    ],
  },
  {
    id: 'ceiling',
    title: 'Ceiling',
    questions: [
      { id: 'c1', text: 'Is the ceiling clean, and free from stains, marks or discoloration?' },
      { id: 'c2', text: 'Are there any cracks, sagging areas or visible issues?' },
      { id: 'c3', text: 'Are ceiling tiles aligned, flush, and consistent in colour and texture?' },
      { id: 'c4', text: 'Signs of leaks, water ingress or damp patches?' },
      { id: 'c5', text: 'Are there any missing ceiling tiles?' },
      { id: 'c6', text: 'Are ceiling access panels secure, clean and properly closed?' },
      { id: 'c7', text: 'Are any ceiling-mounted speakers, cameras, or sensors aligned or undamaged?' },
      { id: 'c8', text: 'Any loose cables or trays hanging from ceiling?' },
      { id: 'c9', text: 'Are there dust accumulations around the vents and lighting fixtures?' },
      { id: 'c10', text: 'Are smoke detectors, fire alarms and emergency lights securely mounted?' },
      { id: 'c11', text: 'Has the store reported recurring ceiling issues (leaks or tiles shifting)?' },
    ],
  },
  {
    id: 'stockroom',
    title: 'Back Office – Stock Room',
    questions: [
      { id: 'sr1', text: 'Is the stock room tidy, structured, and free of clutter?' },
      { id: 'sr2', text: 'Are the aisles clear and wide enough for safe movement?' },
      { id: 'sr3', text: 'Are shelves, racks and storage units clean and well maintained?' },
      { id: 'sr4', text: 'Are ladders, trolleys, and equipment in good condition?' },
      { id: 'sr5', text: 'Are electrical panels and risers accessible?' },
      { id: 'sr6', text: 'Are temperature/humidity levels appropriate for product care?' },
    ],
  },
  {
    id: 'kitchen',
    title: 'Back Office - Kitchens/Break Areas',
    questions: [
      { id: 'k1', text: 'Are kettles, microwaves, and other appliances functioning?' },
      { id: 'k2', text: 'Are electrical cables and sockets safe and tidy?' },
      { id: 'k3', text: 'Are cleaning products stored safely and labelled?' },
    ],
  },
  {
    id: 'toilets',
    title: 'Back Office - Toilets',
    questions: [
      { id: 'to1', text: 'Are toilets clean, odour-free and regularly serviced?' },
      { id: 'to2', text: 'Are sinks, taps, and counters spotless and free from limescale?' },
      { id: 'to3', text: 'Do taps, flushes, dryers and dispensers work properly?' },
      { id: 'to4', text: 'Are there any leaks, blockages, or maintenance issues?' },
    ],
  },
] as const

type QuestionId = (typeof INSPECTION_CATEGORIES)[number]['questions'][number]['id']

type ResponseRow = {
  answer?: 'yes' | 'no'
  comments?: string
  action?: string
  photoUrl?: string | null
}

type Meta = {
  brand: string
  location: string
  manager: string
  inspector: string
  date: string
}

export default function App() {
  const [meta, setMeta] = useState<Meta>({
    brand: '',
    location: '',
    manager: '',
    inspector: '',
    date: new Date().toISOString().split('T')[0] ?? '',
  })

  const [responses, setResponses] = useState<Partial<Record<QuestionId, ResponseRow>>>({})
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [exportFeedback, setExportFeedback] = useState<'idle' | 'exported'>('idle')

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMeta((m) => ({ ...m, [name]: value }))
  }

  const handleResponse = (questionId: QuestionId, field: keyof ResponseRow, value: ResponseRow[typeof field]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }))
  }

  const handlePhotoUpload = (questionId: QuestionId, file: File | undefined) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleResponse(questionId, 'photoUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (questionId: QuestionId) => {
    handleResponse(questionId, 'photoUrl', null)
  }

  const calculateProgress = (categoryId: string) => {
    const category = INSPECTION_CATEGORIES.find((c) => c.id === categoryId)
    if (!category || !category.questions.length) return 0
    const answered = category.questions.filter((q) => responses[q.id]?.answer).length
    return Math.round((answered / category.questions.length) * 100)
  }

  const totalQuestionCount = INSPECTION_CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0)

  const computeAnswerStats = () => {
    let yes = 0
    let no = 0
    let unanswered = 0
    for (const cat of INSPECTION_CATEGORIES) {
      for (const q of cat.questions) {
        const a = responses[q.id]?.answer
        if (a === 'yes') yes++
        else if (a === 'no') no++
        else unanswered++
      }
    }
    return { yes, no, unanswered }
  }

  const buildPdfRows = () => {
    return INSPECTION_CATEGORIES.flatMap((cat) =>
      cat.questions.map((q) => {
        const r = responses[q.id]
        return {
          category: cat.title,
          question: q.text,
          answer: r?.answer ? r.answer.toUpperCase() : '',
          comments: r?.comments ?? '',
          action: r?.action ?? '',
          photo: r?.photoUrl ? 'Yes' : '',
        }
      }),
    )
  }

  const handleExportPdf = () => {
    const metaComplete =
      meta.brand.trim() && meta.location.trim() && meta.manager.trim() && meta.inspector.trim() && meta.date
    if (!metaComplete) {
      window.alert('Please fill in Brand, Location, Store Manager, Inspected By, and Date before exporting a PDF.')
      return
    }

    const stats = computeAnswerStats()
    if (stats.unanswered > 0) {
      const ok = window.confirm(
        `${stats.unanswered} question(s) are still unanswered. Export PDF anyway?`,
      )
      if (!ok) return
    }

    exportInspectionPdf(meta, buildPdfRows(), stats)
    setExportFeedback('exported')
    setTimeout(() => setExportFeedback('idle'), 2500)
  }

  const renderHome = () => (
    <div className="space-y-6 pb-20">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center text-lg font-bold text-slate-800">
          <MapPin className="mr-2 h-5 w-5 text-blue-600" /> Store Details
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Brand</label>
            <input
              type="text"
              name="brand"
              value={meta.brand}
              onChange={handleMetaChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Gucci"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Location</label>
            <input
              type="text"
              name="location"
              value={meta.location}
              onChange={handleMetaChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Bond Street"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Store Manager</label>
            <input
              type="text"
              name="manager"
              value={meta.manager}
              onChange={handleMetaChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              placeholder="Manager Name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Inspected By</label>
            <input
              type="text"
              name="inspector"
              value={meta.inspector}
              onChange={handleMetaChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Date</label>
            <input
              type="date"
              name="date"
              value={meta.date}
              onChange={handleMetaChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 px-1 text-lg font-bold text-slate-800">Inspection Areas</h2>
        <div className="space-y-3">
          {INSPECTION_CATEGORIES.map((category) => {
            const progress = calculateProgress(category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 active:scale-[0.98]"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{category.title}</h3>
                  <div className="mt-2 flex items-center">
                    <div className="mr-3 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-10 text-xs font-medium text-slate-500">{progress}%</span>
                  </div>
                </div>
                <ChevronRight className="ml-4 h-6 w-6 shrink-0 text-slate-400" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderCategory = () => {
    const category = INSPECTION_CATEGORIES.find((c) => c.id === activeCategory)
    if (!category) return null

    return (
      <div className="space-y-6 pb-24">
        {category.questions.map((q, index) => {
          const response = responses[q.id] ?? {}
          const isAnswered = !!response.answer

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-5 shadow-sm transition-all ${
                isAnswered ? 'border-slate-200 bg-white' : 'border-blue-100 bg-white ring-1 ring-blue-50'
              }`}
            >
              <div className="mb-4 flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {index + 1}
                </div>
                <h4 className="font-medium leading-snug text-slate-800">{q.text}</h4>
              </div>

              <div className="mb-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleResponse(q.id, 'answer', 'yes')}
                  className={`flex flex-1 items-center justify-center rounded-lg border-2 py-3 font-semibold transition-all ${
                    response.answer === 'yes'
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {response.answer === 'yes' && <Check className="mr-2 h-4 w-4" />} YES
                </button>
                <button
                  type="button"
                  onClick={() => handleResponse(q.id, 'answer', 'no')}
                  className={`flex flex-1 items-center justify-center rounded-lg border-2 py-3 font-semibold transition-all ${
                    response.answer === 'no'
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {response.answer === 'no' && <X className="mr-2 h-4 w-4" />} NO
                </button>
              </div>

              {isAnswered && (
                <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                      Comments (Location & Details)
                    </label>
                    <textarea
                      rows={2}
                      value={response.comments ?? ''}
                      onChange={(e) => handleResponse(q.id, 'comments', e.target.value)}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add observations here..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Action Taken / Recommended</label>
                    <textarea
                      rows={2}
                      value={response.action ?? ''}
                      onChange={(e) => handleResponse(q.id, 'action', e.target.value)}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Raised ticket with maintenance. ETA 12/04."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Evidence Photo</label>
                    {response.photoUrl ? (
                      <div className="relative inline-block">
                        <img src={response.photoUrl} alt="Issue" className="h-32 w-32 rounded-lg border border-slate-200 object-cover shadow-sm" />
                        <button
                          type="button"
                          onClick={() => removePhoto(q.id)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 p-4 text-slate-500 transition-all hover:border-blue-400 hover:bg-slate-50 hover:text-blue-600">
                        <Camera className="h-5 w-5" />
                        <span className="text-sm font-medium">Take Photo or Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(q.id, e.target.files?.[0])}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-10 bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-3">
            {activeCategory ? (
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="-ml-2 rounded-full p-2 transition-colors hover:bg-slate-800"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            ) : (
              <AlertCircle className="h-6 w-6 shrink-0 text-blue-400" />
            )}
            <h1 className="truncate text-lg font-bold tracking-tight">
              {activeCategory ? INSPECTION_CATEGORIES.find((c) => c.id === activeCategory)?.title : 'Store Inspection Walk'}
            </h1>
          </div>

          {!activeCategory && (
            <button
              type="button"
              onClick={handleExportPdf}
              className="flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold shadow-sm transition-all hover:bg-blue-500 active:scale-95 sm:px-4"
              title={`Export full checklist (${totalQuestionCount} questions) as PDF`}
            >
              {exportFeedback === 'exported' ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {exportFeedback === 'exported' ? 'Downloaded' : 'Export PDF'}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto mt-2 max-w-3xl p-4">{activeCategory ? renderCategory() : renderHome()}</main>

      {activeCategory && (
        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="mr-4 flex-1">
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>Category Progress</span>
                <span>{calculateProgress(activeCategory)}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${calculateProgress(activeCategory)}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="shrink-0 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
