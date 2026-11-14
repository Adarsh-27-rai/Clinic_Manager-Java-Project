import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const linkClass = (path) =>
    `px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
      location.pathname === path
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
    }`

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            🏥
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">
            Clinic Manager
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 p-1 bg-slate-100/60 rounded-full border border-slate-200/50 backdrop-blur-sm">
            <Link to="/" className={linkClass('/')}>Dashboard</Link>
            {user && (
              <>
                <Link to="/patients" className={linkClass('/patients')}>Patients</Link>
                <Link to="/patients/add" className={linkClass('/patients/add')}>+ Add Patient</Link>
              </>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
