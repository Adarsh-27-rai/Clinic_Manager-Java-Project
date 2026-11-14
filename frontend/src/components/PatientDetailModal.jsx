import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { togglePatientStatus } from '../services/patientService'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function PatientDetailModal({ patient, onClose, onPatientUpdate }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const [updating, setUpdating] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!patient) return null

  const handleToggle = async () => {
    try {
      setUpdating(true)
      const res = await togglePatientStatus(patient.id, !patient.isDone)
      onPatientUpdate(res.data)
      showToast(`Status marked as ${res.data.isDone ? 'Completed' : 'Pending'}`)
    } catch (err) {
      console.error(err)
      showToast('Could not update status', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const copyPhone = () => {
    if (patient.phone) {
      navigator.clipboard.writeText(patient.phone)
      setCopied(true)
      showToast('Phone number copied')
      setTimeout(() => setCopied(false), 2000)
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col shadow-xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable section */}
        <div id="printable-patient-card" className="p-8 hidden print:block bg-white text-slate-900">
          <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">CLINIC PRESCRIPTION &amp; VISIT SUMMARY</h1>
              <p className="text-xs text-slate-600">Physician: Dr. {user?.username || 'Doctor'}</p>
            </div>
            <div className="text-right text-xs">
              <p>ID: #{patient.id}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 text-xs">
            <div>
              <p><span className="font-semibold">Patient:</span> {patient.name}</p>
              <p><span className="font-semibold">Age/Gender:</span> {patient.age} yrs / {patient.gender}</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold">Contact:</span> {patient.phone}</p>
              <p><span className="font-semibold">Appointment:</span> {formattedDate}</p>
            </div>
          </div>

          <div className="py-3 border-b border-slate-200 text-xs">
            <span className="font-semibold block mb-1">Chief Complaint:</span>
            <p>{patient.medicalReason || 'None noted'}</p>
          </div>

          <div className="py-3 text-xs">
            <span className="font-semibold block mb-2">Prescribed Medicines:</span>
            {medicines.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {medicines.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-slate-400">No medications prescribed.</p>
            )}
          </div>

          <div className="pt-12 mt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <p className="text-slate-400">Clinic Management Record</p>
            <div className="text-center">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <p className="font-semibold">Dr. {user?.username}</p>
              <p className="text-[10px] text-slate-400">Signature</p>
            </div>
          </div>
        </div>

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              {patient.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{patient.name}</h2>
              <p className="text-xs text-slate-500">
                {patient.age} yrs • {patient.gender} • #{patient.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100"
              title="Print"
            >
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status & Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Status</span>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${patient.isDone ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {patient.isDone ? 'Completed' : 'Pending'}
                </span>
                <button
                  onClick={handleToggle}
                  disabled={updating}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  {patient.isDone ? 'Mark Pending' : 'Mark Done'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Appointment</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Phone Number</span>
            <div className="p-2.5 border border-slate-200 rounded-xl bg-white flex items-center justify-between">
              <span className="font-mono text-slate-800 font-medium">{patient.phone || '—'}</span>
              {patient.phone && (
                <button
                  onClick={copyPhone}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Chief Complaint / Reason</span>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 leading-relaxed font-medium">
              {patient.medicalReason || 'None recorded'}
            </div>
          </div>

          {/* Medicines */}
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Prescription Medicines</span>
            {medicines.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {medicines.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    💊 {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No medicines prescribed.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose()
              navigate(`/patients/edit/${patient.id}`)
            }}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100"
          >
            Edit Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
