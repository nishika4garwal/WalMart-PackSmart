import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  // Function to fetch material data from backend
  const fetchMaterials = async () => {
    try {
      // Replace this with actual backend call:
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/materials`);
      // setMaterials(response.data);

      // For now, use mock data
      const mockData = [
        'Corrugated Box',
        'Biodegradable Bubble Wrap',
        'Paper Tape',
        'Recyclable Air Cushion',
        'Compostable Fillers'
      ];
      setMaterials(mockData);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials(['Unable to load materials.']);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        {/* Decorative Background */}
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>

        {/* Material List Card */}
        <div className="bg-[#DDEEDF] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center relative z-10">
          <h2 className="text-2xl font-bold text-trueblue mb-4">Materials to Use</h2>

          {/* Display materials */}
          <ul className="text-gray-700 text-left list-disc list-inside space-y-2 mb-6">
            {materials.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {/* Complete Packaging Button */}
          <button
            onClick={() => navigate('/last')}
            className="bg-sparkyellow text-black font-semibold px-6 py-2 rounded-md hover:bg-trueblue hover:text-white transition duration-300"
          >
            Complete Packaging
          </button>
        </div>
      </div>
    </>
  );
};

export default AllMaterials;
