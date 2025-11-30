'use client'
import { useEffect, useState } from 'react'
import {useParams} from 'next/navigation'
import { meetingsAPI } from '../../../lib/api'
//===== assets =====//
import { IoCalendarOutline as CalendarIcon } from "react-icons/io5"
import { LuClock as ClockIcon } from "react-icons/lu"
import { RiMapPinLine as LocationMapIcon } from "react-icons/ri"
//===== utils =====//
import getTime from '../../../utils/timeFormat'
import getDayNumber from '../../../utils/dayFormat'
import getMonthName from '../../../utils/monthFormat'
import getYearNumber from '../../../utils/yearFormat'

const page = () => {
  const params = useParams()
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeeting()
  }, [params.id])

  const loadMeeting = async () => {
    try {
      setLoading(true)
      const response = await meetingsAPI.getMeeting(params.id)
      setMeeting(response.data)
    } catch (error) {
      console.error('Ошибка загрузки мероприятия по id: ', error)
    }
    finally {
      setLoading(false)
    }
  }

  const title = meeting?.title
  const day = getDayNumber(meeting?.start_time)
  const month = getMonthName(meeting?.start_time)
  const year = getYearNumber(meeting?.start_time)
  const startTime = getTime(meeting?.start_time)
  const endTime = getTime(meeting?.end_time)
  const location = meeting?.location
  const description = meeting?.description

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <h2 className='text-[var(--text-primary)] mb-2'>{title}</h2>

      <div className='flex flex-row space-x-4 mb-4'>
        <div className='flex items-center space-x-1'>
          <CalendarIcon className='icon' style={{color: 'var(--text-accent)'}} />
          <span className='text-[var(--text-secondary)]'>{month} </span>
          <span className='text-[var(--text-secondary)]'>{day}, </span>
          <span className='text-[var(--text-secondary)]'>{year}</span>
        </div>
        <div className='flex items-center space-x-1'>
          <ClockIcon className='icon' style={{color: 'var(--text-accent)'}} />
          <span className='text-[var(--text-secondary)]'>{startTime} -</span>
          <span className='text-[var(--text-secondary)]'>{endTime}</span>
        </div>
        <div className='flex items-center space-x-1'>
          <LocationMapIcon className='icon' style={{color: 'var(--text-accent)'}} />
          <span className='text-[var(--text-secondary)]'>{location}</span>
        </div>
        <div className='py-2 px-4 bg-[var(--bg-accent)] rounded-lg text-[#f1f5f9]'>
          Запланированно
        </div>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>Описание встречи</h5>
        <span>{description}</span>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>Место встречи</h5>
        <img className='h-96 w-full object-cover rounded-2xl mb-2' src="/images/cafe.jpg" alt='Фото кафе' />
        <span>{location}</span>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>Участники</h5>
      </div>

    </div>
  )
}

export default page