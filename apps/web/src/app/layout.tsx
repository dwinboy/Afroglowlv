import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { I18nProvider } from '@/contexts/I18nContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Afroglow — Premium Salon & Chair Rental | Vilnius, Lithuania',
    template: '%s | Afroglow',
  },
  description:
    'Afroglow is a luxury salon coworking space in Lithuania. Book appointments with expert barbers, hairdressers, and beauty professionals — or rent a working spot.',
  keywords: [
    'salon', 'barber', 'hairdresser', 'braiding', 'chair rental',
    'Vilnius', 'Lithuania', 'Afroglow', 'beauty', 'luxury salon',
    'dreadlocks', 'wigs', 'hair coloring',
  ],
  metadataBase: new URL('https://afroglow.lt'),
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://afroglow.lt',
    siteName:    'Afroglow',
    title:       'Afroglow — Premium Salon & Chair Rental',
    description: 'Book luxury hair and beauty services or rent your own workspace at Afroglow, Vilnius.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Afroglow Salon' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Afroglow — Premium Salon',
    description: 'Luxury salon & chair rental in Lithuania.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon:    '/favicon.ico',
    apple:   '/apple-touch-icon.png',
    shortcut:'/favicon-16x16.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width:             'device-width',
  initialScale:      1,
  maximumScale:      5,
  themeColor:        '#D4AF37',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1E1E1E',
                  color:      '#fff',
                  border:     '1px solid #2A2A2A',
                  borderRadius:'12px',
                },
                success: {
                  iconTheme: { primary: '#D4AF37', secondary: '#000' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
