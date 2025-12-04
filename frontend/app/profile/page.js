'use client'
import React, { useState, useEffect } from 'react'
import useStore from '../../lib/store'
import Link from 'next/link'
//===== utils =====//
import getTime from '../../utils/timeFormat'
import getDayNumber from '../../utils/dayFormat'
import getMonthName from '../../utils/monthFormat'
import getYearNumber from '../../utils/yearFormat'
//===== components =====//
import { MeetingCard } from '../../components/ui/MeetingCard'
import MeetingCardSkeleton from '../../components/ui/MeetingCardSkeleton'
//===== assets =====//
import { LuCircleUserRound } from "react-icons/lu"

const Page = () => {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('my')
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)

  // Статусы (те же что на главной)
  const statuses = [
    { value: 'all', label: 'Все', color: 'bg-gray-500' },
    { value: 'planned', label: 'Запланированные', color: 'bg-yellow-500' },
    { value: 'active', label: 'Активные', color: 'bg-blue-400' },
    { value: 'completed', label: 'Завершенные', color: 'bg-green-400' },
    { value: 'cancelled', label: 'Отмененные', color: 'bg-red-400' },
    { value: 'postponed', label: 'Перенесенные', color: 'bg-orange-400' }
  ]
  const [filter, setFilter] = useState('all')

  // Получаем мероприятия в зависимости от таба
  const allMeetings = activeTab === 'my' 
    ? user?.created_meetings || []
    : user?.participating_meetings || []

  // Фильтрация по статусу
  const filteredMeetings = allMeetings.filter(meeting => 
    filter === 'all' ? true : meeting.status === filter
  )

  // Форматирование времени
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
    creator: meeting.creator_id,
    // Добавляем флаг для отображения действий
    isCreator: activeTab === 'my' && meeting.creator_id === user?.id
  }))

  // Пагинация
  const visibleMeetings = meetingsFormatted.slice(0, visibleCount)
  const hasMore = meetingsFormatted.length > visibleCount

  const loadMore = () => setVisibleCount(prev => prev + 10)

  useEffect(() => {
    setVisibleCount(10)
  }, [filter, activeTab])

  // Скелетон при загрузке
  useEffect(() => {
    if (user) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [user])

  const photo = user?.photo ? (
    <img 
      src={user.photo} 
      alt="Profile" 
      className="w-24 h-24 rounded-full object-cover border-2 border-[var(--border-light)]"
    />
  ) : (
    <LuCircleUserRound 
      className='text-gray-400' 
      style={{ width: '96px', height: '96px' }} 
    />
  )
  
  const fullName = user ? `${user.name} ${user.surname}` : 'Имя Фамилия'
  const email = user?.email || 'email@example.com'

  return (
    <div className='w-full max-w-7xl mx-auto pt-5 pb-5 px-4'>

      {/* Личные данные */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center border border-[var(--border-light)] rounded-lg p-5 mb-6'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <div className='mr-4'>{photo}</div>
          <div className='flex flex-col'>
            <h3 className='text-xl font-semibold'>{fullName}</h3>
            <span className='text-[var(--text-secondary)]'>{email}</span>
          </div>
        </div>

        <Link 
          href='/profile/edit' 
          className='px-6 py-2.5 rounded-lg bg-[var(--bg-accent)] text-white hover:opacity-90 transition-opacity whitespace-nowrap'
        >
          Настройки
        </Link>
      </div>

      {/* Табы мероприятий */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex space-x-1 p-1 rounded-lg'>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === 'my' 
                ? 'bg-[var(--bg-accent)] text-white' 
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            Мои мероприятия
            <span className='ml-2 text-sm opacity-90'>
              ({user?.created_meetings?.length || 0})
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('group')}
            className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === 'group' 
                ? 'bg-[var(--bg-accent)] text-white' 
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            Групповые мероприятия
            <span className='ml-2 text-sm opacity-90'>
              ({user?.participating_meetings?.length || 0})
            </span>
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className='flex items-center justify-between mb-5'>
        <div className='flex flex-wrap gap-3'>
          {statuses.map((status) => (
            <button 
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                filter === status.value 
                  ? `${status.color} text-white` 
                  : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Информация о фильтре */}
      <div className="mb-5 text-sm text-[var(--text-secondary)]">
        {activeTab === 'my' ? 'Мои мероприятия' : 'Групповые мероприятия'}
        {filter !== 'all' && ` • ${statuses.find(s => s.value === filter)?.label}`}
        <span className="ml-2">({visibleMeetings.length} из {meetingsFormatted.length})</span>
      </div>

      {/* Список встреч */}
      <div>
        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <MeetingCardSkeleton key={i} />
            ))}
          </div>
        ) : meetingsFormatted.length === 0 ? (
          <div className="text-center py-12 rounded-2xl shadow-sm border border-[var(--border-light)]">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              {filter === 'all' 
                ? `Нет ${activeTab === 'my' ? 'созданных' : 'групповых'} мероприятий` 
                : `Нет мероприятий со статусом "${statuses.find(s => s.value === filter)?.label}"`}
            </h3>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              {activeTab === 'my' && filter === 'all' && 'Создайте своё первое мероприятие'}
              {activeTab === 'group' && filter === 'all' && 'Присоединитесь к существующему мероприятию'}
              {filter !== 'all' && 'Попробуйте изменить фильтр'}
            </p>
            <div className="mt-6">
              {activeTab === 'my' && filter === 'all' ? (
                <Link 
                  href="/meetings/create"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[var(--bg-accent)] text-white hover:opacity-90 transition-opacity"
                >
                  Создать мероприятие
                </Link>
              ) : (
                <>
                {/* <Link 
                  href="/meetings"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  Найти мероприятия
                </Link> */}
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {visibleMeetings.map((meeting) => (
                <MeetingCard 
                  key={meeting.meeting_id}  
                  meeting={meeting}
                />
              ))}
            </div>

            {/* Кнопка "Показать еще" */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 rounded-lg bg-[var(--bg-accent)] text-white hover:opacity-90 transition-opacity duration-200"
                >
                  Показать еще ({meetingsFormatted.length - visibleCount})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Page