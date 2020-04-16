import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Menu } from './menu';

export const Header = () => {
  return (
    <Navbar bg='light' expand='md' collapseOnSelect>
      <Navbar.Brand href='/'>Flask/NextJs App</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Menu />
      </Navbar.Collapse>
    </Navbar>
  );
};
