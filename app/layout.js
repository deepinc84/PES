import './globals.css'
import { Footer, Header } from '@/components/site'

export const metadata = {
  metadataBase: new URL('https://pt-electrical.com'),
  title: { default: 'Platinum Electrical Services | Calgary Electrician', template: '%s | Platinum Electrical Services' },
  description: 'Residential, commercial and industrial electrical services in Calgary, Alberta.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'en_CA', siteName: 'Platinum Electrical Services', url: 'https://pt-electrical.com', title: 'Platinum Electrical Services', description: 'Residential, commercial and industrial electrical services in Calgary.' },
}

export default function RootLayout({ children }) {
  return <html lang="en-CA"><body><Header /><main>{children}</main><Footer /></body></html>
}
