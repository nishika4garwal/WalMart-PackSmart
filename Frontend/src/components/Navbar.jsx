// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-trueblue text-white px-4 shadow-md flex justify-between items-center z-50">
      <div className="flex items-center space-x-4 h-full">
        <img
          src={logo}
          alt="Walmart Logo"
          className="max-h-full w-auto object-contain"
        />
        <span className="text-xl hover:text-sparkyellow font-semibold">
          <Link to="/home">Admin Dashboard</Link>
        </span>
      </div>
      <div className="flex space-x-6">
        <Link
          to="/summary"
          className="text-white hover:text-sparkyellow transition duration-200 text-lg font-medium"
        >
          Summary
        </Link>
        <Link
          to="/login"
          className="text-white hover:text-sparkyellow transition duration-200 text-lg font-medium"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
