import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import instance from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import bgImg from '../assets/walmart bg.png';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login data:", { email, password });

      const response = await instance.post(`/employees/login`, { email, password });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (err) {
      alert('Invalid credentials or server error');
      console.error(err);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0" />

      <div className="relative z-10 bg-sparkyellow rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center">
        <img
          src={logo}
          alt="Walmart Logo"
          className="w-36 h-36 object-contain mb-6"
        />

        <h2 className="text-2xl font-bold text-trueblue mb-6">
          Login to Admin Dashboard
        </h2>

        <form onSubmit={submitHandler} className="w-full space-y-4">
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

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trueblue"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-gray-500 hover:text-black focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
