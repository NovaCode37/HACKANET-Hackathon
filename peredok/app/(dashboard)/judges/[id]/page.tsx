"use client"

import { useState } from "react"
import { mockJudgeProfile } from "@/lib/mock"
import Link from "next/link"
import type { JudgeType, AccuracyCategory } from "@/lib/types"

function accuracyBg(cat: AccuracyCategory) {
    if (cat === 'bullseye') return 'bg-green-100 text-green-700'
    if (cat === 'allowable') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
}

function accuracyColor(value: number) {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
}

export default function JudgeProfilePage({ params }: { params: { id: string } }) {
    const data = mockJudgeProfile

    const [tab, setTab] = useState<JudgeType>('EXECUTION')
    const [discipline, setDiscipline] = useState('')
    const [age, setAge] = useState('')
    const [competition, setCompetition] = useState('')

    const disciplines = Array.from(new Set(data.performances.map(p => p.performance.discipline)))
    const ages = Array.from(new Set(data.performances.map(p => p.performance.age_category)))
    const competitions = Array.from(new Set(data.performances.map(p => p.performance.competition)))

    const filtered = data.performances.filter(p =>
        p.type === tab &&
        (discipline === '' || p.performance.discipline === discipline) &&
        (age === '' || p.performance.age_category === age) &&
        (competition === '' || p.performance.competition === competition)
    )

    return (
        <div className="space-y-6">
            <Link href="/judges" className="text-blue-600 underline">← Назад</Link>

            <div>
                <h1 className="text-2xl font-bold">{data.referee.fio}</h1>
                <p className="text-slate-600">{data.referee.region}, {data.referee.city}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">Точность исполнения</p>
                    <p className={`text-2xl font-bold ${accuracyColor(data.execution_accuracy)}`}>{data.execution_accuracy}%</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">Точность артистизма</p>
                    <p className={`text-2xl font-bold ${accuracyColor(data.artistic_accuracy)}`}>{data.artistic_accuracy}%</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">Коэф. предвзятости</p>
                    <p className="text-2xl font-bold">{data.bias_coefficient}</p>
                </div>
            </div>

            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setTab('EXECUTION')}
                    className={`px-4 py-2 ${tab === 'EXECUTION' ? 'border-b-2 border-blue-600 font-bold' : 'text-slate-500'}`}>
                    Исполнение
                </button>
                <button
                    onClick={() => setTab('ARTISTIC')}
                    className={`px-4 py-2 ${tab === 'ARTISTIC' ? 'border-b-2 border-blue-600 font-bold' : 'text-slate-500'}`}>
                    Артистизм
                </button>
            </div>

            <div className="flex gap-3">
                <select value={discipline} onChange={e => setDiscipline(e.target.value)} className="border rounded px-2 py-1">
                    <option value="">Все дисциплины</option>
                    {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={age} onChange={e => setAge(e.target.value)} className="border rounded px-2 py-1">
                    <option value="">Все возрасты</option>
                    {ages.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select value={competition} onChange={e => setCompetition(e.target.value)} className="border rounded px-2 py-1">
                    <option value="">Все соревнования</option>
                    {competitions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border px-3 py-2 text-left">Соревнование</th>
                        <th className="border px-3 py-2 text-left">Дисциплина</th>
                        <th className="border px-3 py-2 text-left">Возраст</th>
                        <th className="border px-3 py-2">Моя оценка</th>
                        <th className="border px-3 py-2">Другие</th>
                        <th className="border px-3 py-2">Итог</th>
                        <th className="border px-3 py-2">Отклонение</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(p => (
                        <tr key={p.performance.id}>
                            <td className="border px-3 py-2">{p.performance.competition}</td>
                            <td className="border px-3 py-2">{p.performance.discipline}</td>
                            <td className="border px-3 py-2">{p.performance.age_category}</td>
                            <td className="border px-3 py-2 text-center">{p.my_score}</td>
                            <td className="border px-3 py-2 text-center">{p.other_scores.join(', ')}</td>
                            <td className="border px-3 py-2 text-center">{p.result_score}</td>
                            <td className={`border px-3 py-2 text-center ${accuracyBg(p.accuracy)}`}>{p.deviation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
