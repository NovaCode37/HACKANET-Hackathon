import { mockHeatmapData } from "@/lib/mock";
import Link from "next/link";

function deviationColor(value: number) {
    if (value === 0) return 'bg-green-100 text-green-700'
    if (value <= 0.3) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
}

export default function Heatmap({params} : {params : {id : string, categoryId : string}}) {

    const data = mockHeatmapData

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Тепловая карта</h1>
            <Link href={`/competitions/${params.id}`} className="text-blue-600 underline">Назад</Link>
            <table className="border-collapse">
                <thead>
                    <tr>
                        <th className="border px-3 py-2"></th>
                        {data.regions.map((reg) => (
                            <th key={reg} className="border px-3 py-2">{reg}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.judges.map((jud) => (
                        <tr key={jud.id}>
                            <td className="border px-3 py-2">{jud.fio}</td>
                            {data.regions.map(r => {
                                const cell = data.cells.find(c => c.referee_id === jud.id && c.region === r)
                                const value = cell?.avg_deviation ?? 0
                                return (
                                    <td key={r} className={`border px-3 py-2 text-center ${deviationColor(value)}`}>
                                        {value}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}