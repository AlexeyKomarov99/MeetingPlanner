'use client'

import useStore from '../lib/store'
import { meetingsAPI } from '../lib/api'
import { useEffect, useState } from 'react'

export default function Home() {
  const { theme, user } = useStore()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  // Загрузка встреч при монтировании
  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = async () => {
    try {
      setLoading(true)
      const response = await meetingsAPI.getMeetings()
      setMeetings(response.data)
    } catch (error) {
      console.error('Ошибка загрузки встреч:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ваши встречи
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Планируйте и управляйте встречами эффективно. Создавайте события, 
            приглашайте участников и отслеживайте статусы.
          </p>
        </div>

        {/* Кнопка создания встречи */}
        <div className="text-center mb-12">
          <button className="bg-indigo-500 text-white px-8 py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg font-semibold text-lg">
            + Создать новую встречу
          </button>
        </div>

        {/* Список встреч */}
        <div className="space-y-6">
          {loading ? (
            // Загрузка
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-600">Загружаем встречи...</p>
            </div>
          ) : meetings.length === 0 ? (
            // Пустой список
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Пока нет встреч
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Создайте первую встречу и пригласите участников
              </p>
            </div>
          ) : (
            // Список встреч
            meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {meeting.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {meeting.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>🗓️ {new Date(meeting.start_time).toLocaleDateString()}</span>
                      <span>⏰ {new Date(meeting.start_time).toLocaleTimeString()}</span>
                      <span>📍 {meeting.location}</span>
                    </div>
                  </div>
                  <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors">
                    Подробнее
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  )
}