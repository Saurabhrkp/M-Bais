import React from 'react';
import { Layout } from 'components/layout';
import { authInitialProps } from '../lib/auth';
import Router from 'next/router';

export const Index = ({ auth }) => (
  <Layout>
    {auth.user && auth.user._id ? (
      <div></div>
    ) : (
      <div className='row'>
        <div className='col-12'>
          <h1>Home Page</h1>
        </div>
        <Button
          className={classes.fabButton}
          variant='extendedFab'
          color='primary'
          onClick={() => Router.push('/signup')}
        >
          Get Started
        </Button>
      </div>
    )}
  </Layout>
);

Index.getInitialProps = authInitialProps();
