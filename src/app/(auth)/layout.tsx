import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.png.png" 
            alt="Eternal Echoes & Visions"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="text-lg font-semibold">Eternal Echoes & Visions</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Eternal Echoes & Visions. All rights reserved.
        <br />
        Rev David Oshoba George
      </footer>
    </div>
  )
}



