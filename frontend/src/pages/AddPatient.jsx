import { Link, useNavigate } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import { createPatient } from '../services/patientService'
import { useToast } from '../context/ToastContext'

function AddPatient() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (data) => {
    try {
      await createPatient(data)
      showToast(`Patient ${data.name} registered successfully!`)
      navigate('/patients')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register patient. Please check backend.'
      showToast(msg, 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 animate-fade-in-up">
      {/* Breadcrumb / Back button */}
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register New Clinical Patient
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the patient's personal records, appointment details, and prescription medications.
          </p>
        </div>

        <PatientForm onSubmit={handleSubmit} submitLabel="Register Patient" />
      </div>
    </div>
  )
}

export default AddPatient
