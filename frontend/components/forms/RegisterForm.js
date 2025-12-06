'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../lib/validation'
import Link from 'next/link'
import { authAPI } from '../../lib/api';
import useStore from '../../lib/store'
import { useRouter } from 'next/navigation'
import useTranslations from '../../lib/useTranslations'

function RegisterForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const router = useRouter()
    const { login } = useStore()
    const t = useTranslations()

    const onSubmit = async (data) => {
        try {
            const response = await authAPI.register({
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password
            })
            
            login(response.data.user, response.data.tokens)
            router.push('/')
            
        } catch (error) {
            console.error(t('auth.registerError'), error); 
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-3'>
                {/* Имя и фамилия */}
                <div className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col'>
                        <label className='block text-[var(--text-primary)] mb-1'>
                            {t('auth.nameLabel')} 
                        </label>
                        <input 
                            {...register('name')}
                            placeholder={t('auth.namePlaceholder')} 
                            className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                        />
                        {errors.name && <span className='text-sm text-red-500'>{errors.name.message}</span>}
                    </div>

                    <div className='flex flex-col'>
                        <label className='block text-[var(--text-primary)] mb-1'>
                            {t('auth.surnameLabel')} 
                        </label>
                        <input 
                            {...register('surname')}
                            placeholder={t('auth.surnamePlaceholder')} 
                            className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                        />
                        {errors.surname && <span className='text-sm text-red-500'>{errors.surname.message}</span>}
                    </div>
                </div>

                {/* Email */}
                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>
                        {t('auth.emailLabel')} 
                    </label>
                    <input 
                        {...register('email')}
                        placeholder={t('auth.emailPlaceholder')} 
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
                </div>

                {/* Password */}
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
                    {errors.password && <span className='text-sm text-red-500'>{errors.password.message}</span>}
                </div>

                {/* Confirm password */}
                <div className='flex flex-col'>
                    <label className='block text-[var(--text-primary)] mb-1'>
                        {t('auth.confirmPasswordLabel')} 
                    </label>
                    <input
                        type='password'
                        {...register('confirmPassword')}
                        placeholder={t('auth.confirmPasswordPlaceholder')} 
                        className='w-full px-3 py-1 border border-[var(--border-light)] rounded-lg mb-1 hover:border-[var(--text-accent)!important] transition-colors duration-200 focus:border-[var(--text-accent)!important] focus:outline-none cursor-pointer'
                    />
                    {errors.confirmPassword && <span className='text-sm text-red-500'>{errors.confirmPassword.message}</span>}
                </div>

                <button 
                    type='submit' 
                    className='btn-accent-color w-full'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('app.loading') : t('app.register')} 
                </button>

                <div className='text-center pt-8'>
                    <span className='text-[var(--text-secondary)] text-sm'>
                        {t('auth.haveAccount')}{' '} 
                        <Link href='/auth/login' className='text-[var(--text-accent)]'>
                            {t('app.login')} 
                        </Link>
                    </span>
                </div>
            </div>
        </form>
    )
}

export default RegisterForm