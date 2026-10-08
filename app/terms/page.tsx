import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for drchecker.io — the rules for using our DR checker tools and services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Terms of <span className="gradient-text">Service</span></h1>
        <p className="text-muted text-sm mb-10">Last updated: October 2026</p>

        <div className="legal-content card p-6 sm:p-9">
          <p>These Terms of Service ("Terms") govern your access to and use of drchecker.io ("we", "our", "us"), including our free Domain Rating checker, bulk DR checking tools, paid subscriptions, and DR increase services. By using our website or services, you agree to these Terms.</p>

          <h2>1. Our Services</h2>
          <p>drchecker.io provides tools to check the Ahrefs Domain Rating (DR) of websites, in single and bulk form, and offers optional paid services to increase a website's Domain Rating. Domain Rating data is sourced from Ahrefs; "Domain Rating" and the DR metric are properties of Ahrefs. We are not affiliated with or endorsed by Ahrefs.</p>

          <h2>2. Accounts</h2>
          <ul>
            <li>You must provide a valid, permanent email address to create an account. Temporary or disposable email addresses are not permitted.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</li>
            <li>You must be at least 16 years old to create an account.</li>
          </ul>

          <h2>3. Plans, Usage Limits & Fair Use</h2>
          <ul>
            <li><strong>Guest:</strong> up to 20 domains per check, 10 checks per day, no account required.</li>
            <li><strong>Free account:</strong> up to 50 domains per check, 10 checks per day.</li>
            <li><strong>Pro ($19/month):</strong> up to 1,000 domains per check with unlimited checks.</li>
            <li>Limits are enforced to ensure fair use. Attempting to circumvent limits, scrape, resell, or abuse the service may result in suspension.</li>
          </ul>

          <h2>4. Payments & Subscriptions</h2>
          <ul>
            <li>Paid subscriptions are billed through our payment provider. Prices are shown at checkout and may be subject to applicable taxes.</li>
            <li>Subscriptions renew automatically each billing period until cancelled. You may cancel anytime; access continues until the end of the paid period.</li>
            <li>Refunds are governed by our <Link href="/refund-policy">Refund Policy</Link>.</li>
          </ul>

          <h2>5. Increase DR Services</h2>
          <ul>
            <li>DR increase campaigns are delivered within the stated timeframe (typically 2–4 weeks) to a guaranteed target tier.</li>
            <li>Guarantees and refund eligibility for these services are described on the <Link href="/increase-dr">Increase DR</Link> page and in our <Link href="/refund-policy">Refund Policy</Link>.</li>
            <li>We use white-hat methods only. We are not responsible for DR changes caused by your own actions, third parties, or changes to Ahrefs' methodology.</li>
          </ul>

          <h2>6. Acceptable Use</h2>
          <p>You agree not to: use the service for unlawful purposes; attempt to gain unauthorized access to our systems; overload, scrape, or disrupt the service; resell access without permission; or use the data in violation of Ahrefs' terms or the Domain Rating License.</p>

          <h2>7. Data & Accuracy</h2>
          <p>DR figures are provided "as is" from Ahrefs and may change as Ahrefs recrawls the web. We do not guarantee the accuracy, completeness, or availability of any data, and the service may be unavailable from time to time.</p>

          <h2>8. Intellectual Property</h2>
          <p>All content, branding, and software on drchecker.io are owned by us or our licensors. "Domain Rating by Ahrefs" is attributed to Ahrefs. You may not copy, modify, or distribute our content without permission.</p>

          <h2>9. Disclaimers & Limitation of Liability</h2>
          <p>The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages, or for any loss arising from your use of, or inability to use, the service. Our total liability for any claim is limited to the amount you paid us in the 3 months preceding the claim.</p>

          <h2>10. Termination</h2>
          <p>We may suspend or terminate your access if you violate these Terms. You may stop using the service at any time and request account deletion.</p>

          <h2>11. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. Material changes will be posted on this page with an updated date. Continued use after changes constitutes acceptance.</p>

          <h2>12. Contact</h2>
          <p>Questions about these Terms? Reach us via our <Link href="/contact">Contact page</Link>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
