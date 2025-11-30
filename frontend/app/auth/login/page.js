import React from 'react'
//===== components =====//
import Logo from '../../../components/ui/Logo'
import LoginForm from '../../../components/forms/LoginForm'

const page = () => {

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-md p-6 border border-[var(--border-light)] rounded-lg shadow-md'>
        <div className='flex justify-center mb-6'>
          <Logo />
        </div>
        <div className='text-center mb-4'>
          <h4>Добро пожаловать обратно!</h4>
          <span>Войдите в свою учетную запись</span>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export default page