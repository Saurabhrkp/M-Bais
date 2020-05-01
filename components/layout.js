import React from 'react';

export const Layout = ({ children }) => {
  return (
    <>
      <main className='container-fluid mt-3 p-0'>{children}</main>
    </>
  );
};
