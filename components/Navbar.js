import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';

import { signoutUser } from '../lib/auth';

export const Header = (props) => {
  const { token = '' } = props;
  return (
    <Navbar
      className='shadow-lg'
      bg='dark'
      style={{ padding: '0px 16px' }}
      variant='dark'
      expand='md'
      collapseOnSelect
    >
      <Navbar.Brand href='/'>Flask/NextJs App</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ml-auto'>
          {!!token ? (
            // Auth Navigation
            <>
              <Nav.Item>
                <Link href='/profile'>
                  <a className='nav-link'>Profile</a>
                </Link>
              </Nav.Item>
              <Nav.Item onClick={() => signoutUser()}>
                <Nav.Link>Sign out</Nav.Link>
              </Nav.Item>
            </>
          ) : (
            // UnAuth Navigation
            <>
              <Nav.Item className='mr-2'>
                <Link href='/signin'>
                  <a className='nav-link'>Sign In</a>
                </Link>
              </Nav.Item>
              <Nav.Item className='mr-2'>
                <Link href='/signup'>
                  <a className='nav-link'>Sign up</a>
                </Link>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
