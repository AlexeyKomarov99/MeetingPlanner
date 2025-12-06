'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
//===== utils =====//
import getTime from '../utils/timeFormat'
import getDayNumber from '../utils/dayFormat'
import getMonthName from '../utils/monthFormat'
import getYearNumber from '../utils/yearFormat'
//===== components =====//
import { MeetingCard } from '../components/ui/MeetingCard'
import useStore from '../lib/store'
import { GoPlus as PlusIcon } from "react-icons/go"
import MeetingCardSkeleton from '../components/ui/MeetingCardSkeleton'
import useTranslations from '../lib/useTranslations'

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const { user, lastUpdate, accessToken } = useStore()
  const [visibleCount, setVisibleCount] = useState(10)
  const [hasChecked, setHasChecked] = useState(false)
  const t = useTranslations()
  
  // Редирект, если пользователь не авторизован
  useEffect(() => {
    if (hasChecked) return;
    
    if (!accessToken) {
      redirect('/auth/login');
    }
    
    setHasChecked(true);
  }, [accessToken, hasChecked]);

  // Статусы с сервера
  const statuses = [
    { value: 'all', label: t('meetings.all'), color: 'bg-gray-500' },
    { value: 'planned', label: t('meetings.planned'), color: 'bg-yellow-500' },
    { value: 'active', label: t('meetings.active'), color: 'bg-blue-400' },
    { value: 'completed', label: t('meetings.completed'), color: 'bg-green-400' },
    { value: 'cancelled', label: t('meetings.cancelled'), color: 'bg-red-400' },
    { value: 'postponed', label: t('meetings.postponed'), color: 'bg-orange-400' }
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

  // Видимые карточки
  const visibleMeetings = meetingsFormatted.slice(0, visibleCount)
  const hasMore = meetingsFormatted.length > visibleCount

  // Функция показать еще
  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Функция сброса при изменении фильтра
  useEffect(() => {
    setVisibleCount(10);
  }, [filter]);

  useEffect(() => {
    if (user && lastUpdate) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [user, lastUpdate])

  return (
    <div className='w-full max-w-7xl mx-auto pt-5 pb-5'>
      <h2 className='mb-5'>{t('meetings.myMeetings')}</h2>

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
          <span className='text-[#fff]'>{t('meetings.createMeeting')}</span>
        </Link>
      </div>

      {/* Информация о фильтре */}
      <div className="mb-5 text-sm text-[var(--text-secondary)]">
        {filter === 'all' && t('meetings.showingAll')}
        {filter === 'planned' && t('meetings.showingPlanned')}
        {filter === 'active' && t('meetings.showingActive')}
        {filter === 'completed' && t('meetings.showingCompleted')}
        {filter === 'cancelled' && t('meetings.showingCancelled')}
        {filter === 'postponed' && t('meetings.showingPostponed')}
        <span className="ml-2">({t('meetings.showingCount', { visible: visibleMeetings.length, total: meetingsFormatted.length })})</span> {/* ← ПЕРЕВОД */}
      </div>

      {/* Список встреч */}
      <div>
        {!user ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--border-light)]"></div>
            <p className="mt-4 text-[var(--text-primary)]">{t('meetings.loadingData')}</p> 
          </div>
        ) : isLoading ? (
          // Skeleton
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <MeetingCardSkeleton key={i} />
            ))}
          </div>
        ) : meetingsFormatted.length === 0 ? (
          <div className="text-center py-12 rounded-2xl shadow-sm border">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              {filter === 'all' 
                ? t('meetings.noMeetings') 
                : t('meetings.noMeetingsWithStatus', { status: statuses.find(s => s.value === filter)?.label })}
            </h3>
            <p className="text-[var(--text-primary)] max-w-md mx-auto">
              {filter === 'all' 
                ? t('meetings.createFirstMeeting') 
                : t('meetings.tryChangeFilter')}
            </p>
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
                  {t('meetings.showMore', { count: meetingsFormatted.length - visibleCount })}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}