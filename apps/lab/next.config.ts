import type { NextConfig } from 'next'
if (process.env.VERCEL)
  throw new Error(
    'The lab is localhost-only and must not be deployed to Vercel'
  )
const config: NextConfig = {
  transpilePackages: ['@browsersupport/data'],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
        ],
      },
    ]
  },
}
export default config
