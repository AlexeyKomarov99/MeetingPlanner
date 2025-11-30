'use client'
import React from 'react'
import {usePathname} from 'next/navigation'
import Header from './Header'

function HeaderWrapper() {
    const pathname = usePathname()
    if (['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname)) {
        return null
    }
    return <Header />
}

export default HeaderWrapper