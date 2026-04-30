"use client"

import { useState, useRef } from "react"

type Step = 'referees' | 'performances' | 'assessments'

const steps: { key: Step; label: string }[] = [
  { key: 'referees',     label: 'Судьи' },
  { key: 'performances', label: 'Выступления' },
  { key: 'assessments',  label: 'Оценки' },
]

export default function UploadPage() {
  const [files, setFiles] = useState<Record<Step, File | null>>({
    referees: null,
    performances: null,
    assessments: null,
  })
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    const name = file.name.toLowerCase()
    if (name.includes('referee') || name.includes('судь')) {
      setFiles(prev => ({ ...prev, referees: file }))
    } else if (name.includes('performance') || name.includes('выступ')) {
      setFiles(prev => ({ ...prev, performances: file }))
    } else if (name.includes('assessment') || name.includes('оценк')) {
      setFiles(prev => ({ ...prev, assessments: file }))
    } else {
      // assign to the first empty slot
      const slot = steps.find(s => !files[s.key])
      if (slot) setFiles(prev => ({ ...prev, [slot.key]: file }))
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    Array.from(e.dataTransfer.files).forEach(f => handleFile(f))
  }

  async function handleUpload() {
    if (!files.referees || !files.performances || !files.assessments) {
      setStatus('Загрузите все три файла')
      return
    }
    setLoading(true)
    setStatus('Загрузка...')
    try {
      for (const step of steps) {
        const fd = new FormData()
        fd.append('file', files[step.key]!)
        const res = await fetch(`/api/upload/${step.key}`, { method: 'POST', body: fd })
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.detail ?? `Ошибка загрузки (${step.label})`)
        }
      }
      setStatus('Файлы успешно загружены')
    } catch (e) {
      setStatus('Ошибка: ' + (e instanceof Error ? e.message : 'неизвестная'))
    } finally {
      setLoading(false)
    }
  }

  const allLoaded = files.referees && files.performances && files.assessments

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-16 flex flex-col items-center gap-4 cursor-pointer transition-colors ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-50/40 hover:bg-blue-50'
        }`}
      >
        <span className="text-5xl">📁</span>

        {!allLoaded ? (
          <p className="text-sm text-slate-600 text-center">
            Загрузите файлы в порядке :{' '}
            <span className="text-blue-600 font-medium">Судьи</span>
            {' → '}
            <span className="text-blue-600 font-medium">Выступления</span>
            {' → '}
            <span className="text-blue-600 font-medium">Оценки</span>
          </p>
        ) : (
          <p className="text-sm text-green-600 font-medium text-center">Все файлы готовы к загрузке</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple
          className="hidden"
          onChange={e => Array.from(e.target.files ?? []).forEach(f => handleFile(f))}
        />
      </div>

      {/* File status */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-3">
        {steps.map(s => (
          <div key={s.key} className={`border rounded-xl p-3 text-sm ${files[s.key] ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}>
            <p className="font-medium text-slate-700">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {files[s.key] ? files[s.key]!.name : 'Не загружен'}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !allLoaded}
        className="px-8 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Загрузка...' : 'Загрузить данные'}
      </button>

      {status && (
        <p className={`text-sm ${status.includes('успешно') ? 'text-green-600' : 'text-red-500'}`}>
          {status}
        </p>
      )}
    </div>
  )
}
