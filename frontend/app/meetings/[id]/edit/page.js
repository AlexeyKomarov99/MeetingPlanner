'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { meetingsAPI } from '../../../../lib/api'
import useStore from '../../../../lib/store'
import useTranslations from '../../../../lib/useTranslations'
//===== icons =====//
import { MdKeyboardArrowLeft as ArrowLeftIcon } from "react-icons/md"
import { LuClock as ClockIcon } from "react-icons/lu"
import { RiMapPinLine as LocationMapIcon } from "react-icons/ri"

export default function EditMeetingPage() {
  const params = useParams()
  const router = useRouter()
  const { updateMeeting } = useStore()
  const t = useTranslations()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [meeting, setMeeting] = useState(null)
  
  // Форма
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    location_type: 'office',
    start_time: '',
    end_time: '',
    status: 'planned'
  })

  // Загружаем данные встречи
  useEffect(() => {
    loadMeeting()
  }, [params.id])

  const loadMeeting = async () => {
    try {
      setLoading(true)
      const response = await meetingsAPI.getMeeting(params.id)
      const data = response.data
      setMeeting(data)
      
      // Заполняем форму данными встречи
      setFormData({
        title: data.title,
        description: data.description,
        location: data.location,
        location_type: data.location_type || 'office',
        start_time: formatDateTimeLocal(data.start_time),
        end_time: formatDateTimeLocal(data.end_time),
        status: data.status
      })
    } catch (error) {
      console.error(t('meetings.loadError'), error)
    } finally {
      setLoading(false)
    }
  }

  // Форматирование даты для input[type="datetime-local"]
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  // Обработчик изменений формы
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await meetingsAPI.updateMeeting(params.id, formData)
      updateMeeting(params.id, response.data)
      router.push(`/meetings/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error(t('meetings.updateError'), error)
      alert(t('meetings.updateFailed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='w-full max-w-7xl mx-auto text-center py-12'>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--border-light)]"></div>
        <p className="mt-4 text-[var(--text-primary)]">{t('app.loading')}</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className='w-full max-w-7xl mx-auto text-center py-12'>
        <h2 className='text-[var(--text-primary)] mb-2'>{t('meetings.notFound')}</h2>
        <Link 
          href="/" 
          className="text-[var(--text-accent)] hover:text-[var(--accent-purple)] transition-colors"
        >
          {t('meetings.backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto mb-20 pt-5 pb-5'>
      {/* Внутренняя навигация по пути мероприятий */}
      <div className='flex items-center gap-2 mb-6 text-sm'>
        <Link 
          href="/" 
          className="text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors"
        >
          {t('meetings.allMeetings')}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <Link 
          href={`/meetings/${params.id}`} 
          className="text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors"
        >
          {meeting.title}
        </Link>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--text-primary)] font-medium">{t('meetings.editing')}</span>
      </div>

      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <h2 className='text-[var(--text-primary)]'>{t('meetings.editMeeting')}</h2>
        <Link
          href={`/meetings/${params.id}`}
          className='flex items-center px-4 py-2 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-accent)] hover:text-[var(--text-primary)] transition-opacity cursor-pointer bg-[var(--bg-accent)] hover:opacity-90 duration-200'
        >
          <ArrowLeftIcon className="mr-2 fill-white" />
          <span className='text-[#fff]'>{t('meetings.backToMeeting')}</span>
        </Link>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="border border-[var(--border-light)] rounded-lg p-6">
          <h4 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            {t('meetings.basicInfo')}
          </h4>
          
          <div className="space-y-4">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                {t('meetings.titleLabel')}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                placeholder={t('meetings.titlePlaceholder')}
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                {t('meetings.descriptionLabel')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                placeholder={t('meetings.descriptionPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Дата и время */}
        <div className="border border-[var(--border-light)] rounded-lg p-6">
          <h4 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            {t('meetings.dateTime')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Начало */}
            <div>
              <label className="flex items-center text-sm font-medium text-[var(--text-primary)] mb-2">
                <ClockIcon className="mr-2" />
                {t('meetings.startTimeLabel')}
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
              />
            </div>

            {/* Окончание */}
            <div>
              <label className="flex items-center text-sm font-medium text-[var(--text-primary)] mb-2">
                <ClockIcon className="mr-2" />
                {t('meetings.endTimeLabel')}
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Место проведения */}
        <div className="border border-[var(--border-light)] rounded-lg p-6">
          <h4 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            {t('meetings.locationSection')}
          </h4>
          
          <div className="space-y-4">
            {/* Тип места */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                {t('meetings.locationTypeLabel')}
              </label>
              <select
                name="location_type"
                value={formData.location_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
              >
                <option value="office">{t('meetings.locationOffice')}</option>
                <option value="cafe">{t('meetings.locationCafe')}</option>
                <option value="park">{t('meetings.locationPark')}</option>
                <option value="gym">{t('meetings.locationGym')}</option>
                <option value="home">{t('meetings.locationHome')}</option>
              </select>
            </div>

            {/* Адрес */}
            <div>
              <label className="flex items-center text-sm font-medium text-[var(--text-primary)] mb-2">
                <LocationMapIcon className="mr-2" />
                {t('meetings.addressLabel')}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                placeholder={t('meetings.addressPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Статус */}
        <div className="border border-[var(--border-light)] rounded-lg p-6">
          <h4 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            {t('meetings.statusSection')}
          </h4>
          
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'planned', label: t('meetings.statusPlanned'), color: 'bg-yellow-500' },
              { value: 'active', label: t('meetings.statusActive'), color: 'bg-blue-500' },
              { value: 'completed', label: t('meetings.statusCompleted'), color: 'bg-green-500' },
              { value: 'cancelled', label: t('meetings.statusCancelled'), color: 'bg-red-500' },
              { value: 'postponed', label: t('meetings.statusPostponed'), color: 'bg-orange-500' }
            ].map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                className={`px-4 py-2 rounded-lg border border-[var(--border-light)] cursor-pointer ${
                  formData.status === status.value 
                    ? `${status.color} text-white` 
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-between pt-6 border-t border-[var(--border-light)]">
          <Link
            href={`/meetings/${params.id}`}
            className="px-6 py-3 rounded-lg border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200"
          >
            {t('meetings.cancel')}
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-[var(--bg-accent)] text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t('meetings.saving') : t('meetings.saveChanges')}
          </button>
        </div>
      </form>
    </div>
  )
}