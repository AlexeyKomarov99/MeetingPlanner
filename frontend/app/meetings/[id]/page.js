'use client'
import { useEffect, useState } from 'react'
import {useParams, useRouter} from 'next/navigation'
import Link from 'next/link'
import { meetingsAPI } from '../../../lib/api'
import useStore from '../../../lib/store'
//===== assets =====//
import { IoCalendarOutline as CalendarIcon } from "react-icons/io5"
import { LuClock as ClockIcon } from "react-icons/lu"
import { RiMapPinLine as LocationMapIcon } from "react-icons/ri"
//===== utils =====//
import getTime from '../../../utils/timeFormat'
import getDayNumber from '../../../utils/dayFormat'
import getMonthName from '../../../utils/monthFormat'
import getYearNumber from '../../../utils/yearFormat'
//===== components =====//
import { MdKeyboardArrowLeft as ArrowLeftIcon } from "react-icons/md"

const page = () => {
  const params = useParams()
  const router = useRouter();
  const { removeMeeting } = useStore();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMeeting()
  }, [params.id])

  const loadMeeting = async () => {
    try {
      setLoading(true)
      const response = await meetingsAPI.getMeeting(params.id)
      setMeeting(response.data)
    } catch (error) {
      console.error('Ошибка загрузки мероприятия: ', error)
    }
    finally {
      setLoading(false)
    }
  }

  const deleteMeeting = async () => {
    setIsDeleting(true);
    try {
      await meetingsAPI.deleteMeeting(params.id);
      removeMeeting(params.id);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Ошибка удаления мероприятия: ', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // Добавьте проверку на loading и meeting
  if (loading) {
    return (
      <div className='w-full max-w-7xl mx-auto text-center py-12'>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--border-light)]"></div>
        <p className="mt-4 text-[var(--text-primary)]">Загрузка встречи...</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className='w-full max-w-7xl mx-auto text-center py-12'>
        <h2 className='text-[var(--text-primary)] mb-2'>Встреча не найдена</h2>
        <p className="text-[var(--text-secondary)]">Попробуйте выбрать другую встречу</p>
      </div>
    )
  }

  const title = meeting?.title
  const day = getDayNumber(meeting?.start_time)
  const month = getMonthName(meeting?.start_time)
  const year = getYearNumber(meeting?.start_time)
  const startTime = getTime(meeting?.start_time)
  const endTime = getTime(meeting?.end_time)
  const location = meeting?.location
  const description = meeting?.description
  const locationImage = meeting?.location_type 
  ? `/images/${meeting.location_type}.jpg`
  : '/images/office.jpg';
  const locationTypeLabels = {
    office: 'Офис',
    cafe: 'Кафе', 
    park: 'Парк',
    gym: 'Спортзал',
    home: 'Дом'
  };

  return (
    <div className='w-full max-w-7xl mx-auto'>

      <Link
        href={`/`}
        className='mb-4 flex items-center cursor-pointer transition-colors duration-200 group'>
        <ArrowLeftIcon className='text-[var(--text-accent)] group-hover:text-[var(--accent-purple)]' />
        <span className='text-sm text-[var(--text-accent)] group-hover:text-[var(--accent-purple)]'>Вернуться к списку мероприятий</span>
      </Link>

      <div className='flex justify-between'>
        <h2 className='text-[var(--text-primary)] mb-2'>{title}</h2>
        <div className='flex space-x-3'>
          <div className='flex items-center justify-center px-4 py-1 rounded-lg cursor-pointer bg-[var(--bg-accent)] text-[#fff] hover:opacity-90 transition-all duration-200'>Изменить мероприятие</div>
          <div 
            className='flex items-center justify-center px-4 py-1 rounded-lg cursor-pointer bg-red-500 text-[#fff] hover:bg-red-600 transition-all duration-200'
            onClick={openDeleteModal}
          >Удалить мероприятие</div>
        </div>
      </div>

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
        {/* <div className='py-2 px-4 bg-[var(--bg-accent)] rounded-lg text-[#f1f5f9]'>
          Запланированно
        </div> */}
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>Описание встречи</h5>
        <span>{description}</span>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>Место встречи</h5>
        <img 
          className='h-96 w-full object-cover rounded-2xl mb-2' 
          src={locationImage} 
          alt={`Фото ${meeting.location_type}`} 
        />
       <div>
        <div className="font-medium text-[var(--text-primary)]">
          {locationTypeLabels[meeting.location_type] || 'Офис'}
        </div>
      </div>
      </div>

      {/* <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>Участники</h5>
      </div> */}

      {/* Модальное окно подтверждения */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg text-center font-semibold text-[var(--text-primary)] mb-2">
              Подтверждение удаления
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Вы уверены, что желаете удалить мероприятие? Это действие нельзя отменить.
            </p>
            
            <div className="flex justify-between space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                onClick={deleteMeeting}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default page