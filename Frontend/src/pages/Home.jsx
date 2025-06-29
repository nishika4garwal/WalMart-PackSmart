import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import homepage from '../assets/home page.png'; 
const Home = () => {
  const navigate = useNavigate();

  const handleStartPacking = () => {
    navigate('/scan');
  };
  return (
    <>
      <Navbar />
      <div className="pt-20 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] min-h-screen">
        {/* Hero Section */}
        <div className="bg-trueblue text-white py-16 px-6 text-center shadow-md">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to Walmart Admin Dashboard
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Streamlining packaging while building a sustainable future.
          </p>
          <button
            onClick={handleStartPacking}
            className="bg-sparkyellow text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
          >
            Start Packing
          </button>
        </div>

        {/* Sustainability Section */}
          <img
        src={homepage}
        alt="Walmart Sustainability"
        className="w-full shadow-xl"
        />
      </div>
    </>
  );
};

export default Home;
