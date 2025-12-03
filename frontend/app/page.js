'use client'
import { useState } from 'react'
import Link from 'next/link'
//===== utils =====//
import getTime from '../utils/timeFormat'
import getDayNumber from '../utils/dayFormat'
import getMonthName from '../utils/monthFormat'
import getYearNumber from '../utils/yearFormat'
//===== components =====//
import { MeetingCard } from '../components/ui/MeetingCard'
import useStore from '../lib/store'
import { GoPlus as PlusIcon } from "react-icons/go"

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const { user, lastUpdate } = useStore()

  // Статусы с сервера
  const statuses = [
    { value: 'all', label: 'Все', color: 'bg-gray-500' },
    { value: 'planned', label: 'Запланированные', color: 'bg-yellow-500' },
    { value: 'active', label: 'Активные', color: 'bg-blue-400' },
    { value: 'completed', label: 'Завершенные', color: 'bg-green-400' },
    { value: 'cancelled', label: 'Отмененные', color: 'bg-red-400' },
    { value: 'postponed', label: 'Перенесенные', color: 'bg-orange-400' }
  ]

  // Объединяем встречи пользователя
  const allUserMeetings = [
    ...(user?.created_meetings || []),
    ...(user?.participating_meetings || [])
  ]

  // Фильтрация
  const filteredMeetings = allUserMeetings.filter(meeting => 
    filter === 'all' ? true : meeting.status === filter
  )

  // Форматирование
  const meetingsFormatted = filteredMeetings.map((meeting) => ({
    meeting_id: meeting.meeting_id,
    title: meeting.title,
    description: meeting.description,
    start_time: {
      day: getDayNumber(meeting.start_time),
      month: getMonthName(meeting.start_time),
      year: getYearNumber(meeting.start_time),
      time: getTime(meeting.start_time),
    },
    end_time: {
      day: getDayNumber(meeting.end_time),
      month: getMonthName(meeting.end_time),
      year: getYearNumber(meeting.end_time),
      time: getTime(meeting.end_time),
    },
    location: meeting.location,
    status: meeting.status,
    creator: meeting.creator_id
  }))

  return (
    <main className='bg-[var(--bg-primary)]'>
      <div className='w-full max-w-7xl mx-auto min-h-screen pt-5 pb-5'>
        <h2 className='mb-5'>Мои встречи</h2>

        {/* Кнопки фильтров */}
        <div className='flex items-center justify-between mb-5'>
          <div className='flex flex-wrap gap-3'>
            {statuses.map((status) => (
              <button 
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  filter === status.value 
                    ? `${status.color} text-white` 
                    : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <Link 
            href={'/meetings/create'}
            className='flex items-center px-4 py-2 rounded-lg cursor-pointer bg-[var(--bg-accent)] space-x-1 hover:opacity-90 transition-opacity duration-200'
          >
            <PlusIcon className='text-[#fff]' />
            <span className='text-[#fff]'>Создать мероприятие</span>
          </Link>
        </div>

        {/* Информация о фильтре */}
        <div className="mb-5 text-sm text-[var(--text-secondary)]">
          {filter === 'all' && 'Показаны все встречи'}
          {filter === 'PLANNED' && 'Показаны встречи со статусом "Запланированные"'}
          {filter === 'ACTIVE' && 'Показаны встречи со статусом "Активные"'}
          {filter === 'COMPLETED' && 'Показаны встречи со статусом "Завершенные"'}
          {filter === 'CANCELLED' && 'Показаны встречи со статусом "Отмененные"'}
          {filter === 'POSTPONED' && 'Показаны встречи со статусом "Перенесенные"'}
          <span className="ml-2">({filteredMeetings.length} из {allUserMeetings.length})</span>
        </div>

        {/* Список встреч */}
        <div>
          {!user ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--border-light)]"></div>
              <p className="mt-4 text-[var(--text-primary)]">Загрузка данных...</p>
            </div>
          ) : meetingsFormatted.length === 0 ? (
            <div className="text-center py-12 rounded-2xl shadow-sm border">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                {filter === 'all' ? 'Пока нет встреч' : 
                 `Нет встреч со статусом "${statuses.find(s => s.value === filter)?.label}"`}
              </h3>
              <p className="text-[var(--text-primary)] max-w-md mx-auto">
                {filter === 'all' ? 'Создайте первую встречу' : 'Попробуйте изменить фильтр'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {meetingsFormatted.map((meeting) => (
                <MeetingCard 
                  key={meeting.meeting_id}  
                  meeting={meeting} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}