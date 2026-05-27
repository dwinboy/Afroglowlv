'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Search, Filter, MoreVertical, Shield,
  Edit2, Lock, Ban, CheckCircle, RefreshCw, X,
  ChevronDown, Eye, EyeOff, Scissors, Star,
  Calendar, DollarSign, MapPin, AlertTriangle,
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://afroglowlv-api.vercel.app/api'

const DEFAULT_PERMISSIONS = {
  canAcceptBookings:  true,
  canManageServices:  true,
  canViewEarnings:    true,
  canManagePortfolio: true,
  canAccessCalendar:  true,
  canReceiveReviews:  true,
}

const PERMISSION_LABELS: Record<string, string> = {
  canAcceptBookings:  'Accept Bookings',
  canManageServices:  'Manage Services',
  canViewEarnings:    'View Earnings',
  canManagePortfolio: 'Manage Portfolio',
  canAccessCalendar:  'Access Calendar',
  canReceiveReviews:  'Receive Reviews',
}

const RENTAL_PLANS = ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']
const RENTAL_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING']

function statusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE:    'bg-green-500/15 text-green-400 border-green-500/30',
    INACTIVE:  'bg-gray-500/15 text-gray-400 border-gray-500/30',
    SUSPENDED: 'bg-red-500/15 text-red-400 border-red-500/30',
    EXPIRED:   'bg-orange-500/15 text-orange-400 border-orange-500/30',
    PENDING:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  }
  return cn('px-2 py-0.5 rounded-full text-[11px] font-semibold border', map[status] ?? map['INACTIVE'])
}

/* ── Reusable form input ───────────────────────────── */
function Field({
  label, name, type = 'text', value, onChange, required = false,
  placeholder, options, optional = false,
}: {
  label: string; name: string; type?: string; value: any; onChange: (e: any) => void
  required?: boolean; placeholder?: string
  options?: { value: string; label: string }[]
  optional?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">
        {label} {optional && <span className="text-gray-600">(optional)</span>}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {options ? (
        <select name={name} value={value ?? ''} onChange={onChange}
          className="input-luxury w-full text-sm">
          <option value="">— select —</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={value ?? ''} onChange={onChange} placeholder={placeholder}
          rows={3} className="input-luxury w-full text-sm resize-none" />
      ) : (
        <input name={name} type={type} value={value ?? ''} onChange={onChange}
          placeholder={placeholder} required={required}
          className="input-luxury w-full text-sm" />
      )}
    </div>
  )
}

/* ── Permissions toggle panel ──────────────────────── */
function PermissionsPanel({
  permissions, onChange,
}: {
  permissions: Record<string, boolean>
  onChange: (key: string, val: boolean) => void
}) {
  return (
    <div className="space-y-2">
      {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
        <label key={key} className="flex items-center justify-between p-3 rounded-xl
          bg-white/5 border border-white/10 cursor-pointer hover:bg-white/8 transition-colors">
          <span className="text-sm text-gray-300">{label}</span>
          <div
            onClick={() => onChange(key, !permissions[key])}
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors cursor-pointer',
              permissions[key] ? 'bg-gold-500' : 'bg-white/20',
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
              permissions[key] ? 'left-5' : 'left-0.5',
            )} />
          </div>
        </label>
      ))}
    </div>
  )
}

