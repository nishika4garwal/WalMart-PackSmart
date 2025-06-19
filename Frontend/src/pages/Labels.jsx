import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Labels = () => {
  const [labelInfo, setLabelInfo] = useState('Loading...');
  const navigate = useNavigate();

  // Function to fetch label-related info from backend
  const fetchLabelInfo = async () => {
    try {
      // This would normally hit your backend
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/labels`);
      // setLabelInfo(response.data.message);

      // Temporary hardcoded mock data
      const mockLabels = [
        'FRAGILE - Handle With Care',
        'KEEP UPRIGHT - Do Not Tilt',
        'TEMPERATURE SENSITIVE - Store Below 25°C',
        'HEAVY ITEM - Use Lifting Equipment'
      ];
      const random = Math.floor(Math.random() * mockLabels.length);
      setLabelInfo(mockLabels[random]);
    } catch (error) {
      console.error('Error fetching label info:', error);
      setLabelInfo('Could not load label info. Please try again.');
    }
  };

  useEffect(() => {
    fetchLabelInfo();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        {/* Decorative background blobs */}
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>

        {/* Label Info Card */}
        <div className="bg-[#DDEEDF] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center relative z-10">
          <h2 className="text-2xl font-bold text-trueblue mb-4">Label To Put</h2>
          <p className="text-lg text-gray-700 mb-6">{labelInfo}</p>

          {/* Button */}
          <button
            onClick={() => navigate('/materials')}
            className="bg-trueblue text-white font-semibold px-6 py-2 rounded-md hover:text-sparkyellow transition duration-300"
          >
            Materials to Use
          </button>
        </div>
      </div>
    </>
  );
};

export default Labels;
