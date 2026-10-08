import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://drchecker.io'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/bulk-dr-checker`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/increase-dr`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
