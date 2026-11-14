import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { togglePatientStatus } from '../services/patientService'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

function PatientDetailModal({ patient, onClose, onPatientUpdate }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const [toggling, setToggling] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!patient) return null

  const handleToggle = async () => {
    try {
      setToggling(true)
      const res = await togglePatientStatus(patient.id, !patient.isDone)
      onPatientUpdate(res.data)
      showToast(
        `Consultation status changed to ${res.data.isDone ? 'Completed' : 'Pending'}`
      )
    } catch (err) {
      showToast('Failed to update consultation status', 'error')
    } finally {
      setToggling(false)
    }
  }

  const copyPhone = () => {
    if (patient.phone) {
      navigator.clipboard.writeText(patient.phone)
      setCopied(true)
      showToast('Phone number copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const medicines = patient.medicines
    ? patient.medicines.split(',').map((m) => m.trim()).filter(Boolean)
    : []

  const formattedDate = patient.appointmentDate
    ? new Date(patient.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not scheduled'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in-up">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Prescription Note Section (visible on print, hidden on screen) */}
        <div id="printable-patient-card" className="p-8 hidden print:block bg-white text-slate-900">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-blue-700">MEDISYNC CLINIC</h1>
              <p className="text-xs text-slate-600 font-medium mt-1">Outpatient Medical Record &amp; Prescription Slip</p>
              <p className="text-xs text-slate-500">Attending Physician: Dr. {user?.username || 'Practitioner'}</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold">Record ID: #{patient.id}</p>
              <p className="text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-xs">
            <div>
              <p><span className="font-bold">Patient Name:</span> {patient.name}</p>
              <p><span className="font-bold">Age / Gender:</span> {patient.age} yrs • {patient.gender}</p>
            </div>
            <div className="text-right">
              <p><span className="font-bold">Phone:</span> {patient.phone}</p>
              <p><span className="font-bold">Appointment:</span> {formattedDate}</p>
            </div>
          </div>

          <div className="py-4 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Diagnosis / Chief Complaint</h3>
            <p className="text-sm font-semibold">{patient.medicalReason || 'General Checkup'}</p>
          </div>

          <div className="py-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-3">Rx / Prescribed Medication</h3>
            {medicines.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm font-medium">
                {medicines.map((m, idx) => (
                  <li key={idx}>{m} — as directed by physician</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic text-slate-500">No prescription medications required.</p>
            )}
          </div>

          <div className="pt-16 mt-8 border-t border-slate-200 flex justify-between items-end text-xs">
            <p className="text-slate-400">Electronically generated via MediSync Practice Platform</p>
            <div className="text-center">
              <div className="w-48 border-b border-slate-400 mb-1"></div>
              <p className="font-bold">Dr. {user?.username || 'Physician'}</p>
              <p className="text-[10px] text-slate-500">Authorized Medical Signature</p>
            </div>
          </div>
        </div>

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              {patient.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{patient.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-semibold">
                  #{patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {patient.age} yrs • {patient.gender}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Print Prescription Slip"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status & Schedule Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Clinical Status
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      patient.isDone ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`}
                  ></span>
                  <span className="text-xs font-bold text-slate-900">
                    {patient.isDone ? 'Consultation Completed' : 'Pending Review'}
                  </span>
                </div>
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    patient.isDone
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  {patient.isDone ? 'Reopen' : 'Mark Done'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Appointment Schedule
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Contact &amp; Identification
            </span>
            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-mono font-bold text-slate-900">{patient.phone || '—'}</span>
              </div>
              {patient.phone && (
                <button
                  onClick={copyPhone}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>

          {/* Chief Complaint / Diagnosis */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Primary Chief Complaint / Clinical Diagnosis
            </span>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 text-xs text-slate-800 leading-relaxed font-medium">
              {patient.medicalReason || 'No specific complaints recorded.'}
            </div>
          </div>

          {/* Prescriptions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Prescribed Medications
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {medicines.length} Active Prescriptions
              </span>
            </div>

            {medicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-sm font-bold">
                      Rx
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{med}</span>
                      <span className="text-[10px] text-slate-500">Take as prescribed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No prescriptions attached.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose()
              navigate(`/patients/edit/${patient.id}`)
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Medical Record
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientDetailModal
