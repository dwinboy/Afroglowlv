import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-luxury-charcoal">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gold-600/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
              <span className="text-luxury-black font-serif font-bold text-xl">A</span>
            </div>
            <span className="font-serif font-bold text-xl text-white">Afroglow</span>
          </Link>

          <div>
            <h2 className="font-serif text-4xl font-bold text-white mb-4 leading-tight">
              Your journey to <span className="gold-shimmer">excellence</span> starts here.
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of beauty professionals and satisfied clients.
            </p>
            <div className="space-y-4">
              {[
                { n: '50+',  l: 'Active professionals' },
                { n: '98%',  l: 'Client satisfaction' },
                { n: '200+', l: 'Bookings per day' },
              ].map(s => (
                <div key={s.l} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gradient-gold w-16">{s.n}</span>
                  <span className="text-gray-400">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Afroglow. Lithuania.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                <span className="text-luxury-black font-serif font-bold text-xl">A</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">Afroglow</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
