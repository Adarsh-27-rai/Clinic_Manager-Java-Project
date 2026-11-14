import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { togglePatientStatus, deletePatient } from '../services/patientService'

function PatientTable({ patients, onPatientUpdate, onPatientDelete }) {
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleToggleDone = async (patient) => {
    setTogglingId(patient.id)
    try {
      const res = await togglePatientStatus(patient.id, !patient.isDone)
      onPatientUpdate(res.data)
    } catch (err) {
      alert('Failed to update status. Make sure the backend is running.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    setConfirmDeleteId(null)
    try {
      await deletePatient(id)
      onPatientDelete(id)
    } catch (err) {
      alert('Failed to delete patient. Make sure the backend is running.')
      setDeletingId(null)
    }
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🏥</div>
        <p className="text-lg font-medium text-gray-600">No patients found.</p>
        <p className="text-sm mt-1">Click "Add Patient" to register your first patient.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl glass-card">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-slate-50/80 border-b border-slate-200/60 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
          <tr>
            <th className="px-5 py-4">#</th>
            <th className="px-5 py-4">Patient</th>
            <th className="px-5 py-4">Age/Gender</th>
            <th className="px-5 py-4">Contact</th>
            <th className="px-5 py-4">Reason</th>
            <th className="px-5 py-4">Appointment</th>
            <th className="px-5 py-4">Medicines</th>
            <th className="px-5 py-4 text-center">Status</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50 bg-white/50">
          {patients.map((patient, index) => (
            <tr
              key={patient.id}
              className={`hover:bg-slate-50/80 transition-colors group ${
                patient.isDone ? 'opacity-70 bg-emerald-50/30' : ''
              }`}
            >
              <td className="px-5 py-4 text-slate-400 font-mono text-xs">{index + 1}</td>

              <td className="px-5 py-4 font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${patient.isDone ? 'bg-emerald-400' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={patient.isDone ? 'line-through text-slate-400' : ''}>{patient.name}</span>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-slate-700 font-medium">{patient.age} yrs</span>
                  <span className="text-xs text-slate-500">{patient.gender}</span>
                </div>
              </td>

              <td className="px-5 py-4 text-slate-600 font-mono text-xs">{patient.phone}</td>

              <td className="px-5 py-4 text-slate-600">
                <span className="block truncate max-w-[120px]" title={patient.medicalReason}>
                  {patient.medicalReason || '—'}
                </span>
              </td>

              <td className="px-5 py-4 text-slate-700 font-medium">
                {patient.appointmentDate ? (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs border border-slate-200">
                    {new Date(patient.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                ) : <span className="text-slate-400">—</span>}
              </td>

              <td className="px-5 py-4">
                {patient.medicines ? (
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {patient.medicines.split(',').map((med) => (
                      <span
                        key={med}
                        className="px-2 py-0.5 bg-blue-50/50 text-blue-700 border border-blue-200/50 text-[10px] uppercase font-bold rounded"
                      >
                        {med.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>

              <td className="px-5 py-4 text-center">
                <button
                  onClick={() => handleToggleDone(patient)}
                  disabled={togglingId === patient.id}
                  title={patient.isDone ? 'Mark as pending' : 'Mark as done'}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${
                    togglingId === patient.id
                      ? 'opacity-50 cursor-wait'
                      : patient.isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  {patient.isDone && (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/patients/edit/${patient.id}`)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  {deletingId === patient.id ? (
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-lg"
                      disabled
                    >
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    </button>
                  ) : confirmDeleteId === patient.id ? (
                    <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-100">
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase font-bold rounded"
                      >
                        Del
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] uppercase font-bold rounded"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(patient.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-100"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PatientTable