/* ── Create Professional Modal ─────────────────────── */
function CreateModal({
  spots, onClose, onCreated,
}: {
  spots: any[]
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState<any>({
    fullName: '', email: '', phone: '', specialization: '',
    yearsOfExperience: '', bio: '', instagramHandle: '',
    rentalSpotId: '', rentalPlan: '', adminNotes: '',
    permissions: { ...DEFAULT_PERMISSIONS },
  })
  const [saving, setSaving] = useState(false)

  function handleChange(e: React.ChangeEvent<any>) {
    setForm((p: any) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handlePermission(key: string, val: boolean) {
    setForm((p: any) => ({ ...p, permissions: { ...p.permissions, [key]: val } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('afroglow_token')
      const payload = {
        ...form,
        yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
        rentalSpotId: form.rentalSpotId || undefined,
        rentalPlan:   form.rentalPlan   || undefined,
        phone:        form.phone        || undefined,
      }
      const { data } = await axios.post(`${API}/admin/professionals`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success(`Account created for ${data.fullName}. Credentials emailed.`)
      onCreated()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create professional')
    } finally {
      setSaving(false)
    }
  }

  const availableSpots = spots.filter(s => s.isAvailable)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl card-luxury mt-8 mb-8"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Create Professional Account</h2>
            <p className="text-gray-400 text-sm mt-0.5">Admin-issued credentials will be emailed directly to the professional.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Personal Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Kwame Asante" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="kwame@example.com" />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} optional placeholder="+370 600 00000" />
              <Field label="Instagram" name="instagramHandle" value={form.instagramHandle} onChange={handleChange} optional placeholder="@kwame.cuts" />
            </div>
          </div>

          {/* Professional details */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Professional Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} optional placeholder="e.g. Barber, Colorist, Loctician" />
              <Field label="Years of Experience" name="yearsOfExperience" type="number" value={form.yearsOfExperience} onChange={handleChange} optional placeholder="5" />
            </div>
            <div className="mt-4">
              <Field label="Bio" name="bio" type="textarea" value={form.bio} onChange={handleChange} optional placeholder="A short professional bio…" />
            </div>
          </div>

          {/* Rental */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Rental Assignment</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Assign Spot"
                name="rentalSpotId"
                value={form.rentalSpotId}
                onChange={handleChange}
                optional
                options={availableSpots.map(s => ({ value: s.id, label: `${s.spotNumber} (${s.type ?? 'Chair'})` }))}
              />
              <Field
                label="Rental Plan"
                name="rentalPlan"
                value={form.rentalPlan}
                onChange={handleChange}
                optional
                options={RENTAL_PLANS.map(p => ({ value: p, label: p.charAt(0) + p.slice(1).toLowerCase() }))}
              />
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Dashboard Permissions</h3>
            <PermissionsPanel permissions={form.permissions} onChange={handlePermission} />
          </div>

          {/* Admin notes */}
          <div>
            <Field label="Admin Notes" name="adminNotes" type="textarea" value={form.adminNotes} onChange={handleChange} optional placeholder="Internal notes (not visible to the professional)…" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 btn-outline-gold py-3">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 btn-gold py-3 flex items-center justify-center gap-2">
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <UserPlus size={15} />}
              {saving ? 'Creating…' : 'Create & Send Credentials'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Edit / Permissions Modal ──────────────────────── */
function EditModal({
  professional, spots, onClose, onSaved,
}: {
  professional: any
  spots: any[]
  onClose: () => void
  onSaved: () => void
}) {
  const currentPerms = { ...DEFAULT_PERMISSIONS, ...(professional.permissions ?? {}) }
  const [tab, setTab] = useState<'profile' | 'permissions'>('profile')
  const [form, setForm] = useState({
    specialization:    professional.specialization ?? '',
    yearsOfExperience: professional.yearsOfExperience ?? 0,
    bio:               professional.bio ?? '',
    instagramHandle:   professional.instagramHandle ?? '',
    rentalSpotId:      professional.rentalSpotId ?? '',
    rentalPlan:        professional.rentalPlan ?? '',
    rentalStatus:      professional.rentalStatus ?? '',
    adminNotes:        professional.adminNotes ?? '',
  })
  const [perms, setPerms] = useState<Record<string, boolean>>(currentPerms)
  const [saving, setSaving] = useState(false)

  function handleChange(e: React.ChangeEvent<any>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function saveProfile() {
    setSaving(true)
    try {
      const token = localStorage.getItem('afroglow_token')
      await axios.put(`${API}/admin/professionals/${professional.id}`, {
        ...form,
        rentalSpotId: form.rentalSpotId || null,
        rentalPlan:   form.rentalPlan   || undefined,
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Profile updated')
      onSaved()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function savePermissions() {
    setSaving(true)
    try {
      const token = localStorage.getItem('afroglow_token')
      await axios.patch(`${API}/admin/professionals/${professional.id}/permissions`, {
        permissions: perms,
        adminNotes: form.adminNotes,
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Permissions updated')
      onSaved()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const allSpots = spots.filter(s => s.isAvailable || s.id === professional.rentalSpotId)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl card-luxury mt-8 mb-8"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">{professional.user?.fullName}</h2>
            <p className="text-gray-400 text-sm">{professional.user?.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['profile', 'permissions'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-3 text-sm font-medium capitalize transition-colors',
                tab === t ? 'text-gold-400 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white',
              )}>
              {t === 'profile' ? 'Profile & Assignment' : 'Permissions'}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {tab === 'profile' ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} optional />
                <Field label="Years of Experience" name="yearsOfExperience" type="number" value={form.yearsOfExperience} onChange={handleChange} optional />
                <Field label="Instagram" name="instagramHandle" value={form.instagramHandle} onChange={handleChange} optional placeholder="@handle" />
                <Field
                  label="Rental Status"
                  name="rentalStatus"
                  value={form.rentalStatus}
                  onChange={handleChange}
                  options={RENTAL_STATUSES.map(s => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }))}
                />
                <Field
                  label="Assign Spot"
                  name="rentalSpotId"
                  value={form.rentalSpotId}
                  onChange={handleChange}
                  optional
                  options={[
                    { value: '', label: 'No spot' },
                    ...allSpots.map(s => ({ value: s.id, label: `${s.spotNumber} (${s.type ?? 'Chair'})` })),
                  ]}
                />
                <Field
                  label="Rental Plan"
                  name="rentalPlan"
                  value={form.rentalPlan}
                  onChange={handleChange}
                  optional
                  options={RENTAL_PLANS.map(p => ({ value: p, label: p.charAt(0) + p.slice(1).toLowerCase() }))}
                />
              </div>
              <Field label="Bio" name="bio" type="textarea" value={form.bio} onChange={handleChange} optional />
              <Field label="Admin Notes" name="adminNotes" type="textarea" value={form.adminNotes} onChange={handleChange} optional placeholder="Internal notes…" />
              <button onClick={saveProfile} disabled={saving}
                className="w-full btn-gold py-3 flex items-center justify-center gap-2">
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Edit2 size={14} />}
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Control what this professional can access in their dashboard.
              </p>
              <PermissionsPanel permissions={perms} onChange={(k, v) => setPerms(p => ({ ...p, [k]: v }))} />
              <button onClick={savePermissions} disabled={saving}
                className="w-full btn-gold py-3 flex items-center justify-center gap-2 mt-4">
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14} />}
                {saving ? 'Saving…' : 'Save Permissions'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────── */
export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<any[]>([])
  const [spots, setSpots]                 = useState<any[]>([])
  const [total, setTotal]                 = useState(0)
  const [page, setPage]                   = useState(1)
  const [search, setSearch]               = useState('')
  const [statusFilter, setStatusFilter]   = useState('')
  const [loading, setLoading]             = useState(true)
  const [showCreate, setShowCreate]       = useState(false)
  const [editing, setEditing]             = useState<any>(null)
  const [menuOpen, setMenuOpen]           = useState<string | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('afroglow_token') : null
  const headers = { Authorization: `Bearer ${token}` }

  const fetchProfessionals = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (search)       params.set('search', search)
      if (statusFilter) params.set('rentalStatus', statusFilter)
      const { data } = await axios.get(`${API}/admin/professionals?${params}`, { headers })
      setProfessionals(data.data)
      setTotal(data.total)
    } catch {
      toast.error('Failed to load professionals')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  const fetchSpots = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/spots`, { headers })
      setSpots(data.data ?? data)
    } catch {}
  }, [])

  useEffect(() => { fetchProfessionals() }, [fetchProfessionals])
  useEffect(() => { fetchSpots() }, [fetchSpots])

  async function handleSuspend(pro: any) {
    if (!confirm(`Suspend ${pro.user?.fullName}? Their account will be deactivated.`)) return
    try {
      await axios.patch(`${API}/admin/professionals/${pro.id}/suspend`, {}, { headers })
      toast.success(`${pro.user?.fullName} suspended`)
      fetchProfessionals()
    } catch {
      toast.error('Failed to suspend')
    }
  }

  async function handleReactivate(pro: any) {
    try {
      await axios.patch(`${API}/admin/professionals/${pro.id}/reactivate`, {}, { headers })
      toast.success(`${pro.user?.fullName} reactivated`)
      fetchProfessionals()
    } catch {
      toast.error('Failed to reactivate')
    }
  }

  async function handleResetPassword(pro: any) {
    if (!confirm(`Reset password for ${pro.user?.fullName}? New credentials will be emailed.`)) return
    try {
      await axios.post(`${API}/admin/professionals/${pro.id}/reset-password`, {}, { headers })
      toast.success('New credentials emailed to professional')
    } catch {
      toast.error('Failed to reset password')
    }
  }

  const activeCount    = professionals.filter(p => p.rentalStatus === 'ACTIVE').length
  const suspendedCount = professionals.filter(p => p.rentalStatus === 'SUSPENDED').length
  const pendingCount   = professionals.filter(p => p.rentalStatus === 'PENDING').length

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showCreate && (
          <CreateModal
            spots={spots}
            onClose={() => setShowCreate(false)}
            onCreated={() => { setShowCreate(false); fetchProfessionals() }}
          />
        )}
        {editing && (
          <EditModal
            professional={editing}
            spots={spots}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); fetchProfessionals() }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">Professionals</h1>
          <p className="text-gray-400 mt-1 text-sm">Create accounts, assign spots, and control dashboard access.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="btn-gold flex items-center gap-2 py-2.5 px-5 text-sm">
          <UserPlus size={16} /> New Professional
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: total,          color: 'text-gold-400',   icon: Scissors   },
          { label: 'Active',    value: activeCount,    color: 'text-green-400',  icon: CheckCircle },
          { label: 'Suspended', value: suspendedCount, color: 'text-red-400',    icon: Ban         },
          { label: 'Pending',   value: pendingCount,   color: 'text-yellow-400', icon: AlertTriangle },
        ].map(s => (
          <div key={s.label} className="card-luxury p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or email…"
            className="input-luxury w-full pl-10 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="input-luxury text-sm min-w-[160px]"
        >
          <option value="">All statuses</option>
          {RENTAL_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <button onClick={fetchProfessionals}
          className="btn-outline-gold px-4 text-sm flex items-center gap-2">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3.5">Professional</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3.5 hidden sm:table-cell">Specialization</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3.5 hidden md:table-cell">Spot</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3.5">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3.5 hidden lg:table-cell">Permissions</th>
                <th className="text-right text-xs text-gray-400 font-medium px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : professionals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <Scissors size={32} className="mx-auto mb-3 opacity-20" />
                    <p>No professionals found</p>
                    <button onClick={() => setShowCreate(true)}
                      className="mt-3 text-gold-400 text-sm underline underline-offset-2">
                      Create the first one
                    </button>
                  </td>
                </tr>
              ) : professionals.map((pro, i) => {
                const perms   = { ...DEFAULT_PERMISSIONS, ...(pro.permissions ?? {}) }
                const enabled = Object.values(perms).filter(Boolean).length
                const total_p = Object.keys(perms).length

                return (
                  <motion.tr
                    key={pro.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    {/* Professional */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
                          {pro.user?.fullName?.charAt(0) ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{pro.user?.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{pro.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-300">{pro.specialization ?? '—'}</span>
                    </td>

                    {/* Spot */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      {pro.rentalSpot ? (
                        <span className="flex items-center gap-1.5 text-sm text-gray-300">
                          <MapPin size={12} className="text-gold-400" />
                          {pro.rentalSpot.spotNumber}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">No spot</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={statusBadge(pro.rentalStatus)}>
                        {pro.rentalStatus}
                      </span>
                    </td>

                    {/* Permissions summary */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium',
                          enabled === total_p ? 'text-green-400' : enabled === 0 ? 'text-red-400' : 'text-yellow-400',
                        )}>
                          {enabled}/{total_p}
                        </span>
                        <div className="flex gap-0.5">
                          {Object.values(perms).map((v, idx) => (
                            <div key={idx}
                              className={cn('w-2 h-2 rounded-full', v ? 'bg-green-500' : 'bg-red-500/40')}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuOpen(menuOpen === pro.id ? null : pro.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <AnimatePresence>
                          {menuOpen === pro.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-8 z-20 w-48 card-luxury py-1 shadow-2xl"
                              >
                                <button
                                  onClick={() => { setEditing(pro); setMenuOpen(null) }}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <Edit2 size={14} /> Edit Profile & Spot
                                </button>
                                <button
                                  onClick={() => { setEditing({ ...pro, _tab: 'permissions' }); setMenuOpen(null) }}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <Shield size={14} /> Manage Permissions
                                </button>
                                <button
                                  onClick={() => { handleResetPassword(pro); setMenuOpen(null) }}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <Lock size={14} /> Reset Password
                                </button>
                                <div className="border-t border-white/10 my-1" />
                                {pro.rentalStatus === 'SUSPENDED' || !pro.user?.isActive ? (
                                  <button
                                    onClick={() => { handleReactivate(pro); setMenuOpen(null) }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors"
                                  >
                                    <CheckCircle size={14} /> Reactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => { handleSuspend(pro); setMenuOpen(null) }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Ban size={14} /> Suspend
                                  </button>
                                )}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Showing {((page - 1) * 15) + 1}–{Math.min(page * 15, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400
                  hover:text-white hover:border-gold-500/50 disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * 15 >= total}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400
                  hover:text-white hover:border-gold-500/50 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
