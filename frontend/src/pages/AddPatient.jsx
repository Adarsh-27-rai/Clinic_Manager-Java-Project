import { useNavigate } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import { createPatient } from '../services/patientService'

function AddPatient() {
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    try {
      await createPatient(data)
      alert('Patient added successfully!')
      navigate('/patients')
    } catch (err) {
      alert('Failed to add patient. Please check that the backend is running.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Register New Patient</h1>
        <p className="text-slate-500 mt-2">Enter the patient's details below to register them in the clinic.</p>
      </div>
      <div className="glass-card rounded-2xl p-8 border border-white/60">
        <PatientForm onSubmit={handleSubmit} submitLabel="Register Patient" />
      </div>
    </div>
  )
}

export default AddPatient
