import React from 'react';
import { Header } from '../components/Navbar';
import { authInitialProps } from '../lib/auth';
import Router from 'next/router';

const Index = ({ auth }) => (
  <>
    <Header {...auth} />
    <div>
      <h1>Hello World</h1>
    </div>
  </>
);

Index.getInitialProps = authInitialProps();

export default Index;
