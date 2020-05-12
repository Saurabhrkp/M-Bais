import React from 'react';

import { Header } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Welcome } from '../components/Welcome';

const Index = ({ user }) => {
  return (
    <>
      <Header user={user} />
      {!user && <Welcome />}
      {user && <h1>Hello World</h1>}
      <Footer />
    </>
  );
};

Index.getInitialProps = () => {
  return {};
};

export default Index;
