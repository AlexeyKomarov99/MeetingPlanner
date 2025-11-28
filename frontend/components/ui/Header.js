'use client'
import useStore from '../../lib/store'

const Header = () => {
    
    const {theme, toggleTheme, user} = useStore();
  
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                {/* Логотип и название */}
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                    Meeting Planner
                    </h1>
                </div>

                {/* Правая часть */}
                <div className="flex items-center space-x-4">
                    {/* Кнопка переключения темы */}
                    <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                    {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    {/* Профиль пользователя */}
                    {user ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm">
                        {user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-gray-700">{user.name}</span>
                    </div>
                    ) : (
                    <button className="text-sm text-gray-700 hover:text-gray-900">
                        Войти
                    </button>
                    )}
                </div>
                </div>
            </div>
        </header>
    )
}

export default Header