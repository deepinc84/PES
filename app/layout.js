import './globals.css'
import './project-engine.css'
import { Footer, Header } from '@/components/site'
import { getTrustedSitePlan } from '@/lib/trusted-engine'

export const metadata = {
  metadataBase: new URL('https://pt-electrical.com'),
  title: { default: 'Platinum Electrical Services | Calgary Electrician', template: '%s | Platinum Electrical Services' },
  description: 'Residential, commercial and industrial electrical services in Calgary, Alberta.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'en_CA', siteName: 'Platinum Electrical Services', url: 'https://pt-electrical.com', title: 'Platinum Electrical Services', description: 'Residential, commercial and industrial electrical services in Calgary.' },
}

export default async function RootLayout({ children }) {
  const trusted = await getTrustedSitePlan()
  const navigation = trusted.ok ? trusted.sitePlan?.navigation ?? null : null
  return <html lang="en-CA"><body><Header trustedNavigation={navigation} /><main>{children}</main><Footer trustedNavigation={navigation} /></body></html>
}
