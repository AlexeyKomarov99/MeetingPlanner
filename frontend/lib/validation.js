import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов')
})

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
  surname: z.string().min(2, 'Фамилия должна быть не менее 2 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
})

export const meetingSchema = z.object({
  title: z.string().min(3, 'Название должно быть не менее 3 символов').max(200),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов'),
  start_time: z.string().refine(val => !isNaN(Date.parse(val)), 'Некорректная дата'),
  end_time: z.string().refine(val => !isNaN(Date.parse(val)), 'Некорректная дата'),
  location: z.string().min(3, 'Локация должна быть не менее 3 символов'),
  location_type: z.enum(['office', 'cafe', 'park', 'gym', 'home'], {
    errorMap: () => ({ message: 'Выберите тип локации' })
  }),
  status: z.enum(['planned', 'active', 'completed', 'cancelled', 'postponed'], {
    errorMap: () => ({ message: 'Выберите статус' })
  })
}).refine(data => new Date(data.end_time) > new Date(data.start_time), {
  message: "Время окончания должно быть позже времени начала",
  path: ["end_time"]
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Некорректный email')
})

export const resetPasswordSchema = z.object({
  new_password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Пароли не совпадают",
  path: ["confirm_password"]
})