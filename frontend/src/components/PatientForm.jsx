import { useState } from 'react'

const CATEGORIZED_MEDICINES = {
  Common: ['Paracetamol', 'Dolo 650', 'Ibuprofen', 'Cetirizine', 'Cough Syrup', 'Antacid Syrup'],
  Antibiotics: ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Doxycycline', 'Metronidazole'],
  Chronic: ['Metformin', 'Omeprazole', 'Pantoprazole', 'Atorvastatin', 'Amlodipine', 'Insulin'],
  Supplements: ['Vitamin C', 'Vitamin D3', 'Zinc Tablets', 'Multivitamin', 'Calcium + D3', 'Iron + Folic'],
}

function PatientForm({ initialData, onSubmit, submitLabel = 'Save Patient Record' }) {
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
  const [activeCategory, setActiveCategory] = useState('Common')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Patient name is required'
    if (formData.age === '' || isNaN(formData.age) || Number(formData.age) < 0) {
      errs.age = 'Please enter a valid age (0-120)'
    }
    if (!formData.gender) errs.gender = 'Please select gender'
    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required'
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number'
    }
    if (!formData.medicalReason.trim()) {
      errs.medicalReason = 'Primary diagnosis or chief complaint is required'
    }
    if (!formData.appointmentDate) {
      errs.appointmentDate = 'Appointment date is required'
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

  const setDateOffset = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    const formatted = d.toISOString().split('T')[0]
    setFormData((prev) => ({ ...prev, appointmentDate: formatted }))
    if (errors.appointmentDate) {
      setErrors((prev) => ({ ...prev, appointmentDate: '' }))
    }
  }

  const toggleMedicine = (med) => {
    setSelectedMedicines((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    )
  }

  const handleAddCustomMed = (e) => {
    e.preventDefault()
    const trimmed = customMed.trim()
    if (trimmed && !selectedMedicines.includes(trimmed)) {
      setSelectedMedicines((prev) => [...prev, trimmed])
      setCustomMed('')
    }
  }

  const handleRemoveMed = (med) => {
    setSelectedMedicines((prev) => prev.filter((m) => m !== med))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSubmitting(true)
      await onSubmit({
        ...formData,
        age: parseInt(formData.age, 10),
        medicines: selectedMedicines.join(','),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Demographics Card */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
          <span>👤</span> Personal &amp; Demographic Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Patient Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-xs focus:outline-none focus:ring-2 font-medium transition-all ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              max="130"
              placeholder="e.g. 29"
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-xs focus:outline-none focus:ring-2 font-medium transition-all ${
                errors.age
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.age && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gender <span className="text-rose-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-xs focus:outline-none focus:ring-2 font-medium transition-all cursor-pointer ${
                errors.gender
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.gender}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Contact Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-xs focus:outline-none focus:ring-2 font-mono transition-all ${
                errors.phone
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Clinical Notes & Appointment Schedule */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
          <span>🩺</span> Clinical Details &amp; Appointment
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Consultation / Appointment Date <span className="text-rose-500">*</span>
              </label>
              {/* Quick Date Presets */}
              <div className="flex gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setDateOffset(0)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDateOffset(1)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setDateOffset(7)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  +1 Week
                </button>
              </div>
            </div>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className={`w-full sm:w-64 px-4 py-2.5 rounded-xl border bg-slate-50 text-xs focus:outline-none focus:ring-2 font-medium cursor-pointer ${
                errors.appointmentDate
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.appointmentDate && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.appointmentDate}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Primary Medical Reason / Chief Complaint <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="medicalReason"
              value={formData.medicalReason}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Acute upper respiratory tract infection, sore throat, mild fever for 2 days..."
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-xs focus:outline-none focus:ring-2 leading-relaxed font-medium ${
                errors.medicalReason
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.medicalReason && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.medicalReason}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medication Prescriptions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>💊</span> Pharmaceutical Prescriptions
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {selectedMedicines.length} Prescribed
          </span>
        </div>

        {/* Selected Medicines Pills */}
        {selectedMedicines.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            {selectedMedicines.map((med) => (
              <span
                key={med}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white border border-blue-200 text-blue-800 shadow-2xs"
              >
                <span>💊 {med}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMed(med)}
                  className="w-4 h-4 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add Custom Drug Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customMed}
            onChange={(e) => setCustomMed(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustomMed(e)
              }
            }}
            placeholder="Type any custom medication and press Enter..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium"
          />
          <button
            type="button"
            onClick={handleAddCustomMed}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            + Add Drug
          </button>
        </div>

        {/* Categorized Medicine Selector */}
        <div className="space-y-2">
          <div className="flex gap-1 border-b border-slate-100 pb-2 text-[11px] font-bold">
            {Object.keys(CATEGORIZED_MEDICINES).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-200/60 max-h-32 overflow-y-auto">
            {CATEGORIZED_MEDICINES[activeCategory]?.map((med) => {
              const isSelected = selectedMedicines.includes(med)
              return (
                <button
                  key={med}
                  type="button"
                  onClick={() => toggleMedicine(med)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {med}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Consultation Status Toggle */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isDone"
            name="isDone"
            checked={formData.isDone}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
          />
          <div>
            <label htmlFor="isDone" className="text-xs font-bold text-slate-900 cursor-pointer block">
              Mark Consultation as Completed
            </label>
            <span className="text-[11px] text-slate-500">
              Check this if consultation examination is finalized and prescriptions are issued.
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-3 py-1 rounded-full ${
            formData.isDone
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          {formData.isDone ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Clinical Record...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}

export default PatientForm
