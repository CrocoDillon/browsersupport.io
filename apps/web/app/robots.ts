import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/?q=', '/?browse='],
    },
    sitemap: 'https://browsersupport.io/sitemap.txt',
  }
}
