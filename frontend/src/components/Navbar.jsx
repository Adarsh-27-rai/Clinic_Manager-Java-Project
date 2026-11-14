import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    showToast('You have been signed out.')
    navigate('/login')
  }

  const linkStyle = (path) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      isActive(path)
        ? 'bg-blue-600 text-white'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Title */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
              +
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                Clinic Manager
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Doctor's Outpatient Log</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
              <Link to="/" className={linkStyle('/')}>
                Dashboard
              </Link>
              {user && (
                <>
                  <Link to="/patients" className={linkStyle('/patients')}>
                    Patients
                  </Link>
                  <Link to="/patients/add" className={linkStyle('/patients/add')}>
                    + Add Patient
                  </Link>
                </>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <span className="text-xs font-semibold text-slate-700">
                  Dr. {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Dashboard
          </Link>
          {user ? (
            <>
              <Link
                to="/patients"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Patients
              </Link>
              <Link
                to="/patients/add"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-blue-600 rounded-lg hover:bg-blue-50"
              >
                + Add Patient
              </Link>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Dr. {user.username}</span>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    handleLogout()
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
