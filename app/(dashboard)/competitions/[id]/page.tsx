import { mockCompetitionDetail } from "@/lib/mock"
import Link from "next/link"

function accuracyColor(value: number) {
    if (value >= 80) return 'text-green-600 font-medium'
    if (value >= 60) return 'text-yellow-600 font-medium'
    return 'text-red-600 font-medium'
}

export default function CompetitionPage({ params }: { params: { id: string } }) {
    const data = mockCompetitionDetail

    return (
        <div className="space-y-6">
            <Link href="/competitions" className="text-blue-600 underline">← Назад</Link>

            <div>
                <h1 className="text-2xl font-bold">{data.name}</h1>
                <p className="text-slate-600">{data.type}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">Выступлений</p>
                    <p className="text-2xl font-bold">{data.performance_count}</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">Ср. оценка</p>
                    <p className="text-2xl font-bold">{data.avg_scrores}</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">% исполнения</p>
                    <p className={`text-2xl font-bold ${accuracyColor(data.execution_accuracy)}`}>{data.execution_accuracy}%</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-slate-500">% артистизма</p>
                    <p className={`text-2xl font-bold ${accuracyColor(data.artistic_accuracy)}`}>{data.artistic_accuracy}%</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-3">Категории</h2>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="border px-3 py-2 text-left">Дисциплина</th>
                            <th className="border px-3 py-2 text-left">Возраст</th>
                            <th className="border px-3 py-2">Выступлений</th>
                            <th className="border px-3 py-2">% исп.</th>
                            <th className="border px-3 py-2">% арт.</th>
                            <th className="border px-3 py-2">Девиация</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-slate-50">
                                <td className="border px-3 py-2">
                                    <Link href={`/competitions/${params.id}/${cat.id}`} className="text-blue-600 hover:underline">
                                        {cat.discipline}
                                    </Link>
                                </td>
                                <td className="border px-3 py-2">{cat.age_category}</td>
                                <td className="border px-3 py-2 text-center">{cat.performance_count}</td>
                                <td className={`border px-3 py-2 text-center ${accuracyColor(cat.execution_accuracy)}`}>
                                    {cat.execution_accuracy}%
                                </td>
                                <td className={`border px-3 py-2 text-center ${accuracyColor(cat.artistic_accuracy)}`}>
                                    {cat.artistic_accuracy}%
                                </td>
                                <td className="border px-3 py-2 text-center">{cat.deviation_coefficient}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
