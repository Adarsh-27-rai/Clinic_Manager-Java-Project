import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in-up">
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
    </AuthProvider>
  )
}

export default App
