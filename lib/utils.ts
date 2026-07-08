import { DRRating, UserPlan } from '@/types'

export function getDRRating(score: number): DRRating {
  if (score >= 70) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Fair'
  return 'Poor'
}

export function getDRColor(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 50) return '#3b82f6'
  if (score >= 30) return '#f59e0b'
  return '#ef4444'
}

export function getDRLabel(score: number): string {
  if (score >= 70) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Fair'
  return 'Poor'
}

export function getDRDescription(domain: string, score: number): string {
  const rating = getDRRating(score)
  const descriptions = {
    Excellent: `${domain} has a DR of ${score}. This is a top-tier rating — it suggests an outstanding backlink profile with high-authority referring domains.`,
    Good: `${domain} has a DR of ${score}. This is a solid rating — the site has a healthy backlink profile with good domain authority.`,
    Fair: `${domain} has a DR of ${score}. This is a moderate rating — there is room to grow the backlink profile and domain authority.`,
    Poor: `${domain} has a DR of ${score}. This is a low rating — the site is relatively new or has limited backlinks. Focus on building quality links.`,
  }
  return descriptions[rating]
}

export interface CheckLimits {
  maxDomainsPerRun: number
  maxRunsPerDay: number | null // null = unlimited
  label: string
}

export function getPlanLimits(plan: UserPlan | null): CheckLimits {
  if (!plan) {
    return { maxDomainsPerRun: 3, maxRunsPerDay: null, label: 'Guest' }
  }
  if (plan === 'pro') {
    return { maxDomainsPerRun: 1000, maxRunsPerDay: null, label: 'Pro' }
  }
  return { maxDomainsPerRun: 100, maxRunsPerDay: 10, label: 'Free' }
}

export function cleanDomain(input: string): string {
  try {
    let domain = input.trim().toLowerCase()
    if (!domain.startsWith('http')) {
      domain = 'https://' + domain
    }
    const url = new URL(domain)
    return url.hostname.replace(/^www\./, '')
  } catch {
    return input.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
