import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for drchecker.io — refund and cancellation terms for the Pro subscription.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Refund <span className="gradient-text">Policy</span></h1>
        <p className="text-muted text-sm mb-10">Last updated: July 2026</p>

        <div className="legal-content card p-6 sm:p-9">
          <p>At drchecker.io we want you to be fully satisfied with our services. This policy explains when and how refunds apply to our Pro subscription.</p>

          <h2>1. Pro Subscription ($19/month)</h2>
          <ul>
            <li><strong>7-day money-back guarantee:</strong> If you are not satisfied with your Pro subscription, contact us within 7 days of your first payment for a full refund — no questions asked.</li>
            <li><strong>Renewals:</strong> Monthly renewal charges are non-refundable once a new billing cycle begins, but you can cancel anytime and keep Pro access until the end of your paid period.</li>
            <li><strong>Cancellation:</strong> Cancel anytime from your dashboard billing page. No cancellation fees ever.</li>
          </ul>

          <h2>2. How Refunds Are Processed</h2>
          <ul>
            <li>All refunds are issued to the original payment method via our payment provider, Paddle.</li>
            <li>Refunds typically appear within 5–10 business days depending on your bank or card issuer.</li>
          </ul>

          <h2>3. Situations Not Covered</h2>
          <ul>
                        <li>Requests made outside the timeframes described above.</li>
            <li>Abuse of the free tier or attempts to circumvent plan limits.</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <p>Send us a message via the <Link href="/contact">Contact page</Link> with your account email and reason. We respond to all refund requests within 48 hours.</p>

          <h2>5. Questions</h2>
          <p>Unsure whether your situation qualifies? Just ask — we're fair, and our guarantee exists to protect you. Reach us anytime via <Link href="/contact">Contact</Link>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
