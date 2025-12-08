'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '../../../lib/validation'
import { authAPI } from '../../../lib/api'
import Link from 'next/link'
import SuccessMessage from '../../../components/ui/SuccessMessage'

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (data) => {
    setError('')
    try {
      await authAPI.forgotPassword({ email: data.email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при отправке')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-[var(--bg-primary)] p-8 rounded-2xl shadow-lg border border-[var(--border-light)]">
        <h2 className="text-2xl font-bold text-center mb-2">Восстановление пароля</h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">
          Введите email, указанный при регистрации
        </p>

        {success ? (
          <SuccessMessage />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('email')}
                placeholder="Ваш email"
                className="w-full p-3 border border-[var(--border-light)] rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--bg-accent)] text-white p-3 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить ссылку'}
            </button>

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-[var(--text-accent)] text-sm hover:underline"
              >
                Вернуться к входу
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}