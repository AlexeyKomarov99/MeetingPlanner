import { jwtVerify } from 'jose'

export async function verifyToken(token) {
  try {
    if (!token) return false;
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const { payload } = await jwtVerify(token, secret)
    
    // Проверяем что токен access, а не refresh
    if (payload.type !== 'access') return false
    
    // Проверяем срок действия
    if (payload.exp && Date.now() >= payload.exp * 1000) return false
    
    return true
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return false;
  }
}

// Дополнительно: функция для получения payload
export async function decodeToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}