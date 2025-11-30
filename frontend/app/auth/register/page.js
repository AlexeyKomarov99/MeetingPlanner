import React from 'react'
//===== components =====//
import RegisterForm from '../../../components/forms/RegisterForm'

const page = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-md p-6 border border-[var(--border-light)] rounded-lg shadow-md'>
        <div className='text-center mb-12'>
          <h4>Создайте свой аккаунт</h4>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default page