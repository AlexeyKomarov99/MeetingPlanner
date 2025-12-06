'use client'
import { useMemo } from 'react'
import useStore from './store'
import ruTranslations from './locales/ru.json'
import enTranslations from './locales/en.json'

const translations = {
  ru: ruTranslations,
  en: enTranslations
}

export default function useTranslations() {
  const { lang } = useStore()
  
  const t = useMemo(() => {
    return (key, params = {}) => {
      try {
        const keys = key.split('.')
        let value = translations[lang]
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k]
          } else {
            console.warn(`Translation key not found: ${key} (lang: ${lang})`)
            return `[${key}]`
          }
        }
        
        if (typeof value === 'string' && params && Object.keys(params).length > 0) {
          return Object.keys(params).reduce((str, param) => {
            return str.replace(`{{${param}}}`, params[param])
          }, value)
        }
        
        return value || `[${key}]`
      } catch (error) {
        console.error('Translation error:', error)
        return `[${key}]`
      }
    }
  }, [lang])
  
  return t
}