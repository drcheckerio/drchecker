'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, Activity, Users, Zap } from 'lucide-react'

type Stats = {
  todayDomains: number
  totalDomains: number
  todayVisitors: number
  totalVisitors: number
  totalChecks: number
  unavailable?: boolean
}

/** Counts up to `value`, then tracks later changes without replaying from zero. */
function useCountUp(value: number, duration = 900) {
  const [shown, setShown] = useState(0)
  const from = useRef(0)
  const raf = useRef<number>()

  useEffect(() => {
    const start = performance.now()
    const begin = from.current
    const delta = value - begin
    if (delta === 0) { setShown(value); return }

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(begin + delta * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else from.current = value
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [value, duration])

  return shown
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) {
  const shown = useCountUp(value)
  return (
    <div className="flex-1 min-w-[140px] rounded-xl px-4 py-3.5 text-center"
      style={{
        background: accent ? 'rgba(255,138,30,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'rgba(255,138,30,0.25)' : 'rgba(255,255,255,0.07)'}`,
      }}>
      <div className="flex items-center justify-center gap-1.5 mb-1" style={{ color: accent ? '#FFA94D' : '#8B96AD' }}>
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{shown.toLocaleString()}</div>
    </div>
  )
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' })
        const data = await res.json()
        if (alive && !data.unavailable) setStats(data)
      } catch { /* counter is cosmetic */ }
    }
    load()
    const id = setInterval(load, 20000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  // Render nothing at all until there are real numbers to show.
  if (!stats) return null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#22C55E' }}></span>
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#22C55E' }}></span>
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Live usage</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <Stat icon={<Zap className="w-3.5 h-3.5" />} label="Domains today" value={stats.todayDomains} accent />
        <Stat icon={<Globe className="w-3.5 h-3.5" />} label="Domains all time" value={stats.totalDomains} accent />
        <Stat icon={<Users className="w-3.5 h-3.5" />} label="Visitors today" value={stats.todayVisitors} />
        <Stat icon={<Activity className="w-3.5 h-3.5" />} label="Visitors all time" value={stats.totalVisitors} />
      </div>
      <p className="text-center text-[11px] text-muted mt-3">
        Counting since launch · updates every 20 seconds
      </p>
    </div>
  )
}
