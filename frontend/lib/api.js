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
    const { accessToken } = useStore.getState()
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
        const { refreshToken, refreshTokens, logout } = useStore.getState()
        
        try {
            // Пробуем обновить токен
            const response = await api.post('/api/auth/refresh', { refresh: refreshToken })
            refreshTokens(response.data.tokens)
            
            // Повторяем оригинальный запрос
            error.config.headers.Authorization = `Bearer ${response.data.access}`
            return api.request(error.config)
        } catch (refreshError) {
            // Если refresh не удался - разлогиниваем
            logout()
            window.location.href = '/auth/login'
        }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refresh: refreshToken })
  
}

export const meetingsAPI = {
  getMeetings: () => api.get('/api/meetings/'),
  createMeeting: (meetingData) => api.post('/api/meetings/', meetingData),
  getMeeting: (id) => api.get(`/api/meetings/${id}`),
  updateMeeting: (id, meetingData) => api.put(`/api/meetings/${id}`, meetingData),
  deleteMeeting: (id) => api.delete(`/api/meetings/${id}`)
}

export const usersAPI = {
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (userData) => api.put('/api/users/me', userData),
}

export default api