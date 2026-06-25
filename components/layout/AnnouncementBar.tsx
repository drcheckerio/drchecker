'use client'
import Link from 'next/link'
import { Zap, X } from 'lucide-react'
import { useState } from 'react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="announcement-bar relative z-50">
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
        <p className="text-white text-xs sm:text-sm font-medium text-center">
          <span className="opacity-90">Check 1000 domains at once — </span>
          <Link href="/pricing" className="font-bold underline underline-offset-2 hover:text-yellow-200 transition-colors">
            Get Pro for $9.99/month →
          </Link>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
