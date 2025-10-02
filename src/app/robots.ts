import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/restaurant-dashboard/'],
    },
    sitemap: 'https://menupro.app/sitemap.xml',
  }
}
