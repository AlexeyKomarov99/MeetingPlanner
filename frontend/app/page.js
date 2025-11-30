'use client'
import { meetingsAPI } from '../lib/api'
import { useEffect, useState } from 'react'
//===== utils =====//
import getTime from '../utils/timeFormat'
import getDayNumber from '../utils/dayFormat'
import getMonthName from '../utils/monthFormat'
import getYearNumber from '../utils/yearFormat'
//===== components =====//
import { MeetingCard } from '../components/ui/MeetingCard'

export default function Home() {

  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

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
    }
    finally {
      setLoading(false)
    }
  }

  const meetingsFormatted = meetings.map((meeting) => {
    return {
      id: meeting.id,
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
      creator: meeting.creator_id
    }
  })

  return (
    <main className='bg-[var(--bg-primary)] '>
      <div className='w-full max-w-7xl mx-auto min-height: 100vh pt-5 pb-5'>
        <h2 className='mb-5'>Предстоящие встречи</h2>

        <div className='flex space-x-5 mb-5'>
          <span className='bg-[var(--bg-secondary)] px-4 py-2 rounded-lg cursor-pointer'>Все</span>
          <span className='bg-[var(--bg-secondary)] px-4 py-2 rounded-lg cursor-pointer'>Предстоящие</span>
          <span className='bg-[var(--bg-secondary)] px-4 py-2 rounded-lg cursor-pointer'>Прошедшие</span>
          <span className='bg-[var(--bg-secondary)] px-4 py-2 rounded-lg cursor-pointer'>Созданные мною</span>
        </div>

        <div>
          {loading ? (
            // Загрузка
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-accent)]"></div>
              <p className="mt-4 text-[var(--text-primary)]">Загружаем встречи...</p>
            </div>
          ) : meetingsFormatted.length === 0 ? (
              // Пустой список
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Пока нет встреч
                </h3>
                <p className="text-[var(--text-primary)] max-w-md mx-auto">
                  Создайте первую встречу и пригласите участников
                </p>
              </div>
            ) : (
              // Список встреч
              <div className='grid grid-cols-3 gap-4'>
                {meetingsFormatted.map((meeting) => (
                  <MeetingCard 
                    key={meeting.id}  
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