import Document, { Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  static displayName = 'CustomDocument'

  render() {
    return (
      <html>
        <Head>
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
        </body>
      </html>
    )
  }
}

export default CustomDocument
