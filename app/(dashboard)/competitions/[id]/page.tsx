"use client"

import { useState, useEffect, use } from "react"
import { fetchCompetitionDetail, fetchCategoryHeatmap, type CompetitionDetailResponse, type HeatmapResponse } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { disciplineName } from "@/lib/disciplines"

function heatmapColor(value: number) {
  const abs = Math.abs(value)
  if (value > 0) {
    if (abs >= 0.4) return 'bg-blue-500 text-white'
    if (abs >= 0.2) return 'bg-blue-300 text-white'
    return 'bg-blue-100 text-blue-800'
  } else {
    if (abs >= 0.4) return 'bg-red-400 text-white'
    if (abs >= 0.2) return 'bg-red-200 text-red-800'
    return 'bg-red-50 text-red-700'
  }
}

function biasColor(value: number) {
  if (value > 0.2) return 'text-red-500 font-medium'
  if (value < -0.1) return 'text-green-600 font-medium'
  return 'text-slate-600'
}

export default function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<CompetitionDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [discipline, setDiscipline] = useState('')
  const [age, setAge] = useState('')
  const [heatmap, setHeatmap] = useState<HeatmapResponse | null>(null)
  const [heatmapLoading, setHeatmapLoading] = useState(false)

  useEffect(() => {
    fetchCompetitionDetail(decodeURIComponent(id)).then(setData).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (discipline && age && data) {
      setHeatmapLoading(true)
      fetchCategoryHeatmap(data.name, age, discipline)
        .then(setHeatmap)
        .catch(() => setHeatmap(null))
        .finally(() => setHeatmapLoading(false))
    } else {
      setHeatmap(null)
    }
  }, [discipline, age, data])

  if (loading || !data) return <div className="flex items-center justify-center min-h-[40vh] text-slate-400">{loading ? 'Загрузка...' : 'Соревнование не найдено'}</div>

  const total = data.execution_bullseye + data.execution_allowable + data.execution_serious
  const exBullPct   = total ? Math.round(data.execution_bullseye  / total * 100) : 0
  const exAllowPct  = total ? Math.round(data.execution_allowable / total * 100) : 0
  const exSeriousPct = total ? 100 - exBullPct - exAllowPct : 0

  const filteredCategories = data.categories.filter(c =>
    (discipline === '' || c.discipline === discipline) &&
    (age === '' || c.age_category === age)
  )

  const total2 = data.artistic_bullseye + data.artistic_allowable + data.artistic_serious
  const arBullPct   = total2 ? Math.round(data.artistic_bullseye  / total2 * 100) : 0
  const arAllowPct  = total2 ? Math.round(data.artistic_allowable / total2 * 100) : 0
  const arSeriousPct = total2 ? 100 - arBullPct - arAllowPct : 0


  return (
    <motion.div
      className="space-y-6 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/competitions" className="hover:text-blue-600">Соревнования</Link>
        <span>›</span>
        <span className="text-slate-800">{data.name}</span>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {data.type === 'RUSSIA' ? 'Всероссийские' : 'Региональные'} · {data.performance_count} выступлений
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={discipline}
          onChange={e => setDiscipline(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Все дисциплины</option>
          {data.disciplines.map(d => <option key={d} value={d}>{disciplineName(d)}</option>)}
        </select>
        <select
          value={age}
          onChange={e => setAge(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-400"
        >
          <option value="">Все возрасты</option>
          {data.age_categories.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Оценок',      value: data.total_assessments, sub: 'Всего оценок',              cls: 'text-slate-800' },
          { label: 'Исполнение',  value: data.execution_accuracy, sub: 'В допустимом отклонении',  cls: 'text-slate-800' },
          { label: 'Артистизм',   value: data.artistic_accuracy,  sub: 'В допустимом отклонении',  cls: 'text-slate-800' },
          { label: 'Оценки',      value: data.serious_count,      sub: 'Требует внимания',          cls: 'text-red-500'   },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-white border rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
          >
            <p className="text-xs text-slate-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.cls}`}>{card.value}</p>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Исполнение', bull: exBullPct, allow: exAllowPct, serious: exSeriousPct },
          { label: 'Артистизм',  bull: arBullPct, allow: arAllowPct, serious: arSeriousPct },
        ].map(({ label, bull, allow, serious }) => (
          <div key={label} className="bg-white border rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">{label}</p>
            <div className="flex rounded-full overflow-hidden h-4">
              <div className="bg-green-400" style={{ width: `${bull}%` }} />
              <div className="bg-yellow-400" style={{ width: `${allow}%` }} />
              <div className="bg-red-400"  style={{ width: `${serious}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />В яблочко</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Допустимо</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Сильное отклонение</span>
            </div>
          </div>
        ))}
      </div>

      {/* Categories table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Категории</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase border-b">
              <th className="text-left px-5 py-3">Дисциплина</th>
              <th className="text-left px-5 py-3">Возраст</th>
              <th className="px-5 py-3 text-center">Исполнение (%)</th>
              <th className="px-5 py-3 text-center">Артистизм (%)</th>
              <th className="px-5 py-3 text-center">Ср. Откл</th>
              <th className="px-5 py-3 text-center">Выст.</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(c => (
              <tr key={c.id} className="border-t hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">{disciplineName(c.discipline)}</td>
                <td className="px-5 py-3 text-slate-600">{c.age_category}</td>
                <td className="px-5 py-3 text-center">
                  <span className={c.execution_accuracy >= 80 ? 'text-green-600' : c.execution_accuracy >= 60 ? 'text-yellow-600' : 'text-red-500'}>
                    {c.execution_accuracy}%
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={c.artistic_accuracy >= 80 ? 'text-green-600' : c.artistic_accuracy >= 60 ? 'text-yellow-600' : 'text-red-500'}>
                    {c.artistic_accuracy}%
                  </span>
                </td>
                <td className="px-5 py-3 text-center text-slate-700">{c.deviation_coefficient}</td>
                <td className="px-5 py-3 text-center text-slate-700">{c.performance_count}</td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">Нет категорий</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Judges table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Судья соревнования</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase border-b">
              <th className="text-left px-5 py-3">Судья</th>
              <th className="px-5 py-3 text-center">Ср. Откл</th>
              <th className="px-5 py-3 text-center">Оценок</th>
              <th className="px-5 py-3 text-center">Предвзятость</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {data.judges.map(j => (
              <tr
                key={j.referee.id}
                className="border-t hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/judges/${j.referee.id}`)}
              >
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-800">{j.referee.fio}</p>
                  <p className="text-xs text-slate-400">{j.referee.city}</p>
                </td>
                <td className="px-5 py-3 text-center text-slate-700">{j.avg_deviation}</td>
                <td className="px-5 py-3 text-center text-slate-700">{j.assessment_count}</td>
                <td className={`px-5 py-3 text-center ${biasColor(j.bias_coefficient)}`}>
                  {j.bias_coefficient > 0 ? '+' : ''}{j.bias_coefficient.toFixed(2)}
                </td>
                <td className="pr-4 text-slate-400 text-lg text-center">›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-slate-800">Тепловая карта: Судья × Регион</h2>
          {discipline && age && <p className="text-xs text-slate-400 mt-0.5">{disciplineName(discipline)} · {age}</p>}
        </div>
        {!discipline || !age ? (
          <div className="p-8 text-center text-slate-400">Выберите дисциплину и возрастную категорию выше</div>
        ) : heatmapLoading ? (
          <div className="p-8 text-center text-slate-400">Загрузка...</div>
        ) : heatmap && heatmap.cells.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-2 font-medium text-slate-500 min-w-36">Судья</th>
                  {heatmap.regions.map(r => (
                    <th key={r} className="px-2 py-2 font-medium text-slate-500 text-center min-w-24">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmap.judges.map(judge => (
                  <tr key={judge.id} className="border-t">
                    <td className="px-4 py-2 font-medium text-slate-700 whitespace-nowrap">{judge.fio}</td>
                    {heatmap.regions.map(region => {
                      const cell = heatmap.cells.find(c => c.referee_id === judge.id && c.region === region)
                      if (!cell) return <td key={region} className="px-2 py-2 text-center text-slate-300">—</td>
                      return (
                        <td key={region} className="px-2 py-1">
                          <div className={`rounded px-1 py-1 text-center font-medium ${heatmapColor(cell.avg_deviation)}`}>
                            {cell.avg_deviation > 0 ? '+' : ''}{cell.avg_deviation.toFixed(2)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">Нет данных для выбранной категории</div>
        )}
      </div>

    </motion.div>
  )
}
