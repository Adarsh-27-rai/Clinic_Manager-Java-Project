export default function DeleteConfirmModal({ patient, isOpen, onCancel, onConfirm, isDeleting }) {
  if (!isOpen || !patient) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-slate-900 mb-2">Delete Patient?</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Are you sure you want to delete the record for{' '}
          <span className="font-semibold text-slate-900">{patient.name}</span>? This cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(patient.id)}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-semibold disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
