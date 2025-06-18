import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  FaLeaf,
  FaRecycle,
  FaGlobeAmericas,
  FaSolarPanel,
  FaWater,
  FaTruck
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const handleStartPacking = () => {
    navigate('/scan');
  };

  const sustainabilityCards = [
    {
      icon: <FaLeaf className="text-green-600 text-4xl" />,
      title: 'Sustainability Mission',
      description: 'Walmart is committed to achieving zero emissions across global operations by 2040.'
    },
    {
      icon: <FaRecycle className="text-yellow-600 text-4xl" />,
      title: 'Waste Reduction',
      description: 'Targeting zero waste in key markets by 2025 through innovative packaging and recycling.'
    },
    {
      icon: <FaGlobeAmericas className="text-blue-500 text-4xl" />,
      title: 'Carbon Footprint',
      description: 'Through supply chain optimization, Walmart avoids over 1 million tons of CO₂ annually.'
    },
    {
      icon: <FaSolarPanel className="text-orange-500 text-4xl" />,
      title: 'Renewable Energy',
      description: 'Walmart aims to power 100% of its operations with renewable energy by 2035.'
    },
    {
      icon: <FaWater className="text-blue-400 text-4xl" />,
      title: 'Water Conservation',
      description: 'Initiatives to reduce water waste across stores and supply chains support clean water access.'
    },
    {
      icon: <FaTruck className="text-trueblue text-4xl" />,
      title: 'Eco-Friendly Logistics',
      description: 'Investing in electric vehicles and route optimization to reduce transport emissions.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-trueblue">
            Welcome to Walmart Admin Panel
          </h2>
          <button
            onClick={handleStartPacking}
            className="bg-trueblue text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-sparkyellow hover:text-black transition duration-300"
          >
            Start Packing
          </button>
        </div>

        {/* Sustainability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sustainabilityCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg flex items-start gap-4 hover:shadow-2xl transition duration-300"
            >
              {card.icon}
              <div>
                <h3 className="text-xl font-semibold text-trueblue mb-1">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
