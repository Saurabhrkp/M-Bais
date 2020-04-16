import React from 'react';
import { Footer } from './footer';
import Container from 'react-bootstrap/Container';

export const Layout = (props) => {
  return (
    <>
      <Container fluid>{props.children}</Container>
      <Footer />
    </>
  );
};
