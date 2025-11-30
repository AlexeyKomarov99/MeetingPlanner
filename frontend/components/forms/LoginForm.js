'use client'
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validation';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        console.log('Login data:', data);
        // TODO: API call
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input 
                    {...register('email')}
                    placeholder='Email'
                    className=''
                />
                {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div>
                <input
                    type='password'
                    {...register('password')}
                    placeholder="Пароль"
                    className=''
                />
                {errors.password && <span>{errors.password.message}</span>}
            </div>

            <button 
                type='submit' 
                className=''
            >
                Войти
            </button>
        </form>
    )
}

export default LoginForm