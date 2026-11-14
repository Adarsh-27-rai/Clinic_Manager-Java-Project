import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { togglePatientStatus, deletePatient } from '../services/patientService'
import { useToast } from '../context/ToastContext'
import PatientDetailModal from './PatientDetailModal'
import DeleteConfirmModal from './DeleteConfirmModal'

function PatientTable({
  patients,
  onPatientUpdate,
  onPatientDelete,
  viewMode = 'table', // 'table' or 'grid'
}) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientToDelete, setPatientToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const handleToggleDone = async (patient, e) => {
    e.stopPropagation()
    setTogglingId(patient.id)
    try {
      const res = await togglePatientStatus(patient.id, !patient.isDone)
      onPatientUpdate(res.data)
      showToast(
        `Consultation status updated: ${res.data.isDone ? 'Completed' : 'Pending'}`
      )
    } catch (err) {
      showToast('Failed to update patient status', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleConfirmDelete = async (id) => {
    try {
      setIsDeleting(true)
      await deletePatient(id)
      onPatientDelete(id)
      showToast('Patient record deleted successfully')
      setPatientToDelete(null)
    } catch (err) {
      showToast('Failed to delete patient record', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (patients.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">No matching patient records</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No records match your active search or filter. Modify your query or register a new clinical patient.
        </p>
      </div>
    )
  }

  return (
    <>
      {viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => {
            const meds = patient.medicines
              ? patient.medicines.split(',').map((m) => m.trim()).filter(Boolean)
              : []
            const isDone = patient.isDone

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {patient.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4
                          className={`font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors ${
                            isDone ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {patient.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {patient.age} yrs • {patient.gender} • #{patient.id}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleDone(patient, e)}
                      disabled={togglingId === patient.id}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                      title={isDone ? 'Reopen Consultation' : 'Mark as Completed'}
                    >
                      {isDone ? '✓ Done' : 'Pending'}
                    </button>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-slate-900">Diagnosis: </span>
                      {patient.medicalReason || '—'}
                    </p>
                  </div>

                  {/* Prescriptions */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {meds.slice(0, 3).map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        💊 {m}
                      </span>
                    ))}
                    {meds.length > 3 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        +{meds.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {patient.phone || '—'}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/patients/edit/${patient.id}`)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPatientToDelete(patient)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Patient Details</th>
                  <th className="px-5 py-3.5">Phone Contact</th>
                  <th className="px-5 py-3.5">Appointment</th>
                  <th className="px-5 py-3.5">Chief Complaint</th>
                  <th className="px-5 py-3.5">Prescriptions</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient, index) => {
                  const meds = patient.medicines
                    ? patient.medicines.split(',').map((m) => m.trim()).filter(Boolean)
                    : []
                  const isDone = patient.isDone

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 font-mono text-slate-400">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {patient.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span
                              className={`font-bold text-slate-900 block text-xs group-hover:text-blue-600 transition-colors ${
                                isDone ? 'line-through opacity-60 text-slate-500' : ''
                              }`}
                            >
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {patient.age} yrs • {patient.gender}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-slate-600 bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/50">
                          {patient.phone || '—'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {patient.appointmentDate ? (
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {new Date(patient.appointmentDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block max-w-[160px] truncate text-slate-700 font-medium"
                          title={patient.medicalReason}
                        >
                          {patient.medicalReason || '—'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {meds.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                              {meds[0]}
                            </span>
                            {meds.length > 1 && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                +{meds.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleDone(patient, e)}
                          disabled={togglingId === patient.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          }`}
                          title={isDone ? 'Mark as Pending' : 'Mark as Done'}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDone ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
                            }`}
                          ></span>
                          {isDone ? 'Completed' : 'Pending'}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Chart"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => navigate(`/patients/edit/${patient.id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => setPatientToDelete(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {/* Patient Detail Modal */}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        patient={patientToDelete}
        isOpen={!!patientToDelete}
        onCancel={() => setPatientToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default PatientTable
