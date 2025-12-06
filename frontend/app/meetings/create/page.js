'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { meetingSchema } from '../../../lib/validation'
import useStore from '../../../lib/store'
import useTranslations from '../../../lib/useTranslations'
import { useRouter } from 'next/navigation'
import { meetingsAPI } from '../../../lib/api'

const CreateMeetingPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(meetingSchema),
        defaultValues: {
            status: 'planned',
            location_type: 'office'
        }
    })
    const router = useRouter()
    const { addMeeting } = useStore()
    const t = useTranslations()

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
            console.error(t('meetings.createError'), error)
        }
    }

    return (
        <div className='w-full max-w-4xl mx-auto border border-[var(--border-light)] rounded-lg p-5 mt-5'>

            <h2 className='text-[var(--text-primary)] mb-2'>
                {t('meetings.createNewMeeting')} 
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Название */}
                <div>
                    <label className='block text-[var(--text-primary)] mb-2'>
                        {t('meetings.titleLabel')} 
                    </label>
                    <input 
                        {...register('title')}
                        placeholder={t('meetings.titlePlaceholder')} 
                        className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                    />
                    {errors.title && <span className='text-sm text-red-500'>{errors.title.message}</span>}
                </div>

                {/* Описание */}
                <div>
                    <label className='block text-[var(--text-primary)] mb-2'>
                        {t('meetings.descriptionLabel')} 
                    </label>
                    <textarea 
                        {...register('description')}
                        rows="4"
                        placeholder={t('meetings.descriptionPlaceholder')} 
                        className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                    />
                    {errors.description && <span className='text-sm text-red-500'>{errors.description.message}</span>}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    {/* Дата начала */}
                    <div>
                        <label className='block text-[var(--text-primary)] mb-2'>
                            {t('meetings.startTimeLabel')} 
                        </label>
                        <input 
                            type="datetime-local"
                            {...register('start_time')}
                            className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                        />
                        {errors.start_time && <span className='text-sm text-red-500'>{errors.start_time.message}</span>}
                    </div>

                    {/* Дата окончания */}
                    <div>
                        <label className='block text-[var(--text-primary)] mb-2'>
                            {t('meetings.endTimeLabel')} 
                        </label>
                        <input 
                            type="datetime-local"
                            {...register('end_time')}
                            className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                        />
                        {errors.end_time && <span className='text-sm text-red-500'>{errors.end_time.message}</span>}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    {/* Локация */}
                    <div>
                        <label className='block text-[var(--text-primary)] mb-2'>
                            {t('meetings.locationLabel')} 
                        </label>
                        <input 
                            {...register('location')}
                            placeholder={t('meetings.locationPlaceholder')} 
                            className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                        />
                        {errors.location && <span className='text-sm text-red-500'>{errors.location.message}</span>}
                    </div>

                    {/* Тип локации */}
                    <div>
                        <label className='block text-[var(--text-primary)] mb-2'>
                            {t('meetings.locationTypeLabel')} 
                        </label>
                        <select 
                            {...register('location_type')}
                            className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                        >
                            <option value="office">{t('meetings.locationOffice')}</option>
                            <option value="cafe">{t('meetings.locationCafe')}</option>
                            <option value="park">{t('meetings.locationPark')}</option>
                            <option value="gym">{t('meetings.locationGym')}</option>
                            <option value="home">{t('meetings.locationHome')}</option>
                        </select>
                        {errors.location_type && <span className='text-sm text-red-500'>{errors.location_type.message}</span>}
                    </div>
                </div>

                {/* Статус */}
                <div>
                    <label className='block text-[var(--text-primary)] mb-2'>
                        {t('meetings.statusLabel')} 
                    </label>
                    <select 
                        {...register('status')}
                        className='w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:border-[var(--text-accent)] focus:outline-none'
                    >
                        <option value="planned">{t('meetings.statusPlanned')}</option>
                        <option value="active">{t('meetings.statusActive')}</option>
                        <option value="completed">{t('meetings.statusCompleted')}</option>
                        <option value="cancelled">{t('meetings.statusCancelled')}</option>
                        <option value="postponed">{t('meetings.statusPostponed')}</option>
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
                        {t('meetings.cancel')} 
                    </button>
                    <button
                        type="submit"
                        className='btn-accent-color flex-1'
                    >
                        {t('meetings.createButton')} 
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateMeetingPage