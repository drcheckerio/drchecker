import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Reveal from '@/components/layout/Reveal'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-posts'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SEO Blog — Link Building, Off-Page SEO & Domain Rating Guides',
  description: 'Actionable guides on off-page SEO, link building, blogger outreach and growing your Ahrefs Domain Rating — from the team behind drchecker.io.',
  alternates: { canonical: 'https://drchecker.io/blog' },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative pt-36 pb-10 overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-spotlight" />
        <div className="hero-beam" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary mb-5 inline-flex">The DR Checker Blog</div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4 text-white">
            SEO Guides That <span className="gradient-text">Build Authority</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Real-world playbooks on off-page SEO, link building, outreach and Domain Rating growth — from campaigns we actually run.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <article className="card p-6 sm:p-7 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'rgba(255,138,30,0.12)', border: '1px solid rgba(255,138,30,0.25)' }}>
                      {post.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="badge-primary text-[10px] px-2.5 py-0.5">{post.category}</span>
                        <span className="flex items-center gap-1 text-xs text-muted"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1 text-xs text-muted"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-white mb-2 leading-snug group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: '#FF8A1E' }}>
                        {post.title}
                      </h2>
                      <p className="text-muted text-sm leading-relaxed mb-3">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: '#FFA94D' }}>
                        Read article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}

          {/* CTA */}
          <Reveal delay={300}>
            <div className="card-glow p-7 text-center mt-10">
              <h3 className="text-xl font-black text-white mb-2">Want a Higher <span className="gradient-text">Domain Rating?</span></h3>
              <p className="text-muted text-sm mb-5 max-w-md mx-auto">Check any domain free, bulk check up to 1,000 at once, or let us raise your DR to a guaranteed target in 2–4 weeks.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="btn-primary px-6 py-2.5 text-sm">Check DR Free</Link>
                <Link href="/increase-dr" className="btn-outline px-6 py-2.5 text-sm">Increase DR Packages</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
