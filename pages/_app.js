import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';

const DEFAULT_SEO = {
  title: 'Mech-Bias',
  description: 'Awesome Mech-Bias website',
  openGraph: {
    type: 'website',
    locale: 'en',
    title: 'Mech-Bias website',
    description: 'Awesome Mech-Bias website',
    site_name: 'Mech-Bias',
  },
};

export default class CustomApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req && ctx.req.session && ctx.req.session.passport) {
      pageProps.user = ctx.req.session.passport.user;
    }
    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.state = {
      user: props.pageProps.user,
    };
  }

  componentDidMount() {
    Router.events.on('routeChangeComplete', () => {
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });
    Router.events.on('routeChangeError', () => {
      NProgress.done();
    });
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;
    const props = {
      ...pageProps,
      user: this.state.user,
    };
    return (
      <>
        <DefaultSeo {...DEFAULT_SEO} />
        <Component {...props} />
      </>
    );
  }
}
