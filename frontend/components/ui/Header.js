'use client'
import { useEffect } from 'react';
import useStore from '../../lib/store'
import Link from 'next/link'
//===== assets =====//
import { FiSun as SunIcon } from "react-icons/fi";
import { FiMoon as MoonIcon } from "react-icons/fi";
//===== components =====//
import Logo from './Logo';

const Header = () => {
    
    const {theme, toggleTheme, user} = useStore();
    const userFullname = user ? `${user?.name} ${user?.surname}` : 'Default'

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <header className='bg-[var(--bg-primary)]'>
            <div className='w-full max-w-7xl mx-auto py-5 flex justify-between items-center'>
                <Logo />

                <div className='space-x-8 flex items-center'>
                    <Link href='/' className='text-[var(--text-primary)] hover:text-[var(--text-accent)]'>
                        Главная
                    </Link>
                    <Link href='/profile' className='text-[var(--text-primary)] hover:text-[var(--text-accent)]'>
                        Профиль
                    </Link>
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