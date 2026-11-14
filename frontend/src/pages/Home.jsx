import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllPatients } from '../services/patientService'
import PatientDetailModal from '../components/PatientDetailModal'

function Home() {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    if (user) {
      setLoading(true)
      getAllPatients()
        .then((res) => setPatients(res.data || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user])

  const total = patients.length
  const completed = patients.filter((p) => p.isDone).length
  const pending = total - completed
  const pendingList = patients.filter((p) => !p.isDone).slice(0, 4)

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-12 animate-fade-in-up">
      {user ? (
        /* Doctor's Command Dashboard */
        <div className="space-y-8">
          {/* Welcome Greeting Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-3 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Clinical Session • {currentDate}
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Welcome Back, Dr. {user.username}
                </h1>
                <p className="text-sm text-blue-100 mt-2 max-w-xl leading-relaxed">
                  Your outpatient registry has <span className="font-bold text-white">{pending}</span> consultation{pending === 1 ? '' : 's'} awaiting review and <span className="font-bold text-white">{completed}</span> completed cases.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/patients/add"
                  className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  Register New Patient
                </Link>
                <Link
                  to="/patients"
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
                >
                  Full Directory →
                </Link>
              </div>
            </div>

            {/* Ambient background glow */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Patients
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">{total}</div>
              <p className="text-[11px] text-slate-500 mt-1">Active database records</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Consultations
              </span>
              <div className="text-3xl font-black text-amber-600 mt-1">{pending}</div>
              <p className="text-[11px] text-amber-700/80 mt-1">Needs doctor attention</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Completed Treatments
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{completed}</div>
              <p className="text-[11px] text-emerald-700/80 mt-1">Discharged &amp; closed</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Platform Status
              </span>
              <div className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                MySQL &amp; Spring Boot Sync
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Port 8080 Connected</p>
            </div>
          </div>

          {/* Priority Pending Patients & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Priority Patients List (2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    Priority Outpatients Awaiting Consult
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Click any patient to inspect clinical chart</p>
                </div>
                <Link
                  to="/patients"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All ({total})
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading patients...</div>
              ) : pendingList.length > 0 ? (
                <div className="space-y-2.5">
                  {pendingList.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className="p-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {p.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {p.age} yrs • {p.gender} • Reason: {p.medicalReason || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-blue-600">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    ✓
                  </div>
                  <p className="text-xs font-bold text-slate-700">All Consultations Completed</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No pending patient cases in queue.</p>
                </div>
              )}
            </div>

            {/* Quick Actions & Protocols (1 col) */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                  Doctor Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/patients/add"
                    className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-blue-600">➕</span> New Outpatient Intake
                    </span>
                    <span>→</span>
                  </Link>

                  <Link
                    to="/patients"
                    className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-indigo-600">📋</span> Patient Charts &amp; History
                    </span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Security & Health Compliance Callout */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Compliance &amp; Scoping
                </span>
                <h4 className="font-bold text-sm">Protected Clinical Records</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every patient record is scoped to your practitioner ID using bcrypt-secured authorization and transactional isolation.
                </p>
              </div>
            </div>
          </div>

          {/* Modal if patient clicked from home */}
          {selectedPatient && (
            <PatientDetailModal
              patient={selectedPatient}
              onClose={() => setSelectedPatient(null)}
              onPatientUpdate={(updated) => {
                setPatients((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                )
                setSelectedPatient(updated)
              }}
            />
          )}
        </div>
      ) : (
        /* Public Landing Hero for Unauthenticated Visitors */
        <div className="space-y-16">
          <div className="text-center max-w-3xl mx-auto pt-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Next-Gen Medical Practice Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Elevate Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                Clinical Workflow
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
              A friction-free management system for private practices, clinics, and outpatient centers. Track consultations, maintain digital prescriptions, and simplify patient visits.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                Sign In to Practitioner Portal
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 transition-all hover:-translate-y-0.5 shadow-xs"
              >
                Register Clinic Branch
              </Link>
            </div>
          </div>

          {/* Three Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 text-xl font-bold">
                📋
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Electronic Medical Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized patient medical histories, chief complaints, appointment schedules, and contact records accessible with instant search.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 text-xl font-bold">
                💊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Prescription Formulations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tag and customize pharmaceutical regimens, print instant official prescription slips, and maintain transparent medication tracking.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 text-xl font-bold">
                ✨
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Consultation Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear distinction between ongoing consultations and completed treatments to avoid waiting room friction and improve throughput.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
