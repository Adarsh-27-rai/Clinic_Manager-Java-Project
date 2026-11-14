import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import { getPatientById, updatePatient } from '../services/patientService'

function EditPatient() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatientById(id)
        setPatient(response.data)
      } catch (err) {
        setError('Could not load patient data. Patient may not exist.')
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
  }, [id])

  const handleSubmit = async (data) => {
    try {
      await updatePatient(id, data)
      alert('Patient updated successfully!')
      navigate('/patients')
    } catch (err) {
      alert('Failed to update patient. Please try again.')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading patient data...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
        ⚠️ {error}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Edit Patient Profile</h1>
        <p className="text-slate-500 mt-2">Update the medical information and personal details for {patient.name}.</p>
      </div>
      <div className="glass-card rounded-2xl p-8 border border-white/60">
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
