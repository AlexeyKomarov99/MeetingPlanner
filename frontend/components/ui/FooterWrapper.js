'use client'
import React from 'react'
import {usePathname} from 'next/navigation'
import Footer from './Footer'

function FooterWrapper() {
    const pathname = usePathname()
    if (['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname)) {
        return null
    }
    return <Footer />
}

export default FooterWrapper