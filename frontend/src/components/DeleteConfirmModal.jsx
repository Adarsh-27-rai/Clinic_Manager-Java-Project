function DeleteConfirmModal({ patient, isOpen, onCancel, onConfirm, isDeleting }) {
  if (!isOpen || !patient) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Patient Record</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Are you sure you want to delete the clinical record for{' '}
          <span className="font-semibold text-slate-900">{patient.name}</span>? This action is permanent and cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(patient.id)}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              'Delete Record'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
