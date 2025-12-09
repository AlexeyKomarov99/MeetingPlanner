'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { meetingsAPI } from '../../../lib/api'
import useStore from '../../../lib/store'
import useTranslations from '../../../lib/useTranslations'
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
import ParticipantManager from '../../../components/ui/ParticipantManager'

const MeetingDetailPage = () => {
  const params = useParams()
  const router = useRouter();
  const { removeMeeting } = useStore();
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [participants, setParticipants] = useState([])
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const t = useTranslations()

  // Проверка, что пользователь является создателем
  const { user } = useStore()
  const isCreator = user?.user_id === meeting?.creator_id

  useEffect(() => {
    if (params.id) {
      loadMeeting()
      loadParticipants()
    }
  }, [params.id])

  const loadParticipants = async () => {
    try {
      setParticipantsLoading(true)
      const response = await meetingsAPI.getParticipants(params.id)
      setParticipants(response.data)
    } catch (error) {
      console.error('Ошибка загрузки участников:', error)
    } finally {
      setParticipantsLoading(false)
    }
  }

  const loadMeeting = async () => {
    try {
      setLoading(true)
      const response = await meetingsAPI.getMeeting(params.id)
      setMeeting(response.data)
    } catch (error) {
      console.error(t('meetings.loadError'), error)
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
      console.error(t('meetings.deleteError'), error);
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
        <p className="mt-4 text-[var(--text-primary)]">{t('meetings.loadingMeeting')}</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className='w-full max-w-7xl mx-auto text-center py-12'>
        <h2 className='text-[var(--text-primary)] mb-2'>{t('meetings.notFound')}</h2>
        <p className="text-[var(--text-secondary)]">{t('meetings.tryAnother')}</p>
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
    office: t('meetings.locationOffice'),
    cafe: t('meetings.locationCafe'), 
    park: t('meetings.locationPark'),
    gym: t('meetings.locationGym'),
    home: t('meetings.locationHome')
  };

  return (
    <div className='w-full max-w-7xl mx-auto pt-5 pb-5'>

      <Link
        href={`/`}
        className='mb-4 flex items-center cursor-pointer transition-colors duration-200 group'>
        <ArrowLeftIcon className='text-[var(--text-accent)] group-hover:text-[var(--accent-purple)]' />
        <span className='text-sm text-[var(--text-accent)] group-hover:text-[var(--accent-purple)]'>
          {t('meetings.backToList')}
        </span>
      </Link>

      <div className='flex justify-between'>
        <h2 className='text-[var(--text-primary)] mb-2'>{title}</h2>
        <div className='flex space-x-3'>
          <Link
            href={`${meeting.meeting_id}/edit`}
            className='flex items-center justify-center px-4 py-1 rounded-lg cursor-pointer bg-[var(--bg-accent)] text-[#fff] hover:opacity-90 transition-all duration-200'
          >
            {t('meetings.editMeeting')}
          </Link>
          <div 
            className='flex items-center justify-center px-4 py-1 rounded-lg cursor-pointer bg-red-500 text-[#fff] hover:bg-red-600 transition-all duration-200'
            onClick={openDeleteModal}
          >
            {t('meetings.deleteMeeting')}
          </div>
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
          <span className='text-[var(--text-secondary)]'>{startTime} - </span>
          <span className='text-[var(--text-secondary)]'>{endTime}</span>
        </div>
        <div className='flex items-center space-x-1'>
          <LocationMapIcon className='icon' style={{color: 'var(--text-accent)'}} />
          <span className='text-[var(--text-secondary)]'>{location}</span>
        </div>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>
          {t('meetings.descriptionTitle')}
        </h5>
        <span>{description}</span>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <h5 className='text-[var(--text-primary)] mb-4'>
          {t('meetings.locationTitle')}
        </h5>
        <img 
          className='h-96 w-full object-cover rounded-2xl mb-2' 
          src={locationImage} 
          alt={t('meetings.locationImageAlt', { type: locationTypeLabels[meeting.location_type] })} 
        />
        <div>
          <div className="font-medium text-[var(--text-primary)]">
            {locationTypeLabels[meeting.location_type] || t('meetings.locationOffice')}
          </div>
        </div>
      </div>

      {/* Секция участников (только если есть участники) */}
      {(participants.length > 0 || isCreator) && (
        <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
          <h5 className='text-[var(--text-primary)] mb-4'>
            {t('participants.title')}
          </h5>
          
          <ParticipantManager 
            meetingId={params.id}
            participants={participants}
            isCreator={isCreator}
            onParticipantsUpdate={loadParticipants}
          />
        </div>
      )}

      {/* Модальное окно подтверждения */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg text-center font-semibold text-[var(--text-primary)] mb-2">
              {t('meetings.deleteConfirmationTitle')}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {t('meetings.deleteConfirmationText')}
            </p>
            
            <div className="flex justify-between space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                {t('meetings.cancel')}
              </button>
              <button
                onClick={deleteMeeting}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? t('meetings.deleting') : t('meetings.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default MeetingDetailPage