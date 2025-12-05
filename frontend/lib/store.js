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
                meetings: [],
                lastUpdate: Date.now() 
            }),
            refreshTokens: (tokens) => set({
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
                lastUpdate: Date.now() 
            }),
            
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),
            toggleLang: () => set((state) => ({
                lang: state.lang === 'ru' ? 'en' : 'ru'
            })),
            setAccentColor: (color) => set({ 
                accentColor: color,
                lastUpdate: Date.now() 
            }),
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
                },
                lastUpdate: Date.now()
            })),
            addMeeting: (newMeeting) => set((state) => ({
                user: {
                    ...state.user,
                    created_meetings: [
                        ...(state.user?.created_meetings || []),
                        newMeeting
                    ]
                },
                lastUpdate: Date.now()
            })),
            updateMeeting: (meetingId, updatedMeeting) => set((state) => ({
                user: {
                    ...state.user,
                    created_meetings: state.user?.created_meetings?.map(meeting => 
                        meeting.meeting_id.toString() === meetingId.toString() 
                            ? { ...meeting, ...updatedMeeting } 
                            : meeting
                    ),
                    participating_meetings: state.user?.participating_meetings?.map(meeting => 
                        meeting.meeting_id.toString() === meetingId.toString() 
                            ? { ...meeting, ...updatedMeeting } 
                            : meeting
                    )
                },
                lastUpdate: Date.now()
            })),
            updateUser: (updatedData) => set((state) => ({
                user: state.user ? { ...state.user, ...updatedData } : null,
                lastUpdate: Date.now()
            })),
        }),
        {
            name: 'meeting-planner-storage'
        }
    )
)

export default useStore