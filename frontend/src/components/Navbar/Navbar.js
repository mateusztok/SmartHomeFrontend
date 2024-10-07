import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/"><div>Home</div></Link>
      <Link to="/control"><div>Control</div></Link>
      <Link to="/environment"><div>Environment</div></Link>
      <Link to="/energy-consumption"><div>Energy Consumption</div></Link>
      <Link to="/energy-production"><div>Energy Production</div></Link>
      <Link to="/settings"><div>Settings</div></Link>
    </nav>
  );
}

export default Navbar;
