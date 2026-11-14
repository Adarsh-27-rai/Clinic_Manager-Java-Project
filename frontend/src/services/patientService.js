import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api/patients',
})

API.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      if (user?.id) {
        config.headers['X-User-Id'] = user.id.toString()
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e)
    }
  }
  return config
})

export const getAllPatients = () => API.get('')

export const getPatientById = (id) => API.get(`/${id}`)

export const createPatient = (data) => API.post('', data)

export const updatePatient = (id, data) => API.put(`/${id}`, data)

export const togglePatientStatus = (id, isDone) =>
  API.patch(`/${id}/status`, { isDone })

export const deletePatient = (id) => API.delete(`/${id}`)
