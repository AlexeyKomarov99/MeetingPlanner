import Link from "next/link"

const SuccessMessage = () => (
  <div className="text-center">
    <div className="text-green-500 text-5xl mb-4">✓</div>
    <h3 className="text-lg font-medium mb-2">Письмо отправлено!</h3>
    <p className="text-[var(--text-secondary)] mb-6">
      Если аккаунт с email существует, 
      вы получите ссылку для сброса пароля.
    </p>
    <Link 
      href="/auth/login" 
      className="text-[var(--text-accent)] hover:underline"
    >
      Вернуться к входу
    </Link>
  </div>
)

export default SuccessMessage