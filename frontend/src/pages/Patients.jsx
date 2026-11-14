import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PatientTable from '../components/PatientTable'
import { getAllPatients } from '../services/patientService'
import { useToast } from '../context/ToastContext'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, PENDING, DONE
  const [genderFilter, setGenderFilter] = useState('ALL') // ALL, Male, Female, Other
  const [sortBy, setSortBy] = useState('APPOINTMENT') // APPOINTMENT, NAME, RECENT
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

  const { showToast } = useToast()

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getAllPatients()
      setPatients(res.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load patient records. Make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handlePatientUpdate = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    )
  }

  const handlePatientDelete = (deletedId) => {
    setPatients((prev) => prev.filter((p) => p.id !== deletedId))
  }

  const total = patients.length
  const completed = patients.filter((p) => p.isDone).length
  const pending = total - completed
  const todayStr = new Date().toISOString().split('T')[0]
  const todayCount = patients.filter((p) => p.appointmentDate?.startsWith(todayStr)).length

  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        if (statusFilter === 'PENDING' && p.isDone) return false
        if (statusFilter === 'DONE' && !p.isDone) return false
        if (genderFilter !== 'ALL' && p.gender !== genderFilter) return false

        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          p.name?.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q) ||
          p.medicalReason?.toLowerCase().includes(q) ||
          p.medicines?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        if (sortBy === 'NAME') return (a.name || '').localeCompare(b.name || '')
        if (sortBy === 'RECENT') return b.id - a.id
        if (!a.appointmentDate) return 1
        if (!b.appointmentDate) return -1
        return new Date(a.appointmentDate) - new Date(b.appointmentDate)
      })
  }, [patients, searchQuery, statusFilter, genderFilter, sortBy])

  const exportCSV = () => {
    if (filteredPatients.length === 0) {
      showToast('No patients to export', 'error')
      return
    }

    const headers = ['ID', 'Name', 'Age', 'Gender', 'Phone', 'Appointment', 'Reason', 'Medicines', 'Status']
    const rows = filteredPatients.map((p) => [
      p.id,
      `"${p.name || ''}"`,
      p.age,
      p.gender,
      `"${p.phone || ''}"`,
      p.appointmentDate || '',
      `"${(p.medicalReason || '').replace(/"/g, '""')}"`,
      `"${(p.medicines || '').replace(/"/g, '""')}"`,
      p.isDone ? 'Completed' : 'Pending',
    ])

    const csvData = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `patients_export_${todayStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredPatients.length} patient records.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {total} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, manage consultations, and update patient prescriptions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            Export CSV
          </button>
          <button
            onClick={loadPatients}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <Link
            to="/patients/add"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            + Add Patient
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Patients</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">Pending Review</span>
          <div className="text-xl font-bold text-amber-600 mt-1">{pending}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Completed</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">{completed}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">Today's Visits</span>
          <div className="text-xl font-bold text-blue-600 mt-1">{todayCount}</div>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, diagnosis..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end text-xs">
          {/* Status filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl font-semibold text-slate-600">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Pending ({pending})
            </button>
            <button
              onClick={() => setStatusFilter('DONE')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'DONE' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Done ({completed})
            </button>
          </div>

          {/* Gender */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer"
          >
            <option value="APPOINTMENT">By Date</option>
            <option value="NAME">Name (A-Z)</option>
            <option value="RECENT">Newest First</option>
          </select>

          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-400'
              }`}
              title="Table view"
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-400'
              }`}
              title="Grid view"
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Loading patients...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadPatients}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <PatientTable
          patients={filteredPatients}
          onPatientUpdate={handlePatientUpdate}
          onPatientDelete={handlePatientDelete}
          viewMode={viewMode}
        />
      )}
    </div>
  )
}
