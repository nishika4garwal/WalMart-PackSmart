import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BestBox = () => {
  const [box, setBox] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBox = localStorage.getItem('predictedBox');
    if (storedBox) {
      setBox(JSON.parse(storedBox));
    } else {
      alert("❌ No predicted box found. Please scan items again.");
      navigate("/scan");
    }
  }, [navigate]);

  const handleStartOver = async () => {
    if (!box || typeof box.boxId !== "number") {
      alert("❌ Invalid box ID. Cannot fetch next box.");
      return;
    }

    const nextBoxId = box.boxId + 1;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/boxes/${nextBoxId}`);
      setBox(response.data);
      setIsFallback(true);
    } catch (error) {
      console.error("🚫 No next box found:", error);
      alert("🚫 No next box available.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>

        <div className="bg-[#DDEEDF] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-trueblue mb-4">
            {isFallback ? 'Fallback Box Suggestion' : 'Best Box Suggestion'}
          </h2>

          {box ? (
            box.error ? (
              <p className="text-red-600 font-semibold">{box.error}</p>
            ) : (
              <>
                <p className="text-lg text-gray-800 mb-2">📦 <strong>Box ID:</strong> {box.boxId}</p>
                <p className="text-lg text-gray-800 mb-2">📐 <strong>Dimensions:</strong> {box.length} x {box.width} x {box.height} cm</p>
                <p className="text-lg text-gray-800 mb-2">🧮 <strong>Volume:</strong> {box.volume} cm³</p>
                <p className="text-lg text-gray-800 mb-2">⚖️ <strong>Max Weight Support:</strong> {box.maxWeightSupport} kg</p>
              </>
            )
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              onClick={handleStartOver}
              disabled={isFallback}
              className={`bg-trueblue text-white font-semibold px-6 py-2 rounded-md transition duration-300 ${
                isFallback ? 'opacity-50 cursor-not-allowed' : 'hover:text-sparkyellow'
              }`}
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
