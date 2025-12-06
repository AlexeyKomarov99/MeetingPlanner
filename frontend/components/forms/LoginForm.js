'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../lib/validation'
import Link from 'next/link'
import { authAPI } from '../../lib/api'
import useStore from '../../lib/store'
import { useRouter } from 'next/navigation'
import useTranslations from '../../lib/useTranslations'

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });
    const { login } = useStore()
    const router = useRouter()
    const t = useTranslations()

    const onSubmit = async (data) => {
        try {
            const response = await authAPI.login(data);
            login(response.data.user, response.data.tokens);
            router.push('/');
        } catch (error) {
            console.error(t('auth.loginError'), error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-3'>
                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>
                      {t('auth.emailLabel')}
                    </label>
                    <input 
                        {...register('email')}
                        placeholder={t('auth.emailPlaceholder')}
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.email && (
                      <span className='text-sm text-red-500'>
                        {errors.email.message}
                      </span>
                    )}
                </div>

                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>
                      {t('auth.passwordLabel')}
                    </label>
                    <input
                        type='password'
                        {...register('password')}
                        placeholder={t('auth.passwordPlaceholder')}
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.password && (
                      <span className='text-sm text-red-500'>
                        {errors.password.message}
                      </span>
                    )}
                </div>

                <div className='text-left mt-2'>
                    <Link 
                        href='/auth/forgot-password' 
                        className='text-[var(--text-primary)] text-sm hover:text-[var(--text-accent)]'
                    >
                        {t('auth.forgotPassword')}
                    </Link>
                </div>

                <button 
                    type='submit' 
                    className='btn-accent-color w-full'
                >
                    {t('app.login')}
                </button>

                <div className='text-center mt-4'>
                    <span className='text-[var(--text-secondary)] text-sm'>
                        {t('auth.noAccount')}{' '}
                        <Link href='/auth/register' className='text-[var(--text-accent)]'>
                            {t('auth.registerLink')}
                        </Link>
                    </span>
                </div>
            </div>
        </form>
    )
}

export default LoginForm