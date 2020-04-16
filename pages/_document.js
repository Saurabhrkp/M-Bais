import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import { getSessionFromServer, getUserScript } from '../lib/auth';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const user = getSessionFromServer(ctx.req);
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...user,
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { user = {} } = this.props;
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='stylesheet'
            href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
            integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T'
            crossOrigin='anonymous'
          />
          <link rel='stylesheet' href='/static/styles/style.css' />
        </Head>
        <body>
          <Main />
          <script
            dangerouslySetInnerHTML={{
              __html: getUserScript(user),
            }}
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}
