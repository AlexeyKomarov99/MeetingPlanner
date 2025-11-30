'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validation';
import Link from 'next/link';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        console.log('Login data:', data);
        // TODO: API call
    };
    
    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='space-y-3'>
                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>Email</label>
                    <input 
                        {...register('email')}
                        placeholder='Почта'
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
                </div>

                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>Пароль</label>
                    <input
                        type='password'
                        {...register('password')}
                        placeholder="Пароль"
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.password && <span className='text-sm text-red-500'>{errors.password.message}</span>}
                </div>

                <div className='text-left mt-2'>
                    <Link 
                        href='/auth/forgot-password' 
                        className='text-[var(--text-primary)] text-sm hover:text-[var(--text-accent)]'
                    >
                        Забыли пароль?
                    </Link>
                </div>

                <button 
                    type='submit' 
                    className='btn-accent-color w-full'
                >
                    Войти
                </button>

                <div className='text-center mt-4'>
                    <span className='text-[var(--text-secondary)] text-sm'>
                        Нет аккаунта?{' '}
                        <Link href='/auth/register' className='text-[var(--text-accent)]'>
                            Зарегистрируйтесь
                        </Link>
                    </span>
                </div>

            </div>

        </form>
    )
}

export default LoginForm