"use client"

import { useState, useEffect } from "react"
import { fetchCompetitions } from "@/lib/api"
import type { CompetitionListItem } from "@/lib/types"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type FilterType = 'all' | 'RUSSIA' | 'REGION'

export default function CompetitionsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>('all')
  const [query, setQuery] = useState('')
  const [competitions, setCompetitions] = useState<CompetitionListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompetitions().then(setCompetitions).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-[40vh] text-slate-400">Загрузка...</div>

  const filtered = competitions.filter(c => {
    const matchesType = filter === 'all' || c.type === filter
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-lg font-bold text-slate-800">Статистика турниров</h2>
          <div className="flex gap-1 text-sm">
            {([['all', 'Все'], ['RUSSIA', 'Россия'], ['REGION', 'Регион']] as [FilterType, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-1 rounded-full transition-colors ${filter === val ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по названию..."
            className="border rounded-full pl-8 pr-4 py-1.5 text-sm w-52 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 text-xs uppercase border-b-2 border-blue-200">
            <th className="text-left pb-3 font-medium">Наименования</th>
            <th className="text-left pb-3 font-medium">Тип</th>
            <th className="text-left pb-3 font-medium">Исполнение (%)</th>
            <th className="text-left pb-3 font-medium">Артистизм (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => (
              <motion.tr
                key={c.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/competitions/${c.id}`)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <td className="py-4 font-medium text-slate-800">{c.name}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.type === 'RUSSIA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {c.type === 'RUSSIA' ? 'Россия' : 'Регион'}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-blue-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${c.execution_accuracy}%` }} />
                    </div>
                    <span className="text-slate-700">{c.execution_accuracy}%</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-blue-100 rounded-full h-2">
                      <div className="bg-blue-300 h-2 rounded-full" style={{ width: `${c.artistic_accuracy}%` }} />
                    </div>
                    <span className="text-slate-700">{c.artistic_accuracy}%</span>
                  </div>
                </td>
                <td className="py-4 text-slate-400 text-lg">›</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
