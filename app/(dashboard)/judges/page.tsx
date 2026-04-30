"use client"

import { useState } from "react"
import { mockJudges } from "@/lib/mock"
import Link from "next/link"

function accuracyColor(value: number) {
    if (value === 0) return 'text-slate-400'
    if (value >= 80) return 'text-green-600 font-medium'
    if (value >= 60) return 'text-yellow-600 font-medium'
    return 'text-red-600 font-medium'
}

export default function JudgesPage() {
    const [query, setQuery] = useState('')

    const filtered = mockJudges.filter(j =>
        j.fio.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Судьи</h1>

            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск по ФИО..."
                className="border rounded px-3 py-2 w-full max-w-md"
            />

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border px-3 py-2 text-left">ФИО</th>
                        <th className="border px-3 py-2 text-left">Регион</th>
                        <th className="border px-3 py-2 text-left">Город</th>
                        <th className="border px-3 py-2">% исп.</th>
                        <th className="border px-3 py-2">% арт.</th>
                        <th className="border px-3 py-2">Предвзятость</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(jud => (
                        <tr key={jud.id} className="hover:bg-slate-50">
                            <td className="border px-3 py-2">
                                <Link href={`/judges/${jud.id}`} className="text-blue-600 hover:underline">
                                    {jud.fio}
                                </Link>
                            </td>
                            <td className="border px-3 py-2">{jud.region}</td>
                            <td className="border px-3 py-2">{jud.city}</td>
                            <td className={`border px-3 py-2 text-center ${accuracyColor(jud.execution_accuracy)}`}>
                                {jud.execution_accuracy ? `${jud.execution_accuracy}%` : '—'}
                            </td>
                            <td className={`border px-3 py-2 text-center ${accuracyColor(jud.artistic_accuracy)}`}>
                                {jud.artistic_accuracy ? `${jud.artistic_accuracy}%` : '—'}
                            </td>
                            <td className="border px-3 py-2 text-center">{jud.bias_coefficient}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
