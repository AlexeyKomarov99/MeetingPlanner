'use client'
import React from 'react'
import useStore from '../../lib/store'
import Link from 'next/link'
//===== assets =====//
import { LuCircleUserRound } from "react-icons/lu"

const page = () => {

  const {user} = useStore()

  const photo = user ? user.photo : <LuCircleUserRound className='' style={{width: '96px', height: '96px'}} />
  const fullName = user ? user.fullname : 'Иванов Иван'
  const email = user ? user.email : 'Ivanov@yandex.ru'

  return (
    <div className='w-full max-w-7xl mx-auto'>

      <div className='flex justify-between items-center border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        {/* Левая часть */}
        <div className='flex items-center'>
          <span className='mr-4'>{photo}</span>
          <div className='flex flex-col'>
            <h3>{fullName}</h3>
            <span>{email}</span>
          </div>
        </div>

        {/* Правая часть */}
        <Link href='/profile/edit' className='btn-transparent'>Изменить профиль</Link>
      </div>

      <div className='border border-[var(--border-light)] rounded-lg p-5 mb-4'>
        <span>Встречи, которые я провожу</span>
        <span>Встречи, которые я посещаю</span>
      </div>


    </div>
  )
}

export default page