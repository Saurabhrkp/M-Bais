import React from 'react';
import { Layout } from '../components/layout';
import { authInitialProps } from '../lib/auth';
import Router from 'next/router';

const Index = ({ auth }) => (
  <Layout>
    {auth.user && auth.user._id ? (
      <div>
        <h1>Logged In</h1>
      </div>
    ) : (
      <div className='row'>
        <div className='col-12'>
          <h1>Home Page</h1>
        </div>
        <button onClick={() => Router.push('/signup')}>Get Started</button>
      </div>
    )}
  </Layout>
);

Index.getInitialProps = authInitialProps();

export default Index;
