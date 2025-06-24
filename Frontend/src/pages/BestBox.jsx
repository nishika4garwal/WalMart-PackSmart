import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import boxImg from '../assets/boximg.png';

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
    } catch {
      alert("🚫 No next box available.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col lg:flex-row overflow-hidden">

          {/* Visual Section */}
          <div className="bg-yellow-400 lg:w-1/2 h-64 lg:h-auto relative">
            <img
              src={boxImg}
              alt="Package illustration"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>


          {/* Info & Actions */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
              {isFallback ? '🔄 Fallback Box' : '✅ Best Box Found'}
            </h2>

            {box ? (
              box.error ? (
                <p className="text-red-600 text-center font-semibold">{box.error}</p>
              ) : (
                <div className="space-y-3 text-gray-800 text-center mb-4">
                  <p><span className="font-semibold text-yellow-500">📦 ID:</span> {box.boxId}</p>
                  <p><span className="font-semibold text-yellow-500">📐 Size:</span> {box.length}×{box.width}×{box.height} cm</p>
                  <p><span className="font-semibold text-yellow-500">🧮 Volume:</span> {box.volume} cm³</p>
                  <p><span className="font-semibold text-yellow-500">⚖️ Max Weight:</span> {box.maxWeightSupport} kg</p>
                </div>
              )
            ) : (
              <p className="text-center text-gray-500">Loading...</p>
            )}

            {isFallback && (
              <div className="bg-yellow-100 text-yellow-800 text-sm text-center rounded-md px-4 py-2 font-medium mb-4">
                Displaying next available box.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={handleStartOver}
                disabled={isFallback}
                className={`px-6 py-2 rounded-md font-semibold transition ${isFallback
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-700 text-white hover:text-yellow-400'
                  }`}
              >
                Start Over
              </button>
              <button
                onClick={() => navigate('/labels')}
                className="px-6 py-2 bg-blue-700 text-white rounded-md font-semibold hover:text-yellow-400 transition"
              >
                Proceed
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BestBox;
