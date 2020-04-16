import React from 'react';
import { Footer } from './footer';
import { Header } from './header';

export const Layout = (props) => {
  return (
    <>
      <Header />
      <main className='container mt-3'>{props.children}</main>
      <Footer />
    </>
  );
};
