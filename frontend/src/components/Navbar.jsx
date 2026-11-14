import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinkClass = (path) =>
    `px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
      isActive(path)
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`

  const handleLogout = () => {
    logout()
    showToast('Signed out successfully')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                MediSync
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 uppercase tracking-wider">
                  Clinic
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Clinical Practice Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200/60 rounded-xl mr-2">
              <Link to="/" className={navLinkClass('/')}>
                Dashboard
              </Link>
              {user && (
                <>
                  <Link to="/patients" className={navLinkClass('/patients')}>
                    Patient Directory
                  </Link>
                  <Link to="/patients/add" className={navLinkClass('/patients/add')}>
                    + New Patient
                  </Link>
                </>
              )}
            </div>

            {/* Auth actions */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      Dr. {user.username}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block leading-tight">
                      ● Active
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                  title="Sign out of portal"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Dashboard
          </Link>
          {user ? (
            <>
              <Link
                to="/patients"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Patient Directory
              </Link>
              <Link
                to="/patients/add"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50"
              >
                + Register Patient
              </Link>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Dr. {user.username}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
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

export default Navbar
