'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, MapPin, Phone, Mail, Clock, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BranchSettings {
  name:    string
  address: string
  city:    string
  country: string
  phone:   string
  email:   string
  openingHours: {
    monday:    { open: string; close: string }
    tuesday:   { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday:  { open: string; close: string }
    friday:    { open: string; close: string }
    saturday:  { open: string; close: string }
    sunday:    { open: string; close: string }
  }
}

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const

const DEFAULT: BranchSettings = {
  name: 'Afroglow Vilnius',
  address: 'Kalvarijų g. 88',
  city: 'Vilnius',
  country: 'Lithuania',
  phone: '+37069150485',
  email: 'afroglowstudiostudio@gmail.com',
  openingHours: {
    monday:    { open: '09:00', close: '21:00' },
    tuesday:   { open: '09:00', close: '21:00' },
    wednesday: { open: '09:00', close: '21:00' },
    thursday:  { open: '09:00', close: '21:00' },
    friday:    { open: '09:00', close: '21:00' },
    saturday:  { open: '09:00', close: '19:00' },
    sunday:    { open: '10:00', close: '17:00' },
  },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BranchSettings>(DEFAULT)
  const [loading, setSaving]    = useState(false)

  // No branches API yet — settings are pre-filled from defaults

  function setHours(day: typeof DAYS[number], field: 'open' | 'close', value: string) {
    setSettings(s => ({
      ...s,
      openingHours: { ...s.openingHours, [day]: { ...s.openingHours[day], [field]: value } },
    }))
  }

  async function save() {
    setSaving(true)
    // Branch update API coming soon — settings are managed via database seed for now
    setTimeout(() => {
      toast.success('Settings noted ✓  (branch API coming soon)')
      setSaving(false)
    }, 400)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Branch information & working hours</p>
      </div>

      {/* Contact info */}
      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><MapPin size={16} className="text-gold-400" /> Branch Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { label: 'Branch Name',  key: 'name'    as const },
            { label: 'Address',      key: 'address' as const },
            { label: 'City',         key: 'city'    as const },
            { label: 'Country',      key: 'country' as const },
          ]).map(({ label, key }) => (
            <div key={key}>
              <label className="label-luxury">{label}</label>
              <input value={settings[key]}
                onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                className="input-luxury w-full" />
            </div>
          ))}
          <div>
            <label className="label-luxury flex items-center gap-1.5"><Phone size={12} /> Phone</label>
            <input value={settings.phone}
              onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))}
              className="input-luxury w-full" />
          </div>
          <div>
            <label className="label-luxury flex items-center gap-1.5"><Mail size={12} /> Email</label>
            <input value={settings.email} type="email"
              onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}
              className="input-luxury w-full" />
          </div>
        </div>
      </div>

      {/* Working hours */}
      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><Clock size={16} className="text-gold-400" /> Working Hours</h2>

        <div className="space-y-3">
          {DAYS.map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="text-sm text-gray-400 capitalize w-24">{day}</span>
              <div className="flex items-center gap-2 flex-1">
                <input type="time" value={settings.openingHours[day].open}
                  onChange={e => setHours(day, 'open', e.target.value)}
                  className="input-luxury flex-1 text-sm" />
                <span className="text-gray-500 text-sm">–</span>
                <input type="time" value={settings.openingHours[day].close}
                  onChange={e => setHours(day, 'close', e.target.value)}
                  className="input-luxury flex-1 text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={loading}
        className="btn-gold">
        {loading ? <div className="luxury-loader !w-4 !h-4 !border-2" /> : <Save size={16} />}
        Save Changes
      </button>
    </motion.div>
  )
}
