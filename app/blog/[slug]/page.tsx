import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Reveal from '@/components/layout/Reveal'
import Link from 'next/link'
import { blogPosts, getPost } from '@/lib/blog-posts'
import { Calendar, Clock, ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://drchecker.io/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="badge-primary">{post.category}</span>
            <span className="flex items-center gap-1 text-xs text-muted"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1 text-xs text-muted"><Clock className="w-3 h-3" />{post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{post.title}</h1>
          <p className="text-muted leading-relaxed">{post.excerpt}</p>
        </div>

        <article className="legal-content card p-6 sm:p-9" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* CTA */}
        <div className="card-glow p-6 mt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,138,30,0.2)', border: '1px solid rgba(255,138,30,0.4)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#FF8A1E' }} />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-white mb-1">Ready to grow your Domain Rating?</p>
              <p className="text-sm text-muted">Check any domain free, or get a guaranteed DR increase in 2–4 weeks.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <Link href="/" className="btn-outline px-4 py-2.5 text-xs flex-1 sm:flex-none">Check DR</Link>
              <Link href="/increase-dr" className="btn-primary px-4 py-2.5 text-xs flex-1 sm:flex-none">Increase DR</Link>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-white mb-5">Keep Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                <div className="card p-5 h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="text-2xl mb-3">{p.emoji}</div>
                  <span className="badge-primary text-[10px] px-2 py-0.5 mb-2 inline-flex">{p.category}</span>
                  <h3 className="font-extrabold text-white text-sm leading-snug mb-2">{p.title}</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: '#FFA94D' }}>
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
