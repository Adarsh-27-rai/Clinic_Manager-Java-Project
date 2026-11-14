import { Link, useNavigate } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import { createPatient } from '../services/patientService'
import { useToast } from '../context/ToastContext'

export default function AddPatient() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (data) => {
    try {
      await createPatient(data)
      showToast(`Patient ${data.name} added successfully.`)
      navigate('/patients')
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Failed to add patient'
      showToast(msg, 'error')
    }
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
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Add New Patient</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter patient details, visit schedule, and any prescribed medications
          </p>
        </div>

        <PatientForm onSubmit={handleSubmit} submitLabel="Register Patient" />
      </div>
    </div>
  )
}
