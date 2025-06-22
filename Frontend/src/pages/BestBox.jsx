import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios';

const BestBox = () => {
  const [box, setBox] = useState(null);
  const navigate = useNavigate();

  const fetchBestBox = async () => {
    try {
      const response = await instance.get(`/boxes/best`);
      setBox(response.data);
      console.log("Fetched box:", response.data);
    } catch (error) {
      console.error('Error fetching best box:', error);
      setBox({ error: 'Failed to load box suggestion' });
    }
  };

  const handleStartOver = async () => {
    if (!box || !box.boxId) return;

    const nextBoxId = box.boxId + 1;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/boxes/${nextBoxId}`);
      setBox(response.data);
      console.log("next box:", response.data);
    } catch (error) {
      console.error('No next box found:', error);
      alert('🚫 No next box available.');
    }
  };

  useEffect(() => {
    fetchBestBox();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>

        <div className="bg-[#DDEEDF] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-trueblue mb-4">Best Box Suggestion</h2>

          {box ? (
            box.error ? (
              <p className="text-red-600 font-semibold">{box.error}</p>
            ) : (
              <>
                <p className="text-lg text-gray-800 mb-2">📦 <strong>Box ID:</strong> {box.boxId}</p>
                <p className="text-lg text-gray-800 mb-2">📐 <strong>Volume:</strong> {box.volume} cm³</p>
                <p className="text-lg text-gray-800 mb-6">⚖️ <strong>Max Weight Support:</strong> {box.maxWeightSupport} kg</p>
              </>
            )
          ) : (
            <p>Loading...</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleStartOver}
              className="bg-trueblue text-white font-semibold px-6 py-2 rounded-md hover:text-sparkyellow transition duration-300"
            >
              Start Over
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
