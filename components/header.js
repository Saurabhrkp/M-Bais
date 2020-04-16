import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ActiveLink from './ActiveLink';

import { signoutUser } from '../lib/auth';

export const Header = ({ pageProps: { auth } }) => {
  const { user = {} } = auth || {};
  return (
    <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
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
