import axios from 'axios'
import useStore from './store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const { user } = useStore.getState()
    if(user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
    }
    return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        useStore.getState().clearUser()
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
}

export const meetingsAPI = {
  getMeetings: () => api.get('/api/meetings/'),
  createMeeting: (meetingData) => api.post('/api/meetings/', meetingData),
  getMeeting: (id) => api.get(`/api/meetings/${id}`),
}

export const usersAPI = {
  getProfile: () => api.get('/api/users/me'),
}

export default api