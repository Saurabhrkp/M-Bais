import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ActiveLink from './ActiveLink';

import { signoutUser } from '../lib/auth';

export const Header = ({ pageProps: { auth }, router }) => {
  const { user = {} } = auth || {};
  // (function prefetchPages() {
  //   if (typeof window !== 'undefined') {
  //     router.prefetch(router.pathname);
  //   }
  // })();

  // const handleClick = (event) => {
  //   router.push(href);
  // };

  // const isCurrentPath = router.pathname === href || router.asPath === href;
  return (
    <Navbar
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
          <Nav.Item className='m-2'>
            <ActiveLink href='/'>Home</ActiveLink>
          </Nav.Item>
          {user._id ? (
            // Auth Navigation
            <>
              <Nav.Item>
                <ActiveLink href={`/profile/${user._id}`}>Profile</ActiveLink>
              </Nav.Item>
              <Nav.Item onSelect={signoutUser}>Sign out</Nav.Item>
            </>
          ) : (
            // UnAuth Navigation
            <>
              <Nav.Item className='m-2'>
                <ActiveLink href='/signin'>Sign In</ActiveLink>
              </Nav.Item>
              <Nav.Item className='m-2'>
                <ActiveLink href='/signup'>Sign up</ActiveLink>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
