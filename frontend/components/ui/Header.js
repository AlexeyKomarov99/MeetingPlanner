'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../../lib/store'
import Link from 'next/link'
import { authAPI } from '../../lib/api'
//===== assets =====//
import { FiSun as SunIcon } from "react-icons/fi"
import { FiMoon as MoonIcon } from "react-icons/fi"
//===== components =====//
import Logo from './Logo'

const Header = () => {
    const router = useRouter();
    const {theme, toggleTheme, user, logout: storeLogout} = useStore()
    const userFullname = user ? `${user?.name} ${user?.surname}` : 'Гость'

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme]);

    const handleLogout = async () => {
        try {
            await authAPI.logout()
            storeLogout();
            router.push('/auth/login')
            router.refresh()
            
        } catch (error) {
            console.error('Ошибка выхода:', error);
            storeLogout();
            router.push('/auth/login')
        }
    };

    return (
        <header className='sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-light)]'>
            <div className='w-full max-w-7xl mx-auto py-5 flex justify-between items-center'>
                <div className='flex items-center space-x-8'>
                    <Logo />
                    <div className='space-x-8 flex items-center'>
                        <Link href='/' className='text-[var(--text-primary)] hover:text-[var(--text-accent)] cursor-pointer'>
                            Главная
                        </Link>
                        <Link href='/profile' className='text-[var(--text-primary)] hover:text-[var(--text-accent)] cursor-pointer'>
                            Профиль
                        </Link>
                        {user && (
                            <span 
                                className='text-[var(--text-primary)] hover:text-[var(--text-accent)] transition-colors duration-200 cursor-pointer' 
                                onClick={handleLogout} 
                            >Выход</span>
                        )}
                    </div>
                </div>
                
                <div className='flex items-center space-x-4'>
                    <div
                        onClick={toggleTheme}
                    >
                        {theme === 'light' && <SunIcon className='icon'/>}
                        {theme === 'dark' && <MoonIcon className='icon'/>}
                    </div>
                    <div>
                        {userFullname}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header