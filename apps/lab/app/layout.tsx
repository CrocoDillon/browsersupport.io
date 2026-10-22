import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '../../web/app/globals.css'
import './lab.css'
import { Themes, ThemeSwitch } from '../../web/app/components/theme'
import { Mark } from '../../web/app/components/mark'
export const metadata: Metadata = {
  title: 'browsersupport lab · localhost',
  robots: { index: false, follow: false },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Themes>
          <header className="site-header shell">
            <div className="wordmark">
              <Mark />
              <span>
                browsersupport <span className="wordmark-light">/ lab</span>
              </span>
            </div>
            <nav>
              <span className="category-label">localhost only</span>
              <ThemeSwitch />
            </nav>
          </header>
          <main className="shell">{children}</main>
        </Themes>
      </body>
    </html>
  )
}
