export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Clinic Manager</span>
          <span>•</span>
          <span>Outpatient Registry &amp; Prescription Records</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  )
}
