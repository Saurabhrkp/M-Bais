import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';

import { signoutUser } from '../lib/auth';

export const Header = ({ auth }) => {
  return (
    <Navbar
      className='shadow-lg px-0 navbar-custom'
      bg='dark'
      variant='dark'
      expand='md'
      collapseOnSelect
    >
      <Navbar.Brand href='/' className='ml-2'>
        M-bais App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ml-auto'>
          {auth?.user && auth.user._id ? (
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
