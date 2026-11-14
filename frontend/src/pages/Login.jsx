import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/patients'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Please provide both username and password.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const user = await login(username, password)
      showToast(`Welcome back, Dr. ${user.username}!`)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password. Please try again.'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoAccount = () => {
    setUsername('testdoctor')
    setPassword('password123')
    setError(null)
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Staff Sign In</h1>
        <p className="text-slate-500 mt-1.5 text-xs">Access your clinic's patient records and outpatient registry</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md">
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-start gap-2.5">
            <span className="text-base leading-none">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Practitioner Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(null)
              }}
              placeholder="e.g. testdoctor"
              autoComplete="username"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 text-xs mt-3 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Quick demo autofill button */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors"
          >
            💡 Click to autofill test account (<span className="font-mono">testdoctor</span>)
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          New clinic branch?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
