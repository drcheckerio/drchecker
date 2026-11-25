'use client'
import { useRef, useState, useEffect } from 'react'
import { Download, Globe, TrendingUp, ChevronRight, BarChart3, ArrowRight } from 'lucide-react'
import DRSpeedometer from './DRSpeedometer'
import { DRResult } from '@/types'
import { getDRColor } from '@/lib/utils'
import Link from 'next/link'

interface DRResultCardProps {
  result: DRResult
  domain: string
}

export default function DRResultCard({ result, domain }: DRResultCardProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [startAnim, setStartAnim] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const color = getDRColor(result.dr)

  // Ahrefs ships two Domain Rating models. DR4 is only present when a Pro
  // user ran a comparison; DR3 stays the headline score either way.
  const hasDr4 = result.dr4 !== undefined
  const dr4Color = hasDr4 ? getDRColor(result.dr4 as number) : color
  const dr4Delta = hasDr4 ? (result.dr4 as number) - result.dr : 0


  // Start needle animation only once the card is fully visible on screen
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.intersectionRatio >= 0.55) {
            setStartAnim(true)
            obs.disconnect()
          }
        })
      },
      { threshold: [0.55] }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scoreRanges = [
    { range: '0 – 29', label: 'Poor', color: '#EF4444', active: result.dr < 30 },
    { range: '30 – 49', label: 'Fair', color: '#F59E0B', active: result.dr >= 30 && result.dr < 50 },
    { range: '50 – 69', label: 'Good', color: '#3B82F6', active: result.dr >= 50 && result.dr < 70 },
    { range: '70 – 100', label: 'Excellent', color: '#22C55E', active: result.dr >= 70 },
  ]

  const drMessage =
    result.dr >= 70 ? 'Top-tier rating — an outstanding backlink profile.' :
    result.dr >= 50 ? 'Solid rating — a healthy, growing backlink profile.' :
    result.dr >= 30 ? 'Moderate rating — clear room to increase authority.' :
    'Low rating — increasing DR will unlock real SEO power.'

  const downloadAsPNG = async () => {
    try {
      setDownloading(true)
      // Give the hidden export card one frame to fully paint
      await new Promise((r) => setTimeout(r, 350))
      const html2canvas = (await import('html2canvas')).default
      if (!exportRef.current) return
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0A0F1E',
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1000,
      })
      const link = document.createElement('a')
      link.download = `${domain}-dr-score.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="animate-slide-up">
      <div className="flex justify-end mb-3">
        <button onClick={downloadAsPNG} disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl card text-sm font-semibold text-muted hover:text-white transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> {downloading ? 'Preparing...' : 'Download PNG'}
        </button>
      </div>

      {/* ===== ON-SCREEN CARD ===== */}
      <div ref={cardRef} className="rounded-2xl p-4 sm:p-6" style={{ background: '#0A0F1E', border: '1px solid rgba(148,163,184,0.12)' }}>
        {!hasDr4 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Left: gauge */}
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
              <DRSpeedometer score={result.dr} size={250} animated={true} start={startAnim} />
            </div>

            {/* Desktop-only: credit below the speedometer */}
            <div className="hidden lg:flex items-center justify-center mt-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,138,30,0.07)', border: '1px solid rgba(255,138,30,0.2)' }}>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="drchecker.io" width={20} height={20} className="rounded-md" />
                <span className="text-xs font-bold text-white">Checked on <span style={{ color: '#FF8A1E' }}>drchecker.io</span></span>
                <span className="text-xs text-muted">— Free Bulk Ahrefs DR Checker</span>
              </div>
            </div>

            {/* Mobile-only: credit ABOVE result — stays in every screenshot */}
            <div className="lg:hidden flex items-center justify-center mt-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,138,30,0.07)', border: '1px solid rgba(255,138,30,0.2)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="drchecker.io" width={20} height={20} className="rounded-md" />
                <span className="text-xs font-bold text-white">Checked on <span style={{ color: '#FF8A1E' }}>drchecker.io</span></span>
                <span className="text-xs text-muted hidden sm:inline">— Free Bulk Ahrefs DR Checker</span>
              </div>
            </div>
            {/* Mobile-only: domain result info */}
            <div className="lg:hidden rounded-xl p-3 mt-3" style={{ background: 'rgba(7,11,20,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs text-muted mb-2 font-semibold">Result for</p>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,138,30,0.15)' }}>
                  <Globe className="w-3.5 h-3.5" style={{ color: '#FF8A1E' }} />
                </div>
                <span className="font-bold text-sm text-white">{domain}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {domain} has a <span className="font-extrabold" style={{ color }}>DR of {result.dr}</span>. {drMessage}
              </p>
            </div>
          </div>

          {/* Right: panels — desktop only */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4" style={{ background: 'rgba(15,22,41,0.65)' }}>
                <p className="text-xs text-muted font-semibold mb-3">DR Score</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,138,30,0.15)', border: '1px solid rgba(255,138,30,0.3)' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#FF8A1E' }} />
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(30,41,66,0.6)', border: '1px solid rgba(148,163,184,0.12)' }}>
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">0–100</div>
                    <div className="text-xs text-muted">Ahrefs Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-4" style={{ background: 'rgba(15,22,41,0.65)' }}>
              <p className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">DR Score Range</p>
              <div className="grid grid-cols-2 gap-2">
                {scoreRanges.map((r) => (
                  <div key={r.label} className="rounded-xl p-2.5"
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

            {/* Result for — below DR Score Range */}
            <div className="rounded-xl p-4 flex-1" style={{ background: 'rgba(7,11,20,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs text-muted mb-2 font-semibold">Result for</p>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,138,30,0.15)' }}>
                  <Globe className="w-3.5 h-3.5" style={{ color: '#FF8A1E' }} />
                </div>
                <span className="font-bold text-sm text-white">{domain}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {domain} has a <span className="font-extrabold" style={{ color }}>DR of {result.dr}</span>. {drMessage}
              </p>
            </div>
          </div>
        </div>
        )}

        {/* ===== DR3 vs DR4 — two live gauges ===== */}
        {hasDr4 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* DR3 — classic model */}
              <div className="card p-4 sm:p-6" style={{ background: 'rgba(15,22,41,0.65)' }}>
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <div>
                    <h3 className="font-extrabold text-base text-white tracking-wide">DR3 <span className="text-muted">· CLASSIC</span></h3>
                    <p className="text-xs text-muted mt-0.5">Ahrefs Domain Rating</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-soft"></span>
                    Live
                  </div>
                </div>
                <div className="flex justify-center my-1">
                  <DRSpeedometer score={result.dr} size={240} animated={true} start={startAnim} />
                </div>
                <p className="text-center text-xs text-muted leading-relaxed mt-2">
                  The long-standing Domain Rating the SEO industry has used for years.
                </p>
              </div>

              {/* DR4 — new model */}
              <div className="card p-4 sm:p-6" style={{ background: 'rgba(15,22,41,0.65)', border: '1px solid rgba(255,138,30,0.35)', boxShadow: '0 0 26px rgba(255,138,30,0.10)' }}>
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <div>
                    <h3 className="font-extrabold text-base tracking-wide" style={{ color: '#FFA94D' }}>DR4 <span className="text-muted">· NEW MODEL</span></h3>
                    <p className="text-xs text-muted mt-0.5">Ahrefs&apos; updated Domain Rating</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
                    style={{ background: 'rgba(255,138,30,0.16)', border: '1px solid rgba(255,138,30,0.4)', color: '#FFA94D' }}>
                    NEW
                  </div>
                </div>
                <div className="flex justify-center my-1">
                  <DRSpeedometer score={result.dr4 as number} size={240} animated={true} start={startAnim} />
                </div>
                <p className="text-center text-xs text-muted leading-relaxed mt-2">
                  Ahrefs&apos; rebuilt scoring model, designed to judge link quality more strictly.
                </p>
              </div>
            </div>

            {/* Comparison + what DR4 actually is */}
            <div className="card p-4 sm:p-5 mt-4" style={{ background: 'rgba(15,22,41,0.65)' }}>
              <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap mb-3">
                <div className="text-center">
                  <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-0.5">DR3</div>
                  <div className="text-2xl sm:text-3xl font-black" style={{ color }}>{result.dr}</div>
                </div>
                <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: '#8B96AD' }} />
                <div className="text-center">
                  <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-0.5">DR4</div>
                  <div className="text-2xl sm:text-3xl font-black" style={{ color: dr4Color }}>{result.dr4}</div>
                </div>
                <div className="px-3 py-1.5 rounded-xl text-sm font-black tabular-nums"
                  style={{
                    background: dr4Delta > 0 ? 'rgba(34,197,94,0.14)' : dr4Delta < 0 ? 'rgba(239,68,68,0.14)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${dr4Delta > 0 ? 'rgba(34,197,94,0.35)' : dr4Delta < 0 ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.1)'}`,
                    color: dr4Delta > 0 ? '#22C55E' : dr4Delta < 0 ? '#EF4444' : '#8B96AD',
                  }}>
                  {dr4Delta > 0 ? '+' : ''}{dr4Delta}
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed text-center max-w-2xl mx-auto">
                <span className="font-bold text-white">What is DR4?</span> It is Ahrefs&apos; new Domain Rating model,
                running alongside the original DR3 rather than replacing it overnight. It weighs the quality and
                relevance of backlinks more heavily, so sites built on genuinely strong links tend to hold or gain
                points, while sites propped up by low-value links often drop.{' '}
                {dr4Delta > 0
                  ? <>Here <span className="font-bold text-white">{domain}</span> scores <span className="font-bold" style={{ color: '#22C55E' }}>{dr4Delta} higher</span> on the new model — a sign its backlink profile holds up under stricter scrutiny.</>
                  : dr4Delta < 0
                  ? <>Here <span className="font-bold text-white">{domain}</span> scores <span className="font-bold" style={{ color: '#EF4444' }}>{Math.abs(dr4Delta)} lower</span> on the new model, which usually points to links the stricter model values less.</>
                  : <>Here <span className="font-bold text-white">{domain}</span> scores the same on both models.</>}
              </p>
            </div>

            {/* Credit — stays in every screenshot */}
            <div className="flex items-center justify-center mt-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,138,30,0.07)', border: '1px solid rgba(255,138,30,0.2)' }}>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="drchecker.io" width={20} height={20} className="rounded-md" />
                <span className="text-xs font-bold text-white">Checked on <span style={{ color: '#FF8A1E' }}>drchecker.io</span></span>
                <span className="text-xs text-muted hidden sm:inline">— Free Bulk Ahrefs DR Checker</span>
              </div>
            </div>

            {/* Result for */}
            <div className="rounded-xl p-3 sm:p-4 mt-4" style={{ background: 'rgba(7,11,20,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs text-muted mb-2 font-semibold">Result for</p>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,138,30,0.15)' }}>
                  <Globe className="w-3.5 h-3.5" style={{ color: '#FF8A1E' }} />
                </div>
                <span className="font-bold text-sm text-white">{domain}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {domain} has a <span className="font-extrabold" style={{ color }}>DR of {result.dr}</span> on the classic
                model and <span className="font-extrabold" style={{ color: dr4Color }}>DR {result.dr4}</span> on DR4. {drMessage}
              </p>
            </div>
          </>
        )}

      </div>

      {/* Bulk checker CTA — below card, not in PNG */}
      <div className="mt-5 card-glow p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,138,30,0.2)', border: '1px solid rgba(255,138,30,0.4)' }}>
            <TrendingUp className="w-6 h-6" style={{ color: '#FF8A1E' }} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-white text-base mb-1">Checking more than {domain}?</p>
            <p className="text-sm text-muted leading-relaxed">Run a whole list at once with the Bulk DR Checker — up to 1,000 domains per check on Pro, with CSV export.</p>
          </div>
          <Link href="/bulk-dr-checker" className="btn-primary px-6 py-3 text-sm flex-shrink-0 w-full sm:w-auto">
            Bulk Check Domains <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* ===== HIDDEN EXPORT CARD (clean, solid colors, static needle — used only for PNG) ===== */}
      <div style={{ position: 'fixed', left: '-10000px', top: 0, pointerEvents: 'none' }}>
        <div ref={exportRef} style={{ width: 900, background: '#0A0F1E', border: '1px solid #2A3348', borderRadius: 20, padding: 28, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {/* Left */}
            <div style={{ flex: '1 1 55%', background: '#101830', border: '1px solid #2A3348', borderRadius: 16, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: 0.5 }}>DOMAIN RATING</div>
                  <div style={{ fontSize: 11, color: '#8B96AD', marginTop: 2 }}>Ahrefs Domain Rating</div>
                </div>
                <div style={{ background: '#0E2418', border: '1px solid #1E5A38', color: '#22C55E', fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '5px 12px' }}>
                  ● Live Ahrefs Data
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <DRSpeedometer score={result.dr} size={250} animated={false} />
              </div>
            </div>

            {/* Right */}
            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1, background: '#101830', border: '1px solid #2A3348', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#8B96AD', fontWeight: 600, marginBottom: 8 }}>DR Score</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color }}>{result.dr}<span style={{ fontSize: 12, color: '#8B96AD', fontWeight: 500 }}> /100</span></div>
                </div>
                <div style={{ flex: 1, background: '#101830', border: '1px solid #2A3348', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#8B96AD', fontWeight: 600, marginBottom: 8 }}>Rating Scale</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>0–100</div>
                </div>
              </div>

              <div style={{ background: '#101830', border: '1px solid #2A3348', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#fff', fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>DR SCORE RANGE</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {scoreRanges.map((r) => (
                    <div key={r.label} style={{
                      borderRadius: 10, padding: 9,
                      background: r.active ? `${r.color}22` : '#0C1224',
                      border: `1px solid ${r.active ? r.color : '#232C42'}`,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: r.active ? r.color : '#5A657E' }}>● {r.range}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: r.active ? r.color : '#454F66', marginTop: 2 }}>{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#1A1208', border: '1px solid #4A3010', borderRadius: 12, padding: '10px 14px', textAlign: 'center', fontSize: 12 }}>
                <span style={{ fontWeight: 800, color: '#fff' }}>Checked on <span style={{ color: '#FF8A1E' }}>drchecker.io</span></span>
                <span style={{ color: '#8B96AD' }}> — Free Bulk Ahrefs DR Checker</span>
              </div>

              <div style={{ background: '#080D1A', border: '1px solid #232C42', borderRadius: 14, padding: 16, flex: 1 }}>
                <div style={{ fontSize: 11, color: '#8B96AD', fontWeight: 600, marginBottom: 6 }}>Result for</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🌐 {domain}</div>
                <div style={{ fontSize: 11.5, color: '#8B96AD', lineHeight: 1.6 }}>
                  {domain} has a <span style={{ color, fontWeight: 800 }}>DR of {result.dr}</span>. {drMessage}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
