'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../../../../lib/validation'
import { authAPI } from '../../../../lib/api'
import SuccessMessage from '../../../../components/ui/SuccessMessage'

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = async (data) => {
    try {
      await authAPI.resetPassword({
        token: params.token,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      })
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 3000)
    } catch (err) {
      // Ошибка показывается через Zod
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-[var(--bg-primary)] p-8 rounded-2xl shadow-lg border border-[var(--border-light)]">
        <h2 className="text-2xl font-bold text-center mb-6">Новый пароль</h2>

        {success ? (
          <SuccessMessage />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="password"
                {...register('new_password')}
                placeholder="Новый пароль"
                className="w-full p-3 border border-[var(--border-light)] rounded-lg"
              />
              {errors.new_password && (
                <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
              )}
            </div>
            
            <div>
              <input
                type="password"
                {...register('confirm_password')}
                placeholder="Повторите пароль"
                className="w-full p-3 border border-[var(--border-light)] rounded-lg"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--bg-accent)] text-white p-3 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Изменение...' : 'Установить новый пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}