import React from 'react';
import { Header } from '../components/Navbar';
import { authInitialProps } from '../lib/auth';
import Router from 'next/router';
import Player from '../components/Player';

const Index = ({ auth }) => {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [
      {
        src: '/admin/play/single_blog_1-1587910407739.mp4',
        type: 'video/mp4',
      },
    ],
  };
  return (
    <>
      <Header {...auth} />
      <div>
        <h1>Hello World</h1>
        <Player {...videoJsOptions} />
      </div>
    </>
  );
};

Index.getInitialProps = authInitialProps();

export default Index;
