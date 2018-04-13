import Document, { Head, Main, NextScript } from 'next/document'

import { GA_TRACKING_ID } from '../utils/gtag'

class CustomDocument extends Document {
  static displayName = 'CustomDocument'

  render() {
    return (
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="shortcut icon"
            type="image/png"
            href="/static/favicon.png"
          />
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Global site tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `,
            }}
          />
        </body>
      </html>
    )
  }
}

export default CustomDocument
