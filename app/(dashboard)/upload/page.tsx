"use client"

import { useState } from "react"

type Step = 'referees' | 'performances' | 'assessments'

const steps: { key: Step; label: string }[] = [
    { key: 'referees', label: '1. Судьи (referee.csv)' },
    { key: 'performances', label: '2. Выступления (performances.csv)' },
    { key: 'assessments', label: '3. Оценки (assessments.csv)' },
]

export default function UploadPage() {
    const [files, setFiles] = useState<Record<Step, File | null>>({
        referees: null,
        performances: null,
        assessments: null,
    })
    const [status, setStatus] = useState<string>('')
    const [loading, setLoading] = useState(false)

    function handleFile(step: Step, file: File | null) {
        setFiles(prev => ({ ...prev, [step]: file }))
    }

    async function handleUpload() {
        if (!files.referees || !files.performances || !files.assessments) {
            setStatus('Загрузите все три файла')
            return
        }
        setLoading(true)
        setStatus('Загрузка...')
        try {
            const fd = new FormData()
            fd.append('referees', files.referees)
            fd.append('performances', files.performances)
            fd.append('assessments', files.assessments)

            const res = await fetch('/api/upload', { method: 'POST', body: fd })
            if (!res.ok) throw new Error('Ошибка загрузки')
            setStatus('Файлы успешно загружены')
        } catch (e) {
            setStatus('Ошибка: ' + (e instanceof Error ? e.message : 'неизвестная'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-bold">Загрузка данных</h1>
            <p className="text-slate-600 text-sm">
                Загрузите CSV-файлы в указанном порядке. Дубли исключаются автоматически.
            </p>

            <div className="space-y-4">
                {steps.map(s => (
                    <div key={s.key} className="border rounded p-4">
                        <label className="block font-medium mb-2">{s.label}</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={e => handleFile(s.key, e.target.files?.[0] ?? null)}
                            className="block w-full text-sm"
                        />
                        {files[s.key] && (
                            <p className="text-xs text-slate-500 mt-1">Выбран: {files[s.key]!.name}</p>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                {loading ? 'Загрузка...' : 'Загрузить'}
            </button>

            {status && <p className="text-sm">{status}</p>}
        </div>
    )
}
