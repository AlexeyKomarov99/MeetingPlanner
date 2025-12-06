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

            // auth
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
            // settings
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),
            setLang: (language) => set({ 
                lang: language,
                lastUpdate: Date.now() 
            }),
            setAccentColor: (color) => set({ 
                accentColor: color,
                lastUpdate: Date.now() 
            }),
            // users
            setUser: (userData) => set({user: userData}),
            clearUser: () => set({user: null}),
            updateUser: (updatedData) => set((state) => ({
                user: state.user ? { ...state.user, ...updatedData } : null,
                lastUpdate: Date.now()
            })),
            // meetings
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
        }),
        {
            name: 'meeting-planner-storage'
        }
    )
)

export default useStore