"use client"

import { useState } from "react"
import { mockJudges } from "@/lib/mock"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

function accuracyBarColor(value: number) {
  if (value === 0) return 'bg-slate-200'
  if (value >= 80) return 'bg-green-400'
  if (value >= 60) return 'bg-yellow-400'
  return 'bg-red-400'
}

function biasColor(value: number) {
  if (Math.abs(value) < 0.1) return 'text-slate-600'
  return value > 0 ? 'text-red-500' : 'text-green-600'
}

export default function JudgesPage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const filtered = mockJudges.filter(j =>
    j.fio.toLowerCase().includes(query.toLowerCase())
  )

  const accuracy = (j: typeof mockJudges[0]) =>
    j.execution_accuracy > 0 ? j.execution_accuracy : j.artistic_accuracy

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-start justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Судьи</h1>
          <p className="text-sm text-slate-400 mt-0.5">Список судей и их показатели</p>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по ФИО..."
            className="border rounded-full pl-8 pr-4 py-2 text-sm w-56 focus:outline-none focus:border-blue-400"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
        {filtered.map((j, i) => {
          const acc = accuracy(j)
          return (
            <motion.div
              key={j.id}
              onClick={() => router.push(`/judges/${j.id}`)}
              className="bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-semibold text-slate-800">{j.fio}</p>
                  <p className="text-xs text-slate-400">{j.city}, {j.region}</p>
                </div>
                <span className="text-slate-400 text-lg">›</span>
              </div>

              <div className="flex gap-6 mt-3 mb-3 text-xs">
                <div>
                  <p className="text-slate-400">Точность</p>
                  <p className={`font-semibold ${acc >= 80 ? 'text-green-600' : acc >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {acc > 0 ? `${acc} %` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Предвзятость</p>
                  <p className={`font-semibold ${biasColor(j.bias_coefficient)}`}>
                    {j.bias_coefficient > 0 ? '+' : ''}{j.bias_coefficient.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Оценки</p>
                  <p className="font-semibold text-slate-700">{j.total_assessments}</p>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${accuracyBarColor(acc)}`}
                  style={{ width: `${acc}%` }}
                />
              </div>
            </motion.div>
          )
        })}
        </AnimatePresence>
      </div>
    </div>
  )
}
