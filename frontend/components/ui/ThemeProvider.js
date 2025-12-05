'use client'
import { useEffect } from 'react'
import useStore from '../../lib/store'

export default function ThemeProvider({ children }) {
    const { theme, accentColor } = useStore()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        document.documentElement.setAttribute('data-accent', accentColor)
    }, [theme, accentColor])

    return <>{children}</>
}