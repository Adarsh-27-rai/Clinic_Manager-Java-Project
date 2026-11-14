import axios from 'axios'

const AUTH_BASE_URL = 'http://localhost:8080/api/auth'

export const loginUser = async (username, password) => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, { username, password })
  const { userId, username: returnedUsername } = response.data
  const user = { id: userId, username: returnedUsername }
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export const registerUser = async (username, password) => {
  const response = await axios.post(`${AUTH_BASE_URL}/register`, { username, password })
  const { userId, username: returnedUsername } = response.data
  const user = { id: userId, username: returnedUsername }
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('Failed to parse user from localStorage', e)
    return null
  }
}

export const logoutUser = () => {
  localStorage.removeItem('user')
}
