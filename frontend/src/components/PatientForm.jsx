import { useState } from 'react'

const MEDICINES_LIST = [
  'Paracetamol',
  'Ibuprofen',
  'Aspirin',
  'Amoxicillin',
  'Azithromycin',
  'Cetirizine',
  'Omeprazole',
  'Metformin',
  'Vitamin C',
  'Vitamin D',
  'Zinc Tablets',
  'Antacid',
  'Cough Syrup',
  'Eye Drops',
  'Insulin',
  'Dolo 650',
  'Pantoprazole',
  'Levocetirizine',
]

function PatientForm({ initialData, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    phone: initialData?.phone || '',
    medicalReason: initialData?.medicalReason || '',
    appointmentDate: initialData?.appointmentDate || '',
    isDone: initialData?.isDone || false,
  })

  const [selectedMedicines, setSelectedMedicines] = useState(() => {
    if (initialData?.medicines) {
      return initialData.medicines.split(',').map(m => m.trim()).filter(Boolean)
    }
    return []
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.age) newErrors.age = 'Age is required'
    else if (Number(formData.age) < 0) newErrors.age = 'Age must be 0 or more'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.medicalReason.trim()) newErrors.medicalReason = 'Medical reason is required'
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleMedicine = (med) => {
    setSelectedMedicines(prev =>
      prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    await onSubmit({
      ...formData,
      age: parseInt(formData.age),
      medicines: selectedMedicines.join(','),
    })
    setLoading(false)
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all shadow-sm ${
      errors[field] ? 'border-red-400 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClass('name')}
          placeholder="e.g. John Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 30"
            min="0"
            className={inputClass('age')}
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass('gender')}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          className={inputClass('phone')}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Appointment Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          className={inputClass('appointmentDate')}
        />
        {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Medical Reason</label>
        <textarea
          name="medicalReason"
          value={formData.medicalReason}
          onChange={handleChange}
          placeholder="e.g. Fever, Cold, Diabetes check-up, Back pain..."
          rows={3}
          className={inputClass('medicalReason')}
        />
        {errors.medicalReason && <p className="text-red-500 text-xs mt-1">{errors.medicalReason}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          Medicines Required
          {selectedMedicines.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
              {selectedMedicines.length} selected
            </span>
          )}
        </label>
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50/80 border border-slate-200 rounded-xl max-h-52 overflow-y-auto shadow-inner">
          {MEDICINES_LIST.map((med) => (
            <label
              key={med}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all select-none border ${
                selectedMedicines.includes(med)
                  ? 'bg-blue-50 border-blue-200 text-blue-800 font-bold shadow-sm'
                  : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm text-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedMedicines.includes(med)}
                onChange={() => toggleMedicine(med)}
                className="w-4 h-4 accent-blue-600 rounded transition-all"
              />
              {med}
            </label>
          ))}
        </div>
        {selectedMedicines.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedMedicines.map(med => (
              <span key={med} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                {med}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl transition-colors hover:bg-emerald-50">
        <input
          type="checkbox"
          id="isDone"
          name="isDone"
          checked={formData.isDone}
          onChange={handleChange}
          className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
        />
        <label htmlFor="isDone" className="text-sm font-bold text-emerald-900 cursor-pointer select-none">
          Treatment complete / Consultation done
        </label>
        {formData.isDone && (
          <span className="ml-auto text-xs text-emerald-600 font-bold px-3 py-1 bg-emerald-100 rounded-full">✓ Done</span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

export default PatientForm
