'use client'

import Link from 'next/link'

export default function MeetingCard({ meeting }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {meeting.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {meeting.description}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <span>🗓️</span>
              <span>{formatDate(meeting.start_time)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⏰</span>
              <span>{formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>{meeting.location}</span>
            </div>
          </div>

          {/* Участники (заглушка) */}
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center text-indigo-600 text-xs font-medium">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">+3 участника</span>
          </div>
        </div>

        <Link 
          href={`/meetings/${meeting.id}`}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white transition-colors font-medium"
        >
          Подробнее
        </Link>
      </div>
    </div>
  )
}