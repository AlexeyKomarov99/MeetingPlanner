'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../../lib/store'
import Link from 'next/link'
import { authAPI } from '../../lib/api'
import useTranslations from '../../lib/useTranslations'
//===== assets =====//
import { FiSun as SunIcon, FiMoon as MoonIcon } from "react-icons/fi"
//===== components =====//
import Logo from './Logo'

const Header = () => {
    const router = useRouter();
    const { theme, toggleTheme, user, logout: storeLogout, lang, setLang } = useStore()
    const t = useTranslations()
    
    const userFullname = user 
        ? `${user?.name} ${user?.surname}` 
        : t('header.guest') 

    const handleLogout = async () => {
        try {
            await authAPI.logout()
            storeLogout();
            router.push('/auth/login')
            router.refresh()
        } catch (error) {
            console.error(t('header.logoutError'), error); 
            storeLogout();
            router.push('/auth/login')
        }
    };

    return (
        <header className='fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-light)]'>
            <div className='w-full max-w-7xl mx-auto py-5 flex justify-between items-center px-4'>
                <div className='flex items-center space-x-8'>
                    <Logo />
                    <div className='space-x-8 flex items-center'>
                        <Link href='/' className='text-[var(--text-primary)] hover:text-[var(--text-accent)] cursor-pointer'>
                            {t('header.home')} 
                        </Link>
                        <Link href='/profile/edit' className='text-[var(--text-primary)] hover:text-[var(--text-accent)]'>
                            {t('header.settings')} 
                        </Link>
                        {user && (
                            <span 
                                className='text-[var(--text-primary)] hover:text-[var(--text-accent)] transition-colors duration-200 cursor-pointer' 
                                onClick={handleLogout} 
                            >
                                {t('header.logout')} 
                            </span>
                        )}
                    </div>
                </div>
                
                <div className='flex items-center space-x-6'>
                    {/* Тема */}
                    <button
                        onClick={toggleTheme}
                        className='p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors'
                        title={theme === 'light' ? t('header.switchToDark') : t('header.switchToLight')}
                    >
                        {theme === 'light' ? <SunIcon className='icon'/> : <MoonIcon className='icon'/>}
                    </button>
                    
                    {/* Язык */}
                    <button
                        onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                        className='text-sm text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors'
                        title={t('header.changeLanguage')}
                    >
                        {lang === 'ru' ? 'EN' : 'RU'}
                    </button>
                    
                    {/* Пользователь */}
                    <div className='text-[var(--text-secondary)] text-sm'>
                        {userFullname}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header