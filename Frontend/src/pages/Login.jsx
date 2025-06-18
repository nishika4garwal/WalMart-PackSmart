/* need db logic in backend app.js to actually login */

import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent form reload
    const userData = {
      email: email,
      password: password
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
    // console.log(userData);
    
    if (response.status === 200) {
      const data = response.data;
      // setUser(data.user);
      localStorage.setItem('token', data.token); 
      navigate('/');     
    }


    setEmail(''); // Clear email input
    setPassword(''); // Clear password input
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex items-center justify-center px-4 overflow-hidden">

      {/* Decorative blob */}
      <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>
      {/* Login Card */}
      <div className="relative z-10 bg-sparkyellow rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center">

        {/* Logo */}
        <img
          src={logo}
          alt="Walmart Logo"
          className="w-36 h-36 object-contain mb-6"
        />

        {/* Title */}
        <h2 className="text-2xl font-bold text-trueblue mb-6">
          Login to Admin Dashboard
        </h2>

        {/* Login Form */}
        <form 
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
              </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trueblue"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor = "password" className="block text-sm font-medium text-gray-700">
              Password
              </label>
            <input
              type="password"
              id = "password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trueblue"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-trueblue text-white font-semibold py-2 rounded-md hover:text-black transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
