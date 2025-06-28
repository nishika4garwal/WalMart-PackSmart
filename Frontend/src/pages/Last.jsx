import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Last = () => {
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();

  // Show success toast when page loads
  useEffect(() => {
    toast.success('Packaging done!', {
      position: 'top-center',
      autoClose: 3000
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const items = JSON.parse(localStorage.getItem('scannedItems')) || [];
      const box = localStorage.getItem('predictedBox');

      if (!items.length || !box) {
        throw new Error('Missing itemIds or boxId in localStorage');
      }
      console.log(box);
      console.log(items);
      const parsedBox = JSON.parse(box);
      const totalCO2Score = (parsedBox.co2Footprint || 0) + items.reduce((sum, item) => sum + (item.estimatedCO2 || 0) * (item.quantity || 1), 0);
      console.log(totalCO2Score);
      const recyclabilityScore = (parsedBox.madeOfRecycledMaterial === "yes" ? 10 : -3) + items.reduce((sum, item) => sum + (item.recyclable ? 15 : -5) * (item.quantity || 1), 0);
      console.log(recyclabilityScore);
      const biodegradabilityScore = (parsedBox.reusable === "yes" ? 10 : -2) + items.reduce((sum, item) => sum + (item.biodegradable ? 10 : -3) * (item.quantity || 1), 0);
      console.log(biodegradabilityScore);
      const plasticPenalty = (parsedBox.materialType === "Plastic" ? -5 : 0) + items.reduce((sum, item) => sum + (item.plasticUsed ? -7 : 0) * (item.quantity || 1), 0);
      console.log(plasticPenalty);

      // Calculate and set final score
      const calculatedScore =
        (100 - totalCO2Score) * 0.5 +
        recyclabilityScore * 0.2 +
        biodegradabilityScore * 0.2 +
        plasticPenalty * 0.1;

      setScore(Math.max(0, Math.min(100, Math.round(calculatedScore))));

      setSummary([
        `Box Type: ${parsedBox.boxId ? "EcoBox " + parsedBox.boxId : "No such data"}`,
        `Label: ${parsedBox.label || "No such data"}`,
        `Materials: ${parsedBox.materialType
          ? parsedBox.materialType + (parsedBox.layerMaterials?.length ? ", " + parsedBox.layerMaterials.join(", ") : "")
          : parsedBox.layerMaterials?.length
            ? parsedBox.layerMaterials.join(", ")
            : "No such data"
        }`
      ]);

    } catch (error) {
      console.error('Error fetching summary:', error);
      setScore(0);
      setSummary(['Failed to load summary.']);
    }
  };


  const getFeedback = () => {
    if (score >= 80) return '🎉 Yay! You contributed to the Earth!';
    if (score >= 50) return '🌱 Good effort, but there\'s room to grow!';
    return '⚠️ Oh no! Try better next time!';
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        {/* Decorative Background */}
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>

        {/* Score and Summary Card */}
        <div className="relative z-10 bg-sparkyellow rounded-2xl shadow-xl max-w-xl w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-trueblue mb-4">Packaging Summary</h2>

          {/* Score */}
          <p className="text-xl text-gray-800 mb-2 font-medium">🌍 Sustainability Score: <span className="font-bold text-trueblue">{score}</span></p>
          <p className="text-md text-gray-700 italic mb-6">{getFeedback()}</p>

          {/* Summary List */}
          <div className="text-left text-gray-700 bg-white rounded-lg p-4 shadow-inner mb-6">
            <h3 className="text-lg font-semibold mb-2 text-trueblue">Items Used:</h3>
            <ul className="list-disc list-inside space-y-1">
              {summary.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/home')}
            className="bg-trueblue text-white font-semibold px-6 py-2 rounded-md hover:text-sparkyellow transition duration-300"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default Last;
