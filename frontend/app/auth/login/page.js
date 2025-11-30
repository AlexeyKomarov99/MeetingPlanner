import React from 'react'
//===== components =====//
import Logo from '../../../components/ui/Logo'
import LoginForm from '../../../components/forms/LoginForm'

const page = () => {

  // add location 
  return (
    <div className='flex'>
      <Logo />
      <LoginForm />
    </div>
  )
}

export default page





// components/forms/LoginForm.js
// 'use client';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '../../lib/validation';

// export default function LoginForm() {
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema)
//   });

//   const onSubmit = async (data) => {
//     console.log('Login data:', data);
//     // TODO: API call
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <input
//           {...register('email')}
//           placeholder="Email"
//           className="w-full p-3 border border-[var(--border-light)] rounded-lg"
//         />
//         {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//       </div>
      
//       <div>
//         <input
//           type="password"
//           {...register('password')}
//           placeholder="Пароль"
//           className="w-full p-3 border border-[var(--border-light)] rounded-lg"
//         />
//         {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//       </div>

//       <button type="submit" className="w-full bg-[var(--bg-accent)] text-white p-3 rounded-lg">
//         Войти
//       </button>
//     </form>
//   );
// }


