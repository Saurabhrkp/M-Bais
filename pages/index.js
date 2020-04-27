import React from 'react';
import { Header } from '../components/Navbar';
import { authInitialProps } from '../lib/auth';
import Router from 'next/router';
import { Player } from 'video-react';

const Index = ({ auth }) => {
  return (
    <>
      <Header {...auth} />
      <div>
        <h1>Hello World</h1>{' '}
        <Player>
          <source src='/admin/play/single_blog_1-1587910407739.mp4' />
        </Player>
      </div>
    </>
  );
};

Index.getInitialProps = authInitialProps();

export default Index;
