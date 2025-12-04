'use client'
import Link from 'next/link'
//===== assets =====//
import { IoCalendarOutline as CalendarIcon } from "react-icons/io5"
import { LuClock as ClockIcon } from "react-icons/lu"
import { RiMapPinLine as LocationMapIcon } from "react-icons/ri"

export const MeetingCard = ({meeting}) => {
  return (
    <article className='border border-[var(--border-light)] rounded-lg p-6 flex flex-col h-[350px]'>
      <h5 className='text-[var(--text-primary)] mb-2 line-clamp-1'>{meeting.title}</h5>
      
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