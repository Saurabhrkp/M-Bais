import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import ActiveLink from './ActiveLink';

export const Menu = () => {
  return (
    <Nav className='ml-auto' navbar>
      <Nav.Item>
        <Link href='/' passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href='/blog'>Blog</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
