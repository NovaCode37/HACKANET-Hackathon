import Navbar from './components/Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}