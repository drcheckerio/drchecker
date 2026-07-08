'use client'
import { useRef } from 'react'
import { Download, Globe, TrendingUp, ChevronRight, BarChart3 } from 'lucide-react'
import DRSpeedometer from './DRSpeedometer'
import { DRResult } from '@/types'
import { getDRColor } from '@/lib/utils'
import Link from 'next/link'

interface DRResultCardProps {
  result: DRResult
  domain: string
}

export default function DRResultCard({ result, domain }: DRResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const color = getDRColor(result.dr)

  const downloadAsPNG = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0F1E',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `${domain}-dr-score.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const scoreRanges = [
    { range: '0 – 29', label: 'Poor', color: '#EF4444', active: result.dr < 30 },
    { range: '30 – 49', label: 'Fair', color: '#F59E0B', active: result.dr >= 30 && result.dr < 50 },
    { range: '50 – 69', label: 'Good', color: '#3B82F6', active: result.dr >= 50 && result.dr < 70 },
    { range: '70 – 100', label: 'Excellent', color: '#22C55E', active: result.dr >= 70 },
  ]

  return (
    <div className="animate-slide-up">
      <div className="flex justify-end mb-3">
        <button onClick={downloadAsPNG}
          className="flex items-center gap-2 px-4 py-2 rounded-xl card text-sm font-semibold text-muted hover:text-white transition-colors">
          <Download className="w-4 h-4" /> Download PNG
        </button>
      </div>

      <div ref={cardRef} className="rounded-2xl p-4 sm:p-6" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          <div className="lg:col-span-3 card p-5 sm:p-6" style={{ background: 'rgba(15,22,41,0.65)' }}>
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <div>
                <h3 className="font-extrabold text-base text-white tracking-wide">DOMAIN RATING</h3>
                <p className="text-xs text-muted mt-0.5">Ahrefs Domain Rating</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-soft"></span>
                Live Ahrefs Data
              </div>
            </div>

            <div className="flex justify-center my-1">
              <DRSpeedometer score={result.dr} size={250} animated={true} />
            </div>

            <div className="rounded-xl p-3 mt-2" style={{ background: 'rgba(7,11,20,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs text-muted mb-2 font-semibold">Result for</p>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(79,124,255,0.15)' }}>
                  <Globe className="w-3.5 h-3.5" style={{ color: '#4F7CFF' }} />
                </div>
                <span className="font-bold text-sm text-white">{domain}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {domain} has a <span className="font-extrabold" style={{ color }}>DR of {result.dr}</span>.{' '}
                {result.dr >= 70 ? 'Top-tier rating — an outstanding backlink profile.' :
                 result.dr >= 50 ? 'Solid rating — a healthy, growing backlink profile.' :
                 result.dr >= 30 ? 'Moderate rating — clear room to increase authority.' :
                 'Low rating — increasing DR will unlock real SEO power.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4" style={{ background: 'rgba(15,22,41,0.65)' }}>
                <p className="text-xs text-muted font-semibold mb-3">DR Score</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(79,124,255,0.15)', border: '1px solid rgba(79,124,255,0.3)' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#4F7CFF' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-black" style={{ color }}>{result.dr}</div>
                    <div className="text-xs text-muted">out of 100</div>
                  </div>
                </div>
              </div>
              <div className="card p-4" style={{ background: 'rgba(15,22,41,0.65)' }}>
                <p className="text-xs text-muted font-semibold mb-3">Rating Scale</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(30,41,66,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">0–100</div>
                    <div className="text-xs text-muted">Ahrefs Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-4 flex-1" style={{ background: 'rgba(15,22,41,0.65)' }}>
              <p className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">DR Score Range</p>
              <div className="grid grid-cols-2 gap-2">
                {scoreRanges.map((r) => (
                  <div key={r.label} className="rounded-xl p-2.5 transition-all"
                    style={{
                      background: r.active ? `${r.color}1E` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${r.active ? `${r.color}50` : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: r.active ? `0 0 14px ${r.color}25` : 'none',
                    }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: r.color }}></span>
                      <span className="text-xs font-extrabold" style={{ color: r.active ? r.color : 'rgba(255,255,255,0.4)' }}>{r.range}</span>
                    </div>
                    <p className="text-xs font-bold" style={{ color: r.active ? r.color : 'rgba(255,255,255,0.3)' }}>{r.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(30,41,66,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs text-muted leading-relaxed">
                DR (Domain Rating) is a score developed by Ahrefs measuring the strength of a website's backlink profile on a scale of 0 to 100.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 pt-3 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)' }}>
            <BarChart3 className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-bold text-white">Checked on <span style={{ color: '#4F7CFF' }}>drchecker.io</span></span>
          <span className="text-xs text-muted">— Free Bulk Ahrefs DR Checker</span>
        </div>
      </div>

      <div className="mt-5 card-glow p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(79,124,255,0.2)', border: '1px solid rgba(79,124,255,0.4)' }}>
            <TrendingUp className="w-6 h-6" style={{ color: '#4F7CFF' }} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-white text-base mb-1">Want a Higher DR for {domain}?</p>
            <p className="text-sm text-muted leading-relaxed">We increase Domain Rating to 20+, 30+, 40+, 50+ or even 70+ — with permanent guarantees. Delivered in 2–4 weeks.</p>
          </div>
          <Link href="/increase-dr" className="btn-primary px-6 py-3 text-sm flex-shrink-0 w-full sm:w-auto">
            Increase DR Now <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
