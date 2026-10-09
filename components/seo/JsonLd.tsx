const SITE = 'https://drchecker.io'

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Organization + WebSite (with sitelinks search box) — site-wide, rendered once in the root layout. */
export function SiteJsonLd() {
  return (
    <>
      <Script data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'DR Checker',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/logo-full.png` },
        description: 'Free bulk Ahrefs Domain Rating (DR) checker and guaranteed DR increase services.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@drchecker.io',
          url: `${SITE}/contact`,
        },
      }} />
      <Script data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'DR Checker',
        publisher: { '@id': `${SITE}/#organization` },
      }} />
    </>
  )
}

/** The checker itself as a SoftwareApplication, with its pricing tiers. */
export function AppJsonLd() {
  return (
    <Script data={{
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'DR Checker — Bulk Ahrefs Domain Rating Checker',
      url: SITE,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web browser',
      description: 'Check the Ahrefs Domain Rating of any website free. Bulk check up to 1,000 domains in one run with live Ahrefs data, sorting and CSV export.',
      offers: [
        {
          '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD',
          description: '50 domains per check, 10 checks per day.',
        },
        {
          '@type': 'Offer', name: 'Pro', price: '19', priceCurrency: 'USD',
          description: '1,000 domains per check with unlimited checks.',
        },
      ],
    }} />
  )
}

/** FAQ rich results. Pass the same Q&A shown on the page. */
export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Script data={{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }} />
  )
}

/** Increase DR packages as a Service with an offer catalog. */
export function ServiceJsonLd({ packages }: { packages: { target: string; price: number }[] }) {
  return (
    <Script data={{
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Increase Domain Rating (DR) Service',
      serviceType: 'SEO link building / Domain Rating increase',
      url: `${SITE}/increase-dr`,
      provider: { '@id': `${SITE}/#organization` },
      description: 'Guaranteed Ahrefs Domain Rating increase to a target tier using high-authority white-hat backlinks, delivered in 2–4 weeks.',
      offers: packages.map((p) => ({
        '@type': 'Offer',
        name: `Increase to ${p.target}`,
        price: String(p.price),
        priceCurrency: 'USD',
        url: `${SITE}/increase-dr`,
      })),
    }} />
  )
}

/** Blog post article markup. */
export function ArticleJsonLd({ title, description, slug, date }: { title: string; description: string; slug: string; date: string }) {
  return (
    <Script data={{
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: date,
      dateModified: date,
      url: `${SITE}/blog/${slug}`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${slug}` },
      author: { '@id': `${SITE}/#organization` },
      publisher: { '@id': `${SITE}/#organization` },
      image: `${SITE}/logo-full.png`,
    }} />
  )
}

/** Breadcrumbs for inner pages. */
export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <Script data={{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        item: `${SITE}${it.path}`,
      })),
    }} />
  )
}
