import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { togglePatientStatus, deletePatient } from '../services/patientService'
import { useToast } from '../context/ToastContext'
import PatientDetailModal from './PatientDetailModal'
import DeleteConfirmModal from './DeleteConfirmModal'

export default function PatientTable({
  patients,
  onPatientUpdate,
  onPatientDelete,
  viewMode = 'table',
}) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientToDelete, setPatientToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const handleToggle = async (patient, e) => {
    e.stopPropagation()
    setTogglingId(patient.id)
    try {
      const res = await togglePatientStatus(patient.id, !patient.isDone)
      onPatientUpdate(res.data)
      showToast(`Status updated to ${res.data.isDone ? 'Completed' : 'Pending'}`)
    } catch (err) {
      console.error(err)
      showToast('Could not update status', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true)
      await deletePatient(id)
      onPatientDelete(id)
      showToast('Patient record deleted.')
      setPatientToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Failed to delete patient', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (patients.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">No patients found</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or add a new patient.</p>
      </div>
    )
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => {
            const meds = patient.medicines
              ? patient.medicines.split(',').map((m) => m.trim()).filter(Boolean)
              : []

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{patient.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {patient.age} yrs • {patient.gender} • #{patient.id}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleToggle(patient, e)}
                      disabled={togglingId === patient.id}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        patient.isDone
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {patient.isDone ? 'Completed' : 'Pending'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 my-2">
                    <span className="font-medium text-slate-700">Reason: </span>
                    {patient.medicalReason || 'None recorded'}
                  </p>

                  {meds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                      {meds.slice(0, 3).map((m, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                        >
                          {m}
                        </span>
                      ))}
                      {meds.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          +{meds.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="font-mono text-slate-500">{patient.phone || '—'}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/patients/edit/${patient.id}`)}
                      className="text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      Edit
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setPatientToDelete(patient)}
                      className="text-rose-500 hover:text-rose-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Appointment</th>
                  <th className="px-4 py-3">Symptoms / Reason</th>
                  <th className="px-4 py-3">Medicines</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient, index) => {
                  const meds = patient.medicines
                    ? patient.medicines.split(',').map((m) => m.trim()).filter(Boolean)
                    : []

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 font-mono">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">{patient.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {patient.age} yrs • {patient.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">{patient.phone || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {patient.appointmentDate
                          ? new Date(patient.appointmentDate).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">
                        {patient.medicalReason || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {meds.length > 0 ? (
                          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {meds[0]} {meds.length > 1 ? `(+${meds.length - 1})` : ''}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggle(patient, e)}
                          disabled={togglingId === patient.id}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            patient.isDone
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {patient.isDone ? 'Done' : 'Pending'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/patients/edit/${patient.id}`)}
                            className="text-slate-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setPatientToDelete(patient)}
                            className="text-rose-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onPatientUpdate={(updated) => {
            onPatientUpdate(updated)
            setSelectedPatient(updated)
          }}
        />
      )}

      <DeleteConfirmModal
        patient={patientToDelete}
        isOpen={!!patientToDelete}
        onCancel={() => setPatientToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
