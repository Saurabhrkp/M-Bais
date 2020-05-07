import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';

import { signoutUser } from '../lib/auth';

export const Header = () => {
  const [auth, setAuth] = useState({});
  useEffect(() => {
    let user = window.localStorage.getItem('token');
    user = JSON.parse(user);
    setAuth(user);
  }, []);

  return (
    <Navbar
      className='shadow-lg px-0 navbar-custom'
      style={{ backgroundcolor: '#4633af' }}
      variant='dark'
      expand='md'
      collapseOnSelect
    >
      <Navbar.Brand href='/' className='ml-2'>
        <img
          src='/assets/Gear.png'
          width='60'
          height='50'
          className='d-inline-block align-top ml-4'
          alt='React Bootstrap logo'
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ml-auto'>
          {auth && auth._id ? (
            // Auth Navigation
            <>
              <Nav.Item>
                <Link href='/home'>
                  <a className='nav-link'>Search Video</a>
                </Link>
              </Nav.Item>

              <Nav.Item onClick={() => signoutUser()}>
                <Nav.Link>Sign out</Nav.Link>
              </Nav.Item>
            </>
          ) : (
            // UnAuth Navigation
            <>
              <Nav.Item className='mr-2 m-2'>
                <Link href='/signin'>
                  <a className='nav-link'>Sign In</a>
                </Link>
              </Nav.Item>
              <Nav.Item className='mr-4 m-2'>
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
