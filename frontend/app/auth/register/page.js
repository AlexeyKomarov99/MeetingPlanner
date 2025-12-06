'use client'
import React from 'react'
//===== components =====//
import RegisterForm from '../../../components/forms/RegisterForm'
import useTranslations from '../../../lib/useTranslations'

const page = () => {
  const t = useTranslations()

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-md p-6 border border-[var(--border-light)] rounded-lg shadow-md'>
        <div className='text-center mb-12'>
          <h4>{t('auth.registerAccount')}</h4>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default page