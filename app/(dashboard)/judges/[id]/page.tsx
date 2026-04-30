"use client"

import { useState, useEffect, use } from "react"
import { fetchJudgeProfile } from "@/lib/api"
import type { JudgeProfile } from "@/lib/types"
import Link from "next/link"
import type { JudgeType, AccuracyCategory } from "@/lib/types"
import { motion } from "framer-motion"
import { disciplineName } from "@/lib/disciplines"

const PAGE_SIZE = 12

function statusBadge(cat: AccuracyCategory) {
  if (cat === 'bullseye')  return <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-medium">В яблочко</span>
  if (cat === 'allowable') return <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700 font-medium">Допуст.</span>
  return <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-medium">Откл.</span>
}

function deviationColor(dev: number) {
  if (dev === 0) return 'text-green-600'
  if (Math.abs(dev) <= 0.3) return 'text-yellow-600'
  return 'text-red-500'
}

export default function JudgeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<JudgeProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJudgeProfile(Number(id)).then(setData).finally(() => setLoading(false))
  }, [id])

  const [tab, setTab] = useState<JudgeType>('EXECUTION')
  const [competition, setCompetition] = useState('')
  const [discipline, setDiscipline] = useState('')

  if (loading || !data) return <div className="flex items-center justify-center min-h-[40vh] text-slate-400">{loading ? 'Загрузка...' : 'Судья не найден'}</div>

  const competitions = Array.from(new Set(data.performances.map(p => p.performance.competition)))
  const disciplines  = Array.from(new Set(data.performances.map(p => p.performance.discipline)))

  const filtered = data.performances.filter(p =>
    p.type === tab &&
    (competition === '' || p.performance.competition === competition) &&
    (discipline  === '' || p.performance.discipline  === discipline)
  )

  const shown = filtered.slice(0, PAGE_SIZE)

  return (
    <motion.div
      className="space-y-6 pb-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/judges" className="hover:text-blue-600">Судьи</Link>
        <span>›</span>
        <span className="text-slate-800">{data.referee.fio}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{data.referee.fio}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{data.referee.city}, {data.referee.region}</p>
        </div>
        <div className="flex gap-3">
          <div className="border rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-slate-400">Точность</p>
            <p className={`text-lg font-bold ${data.execution_accuracy >= 80 ? 'text-green-600' : data.execution_accuracy >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
              {data.execution_accuracy}%
            </p>
          </div>
          <div className="border rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-slate-400">Предвзятость</p>
            <p className={`text-lg font-bold ${Math.abs(data.bias_coefficient) < 0.1 ? 'text-slate-700' : data.bias_coefficient > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {data.bias_coefficient > 0 ? '+' : ''}{data.bias_coefficient.toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b">
        {(['EXECUTION', 'ARTISTIC'] as JudgeType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'EXECUTION' ? 'Исполнение' : 'Артистизм'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={competition}
          onChange={e => setCompetition(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Все соревнования</option>
          {competitions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={discipline}
          onChange={e => setDiscipline(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Все дисциплины</option>
          {disciplines.map(d => <option key={d} value={d}>{disciplineName(d)}</option>)}
        </select>
      </div>

      {/* Stat mini-cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">В яблочко</p>
          <p className="text-3xl font-bold text-green-600">{data.bullseye_count}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Допустимо</p>
          <p className="text-3xl font-bold text-yellow-500">{data.allowable_count}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Серьезное откл.</p>
          <p className="text-3xl font-bold text-red-500">{data.serious_count}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Всего оценок</p>
          <p className="text-3xl font-bold text-slate-800">{data.total_count}</p>
        </div>
      </div>

      {/* Performances table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Оценки по выступлениям</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase border-b bg-slate-50">
              <th className="text-center px-4 py-3 w-10">#</th>
              <th className="text-left px-4 py-3">Дисциплина/Возраст</th>
              <th className="text-center px-4 py-3">Оценка судьи</th>
              <th className="text-center px-4 py-3">Итог</th>
              <th className="text-center px-4 py-3">Отклонение</th>
              <th className="text-center px-4 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p, i) => (
              <tr key={p.performance.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3 text-center text-slate-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-800">{disciplineName(p.performance.discipline)}</span>
                  <span className="ml-2 text-xs text-slate-400">{p.performance.age_category}</span>
                </td>
                <td className="px-4 py-3 text-center text-slate-700">{p.my_score.toFixed(2)}</td>
                <td className="px-4 py-3 text-center text-slate-700">{p.result_score.toFixed(2)}</td>
                <td className={`px-4 py-3 text-center font-medium ${deviationColor(p.deviation)}`}>
                  {p.deviation > 0 ? '+' : ''}{p.deviation.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">{statusBadge(p.accuracy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t text-xs text-center text-slate-400">
          Показано {shown.length} из {data.total_count} оценок
        </div>
      </div>
    </motion.div>
  )
}
