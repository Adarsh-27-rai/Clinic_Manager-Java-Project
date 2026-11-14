import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import { getPatientById, updatePatient } from '../services/patientService'
import { useToast } from '../context/ToastContext'

export default function EditPatient() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPatientById(id)
      .then((res) => {
        setPatient(res.data)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not find this patient record.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (data) => {
    try {
      await updatePatient(id, data)
      showToast(`Updated details for ${data.name}.`)
      navigate('/patients')
    } catch (err) {
      console.error(err)
      showToast('Failed to update patient record.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-xs text-slate-400">
        Loading patient details...
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
          <p className="font-semibold mb-2">{error || 'Patient record not found.'}</p>
          <Link to="/patients" className="text-blue-600 underline font-semibold">
            Back to Patients
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-4">
        <Link
          to="/patients"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          ← Back to Patients
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Patient</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update information for {patient.name}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            ID #{patient.id}
          </span>
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
