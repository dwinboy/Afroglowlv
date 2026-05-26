'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { en } from '@/i18n/en'
import { lt } from '@/i18n/lt'

type Locale = 'en' | 'lt'

interface I18nContextType {
  locale:    Locale
  t:         typeof en
  setLocale: (locale: Locale) => void
}

const translations = { en, lt }

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('afroglow_locale') as Locale | null
    if (saved && (saved === 'en' || saved === 'lt')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('afroglow_locale', newLocale)
    document.documentElement.lang = newLocale
  }, [])

  const value: I18nContextType = {
    locale,
    t: translations[locale] as typeof en,
    setLocale,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
