'use client'
import { useState, useEffect } from 'react'
import useStore from '../../../lib/store'
import { usersAPI } from '../../../lib/api'
//===== icons =====//
import { FiUser, FiLock, FiSettings, FiGlobe, FiSun, FiMoon } from 'react-icons/fi'
import { MdPhotoCamera } from 'react-icons/md'
import { FaCheck as CheckIcon } from "react-icons/fa6";

export default function SettingsPage() {
  const { user, theme, lang, accentColor, updateUser, toggleTheme, toggleLang, setAccentColor } = useStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Состояния для формы профиля
  const [profileForm, setProfileForm] = useState({
    name: '',
    surname: '',
    email: '',
    user_photo: ''
  })
  
  // Состояния для смены пароля
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: <FiUser /> },
    { id: 'password', label: 'Пароль', icon: <FiLock /> },
    { id: 'appearance', label: 'Внешний вид', icon: <FiSettings /> },
  ]

  // Загружаем данные пользователя
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        user_photo: user.user_photo || ''
      })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Создаем объект БЕЗ email
      const dataToSend = {
        name: profileForm.name,
        surname: profileForm.surname,
        user_photo: profileForm.user_photo
        // НЕ включаем email
      }
      
      const response = await usersAPI.updateProfile(dataToSend, user.user_id)
      
      updateUser(response.data)
      alert('Профиль успешно обновлен!')
    } catch (error) {
      console.error('Полная ошибка обновления профиля:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      alert('Не удалось обновить профиль')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('Новые пароли не совпадают!')
      return
    }
    
    setSaving(true)
    
    try {
      const response = await usersAPI.updateProfile(
        {
          current_password: passwordForm.current_password,
          password: passwordForm.new_password
        },
        user.user_id
      )
      
      alert('Пароль успешно изменен!')
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      alert('Не удалось сменить пароль')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='w-full max-w-7xl mx-auto text-center py-12'>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--border-light)]"></div>
        <p className="mt-4 text-[var(--text-primary)]">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto pt-5 pb-5'>
      <h2 className='mb-6'>Настройки</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Боковое меню */}
        <div className="lg:w-1/4">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[var(--bg-accent)] text-white' 
                    : 'hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Контент */}
        <div className="lg:w-3/4">
          {/* Секция профиля */}
          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <h3 className="flex items-center space-x-2 mb-6">
                <FiUser />
                <span>Персональная информация</span>
              </h3>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
                  {/* Аватар */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      {profileForm.user_photo ? (
                        <img 
                          src={profileForm.user_photo} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl text-gray-600">
                          {profileForm.name?.[0]}{profileForm.surname?.[0]}
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 bg-[var(--bg-accent)] text-white p-2 rounded-full hover:opacity-90"
                    >
                      <MdPhotoCamera size={20} />
                    </button>
                  </div>
                  
                  {/* Поля формы */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Имя</label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Фамилия</label>
                        <input
                          type="text"
                          name="surname"
                          value={profileForm.surname}
                          onChange={(e) => setProfileForm({...profileForm, surname: e.target.value})}
                          className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        readOnly
                        disabled
                        className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-[var(--bg-accent)] text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </form>
            </div>
          )}

          {/* Секция пароля */}
          {activeTab === 'password' && (
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <h3 className="flex items-center space-x-2 mb-6">
                <FiLock />
                <span>Настройки пароля</span>
              </h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Текущий пароль</label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                    className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Новый пароль</label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                    className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                    required
                    minLength="6"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Подтвердите новый пароль</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                    className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-accent)!important] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-accent)] focus:border-transparent"
                    required
                    minLength="6"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-[var(--bg-accent)] text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Смена пароля...' : 'Сменить пароль'}
                </button>
              </form>
            </div>
          )}

          {/* Секция внешнего вида */}
          {activeTab === 'appearance' && (
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <h3 className="flex items-center space-x-2 mb-6">
                <FiSettings />
                <span>Внешний вид приложения</span>
              </h3>
              
              <div className="space-y-8">
                {/* Тема */}
                <div>
                  <h4 className="flex items-center space-x-2 mb-4 text-[var(--text-primary)]">
                    {theme === 'light' ? <FiSun /> : <FiMoon />}
                    <span>Тема</span>
                  </h4>
                  <div className="flex space-x-4">
                    <button
                      onClick={toggleTheme}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border ${
                        theme === 'light' 
                          ? 'border-[var(--text-primary)] bg-[var(--bg-accent)]/10 text-[var(--text-primary)]' 
                          : 'border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {theme === 'light' ? <FiSun /> : <FiMoon />}
                      <span>{theme === 'light' ? 'Светлая' : 'Тёмная'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Язык */}
                <div>
                  <h4 className="flex items-center space-x-2 mb-4 text-[var(--text-primary)]">
                    <FiGlobe />
                    <span>Язык</span>
                  </h4>
                  <div className="flex space-x-4">
                    <button
                      onClick={toggleLang}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border ${
                        lang === 'ru' 
                          ? 'border-[var(--text-primary)] bg-[var(--bg-accent)]/10 text-[var(--text-primary)]' 
                          : 'border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <span>{lang === 'ru' ? 'Русский' : 'English'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Акцентный цвет */}
                <div>
                  <h4 className="mb-4 text-[var(--text-primary)]">Акцентный цвет</h4>
                  <div className="flex space-x-4">
                    {[
                      { value: 'indigo', color: '#6366F1', label: 'Индиго' },
                      { value: 'purple', color: '#8B5CF6', label: 'Пурпурный' },
                      { value: 'blue', color: '#3B82F6', label: 'Синий' },
                      { value: 'emerald', color: '#10B981', label: 'Изумрудный' }
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setAccentColor(item.value)}
                        className="flex flex-col items-center"
                        title={item.label}
                      >
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-full mb-2 flex items-center justify-center"
                            style={{ backgroundColor: item.color }}
                          >
                            {accentColor === item.value && (
                              <CheckIcon className="w-6 h-6 text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}