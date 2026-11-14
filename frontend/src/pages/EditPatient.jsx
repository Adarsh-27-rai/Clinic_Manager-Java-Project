import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import { getPatientById, updatePatient } from '../services/patientService'
import { useToast } from '../context/ToastContext'

function EditPatient() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getPatientById(id)
        setPatient(response.data)
      } catch (err) {
        setError('Could not load patient profile. The record may not exist or has been removed.')
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
  }, [id])

  const handleSubmit = async (data) => {
    try {
      await updatePatient(id, data)
      showToast(`Updated record for ${data.name} successfully!`)
      navigate('/patients')
    } catch (err) {
      showToast('Failed to update patient profile. Please try again.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading patient profile...</p>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl">
          <p className="font-semibold text-sm mb-4">⚠️ {error || 'Patient not found'}</p>
          <Link
            to="/patients"
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors inline-block"
          >
            ← Return to Patient Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-6 animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Patient Directory
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Patient Profile
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              ID #{patient.id}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Update clinical diagnosis, prescriptions, or contact details for{' '}
            <span className="font-semibold text-slate-800">{patient.name}</span>.
          </p>
        </div>

        <PatientForm
          initialData={patient}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}

export default EditPatient
