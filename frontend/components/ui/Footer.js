'use client'
import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="sticky bottom-0 bg-[var(--bg-primary)] border-t border-[var(--border-light)] py-5 mt-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center text-sm text-[var(--text-secondary)]">
          <p>© {currentYear} MeetingPlanner. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer