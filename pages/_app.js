import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';
import 'video.js/dist/video-js.css';

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
        <DefaultSeo {...DEFAULT_SEO} />
        <Component {...pageProps} />
      </>
    );
  }
}
