import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllPatients } from '../services/patientService'
import PatientDetailModal from '../components/PatientDetailModal'

export default function Home() {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getAllPatients()
      .then((res) => {
        setPatients(res.data || [])
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  const total = patients.length
  const completed = patients.filter((p) => p.isDone).length
  const pending = total - completed
  const recentPatients = patients.slice(0, 5)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayAppointments = patients.filter((p) => p.appointmentDate?.startsWith(todayStr))

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-sm text-2xl font-bold mb-6">
            +
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Clinic Patient Management Portal
          </h1>
          <p className="text-slate-600 text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Manage your daily clinic consultations, track patient appointments, and handle prescriptions in one place.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors"
            >
              Register New Doctor
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Patient Records</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Store patient details, contact numbers, age, gender, and visit history.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Prescriptions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add medications to patient charts and print out formatted prescription slips.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Consultation Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Keep track of pending consultations and mark visits complete once done.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, Dr. {user.username}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/patients/add"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            + Add New Patient
          </Link>
          <Link
            to="/patients"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            View All Patients
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</div>
          <div className="text-2xl font-bold text-slate-900 mt-1.5">{total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">In your registry</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Visits</div>
          <div className="text-2xl font-bold text-amber-600 mt-1.5">{pending}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Need consultation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1.5">{completed}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Consultations done</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Today's Visits</div>
          <div className="text-2xl font-bold text-blue-600 mt-1.5">{todayAppointments.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Scheduled for today</div>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Patients</h2>
            <p className="text-xs text-slate-500">Patients recently registered or updated in the system</p>
          </div>
          <Link to="/patients" className="text-xs font-semibold text-blue-600 hover:underline">
            View full directory ({total}) →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading recent patients...</div>
        ) : recentPatients.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {patient.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{patient.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {patient.age} yrs • {patient.gender} • Reason: {patient.medicalReason || 'None'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      patient.isDone
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {patient.isDone ? 'Completed' : 'Pending'}
                  </span>
                  <span className="text-xs text-slate-400">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No patients registered yet.{' '}
            <Link to="/patients/add" className="text-blue-600 font-semibold hover:underline">
              Add your first patient
            </Link>
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onPatientUpdate={(updated) => {
            setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            setSelectedPatient(updated)
          }}
        />
      )}
    </div>
  )
}
