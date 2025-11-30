'use client'
import React from 'react'
import {usePathname} from 'next/navigation'
import Header from './Header'

function HeaderWrapper() {
    const pathname = usePathname()
    if (['/auth/login', '/auth/register'].includes(pathname)) {
        return null
    }
    return <Header />
}

export default HeaderWrapper