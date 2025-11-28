import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
    persist(
        (set) => ({
            theme: 'light',
            lang: 'ru',
            accentColor: 'indigo',
            user: null,
        
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),
            toggleLang: () => set((state) => ({
                lang: state.lang === 'ru' ? 'en' : 'ru'
            })),
            toggleAccentColor: () => set((state) => ({
                accentColor: state.accentColor === 'indigo' ? 'purple' : 'indigo'
            })),
            setUser: (userData) => set({user: userData}),
            clearUser: () => set({user: null})
        }),
        {
            name: 'meeting-planner-storage'
        }
    )
)

export default useStore