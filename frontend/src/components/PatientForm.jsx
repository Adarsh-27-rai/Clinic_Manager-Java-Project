import { useState } from 'react'

const COMMON_DRUGS = [
  'Paracetamol',
  'Dolo 650',
  'Amoxicillin',
  'Azithromycin',
  'Ibuprofen',
  'Cetirizine',
  'Omeprazole',
  'Pantoprazole',
  'Metformin',
  'Cough Syrup',
  'Vitamin C',
  'Zinc Tablets',
]

export default function PatientForm({ initialData, onSubmit, submitLabel = 'Save Patient' }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age !== undefined ? initialData.age : '',
    gender: initialData?.gender || '',
    phone: initialData?.phone || '',
    medicalReason: initialData?.medicalReason || '',
    appointmentDate: initialData?.appointmentDate
      ? initialData.appointmentDate.split('T')[0]
      : '',
    isDone: initialData?.isDone || false,
  })

  const [selectedMedicines, setSelectedMedicines] = useState(() => {
    if (initialData?.medicines) {
      return initialData.medicines
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)
    }
    return []
  })

  const [customMed, setCustomMed] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Patient name is required'
    if (formData.age === '' || isNaN(formData.age) || Number(formData.age) < 0) {
      errs.age = 'Please enter a valid age'
    }
    if (!formData.gender) errs.gender = 'Please select a gender'
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required'
    }
    if (!formData.medicalReason.trim()) {
      errs.medicalReason = 'Please enter medical reason or diagnosis'
    }
    if (!formData.appointmentDate) {
      errs.appointmentDate = 'Please select appointment date'
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const setPresetDate = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    const formatted = d.toISOString().split('T')[0]
    setFormData((prev) => ({ ...prev, appointmentDate: formatted }))
    if (errors.appointmentDate) {
      setErrors((prev) => ({ ...prev, appointmentDate: '' }))
    }
  }

  const toggleDrug = (drug) => {
    setSelectedMedicines((prev) =>
      prev.includes(drug) ? prev.filter((d) => d !== drug) : [...prev, drug]
    )
  }

  const handleAddCustomDrug = (e) => {
    e.preventDefault()
    const trimmed = customMed.trim()
    if (trimmed && !selectedMedicines.includes(trimmed)) {
      setSelectedMedicines((prev) => [...prev, trimmed])
      setCustomMed('')
    }
  }

  const removeDrug = (drug) => {
    setSelectedMedicines((prev) => prev.filter((d) => d !== drug))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSaving(true)
      await onSubmit({
        ...formData,
        age: parseInt(formData.age, 10),
        medicines: selectedMedicines.join(','),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          Patient Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Adarsh Rai"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 24"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-rose-500 mt-1">{errors.gender}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Appointment & Medical Reason */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          Visit Details
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Appointment Date *
              </label>
              <div className="flex gap-1 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPresetDate(0)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(1)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  Tomorrow
                </button>
              </div>
            </div>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className="w-full sm:w-60 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
            />
            {errors.appointmentDate && (
              <p className="text-xs text-rose-500 mt-1">{errors.appointmentDate}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Reason / Symptoms *
            </label>
            <textarea
              name="medicalReason"
              value={formData.medicalReason}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Fever, body ache, sore throat..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 leading-relaxed"
            />
            {errors.medicalReason && (
              <p className="text-xs text-rose-500 mt-1">{errors.medicalReason}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medicines / Prescriptions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prescriptions
          </h3>
          <span className="text-xs text-slate-500">
            {selectedMedicines.length} selected
          </span>
        </div>

        {selectedMedicines.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            {selectedMedicines.map((drug) => (
              <span
                key={drug}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800"
              >
                <span>{drug}</span>
                <button
                  type="button"
                  onClick={() => removeDrug(drug)}
                  className="text-slate-400 hover:text-rose-600 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom Drug Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customMed}
            onChange={(e) => setCustomMed(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustomDrug(e)
              }
            }}
            placeholder="Type medicine name and press Enter..."
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium"
          />
          <button
            type="button"
            onClick={handleAddCustomDrug}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            + Add
          </button>
        </div>

        {/* Common list */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {COMMON_DRUGS.map((drug) => {
            const isSelected = selectedMedicines.includes(drug)
            return (
              <button
                key={drug}
                type="button"
                onClick={() => toggleDrug(drug)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {drug}
              </button>
            )
          })}
        </div>
      </div>

      {/* Consultation Done Checkbox */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
        <label htmlFor="isDone" className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            id="isDone"
            name="isDone"
            checked={formData.isDone}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-800">
            Mark consultation as completed
          </span>
        </label>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            formData.isDone
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {formData.isDone ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Submit Button */}
      <div className="pt-3 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
