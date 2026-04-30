"use client"

import { useState } from "react"
import { mockCompetitions } from "@/lib/mock"
import { useRouter } from "next/navigation"
import Navbar from "./(dashboard)/components/Navbar"
import { motion, AnimatePresence } from "framer-motion"

type FilterType = 'all' | 'RUSSIA' | 'REGION'

const last5 = mockCompetitions.slice(-5)

export default function Home() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>('all')
  const [query, setQuery] = useState('')

  const filtered = last5.filter(c => {
    const matchesType = filter === 'all' || c.type === filter
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 text-white px-8 pt-16 pb-28">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Система судейской аналитики<br />и цифровизации
          </motion.h1>
          <motion.p
            className="text-blue-100 max-w-xl text-sm leading-relaxed"
            style={{ fontFamily: 'var(--font-nunito-sans)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Анализ точности и предвзятости судей на базе экосистемы Aqua Aerobic Space.<br />
            Инструменты для ООО «Дот Спейс» и спортивных федераций.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* Таблица */}
      <div className="max-w-5xl mx-auto px-8 -mt-4 relative z-10 pb-16">
        <motion.div
          className="bg-white rounded-2xl shadow-sm p-6 border-0 outline-none"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-lg font-bold text-slate-800">Статистика последних турниров</h2>
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
                    transition={{ duration: 0.25, delay: i * 0.05 }}
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
        </motion.div>
      </div>
    </div>
  )
}
