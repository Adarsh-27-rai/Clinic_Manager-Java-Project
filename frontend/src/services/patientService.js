import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/patients'

export const getAllPatients = () => axios.get(BASE_URL)

export const getPatientById = (id) => axios.get(`${BASE_URL}/${id}`)

export const createPatient = (data) => axios.post(BASE_URL, data)

export const updatePatient = (id, data) => axios.put(`${BASE_URL}/${id}`, data)

export const togglePatientStatus = (id, isDone) =>
  axios.patch(`${BASE_URL}/${id}/status`, { isDone })

export const deletePatient = (id) => axios.delete(`${BASE_URL}/${id}`)
