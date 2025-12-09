'use client'
import { useState, useEffect } from 'react'
import { meetingsAPI } from '../../lib/api'
import UserSearch from '../ui/UserSearch'
import useTranslations from '../../lib/useTranslations'

export default function ParticipantManager({ meetingId, isCreator }) {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const loadParticipants = async () => {
    try {
      const response = await meetingsAPI.getParticipants(meetingId)
      setParticipants(response.data)
    } catch (error) {
      console.error('Failed to load participants:', error)
    }
  }

  useEffect(() => {
    loadParticipants()
  }, [meetingId])

  const handleAddParticipant = async (user) => {
    if (!isCreator) return
    
    setLoading(true)
    try {
      await meetingsAPI.addParticipant(meetingId, { user_id: user.user_id })
      loadParticipants() // обновляем список
    } catch (error) {
      alert(error.response?.data?.detail || 'Ошибка добавления')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">      
      {isCreator && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t('participants.addParticipant')}
          </label>
          <UserSearch
            onSelect={handleAddParticipant}
            excludedUsers={participants.map(p => p.user_id)}
          />
        </div>
      )}
      
      {participants.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          {isCreator 
            ? t('participants.noParticipants') 
            : t('participants.onlyCreatorCanAdd')}
        </div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.user_id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {participant.user_photo ? (
                    <img src={participant.user_photo} alt="" className="w-full h-full rounded-full" />
                  ) : (
                    <span className="font-medium">
                      {participant.name?.[0]}{participant.surname?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {participant.name} {participant.surname}
                  </div>
                  <div className="text-sm text-gray-500">{participant.email}</div>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm ${
                participant.status === 'accepted' ? 'bg-green-100 text-green-800' :
                participant.status === 'declined' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {participant.status === 'accepted' ? t('participants.statusAccepted') :
                participant.status === 'declined' ? t('participants.statusDeclined') : 
                t('participants.statusPending')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}