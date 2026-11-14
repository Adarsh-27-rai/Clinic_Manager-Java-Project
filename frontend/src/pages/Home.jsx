import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      {/* Background abstract gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl shadow-blue-500/30 text-5xl mb-8 transform hover:rotate-12 transition-transform duration-500">
          <span className="drop-shadow-lg text-white">🏥</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-800 mb-6">
          Next-Gen <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Clinic Management</span>
        </h1>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
          A premium, frictionless experience for managing patient records, treatments, and appointments in one place.
        </p>

        <div className="flex gap-4 justify-center mt-10">
          {user ? (
            <>
              <Link
                to="/patients"
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1"
              >
                View Patients
              </Link>
              <Link
                to="/patients/add"
                className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-full shadow-md border border-slate-200 transition-all hover:-translate-y-1"
              >
                + Add New Patient
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-full shadow-md border border-slate-200 transition-all hover:-translate-y-1"
              >
                Register Clinic
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-inner">
            📋
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Patient Records</h3>
          <p className="text-slate-500 leading-relaxed text-sm">Access and manage all registered patients instantly through a lightning-fast data table.</p>
        </div>
        <div className="glass-card rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-inner">
            ✏️
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Edit & Update</h3>
          <p className="text-slate-500 leading-relaxed text-sm">Seamlessly update medical histories, medicines, and appointments with zero friction.</p>
        </div>
        <div className="glass-card rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-inner">
            ✨
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Status Tracking</h3>
          <p className="text-slate-500 leading-relaxed text-sm">Keep track of which treatments are completed and which ones require attention.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
