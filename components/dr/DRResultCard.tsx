'use client'
import { useRef } from 'react'
import { Download, Globe, TrendingUp, ChevronRight } from 'lucide-react'
import DRSpeedometer from './DRSpeedometer'
import { DRResult } from '@/types'
import { getDRColor, getDRRating, getDRDescription, formatNumber } from '@/lib/utils'
import Link from 'next/link'

interface DRResultCardProps {
  result: DRResult
  domain: string
}

export default function DRResultCard({ result, domain }: DRResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rating = getDRRating(result.dr)
  const color = getDRColor(result.dr)
  const description = getDRDescription(domain, result.dr)

  const downloadAsPNG = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080C14',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `dr-score-${domain}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const scoreRanges = [
    { range: '0 – 29', label: 'Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', active: result.dr < 30 },
    { range: '30 – 49', label: 'Fair', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', active: result.dr >= 30 && result.dr < 50 },
    { range: '50 – 69', label: 'Good', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', active: result.dr >= 50 && result.dr < 70 },
    { range: '70 – 100', label: 'Excellent', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', active: result.dr >= 70 },
  ]

  return (
    <div className="animate-slide-up">
      {/* Download Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={downloadAsPNG}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-medium hover:border-brand-500 transition-all text-muted hover:text-foreground"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </div>

      {/* Card (captured for PNG) */}
      <div ref={cardRef} className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left: Speedometer Panel */}
        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-base text-foreground">DOMAIN RATING</h3>
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                Ahrefs Domain Rating
                <span className="w-3.5 h-3.5 rounded-full border border-muted inline-flex items-center justify-center text-[8px] cursor-help" title="Domain Rating (DR) is an Ahrefs metric that measures the strength of a website's backlink profile on a scale from 0 to 100.">i</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Updated just now
            </div>
          </div>

          {/* Speedometer */}
          <div className="flex justify-center my-2">
            <DRSpeedometer score={result.dr} size={260} animated={true} />
          </div>

          {/* Domain info */}
          <div className="glass-card p-3 mt-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs text-muted mb-2 font-medium">Result for</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-glass flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-brand-400" />
              </div>
              <span className="font-semibold text-sm">{domain}</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {domain} has a{' '}
              <span className="font-bold" style={{ color }}>DR of {result.dr}</span>.{' '}
              {result.dr >= 70 ? 'Top-tier rating — this suggests an outstanding backlink profile.' :
               result.dr >= 50 ? 'Solid rating — this site has a healthy and growing backlink profile.' :
               result.dr >= 30 ? 'Moderate rating — there is clear room to improve domain authority.' :
               'New or low-authority site — focus on building quality backlinks.'}
            </p>
          </div>
        </div>

        {/* Right: Info Panels */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Row 1: DR Score + Rating Scale */}
          <div className="grid grid-cols-2 gap-4">
            {/* DR Score */}
            <div className="glass-card p-4">
              <p className="text-xs text-muted font-medium mb-3">DR Score</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <TrendingUp className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color }}>{result.dr}</div>
                  <div className="text-xs text-muted">out of 100</div>
                </div>
              </div>
            </div>

            {/* Rating Scale */}
            <div className="glass-card p-4">
              <p className="text-xs text-muted font-medium mb-3">Rating Scale</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <svg className="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">0–100</div>
                  <div className="text-xs text-muted">Ahrefs Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* DR Score Range */}
          <div className="glass-card p-4 flex-1">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">DR SCORE RANGE</p>
            <div className="grid grid-cols-2 gap-2">
              {scoreRanges.map((range) => (
                <div
                  key={range.label}
                  className="rounded-xl p-2.5 border transition-all"
                  style={{
                    background: range.active ? range.bg : 'rgba(255,255,255,0.02)',
                    borderColor: range.active ? range.border : 'rgba(255,255,255,0.06)',
                    boxShadow: range.active ? `0 0 12px ${range.color}20` : 'none',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: range.color }}></span>
                    <span className="text-xs font-bold" style={{ color: range.active ? range.color : 'rgba(255,255,255,0.4)' }}>
                      {range.range}
                    </span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: range.active ? range.color : 'rgba(255,255,255,0.3)' }}>
                    {range.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Improve DR CTA */}
          <div className="glass-card p-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.05) 100%)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <TrendingUp className="w-5 h-5 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1">IMPROVE DR</p>
                <p className="text-xs text-muted leading-relaxed">Explore powerful services to boost your Domain Rating and strengthen your website's authority.</p>
              </div>
            </div>
            <Link href="/#services" className="mt-3 w-full btn-brand py-2 text-xs flex items-center justify-center gap-1.5">
              Explore Services
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Extra stats if available */}
          {(result.backlinks !== undefined || result.referring_domains !== undefined) && (
            <div className="grid grid-cols-2 gap-3">
              {result.backlinks !== undefined && (
                <div className="glass-card p-3 text-center">
                  <div className="text-lg font-bold text-brand-400">{formatNumber(result.backlinks)}</div>
                  <div className="text-xs text-muted mt-0.5">Backlinks</div>
                </div>
              )}
              {result.referring_domains !== undefined && (
                <div className="glass-card p-3 text-center">
                  <div className="text-lg font-bold text-brand-400">{formatNumber(result.referring_domains)}</div>
                  <div className="text-xs text-muted mt-0.5">Ref. Domains</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="w-3.5 h-3.5 rounded-full border border-muted inline-flex items-center justify-center text-[8px] text-muted flex-shrink-0">i</span>
        <p className="text-xs text-muted">
          DR (Domain Rating) is a score developed by Ahrefs to measure the strength of a website's backlink profile on a scale of 0 to 100.
        </p>
      </div>
    </div>
  )
}
