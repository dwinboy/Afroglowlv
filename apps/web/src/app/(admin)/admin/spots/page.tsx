'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, Pencil, CheckCircle, XCircle, Trash2, X, Save } from 'lucide-react'
import { api } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface Spot {
  id:          string
  spotNumber:  string
  type:        string
  description?: string
  dailyRate:   number
  weeklyRate:  number
  monthlyRate: number
  isAvailable: boolean
  professional?: { user: { fullName: string }; rentalPlan: string; rentalEndDate?: string }
}

interface SpotForm {
  spotNumber:  string
  type:        string
  description: string
  dailyRate:   number
  weeklyRate:  number
  monthlyRate: number
  isAvailable: boolean
}

const EMPTY_FORM: SpotForm = {
  spotNumber:  '',
  type:        'CHAIR',
  description: '',
  dailyRate:   35,
  weeklyRate:  180,
  monthlyRate: 600,
  isAvailable: true,
}

export default function AdminSpotsPage() {
  const [spots, setSpots]   = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Spot | null>(null)
  const [form, setForm] = useState<SpotForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSpots() }, [])

  async function fetchSpots() {
    setLoading(true)
    try {
      const { data } = await api.get('/spots')
      setSpots(Array.isArray(data) ? data : data.data ?? [])
    } catch {
      setSpots([])
    } finally {
      setLoading(false)
    }
  }

  async function toggleAvailability(id: string, current: boolean) {
    try {
      await api.patch(`/spots/${id}/availability`, { isAvailable: !current })
      fetchSpots()
    } catch { /* handled silently */ }
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModal('create')
  }

  function openEdit(spot: Spot) {
    setEditing(spot)
    setForm({
      spotNumber:  spot.spotNumber,
      type:        spot.type ?? 'CHAIR',
      description: spot.description ?? '',
      dailyRate:   spot.dailyRate,
      weeklyRate:  spot.weeklyRate,
      monthlyRate: spot.monthlyRate,
      isAvailable: spot.isAvailable,
    })
    setModal('edit')
  }

  async function saveSpot() {
    if (!form.spotNumber.trim()) {
      toast.error('Spot number is required')
      return
    }
    if (form.dailyRate < 0 || form.weeklyRate < 0 || form.monthlyRate < 0) {
      toast.error('Rates must be positive')
      return
    }

    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/spots', {
          spotNumber: form.spotNumber,
          type: form.type,
          description: form.description || undefined,
          dailyRate: form.dailyRate,
          weeklyRate: form.weeklyRate,
          monthlyRate: form.monthlyRate,
          isAvailable: form.isAvailable,
        })
        toast.success('Spot created')
      } else if (editing) {
        await api.put(`/spots/${editing.id}`, {
          spotNumber: form.spotNumber,
          type: form.type,
          description: form.description || undefined,
          dailyRate: form.dailyRate,
          weeklyRate: form.weeklyRate,
          monthlyRate: form.monthlyRate,
          isAvailable: form.isAvailable,
        })
        toast.success('Spot updated')
      }

      setModal(null)
      fetchSpots()
    } catch {
      toast.error('Failed to save spot')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSpot(id: string) {
    if (!confirm('Delete this spot? This cannot be undone.')) return
    try {
      await api.delete(`/spots/${id}`)
      toast.success('Spot deleted')
      setSpots(prev => prev.filter(s => s.id !== id))
    } catch {
      toast.error('Cannot delete this spot right now')
    }
  }

  const available = spots.filter(s => s.isAvailable).length

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Rental Spots</h1>
          <p className="text-gray-400 text-sm mt-1">{available} of {spots.length} spots available</p>
        </div>
        <button onClick={openCreate} className="btn-gold">
          <Plus size={16} /> New Spot
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Spots',   value: spots.length,     color: 'text-white'       },
          { label: 'Available',     value: available,         color: 'text-green-400'   },
          { label: 'Occupied',      value: spots.length - available, color: 'text-red-400' },
          { label: 'Occupancy',     value: spots.length ? `${Math.round((spots.length - available) / spots.length * 100)}%` : '0%', color: 'text-gold-400' },
        ].map(s => (
          <div key={s.label} className="card-luxury p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Spots grid */}
      {loading ? (
        <div className="p-16 text-center"><div className="luxury-loader mx-auto" /></div>
      ) : spots.length === 0 ? (
        <div className="card-luxury p-16 text-center text-gray-400">
          <MapPin size={40} className="mx-auto mb-3 opacity-30" />
          <p>No spots found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spots.map(spot => (
            <motion.div
              key={spot.id}
              layout
              className={`card-luxury p-5 border-2 transition-colors ${
                spot.isAvailable ? 'border-green-500/30' : 'border-red-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                    ${spot.isAvailable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {spot.spotNumber}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{spot.spotNumber}</p>
                    <p className="text-xs text-gray-400 capitalize">{spot.type?.toLowerCase() ?? 'chair'}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                  ${spot.isAvailable ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {spot.isAvailable ? <><CheckCircle size={11} /> Available</> : <><XCircle size={11} /> Occupied</>}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 mb-4">
                <button
                  onClick={() => openEdit(spot)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-luxury-surface transition-colors"
                  title="Edit spot"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteSpot(spot.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete spot"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Daily',   value: spot.dailyRate   },
                  { label: 'Weekly',  value: spot.weeklyRate  },
                  { label: 'Monthly', value: spot.monthlyRate },
                ].map(r => (
                  <div key={r.label} className="text-center p-2 bg-luxury-surface rounded-lg">
                    <p className="text-xs text-gray-400">{r.label}</p>
                    <p className="text-sm text-gold-400 font-semibold">{formatPrice(r.value)}</p>
                  </div>
                ))}
              </div>

              {/* Current occupant */}
              {!spot.isAvailable && spot.professional && (
                <div className="p-3 rounded-lg bg-luxury-surface text-sm text-gray-300 mb-4">
                  <p className="font-medium text-white">{spot.professional.user.fullName}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {spot.professional.rentalPlan?.toLowerCase() ?? 'monthly'} plan
                    {spot.professional.rentalEndDate && ` · until ${new Date(spot.professional.rentalEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                  </p>
                </div>
              )}

              <button
                onClick={() => toggleAvailability(spot.id, spot.isAvailable)}
                className={`w-full text-xs py-2 rounded-lg border transition-colors ${
                  spot.isAvailable
                    ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                    : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                }`}
              >
                Mark as {spot.isAvailable ? 'Occupied' : 'Available'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-luxury-charcoal border border-luxury-border rounded-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-border">
              <h2 className="font-semibold text-white">{modal === 'create' ? 'New Spot' : 'Edit Spot'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Spot Number *</label>
                  <input
                    value={form.spotNumber}
                    onChange={e => setForm(prev => ({ ...prev, spotNumber: e.target.value }))}
                    placeholder="e.g. A1"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="label-luxury">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="input-luxury w-full"
                  >
                    <option value="CHAIR">Chair</option>
                    <option value="ROOM">Room</option>
                    <option value="STATION">Station</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-luxury">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Optional notes about this spot"
                  className="input-luxury w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-luxury">Daily (€) *</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={form.dailyRate}
                    onChange={e => setForm(prev => ({ ...prev, dailyRate: parseFloat(e.target.value) || 0 }))}
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="label-luxury">Weekly (€) *</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={form.weeklyRate}
                    onChange={e => setForm(prev => ({ ...prev, weeklyRate: parseFloat(e.target.value) || 0 }))}
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="label-luxury">Monthly (€) *</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={form.monthlyRate}
                    onChange={e => setForm(prev => ({ ...prev, monthlyRate: parseFloat(e.target.value) || 0 }))}
                    className="input-luxury w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={e => setForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="accent-gold-500"
                />
                <span className="text-sm text-gray-300">Available immediately</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-luxury-border flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={saveSpot} disabled={saving} className="btn-gold">
                {saving ? <div className="luxury-loader !w-4 !h-4 !border-2" /> : <Save size={16} />}
                {modal === 'create' ? 'Create Spot' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
