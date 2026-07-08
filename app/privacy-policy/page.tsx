import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for drchecker.io — how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Privacy <span className="gradient-text">Policy</span></h1>
        <p className="text-muted text-sm mb-10">Last updated: July 2026</p>

        <div className="legal-content card p-6 sm:p-9">
          <p>Welcome to drchecker.io ("we", "our", "us"). This Privacy Policy explains how we collect, use, and protect your information when you use our website and services, including our free Domain Rating checker, bulk checking tools, and DR increase services.</p>

          <h2>1. Information We Collect</h2>
          <p><strong>Information you provide directly:</strong></p>
          <ul>
            <li>Account information — email address and name when you create an account.</li>
            <li>Payment information — processed securely by our payment provider (Paddle). We never store your full card details on our servers.</li>
            <li>Order details — domains and requirements you submit when ordering our DR increase services.</li>
            <li>Communications — messages you send us via email or contact forms.</li>
          </ul>
          <p><strong>Information collected automatically:</strong></p>
          <ul>
            <li>Usage data — domains you check, number of checks performed, and feature usage, used to enforce plan limits.</li>
            <li>Technical data — IP address, browser type, device type, and pages visited, collected via analytics tools such as Google Analytics.</li>
            <li>Cookies — small files used to keep you logged in, remember preferences, and measure site performance.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and operate our DR checking tools and services.</li>
            <li>To process payments, manage subscriptions, and deliver service orders.</li>
            <li>To enforce usage limits across Guest, Free, and Pro plans.</li>
            <li>To send transactional emails such as order confirmations and status updates.</li>
            <li>To improve our website, tools, and user experience.</li>
            <li>To prevent fraud, abuse, and unauthorized access.</li>
          </ul>

          <h2>3. How We Share Information</h2>
          <p>We do not sell your personal data. We share information only with:</p>
          <ul>
            <li><strong>Service providers</strong> — hosting (Vercel), database and authentication (Supabase), payments (Paddle), email delivery, and analytics providers who process data on our behalf.</li>
            <li><strong>Legal requirements</strong> — when required by law, court order, or to protect our legal rights.</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>We keep account data for as long as your account is active. Order records are retained for accounting and guarantee-servicing purposes. You may request deletion of your account and associated personal data at any time by contacting us.</p>

          <h2>5. Data Security</h2>
          <p>We use industry-standard measures to protect your data, including encrypted connections (HTTPS), secure authentication, and row-level security on our database. No method of transmission over the internet is 100% secure, but we work continuously to protect your information.</p>

          <h2>6. Cookies & Analytics</h2>
          <p>We use cookies for essential site functions and analytics tools (such as Google Analytics) to understand how visitors use our site. You can control cookies through your browser settings; disabling them may limit some functionality.</p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to access, correct, export, or delete your personal data, and to object to or restrict certain processing. To exercise these rights, contact us at the details below.</p>

          <h2>8. Children's Privacy</h2>
          <p>Our services are not directed to individuals under 16. We do not knowingly collect personal information from children.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated date.</p>

          <h2>10. Contact Us</h2>
          <p>For any privacy questions or requests, reach out via our <Link href="/contact">Contact page</Link>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
