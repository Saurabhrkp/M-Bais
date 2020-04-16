import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';

import { Header } from '../components/header';

const DEFAULT_SEO = {
  title: 'Blog Tutorial Web',
  description: 'Awesome blog tutorial website',
  openGraph: {
    type: 'website',
    locale: 'en',
    title: 'Blog Tutorial website',
    description: 'Awesome blog tutorial website',
    site_name: 'BlogTutorial',
  },
};

export default class CustomApp extends App {
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

    return (
      <>
        <Header {...this.props} />
        <DefaultSeo {...DEFAULT_SEO} />
        <Component {...pageProps} />
      </>
    );
  }
}
