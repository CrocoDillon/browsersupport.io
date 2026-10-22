import type { Metadata } from 'next'
import Link from 'next/link'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './globals.css'
import { Mark } from './components/mark'
import { Themes, ThemeSwitch } from './components/theme'
export const metadata: Metadata = {
  metadataBase: new URL('https://browsersupport.io'),
  title: {
    default: 'browsersupport.io — Explore JavaScript APIs',
    template: '%s · browsersupport.io',
  },
  description:
    'Explore browser observations for JavaScript APIs, one property at a time. The familiar, the obscure, and everything in between.',
  openGraph: {
    type: 'website',
    siteName: 'browsersupport.io',
    title: 'browsersupport.io',
    description: 'JavaScript APIs, one property at a time.',
  },
  icons: { icon: '/icon.svg', apple: '/apple-icon' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Themes>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <header className="site-header shell">
            <Link
              href="/"
              className="wordmark"
              aria-label="browsersupport.io home"
            >
              <Mark />
              <span>
                browser<span className="wordmark-light">support</span>
                <span className="wordmark-dot">.io</span>
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/?browse=1">Explore APIs</Link>
              <Link href="/about">About</Link>
              <a
                href="https://github.com/CrocoDillon/browsersupport.io"
                className="github-link"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <ThemeSwitch />
            </nav>
          </header>
          <main id="main" className="shell">
            {children}
          </main>
          <footer className="site-footer shell">
            <div className="footer-brand">
              <Mark />
              <span>A small project about a very big language.</span>
            </div>
            <div>
              Made by <a href="https://crocodillon.com">Dillon</a>
              <span className="footer-divider">/</span>
              <a href="https://github.com/CrocoDillon/browsersupport.io">
                Open source ↗
              </a>
            </div>
          </footer>
        </Themes>
      </body>
    </html>
  )
}
