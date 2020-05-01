import React from 'react';

import { authInitialProps } from '../lib/auth';

import { getPosts } from '../lib/api';

const Index = () => {
  return (
    <>
      <h1>Start from here</h1>
    </>
  );
};

// Just let authInitialProps() be there it would do any thing
Index.getInitialProps = authInitialProps();

export default Index;
