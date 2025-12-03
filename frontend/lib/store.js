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
            lastUpdate: Date.now(),

            login: (userData, tokens) => set({
                user: userData,
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
                meetings: userData.meetings || [],
                lastUpdate: Date.now()
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
            clearUser: () => set({user: null}),
            removeMeeting: (meetingId) => set((state) => ({
                user: {
                    ...state.user,
                    created_meetings: state.user?.created_meetings?.filter(
                        m => m.meeting_id.toString() !== meetingId.toString()
                    ),
                    participating_meetings: state.user?.participating_meetings?.filter(
                        m => m.meeting_id.toString() !== meetingId.toString()
                    )
                },
                lastUpdate: Date.now()
            })),
            updateMeetings: (meetingsData) => set((state) => ({
                user: {
                    ...state.user,
                    created_meetings: meetingsData.created_meetings || [],
                    participating_meetings: meetingsData.participating_meetings || []
                }
            }))
        }),
        {
            name: 'meeting-planner-storage'
        }
    )
)

export default useStore