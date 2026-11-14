import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PatientTable from '../components/PatientTable'
import { getAllPatients } from '../services/patientService'

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllPatients()
      setPatients(response.data)
    } catch (err) {
      setError('Could not connect to the backend. Please make sure the Spring Boot server is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handlePatientUpdate = (updatedPatient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p))
  }

  const handlePatientDelete = (deletedId) => {
    setPatients(prev => prev.filter(p => p.id !== deletedId))
  }

  const pending = patients.filter(p => !p.isDone).length
  const done = patients.filter(p => p.isDone).length

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patient Directory</h1>
          {patients.length > 0 && (
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> {pending} Pending
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {done} Completed
              </span>
            </p>
          )}
        </div>
        <Link
          to="/patients/add"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-sm shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Patient
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg className="w-10 h-10 animate-spin text-blue-500 mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="font-medium text-slate-500">Loading directory...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl p-6 text-sm flex items-start gap-3 shadow-sm">
          <span className="text-xl">⚠️</span> 
          <p className="font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <PatientTable
          patients={patients}
          onPatientUpdate={handlePatientUpdate}
          onPatientDelete={handlePatientDelete}
        />
      )}
    </div>
  )
}

export default Patients
