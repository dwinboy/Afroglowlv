'use client'

import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

/* TikTok icon (not in lucide-react) */
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

const socialLinks = [
  { icon: Instagram,  href: 'https://instagram.com/afroglowstudio370', label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@afroglow370',          label: 'TikTok'   },
  { icon: Facebook,   href: 'https://facebook.com/afroglowlt',          label: 'Facebook' },
  { icon: Youtube,    href: 'https://youtube.com/@afroglowlt',          label: 'YouTube'  },
]

const quickLinks = [
  { href: '/',              label: 'Home' },
  { href: '/about',         label: 'About' },
  { href: '/services',      label: 'Services' },
  { href: '/professionals', label: 'Professionals' },
  { href: '/rent-a-spot',   label: 'Rent a Spot' },
  { href: '/book',          label: 'Book Now' },
]

const serviceLinks = [
  'Haircut', 'Beard Trim', 'Braiding', 'Dreadlocks',
  'Wig Installation', 'Hair Coloring',
]

export default function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-luxury-charcoal border-t border-luxury-border">
      {/* Newsletter CTA */}
      <div className="border-b border-luxury-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Stay in the loop</h3>
              <p className="text-gray-400 mt-1">Get exclusive offers & beauty tips delivered to your inbox.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-luxury min-w-0 flex-1 md:w-72"
              />
              <button type="submit" className="btn-gold whitespace-nowrap">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-luxury-black font-serif font-bold text-lg">A</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">Afroglow</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-luxury-surface border border-luxury-border
                             flex items-center justify-center text-gray-400
                             hover:text-gold-400 hover:border-gold-500/30 hover:bg-gold-500/10
                             transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.footer.links}</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.footer.services}</h4>
            <ul className="space-y-2">
              {serviceLinks.map(service => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Kalvarijų g. 88, Vilnius, Lithuania</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-gold-400 flex-shrink-0" />
                <a href="tel:+37069150485" className="hover:text-gold-400 transition-colors">
                  +370 691 50485
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-gold-400 flex-shrink-0" />
                <a href="mailto:afroglowstudiostudio@gmail.com" className="hover:text-gold-400 transition-colors">
                  afroglowstudiostudio@gmail.com
                </a>
              </li>
            </ul>

            {/* Working Hours */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-2">Working Hours</h5>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Mon – Fri: 09:00 – 21:00</p>
                <p>Saturday: 09:00 – 19:00</p>
                <p>Sunday: 10:00 – 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-luxury-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} Afroglow. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            {[
              { href: '/privacy', label: t.footer.privacy },
              { href: '/terms',   label: t.footer.terms   },
              { href: '/gdpr',    label: t.footer.gdpr    },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="text-xs text-gray-500 hover:text-gold-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
