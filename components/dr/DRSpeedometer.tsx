'use client'
import { useEffect, useRef, useState } from 'react'
import { getDRColor, getDRRating } from '@/lib/utils'

interface SpeedometerProps {
  score: number
  size?: number
  animated?: boolean
  start?: boolean
}

export default function DRSpeedometer({ score, size = 280, animated = true, start = true }: SpeedometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentScore, setCurrentScore] = useState(animated ? 0 : score)
  const animRef = useRef<number>()
  const startedRef = useRef(false)

  useEffect(() => {
    if (!animated) { setCurrentScore(score); return }
    if (!start || startedRef.current) return
    startedRef.current = true
    const duration = 1800
    const startTime = performance.now()
    const animate = (t: number) => {
      const progress = Math.min((t - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrentScore(Math.round(score * eased))
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    const timer = setTimeout(() => { animRef.current = requestAnimationFrame(animate) }, 200)
    return () => { clearTimeout(timer); if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [score, animated, start])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2 + 18
    const radius = size * 0.38
    const lineWidth = size * 0.085

    ctx.clearRect(0, 0, size, size)

    ctx.beginPath()
    ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25)
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'
    ctx.lineWidth = lineWidth + 4
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = lineWidth
    ctx.stroke()

    const totalArc = Math.PI * 1.5
    const startAngle = Math.PI * 0.75
    const segments = [
      { from: 0, to: 30, color: '#EF4444', glow: 'rgba(239,68,68,0.5)' },
      { from: 30, to: 50, color: '#F59E0B', glow: 'rgba(245,158,11,0.5)' },
      { from: 50, to: 70, color: '#3B82F6', glow: 'rgba(59,130,246,0.5)' },
      { from: 70, to: 100, color: '#22C55E', glow: 'rgba(34,197,94,0.5)' },
    ]

    segments.forEach(({ from, to, color, glow }) => {
      const s = startAngle + (from / 100) * totalArc
      const e = startAngle + (to / 100) * totalArc
      ctx.beginPath(); ctx.arc(cx, cy, radius, s, e)
      ctx.strokeStyle = glow; ctx.lineWidth = lineWidth + 6; ctx.lineCap = 'butt'
      ctx.filter = 'blur(4px)'; ctx.globalAlpha = 0.4; ctx.stroke()
      ctx.filter = 'none'; ctx.globalAlpha = 1

      ctx.beginPath(); ctx.arc(cx, cy, radius, s, e)
      ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke()

      const grad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius)
      grad.addColorStop(0, 'rgba(255,255,255,0.25)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx, cy, radius, s, e)
      ctx.strokeStyle = grad; ctx.lineWidth = lineWidth * 0.3; ctx.stroke()
    })

    for (let i = 0; i <= 10; i += 5) {
      const value = i * 10
      const angle = startAngle + (value / 100) * totalArc
      const textR = radius - lineWidth / 2 - 20
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = `bold ${size * 0.046}px Inter, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(value.toString(), cx + Math.cos(angle) * textR, cy + Math.sin(angle) * textR)
    }

    const needleAngle = startAngle + (currentScore / 100) * totalArc
    const needleLength = radius - lineWidth / 2 - 8
    const nw = size * 0.022

    ctx.save()
    ctx.translate(cx, cy); ctx.rotate(needleAngle)
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2
    const ng = ctx.createLinearGradient(0, -nw, needleLength, 0)
    ng.addColorStop(0, '#E2E8F0'); ng.addColorStop(0.5, '#F8FAFC'); ng.addColorStop(1, '#94A3B8')
    ctx.beginPath()
    ctx.moveTo(0, -nw / 2); ctx.lineTo(needleLength, 0); ctx.lineTo(0, nw / 2); ctx.closePath()
    ctx.fillStyle = ng; ctx.fill()
    ctx.restore()
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0

    const hubR = size * 0.055
    const hg = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, hubR)
    hg.addColorStop(0, '#94A3B8'); hg.addColorStop(0.4, '#475569'); hg.addColorStop(1, '#1E293B')
    ctx.beginPath(); ctx.arc(cx, cy, hubR, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill()
    ctx.beginPath(); ctx.arc(cx, cy, hubR, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.beginPath(); ctx.arc(cx - hubR * 0.3, cy - hubR * 0.3, hubR * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill()
  }, [currentScore, size])

  const color = getDRColor(score)
  const rating = getDRRating(score)
  const displayColor = getDRColor(currentScore)

  return (
    <div className="flex flex-col items-center relative">
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      <div className="text-center -mt-12 relative z-10">
        <div className="text-5xl font-black" style={{ color: displayColor }}>{currentScore}</div>
        <div className="text-xs font-bold text-muted uppercase tracking-widest mt-1">DR SCORE</div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ background: `${color}20`, color, border: `1px solid ${color}45` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
          {rating}
        </div>
      </div>
    </div>
  )
}
