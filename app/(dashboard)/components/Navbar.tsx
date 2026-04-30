'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/competitions', label: 'Соревнования' },
  { href: '/judges',       label: 'Судьи' },
  { href: '/upload',       label: 'Загрузка данных' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-16">
        <span className="font-bold text-white mr-auto text-lg">Aerobic.Space</span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith(item.href)
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
