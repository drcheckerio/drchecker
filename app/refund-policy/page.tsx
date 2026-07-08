import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for drchecker.io — Pro subscriptions and DR increase service refund terms.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Refund <span className="gradient-text">Policy</span></h1>
        <p className="text-muted text-sm mb-10">Last updated: July 2026</p>

        <div className="legal-content card p-6 sm:p-9">
          <p>At drchecker.io we want you to be fully satisfied with our services. This policy explains when and how refunds apply to our Pro subscription and our Increase DR services.</p>

          <h2>1. Pro Subscription ($5/month)</h2>
          <ul>
            <li><strong>7-day money-back guarantee:</strong> If you are not satisfied with your Pro subscription, contact us within 7 days of your first payment for a full refund — no questions asked.</li>
            <li><strong>Renewals:</strong> Monthly renewal charges are non-refundable once a new billing cycle begins, but you can cancel anytime and keep Pro access until the end of your paid period.</li>
            <li><strong>Cancellation:</strong> Cancel anytime from your dashboard billing page. No cancellation fees ever.</li>
          </ul>

          <h2>2. Increase DR Services</h2>
          <ul>
            <li><strong>Before work begins:</strong> If you cancel within 24 hours of placing your order and before our team starts the campaign, you receive a 100% refund.</li>
            <li><strong>Target not reached:</strong> If we fail to deliver your guaranteed DR target within the promised delivery window (2–4 weeks, allowing for Ahrefs recalculation time), you are entitled to a full refund of your package price.</li>
            <li><strong>After successful delivery:</strong> Once your target DR is reached and verified via live Ahrefs data, the order is considered complete and non-refundable. Your guarantee (Lifetime for DR 20+/30+/40+, or 1 Year for DR 50+/70+) remains active — any drop below the target within the guarantee period is restored free of charge, not refunded.</li>
          </ul>

          <h2>3. How Refunds Are Processed</h2>
          <ul>
            <li>All refunds are issued to the original payment method via our payment provider, Paddle.</li>
            <li>Refunds typically appear within 5–10 business days depending on your bank or card issuer.</li>
          </ul>

          <h2>4. Situations Not Covered</h2>
          <ul>
            <li>DR fluctuations caused by your own actions (e.g., removing links, domain penalties, site migration errors) during or after a campaign.</li>
            <li>Requests made outside the timeframes described above.</li>
            <li>Abuse of the free tier or attempts to circumvent plan limits.</li>
          </ul>

          <h2>5. How to Request a Refund</h2>
          <p>Send us a message via the <Link href="/contact">Contact page</Link> with your order ID and reason. We respond to all refund requests within 48 hours.</p>

          <h2>6. Questions</h2>
          <p>Unsure whether your situation qualifies? Just ask — we're fair, and our guarantee exists to protect you. Reach us anytime via <Link href="/contact">Contact</Link>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
