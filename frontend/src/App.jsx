import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Patients from './pages/Patients'
import AddPatient from './pages/AddPatient'
import EditPatient from './pages/EditPatient'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <Patients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/add"
                  element={
                    <ProtectedRoute>
                      <AddPatient />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditPatient />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
