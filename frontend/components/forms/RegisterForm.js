'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../lib/validation';
import Link from 'next/link';

function RegisterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        console.log('Registr data:', data);
        // TODO: API call
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-3'>

                {/* Имя и фамилия */}
                <div className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col'>
                        <label className='block text-[var(--text-primary)] mb-1'>Имя</label>
                        <input 
                            {...register('name')}
                            placeholder='Имя'
                            className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                        />
                        {errors.name && <span className='text-sm text-red-500'>{errors.name.message}</span>}
                    </div>

                    <div className='flex flex-col'>
                        <label className='block text-[var(--text-primary)] mb-1'>Фамилия</label>
                        <input 
                            {...register('surname')}
                            placeholder='Фамилия'
                            className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                        />
                        {errors.surname && <span className='text-sm text-red-500'>{errors.surname.message}</span>}
                    </div>
                </div>

                {/* Email */}
                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>Email</label>
                    <input 
                        {...register('email')}
                        placeholder='Email'
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
                </div>

                {/* Password */}
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

                {/* Confirm password */}
                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>Подтвердите пароль</label>
                    <input
                        type='password'
                        {...register('confirmPassword')}
                        placeholder="Повторите пароль"
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.confirmPassword && <span className='text-sm text-red-500'>{errors.confirmPassword.message}</span>}
                </div>

                <button 
                    type='submit' 
                    className='btn-accent-color w-full'
                >
                    Зарегистрироваться
                </button>

                <div className='text-center pt-8'>
                    <span className='text-[var(--text-secondary)] text-sm'>
                        Уже есть аккаунт?{' '}
                        <Link href='/auth/login' className='text-[var(--text-accent)]'>
                            Войти
                        </Link>
                    </span>
                </div>

            </div>
        </form>
    )
}

export default RegisterForm