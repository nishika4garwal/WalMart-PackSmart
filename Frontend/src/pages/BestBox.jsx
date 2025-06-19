import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BestBox = () => {
  const [suggestion, setSuggestion] = useState('Loading...');
  const navigate = useNavigate();

  // Function to fetch the best box suggestion from the backend
  const fetchSuggestion = async () => {
    try {
      // This is the API call to your backend. Replace with actual endpoint.
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/box/suggestion`);
      // setSuggestion(response.data.message);

      // Temporary hardcoded response for development
      const mockResponses = ['Box Type A', 'EcoBox Small', 'Reusable Carton XL', 'Compact Pack Blue'];
      const random = Math.floor(Math.random() * mockResponses.length);
      setSuggestion(mockResponses[random]);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setSuggestion('Could not fetch suggestion. Try again.');
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchSuggestion();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>
        {/* Suggestion Box */}
        <div className="bg-[#DDEEDF] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-trueblue mb-4">Best Box Suggestion</h2>
          <p className="text-lg text-gray-700 mb-6">{suggestion}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={fetchSuggestion}
              className="bg-trueblue text-white font-semibold px-6 py-2 rounded-md hover:text-sparkyellow transition duration-300"
            >
              Suggest Something Else
            </button>

            <button
              onClick={() => navigate('/labels')}
              className="bg-trueblue text-white font-semibold px-6 py-2 rounded-md hover:text-sparkyellow transition duration-300"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BestBox;
