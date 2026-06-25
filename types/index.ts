export type UserPlan = 'free' | 'pro'
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type DRRating = 'Poor' | 'Fair' | 'Good' | 'Excellent'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  plan: UserPlan
  dr_checks_used_today: number
  dr_runs_used_today: number
  last_check_date: string | null
  is_admin: boolean
  created_at: string
}

export interface DRResult {
  domain: string
  dr: number
  rating: DRRating
  ahrefs_rank?: number
  backlinks?: number
  referring_domains?: number
  error?: string
}

export interface Order {
  id: string
  user_id: string
  service_id: string
  service_name: string
  status: OrderStatus
  urls: string[]
  notes: string | null
  price: number
  result_data: any | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  delivery_days: number
  features: string[]
  is_active: boolean
  sort_order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  paddle_subscription_id: string
  plan: UserPlan
  status: string
  current_period_end: string
  created_at: string
}
