"use client"

import { useState } from "react"
import { mockCompetitions } from "@/lib/mock"
import Link from "next/link"

function accuracyColor(value: number) {
    if (value >= 80) return 'text-green-600 font-medium'
    if (value >= 60) return 'text-yellow-600 font-medium'
    return 'text-red-600 font-medium'
}

export default function CompetitionsPage() {
    const [query, setQuery] = useState('')

    const filtered = mockCompetitions.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Соревнования</h1>

            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="border rounded px-3 py-2 w-full max-w-md"
            />

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="border px-3 py-2 text-left">Наименование</th>
                        <th className="border px-3 py-2">Тип</th>
                        <th className="border px-3 py-2">Выступлений</th>
                        <th className="border px-3 py-2">Ср. оценка</th>
                        <th className="border px-3 py-2">% исп.</th>
                        <th className="border px-3 py-2">% арт.</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(comp => (
                        <tr key={comp.id} className="hover:bg-slate-50">
                            <td className="border px-3 py-2">
                                <Link href={`/competitions/${comp.id}`} className="text-blue-600 hover:underline">
                                    {comp.name}
                                </Link>
                            </td>
                            <td className="border px-3 py-2 text-center">{comp.type}</td>
                            <td className="border px-3 py-2 text-center">{comp.performance_count}</td>
                            <td className="border px-3 py-2 text-center">{comp.avg_scrores}</td>
                            <td className={`border px-3 py-2 text-center ${accuracyColor(comp.execution_accuracy)}`}>
                                {comp.execution_accuracy}%
                            </td>
                            <td className={`border px-3 py-2 text-center ${accuracyColor(comp.artistic_accuracy)}`}>
                                {comp.artistic_accuracy}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
