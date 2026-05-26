'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Instagram, Save } from 'lucide-react'
import { api } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

export default function DashboardSettingsPage() {
  const { user, updateUser } = useAuth()
  const [form, setForm]     = useState({ bio: '', specialization: '', instagramHandle: '', yearsOfExperience: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/professionals/me').then(({ data }) => {
      setForm({
        bio:               data.bio               ?? '',
        specialization:    data.specialization     ?? '',
        instagramHandle:   data.instagramHandle    ?? '',
        yearsOfExperience: data.yearsOfExperience  ?? 0,
      })
    }).catch(() => {})
  }, [])

  async function save() {
    setSaving(true)
    try {
      await api.put('/professionals/me', form)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Update your professional info visible to clients</p>
      </div>

      {/* Account info (read-only) */}
      <div className="card-luxury p-5 space-y-3">
        <h2 className="font-semibold text-white flex items-center gap-2"><User size={16} className="text-gold-400" /> Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-luxury-surface rounded-xl">
            <User size={14} className="text-gold-400" />
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-sm text-white">{user?.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-luxury-surface rounded-xl">
            <Mail size={14} className="text-gold-400" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm text-white">{user?.email}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">To change your name, email or password — contact the admin.</p>
      </div>

      {/* Professional profile */}
      <div className="card-luxury p-5 space-y-4">
        <h2 className="font-semibold text-white">Professional Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-luxury">Specialization</label>
            <input value={form.specialization}
              onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
              placeholder="e.g. Braids & Locs" className="input-luxury w-full" />
          </div>
          <div>
            <label className="label-luxury">Years of Experience</label>
            <input type="number" min={0} max={50} value={form.yearsOfExperience}
              onChange={e => setForm(f => ({ ...f, yearsOfExperience: +e.target.value }))}
              className="input-luxury w-full" />
          </div>
        </div>

        <div>
          <label className="label-luxury flex items-center gap-1.5"><Instagram size={12} /> Instagram Handle</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
            <input value={form.instagramHandle}
              onChange={e => setForm(f => ({ ...f, instagramHandle: e.target.value.replace('@','') }))}
              placeholder="yourhandle" className="input-luxury w-full pl-8" />
          </div>
        </div>

        <div>
          <label className="label-luxury">Bio</label>
          <textarea value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="Tell clients about yourself, your experience and style…"
            rows={4} maxLength={500}
            className="input-luxury w-full resize-none" />
          <p className="text-xs text-gray-500 text-right mt-1">{form.bio.length}/500</p>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="btn-gold">
        {saving ? <div className="luxury-loader !w-4 !h-4 !border-2" /> : <Save size={16} />}
        Save Changes
      </button>
    </motion.div>
  )
}
