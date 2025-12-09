'use client'
import { useState, useEffect, useRef } from 'react'
import { usersAPI } from '../../lib/api'
import useTranslations from '../../lib/useTranslations'

export default function UserSearch({ onSelect, excludedUsers = [] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef()
  const t = useTranslations()

  useEffect(() => {
    const trimmedQuery = query.trim()
  
    if (trimmedQuery.length < 2) {
        setResults([])
        return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await usersAPI.searchUsers(query)

        const filtered = response.data.filter(
          user => !excludedUsers.includes(user.user_id)
        )
        setResults(filtered)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query, excludedUsers])

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('participants.searchPlaceholder')}
        className="w-full p-3 border border-[var(--border-light)] rounded-lg bg-[var(--bg-primary)]"
      />
      
        {loading && (
            <div className="absolute right-3 top-3">{t('userSearch.loading')}</div>
        )}
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[var(--bg-primary)] border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map(user => (
            <button
              key={user.user_id}
              onClick={() => {
                onSelect(user)
                setQuery('')
                setResults([])
              }}
              className="w-full p-3 text-left hover:bg-[var(--bg-secondary)] flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                {user.user_photo ? (
                  <img src={user.user_photo} alt="" className="w-full h-full rounded-full" />
                ) : (
                  <span>{user.name?.[0]}{user.surname?.[0]}</span>
                )}
              </div>
              <div>
                <div className="font-medium">{user.name} {user.surname}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}