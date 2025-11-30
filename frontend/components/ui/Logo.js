import React from 'react'
//===== assets =====//
import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa'

const Logo = () => {
  return (
    <div className='flex items-center'>
        <CalendarIcon className='mr-2 main-icon' style={{ color: 'var(--text-accent)' }}/>
        <h4 className='' style={{ color: 'var(--text-accent)' }}>Планировщик встреч</h4>
    </div>
  )
}

export default Logo