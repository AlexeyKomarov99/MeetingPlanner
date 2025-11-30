import React from 'react'
import Link from 'next/link'
//===== assets =====//
import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa'

const Logo = () => {
  return (
    <Link 
        href='/'
        className='flex items-center cursor-pointer'
    >
        <CalendarIcon className='mr-2 main-icon' style={{ color: 'var(--text-accent)' }}/>
        <h4 className='' style={{ color: 'var(--text-accent)' }}>Планировщик встреч</h4>
    </Link>
  )
}

export default Logo