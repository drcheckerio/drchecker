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
        <Zap className="w-3.5 h-3.5 text-white flex-shrink-0" />
        <p className="text-white text-xs sm:text-sm font-semibold text-center">
          Check 1,000 domains per run —{' '}
          <Link href="/#pricing" className="font-extrabold underline underline-offset-2 hover:opacity-80 transition-opacity">
            Go Pro for just $5/month →
          </Link>
        </p>
        <button onClick={() => setVisible(false)} className="absolute right-4 text-white/70 hover:text-white transition-colors" aria-label="Close">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
