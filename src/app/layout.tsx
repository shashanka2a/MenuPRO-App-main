import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MenuOS - #1 Restaurant CMS & Digital Menu System | Better Than Square & Toast',
  description: 'The best restaurant CMS for digital menus and QR ordering. No commission fees, $19/month flat rate. Better than Square ($69+/month) and Toast ($79+/month). Setup in 15 minutes.',
  keywords: 'restaurant CMS, digital menu system, QR code ordering, restaurant management software, restaurant POS alternative, digital ordering platform, restaurant technology, menu management, online ordering system, restaurant analytics, multi-location restaurant software, restaurant management platform, digital menu QR code, restaurant ordering system, restaurant management solution, restaurant software, menu management system, restaurant digital transformation, restaurant technology solutions, restaurant management tools, restaurant ordering platform, digital restaurant menu, restaurant management system, restaurant POS software, restaurant management app, restaurant digital menu, restaurant ordering software, restaurant management platform, restaurant technology platform, restaurant digital ordering, restaurant management software, restaurant ordering system, restaurant digital transformation, restaurant technology solutions, restaurant management tools, restaurant ordering platform, restaurant digital menu, restaurant management system, restaurant POS software, restaurant management app, restaurant digital menu, restaurant ordering software, restaurant management platform, restaurant technology platform, restaurant digital ordering',
  authors: [{ name: 'MenuOS Team' }],
  creator: 'MenuOS',
  publisher: 'MenuOS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://menupro.app',
    siteName: 'MenuOS - Restaurant CMS & Digital Menu System',
    title: 'MenuOS - #1 Restaurant CMS | Better Than Square & Toast | $19/month',
    description: 'The best restaurant CMS for digital menus and QR ordering. No commission fees, $19/month flat rate. Better than Square ($69+/month) and Toast ($79+/month). Setup in 15 minutes.',
    images: [
      {
        url: '/menupro-logo.png',
        width: 1200,
        height: 630,
        alt: 'MenuOS Restaurant CMS - Better Than Square and Toast',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuOS - #1 Restaurant CMS | Better Than Square & Toast',
    description: 'The best restaurant CMS for digital menus and QR ordering. No commission fees, $19/month flat rate. Better than Square and Toast.',
    images: ['/menupro-logo.png'],
    creator: '@menuos',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/menupro-logo.svg',
    shortcut: '/menupro-logo.svg',
    apple: '/menupro-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
