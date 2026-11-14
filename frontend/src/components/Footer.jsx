function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              +
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">MediSync Clinic Manager</span>
              <span className="text-slate-400 text-xs ml-2">v2.4.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend Core: Connected (Port 8080)</span>
            </div>
            <span>•</span>
            <span>MySQL 8.0</span>
            <span>•</span>
            <span>Spring Boot 3.3</span>
          </div>

          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} MediSync Practice Solutions. All clinical records encrypted.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
