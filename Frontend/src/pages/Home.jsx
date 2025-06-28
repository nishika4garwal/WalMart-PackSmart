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
      description:
        'Walmart is committed to achieving zero emissions across global operations by 2040.'
    },
    {
      icon: <FaRecycle className="text-yellow-500 text-4xl" />,
      title: 'Waste Reduction',
      description:
        'Targeting zero waste in key markets by 2025 through innovative packaging and recycling.'
    },
    {
      icon: <FaGlobeAmericas className="text-blue-500 text-4xl" />,
      title: 'Carbon Footprint',
      description:
        'Through supply chain optimization, Walmart avoids over 1 million tons of CO₂ annually.'
    },
    {
      icon: <FaSolarPanel className="text-orange-500 text-4xl" />,
      title: 'Renewable Energy',
      description:
        'Walmart aims to power 100% of its operations with renewable energy by 2035.'
    },
    {
      icon: <FaWater className="text-sky-400 text-4xl" />,
      title: 'Water Conservation',
      description:
        'Reducing water waste across stores and supply chains to support clean water access.'
    },
    {
      icon: <FaTruck className="text-trueblue text-4xl" />,
      title: 'Eco-Friendly Logistics',
      description:
        'Investing in electric vehicles and route optimization to reduce transport emissions.'
    }
  ];

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
        <section className="py-14 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-trueblue mb-10">
            Walmart’s Sustainability Commitments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sustainabilityCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300 flex items-start gap-5"
              >
                <div className="shrink-0">{card.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-trueblue mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
