
import React from 'react';
import Navbar from './Navbar.jsx';
import Footor from './Footor.jsx';

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footor />
    </div>
  );
}