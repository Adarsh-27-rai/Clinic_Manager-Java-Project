import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PatientTable from '../components/PatientTable'
import { getAllPatients } from '../services/patientService'
import { useToast } from '../context/ToastContext'

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, PENDING, DONE
  const [genderFilter, setGenderFilter] = useState('ALL') // ALL, Male, Female, Other
  const [sortBy, setSortBy] = useState('APPOINTMENT') // APPOINTMENT, NAME, RECENT
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

  const { showToast } = useToast()

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllPatients()
      setPatients(response.data || [])
    } catch (err) {
      setError(
        'Could not load patients. Please make sure the Spring Boot backend is active.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handlePatientUpdate = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    )
  }

  const handlePatientDelete = (deletedId) => {
    setPatients((prev) => prev.filter((p) => p.id !== deletedId))
  }

  // Derived metrics
  const totalCount = patients.length
  const doneCount = patients.filter((p) => p.isDone).length
  const pendingCount = totalCount - doneCount
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
  const todayStr = new Date().toISOString().split('T')[0]
  const todayCount = patients.filter(
    (p) => p.appointmentDate && p.appointmentDate.startsWith(todayStr)
  ).length

  // Filtered & Sorted patients
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        // Status filter
        if (statusFilter === 'PENDING' && p.isDone) return false
        if (statusFilter === 'DONE' && !p.isDone) return false

        // Gender filter
        if (genderFilter !== 'ALL' && p.gender !== genderFilter) return false

        // Search filter
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase()
        const matchName = p.name?.toLowerCase().includes(query)
        const matchPhone = p.phone?.toLowerCase().includes(query)
        const matchReason = p.medicalReason?.toLowerCase().includes(query)
        const matchMeds = p.medicines?.toLowerCase().includes(query)
        return matchName || matchPhone || matchReason || matchMeds
      })
      .sort((a, b) => {
        if (sortBy === 'NAME') {
          return (a.name || '').localeCompare(b.name || '')
        }
        if (sortBy === 'RECENT') {
          return b.id - a.id
        }
        // Default: APPOINTMENT
        if (!a.appointmentDate) return 1
        if (!b.appointmentDate) return -1
        return new Date(a.appointmentDate) - new Date(b.appointmentDate)
      })
  }, [patients, searchQuery, statusFilter, genderFilter, sortBy])

  // Export CSV
  const handleExportCSV = () => {
    if (filteredPatients.length === 0) {
      showToast('No patients to export', 'error')
      return
    }

    const headers = [
      'ID',
      'Name',
      'Age',
      'Gender',
      'Phone',
      'Appointment Date',
      'Diagnosis / Chief Complaint',
      'Medicines Prescribed',
      'Status',
    ]

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

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `medisync_patients_${todayStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredPatients.length} records to CSV`)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              {totalCount} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Review outpatient charts, consult status, and pharmaceutical prescriptions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Export filtered patients to CSV"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>

          {/* Refresh button */}
          <button
            onClick={fetchPatients}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Registry"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Add patient button */}
          <Link
            to="/patients/add"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all hover:shadow-md flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            + Register Patient
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Patients</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
              👥
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Practitioner patient registry</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Consults</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
              ⏳
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Awaiting clinical review</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{doneCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">{completionRate}% done</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Visits</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
              📅
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600">{todayCount}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Scheduled for today</div>
        </div>
      </div>

      {/* Filter, Search, and View Mode Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Search input */}
        <div className="relative w-full md:w-72">
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, diagnosis..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Status Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('DONE')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'DONE'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Done ({doneCount})
            </button>
          </div>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="APPOINTMENT">By Date</option>
            <option value="NAME">Name (A-Z)</option>
            <option value="RECENT">Recent</option>
          </select>

          {/* View Mode Toggle (Table vs Grid) */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table view"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card Grid view"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-16 bg-white rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-bold text-slate-600">Loading patient registry...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="text-xs font-semibold">{error}</span>
          </div>
          <button
            onClick={fetchPatients}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Patient Table or Grid View */}
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

export default Patients
