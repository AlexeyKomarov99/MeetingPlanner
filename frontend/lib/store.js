import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            meetings: [],

            theme: 'light',
            lang: 'ru',
            accentColor: 'indigo',

            login: (userData, tokens) => set({
                user: userData,
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
                meetings: userData.meetings || []
            }),
            logout: () => set({ 
                user: null, 
                accessToken: null, 
                refreshToken: null,
                meetings: [] 
            }),
            refreshTokens: (tokens) => set({
                accessToken: tokens.access,
                refreshToken: tokens.refresh
            }),
            updateMeetings: (meetings) => set({ meetings }),
            
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