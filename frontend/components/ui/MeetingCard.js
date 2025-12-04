'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
//===== assets =====//
import { IoCalendarOutline as CalendarIcon } from "react-icons/io5"
import { LuClock as ClockIcon } from "react-icons/lu"
import { RiMapPinLine as LocationMapIcon } from "react-icons/ri"

export const MeetingCard = ({ meeting }) => {
  const pathname = usePathname()
  
  const isProfilePage = pathname?.includes('/profile')
  
  const statusColors = {
    planned: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    postponed: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  
  const statusLabels = {
    planned: 'Запланировано',
    active: 'Активно',
    completed: 'Завершено',
    cancelled: 'Отменено',
    postponed: 'Перенесено'
  }

  return (
    <article className='border border-[var(--border-light)] rounded-lg p-6 flex flex-col h-[350px]'>
      <div className='flex justify-between items-start mb-2'>
        <h5 className='text-[var(--text-primary)] line-clamp-1 flex-1'>{meeting.title}</h5>
        
        {isProfilePage && meeting.status && meeting.status !== 'all' && (
          <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full border ${statusColors[meeting.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {statusLabels[meeting.status] || meeting.status}
          </span>
        )}
      </div>
      
      <div className='flex flex-col mb-2'>
        <div className='flex items-center space-x-1'>
          <CalendarIcon className='icon' style={{color: 'var(--text-secondary)'}} />
          <span className='text-[var(--text-secondary)]'>{meeting.start_time.month} </span>
          <span className='text-[var(--text-secondary)]'>{meeting.start_time.day}, </span>
          <span className='text-[var(--text-secondary)]'>{meeting.start_time.year}</span>
        </div>

        <div className='flex items-center space-x-1'>
          <ClockIcon className='icon' style={{color: 'var(--text-secondary)'}} />
          <span className='text-[var(--text-secondary)]'>{meeting.start_time.time} -</span>
          <span className='text-[var(--text-secondary)]'>{meeting.end_time.time}</span>
        </div>

        <div className='flex items-center space-x-1'>
          <LocationMapIcon className='icon' style={{color: 'var(--text-secondary)'}} />
          <span className='text-[var(--text-secondary)] truncate'>{meeting.location}</span>
        </div>
      </div>

      <div className='flex-1 overflow-hidden mb-4'>
        <p className='text-[var(--text-secondary)] line-clamp-4 text-sm'>
          {meeting.description}
        </p>
      </div>

      <div className='border-t border-[var(--border-light)] mb-4 mt-4'></div>

      <div className='w-full flex justify-end mt-auto'>
        <Link href={`/meetings/${meeting.meeting_id}`} className='btn-transparent'>Подробнее</Link>
      </div>
    </article>
  )
}