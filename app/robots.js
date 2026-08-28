const canonicalOrigin = 'https://pt-electrical.com'

/**
 * Public PES pages are crawlable by every standards-compliant crawler.
 * Page-level noindex directives (for example, the private integration
 * diagnostic) remain controlled by that route's metadata.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${canonicalOrigin}/sitemap.xml`,
    host: canonicalOrigin,
  }
}
