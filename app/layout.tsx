import type { Metadata } from 'next'
import { Lexend, Nunito_Sans } from 'next/font/google'
import './globals.css'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito-sans',
})

export const metadata: Metadata = {
  title: 'Aerobic.Space — Анализ судейских оценок',
  description: 'Дашборд для анализа точности и предвзятости судейских оценок в спортивной аэробике',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${lexend.variable} ${nunitoSans.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
