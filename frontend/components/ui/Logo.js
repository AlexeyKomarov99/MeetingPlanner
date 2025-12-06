'use client'
import React from 'react'
import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa'
import useTranslations from '../../lib/useTranslations'

const Logo = () => {
  const t = useTranslations()
  
  return (
    <div className='flex items-center'>
        <CalendarIcon className='mr-2 main-icon' style={{ color: 'var(--text-accent)' }}/>
        <h4 className='' style={{ color: 'var(--text-accent)' }}>
          {t('app.title')}
        </h4>
    </div>
  )
}

export default Logo