import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Layout.css'; 
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="layout-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
