'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { meetingSchema } from '../../../lib/validation'
import useStore from '../../../lib/store'
import { useRouter } from 'next/navigation'
import {meetingsAPI} from '../../../lib/api'

const page = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(meetingSchema),
      defaultValues: {
        status: 'planned',
        location_type: 'office'
      }
    })
    const router = useRouter()
    const {addMeeting} = useStore()

    const onSubmit = async (data) => {
      try {
        const meetingData = {
          ...data,
          start_time: new Date(data.start_time).toISOString(),
          end_time: new Date(data.end_time).toISOString()
        }
        
        const response = await meetingsAPI.createMeeting(meetingData)
        addMeeting(response.data)
        router.push(`/meetings/${response.data.meeting_id}`)
      } catch (error) {
        console.error('Ошибка создания встречи:', error)
      }
    }

    return (
      <div className='w-full max-w-4xl mx-auto border border-[var(--border-light)] rounded-lg p-5 mt-5'>

        <h2 className='text-[var(--text-primary)] mb-2'>Создать новое мероприятие</h2>
        
         <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Название */}
          <div>
            <label className='block text-[var(--text-primary)] mb-2'>Название встречи</label>
            <input 
              {...register('title')}
              placeholder='Введите название встречи'
              className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
            />
            {errors.title && <span className='text-sm text-red-500'>{errors.title.message}</span>}
          </div>

          {/* Описание */}
          <div>
            <label className='block text-[var(--text-primary)] mb-2'>Описание</label>
            <textarea 
              {...register('description')}
              rows="4"
              placeholder='Опишите детали встречи'
              className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
            />
            {errors.description && <span className='text-sm text-red-500'>{errors.description.message}</span>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Дата начала */}
            <div>
              <label className='block text-[var(--text-primary)] mb-2'>Дата и время начала</label>
              <input 
                type="datetime-local"
                {...register('start_time')}
                className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg  hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
              />
              {errors.start_time && <span className='text-sm text-red-500'>{errors.start_time.message}</span>}
            </div>

            {/* Дата окончания */}
            <div>
              <label className='block text-[var(--text-primary)] mb-2'>Дата и время окончания</label>
              <input 
                type="datetime-local"
                {...register('end_time')}
                className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
              />
              {errors.end_time && <span className='text-sm text-red-500'>{errors.end_time.message}</span>}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Локация */}
            <div>
              <label className='block text-[var(--text-primary)] mb-2'>Место проведения</label>
              <input 
                {...register('location')}
                placeholder='Например: Центральный офис'
                className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
              />
              {errors.location && <span className='text-sm text-red-500'>{errors.location.message}</span>}
            </div>

            {/* Тип локации */}
            <div>
              <label className='block text-[var(--text-primary)] mb-2'>Тип места</label>
              <select 
                {...register('location_type')}
                className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
              >
                <option value="office">Офис</option>
                <option value="cafe">Кафе</option>
                <option value="park">Парк</option>
                <option value="gym">Спортзал</option>
                <option value="home">Дом</option>
              </select>
              {errors.location_type && <span className='text-sm text-red500'>{errors.location_type.message}</span>}
            </div>
          </div>

          {/* Статус */}
          <div>
            <label className='block text-[var(--text-primary)] mb-2'>Статус</label>
            <select 
              {...register('status')}
              className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
            >
              <option value="planned">Запланировано</option>
              <option value="active">Активно</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
              <option value="postponed">Перенесено</option>
            </select>
            {errors.status && <span className='text-sm text-red-500'>{errors.status.message}</span>}
          </div>

          {/* Кнопки */}
          <div className='flex space-x-4 pt-4'>
            <button
              type="button"
              onClick={() => router.back()}
              className='btn-transparent flex-1'
            >
              Отмена
            </button>
            <button
              type="submit"
              className='btn-accent-color flex-1'
            >
              Создать встречу
            </button>
          </div>

        </form>

      </div>
    )
}

export default page