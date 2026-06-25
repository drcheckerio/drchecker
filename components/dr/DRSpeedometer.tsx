'use client'
import { useEffect, useRef, useState } from 'react'
import { getDRColor, getDRRating } from '@/lib/utils'

interface SpeedometerProps {
  score: number
  size?: number
  animated?: boolean
}

export default function DRSpeedometer({ score, size = 280, animated = true }: SpeedometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const animRef = useRef<number>()

  useEffect(() => {
    if (!animated) {
      setCurrentScore(score)
      return
    }
    // Animate from 0 to score
    const duration = 1800
    const startTime = performance.now()
    const startScore = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startScore + (score - startScore) * eased)
      setCurrentScore(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    const timer = setTimeout(() => {
      animRef.current = requestAnimationFrame(animate)
    }, 300)

    return () => {
      clearTimeout(timer)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [score, animated])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const displaySize = size
    canvas.width = displaySize * dpr
    canvas.height = displaySize * dpr
    canvas.style.width = `${displaySize}px`
    canvas.style.height = `${displaySize}px`
    ctx.scale(dpr, dpr)

    const cx = displaySize / 2
    const cy = displaySize / 2 + 20
    const radius = displaySize * 0.38
    const lineWidth = displaySize * 0.085

    ctx.clearRect(0, 0, displaySize, displaySize)

    // Background arc glow (dark shadow)
    ctx.beginPath()
    ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25)
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = lineWidth + 4
    ctx.lineCap = 'round'
    ctx.stroke()

    // Background track
    ctx.beginPath()
    ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // Color segments: Poor (0-29), Fair (30-49), Good (50-69), Excellent (70-100)
    const totalArc = Math.PI * 1.5 // 270 degrees
    const startAngle = Math.PI * 0.75

    const segments = [
      { from: 0, to: 30, color: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
      { from: 30, to: 50, color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
      { from: 50, to: 70, color: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
      { from: 70, to: 100, color: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
    ]

    segments.forEach(({ from, to, color, glow }) => {
      const segStart = startAngle + (from / 100) * totalArc
      const segEnd = startAngle + (to / 100) * totalArc

      // Glow layer
      ctx.beginPath()
      ctx.arc(cx, cy, radius, segStart, segEnd)
      ctx.strokeStyle = glow
      ctx.lineWidth = lineWidth + 6
      ctx.lineCap = 'butt'
      ctx.filter = 'blur(4px)'
      ctx.globalAlpha = 0.4
      ctx.stroke()
      ctx.filter = 'none'
      ctx.globalAlpha = 1

      // Main colored arc
      ctx.beginPath()
      ctx.arc(cx, cy, radius, segStart, segEnd)
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'butt'
      ctx.stroke()

      // 3D highlight on top edge
      const gradient = ctx.createLinearGradient(0, cy - radius, 0, cy + radius)
      gradient.addColorStop(0, 'rgba(255,255,255,0.25)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, radius, segStart, segEnd)
      ctx.strokeStyle = gradient
      ctx.lineWidth = lineWidth * 0.3
      ctx.stroke()
    })

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const value = i * 10
      const angle = startAngle + (value / 100) * totalArc
      const isLarge = i % 5 === 0
      const innerR = radius - lineWidth / 2 - (isLarge ? 10 : 6)
      const outerR = radius + lineWidth / 2 + 2

      if (isLarge) {
        const textR = radius - lineWidth / 2 - 22
        const tx = cx + Math.cos(angle) * textR
        const ty = cy + Math.sin(angle) * textR
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `bold ${displaySize * 0.048}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(value.toString(), tx, ty)
      }
    }

    // Needle
    const needleAngle = startAngle + (currentScore / 100) * totalArc
    const needleLength = radius - lineWidth / 2 - 8
    const needleBaseWidth = displaySize * 0.022

    // Needle shadow
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(needleAngle)
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    // Needle body
    const needleGrad = ctx.createLinearGradient(0, -needleBaseWidth, needleLength, 0)
    needleGrad.addColorStop(0, '#e2e8f0')
    needleGrad.addColorStop(0.5, '#f8fafc')
    needleGrad.addColorStop(1, '#94a3b8')

    ctx.beginPath()
    ctx.moveTo(0, -needleBaseWidth / 2)
    ctx.lineTo(needleLength, 0)
    ctx.lineTo(0, needleBaseWidth / 2)
    ctx.closePath()
    ctx.fillStyle = needleGrad
    ctx.fill()

    // Needle highlight
    ctx.beginPath()
    ctx.moveTo(0, -needleBaseWidth / 4)
    ctx.lineTo(needleLength * 0.85, 0)
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.restore()
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    // Center hub - 3D metallic circle
    const hubRadius = displaySize * 0.055
    const hubGrad = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, hubRadius)
    hubGrad.addColorStop(0, '#94a3b8')
    hubGrad.addColorStop(0.4, '#475569')
    hubGrad.addColorStop(1, '#1e293b')

    ctx.beginPath()
    ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2)
    ctx.fillStyle = hubGrad
    ctx.fill()

    // Hub ring
    ctx.beginPath()
    ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Hub inner shine
    ctx.beginPath()
    ctx.arc(cx - hubRadius * 0.3, cy - hubRadius * 0.3, hubRadius * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fill()

  }, [currentScore, size])

  const color = getDRColor(score)
  const rating = getDRRating(score)

  return (
    <div className="flex flex-col items-center relative">
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      {/* Score display below needle center */}
      <div className="text-center -mt-12 relative z-10">
        <div className="text-5xl font-black" style={{ color }}>{currentScore}</div>
        <div className="text-xs font-semibold text-muted uppercase tracking-widest mt-1">DR SCORE</div>
        <div className={`mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border ${
          rating === 'Excellent' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
          rating === 'Good' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
          rating === 'Fair' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
          'bg-red-500/15 text-red-400 border-red-500/30'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
          {rating}
        </div>
      </div>
    </div>
  )
}
