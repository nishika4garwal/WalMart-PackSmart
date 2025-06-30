import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bg from '../assets/bg page last.png';

const Last = () => {
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false); // 🔐 to prevent duplicate API calls

  useEffect(() => {
    toast.success('Packaging done!', {
      position: 'top-center',
      autoClose: 3000,
    });

    // only fetch once
    if (!hasFetchedRef.current) {
      fetchData();
      hasFetchedRef.current = true;
    }
  }, []);

  const fetchData = async () => {
    try {
      const items = JSON.parse(localStorage.getItem('scannedItems')) || [];
      const box = localStorage.getItem('predictedBox');
      const employeeId = localStorage.getItem('eid');

      if (!items.length || !box || !employeeId) {
        throw new Error('Missing itemIds or boxId or employeeId in localStorage');
      }

      const parsedBox = JSON.parse(box);

      // Sustainability calculations
      const totalCO2Score =
        (parsedBox.co2Footprint || 0) +
        items.reduce((sum, item) => sum + (item.estimatedCO2 || 0) * (item.quantity || 1), 0);

      const recyclabilityScore =
        (parsedBox.madeOfRecycledMaterial === 'yes' ? 10 : -3) +
        items.reduce((sum, item) => sum + (item.recyclable ? 15 : -5) * (item.quantity || 1), 0);

      const biodegradabilityScore =
        (parsedBox.reusable === 'yes' ? 10 : -2) +
        items.reduce((sum, item) => sum + (item.biodegradable ? 10 : -3) * (item.quantity || 1), 0);

      const plasticPenalty =
        (parsedBox.materialType === 'Plastic' ? -5 : 0) +
        items.reduce((sum, item) => sum + (item.plasticUsed ? -7 : 0) * (item.quantity || 1), 0);

      const calculatedScore =
        (100 - totalCO2Score) * 0.5 +
        recyclabilityScore * 0.2 +
        biodegradabilityScore * 0.2 +
        plasticPenalty * 0.1;

      const finalScore = Math.max(0, Math.min(100, Math.round(calculatedScore)));
      setScore(finalScore);

      // Summary
      setSummary([
        parsedBox.boxId ? `Box Type: EcoBox ${parsedBox.boxId}` : 'Box Type: No such data',
      ]);

      // Save order to backend
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/storeOrder`, {
        items,
        box: parsedBox,
        employeeId
      });

      console.log('Order saved:', res.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setScore(0);
      setSummary(['Failed to load summary.']);
    }
  };

  const getFeedback = () => {
    if (score >= 70) return 'Excellent! You contributed to the Earth!';
    if (score >= 50) return 'Good effort, but there\'s room to grow.';
    return 'Try better next time.';
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="relative z-10 bg-sparkyellow rounded-2xl shadow-xl max-w-xl w-full p-8 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-trueblue mb-4">Packaging Summary</h2>

          <p className="text-lg text-gray-800 mb-1">
            <span className="font-medium">Sustainability Score:</span>{' '}
            <span className="text-2xl text-trueblue font-bold">{score}</span>
          </p>

          <p className="text-md text-gray-700 italic mb-6">{getFeedback()}</p>

          <div className="text-left text-gray-700 bg-white rounded-lg p-5 shadow-inner space-y-2 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-trueblue">Summary:</h3>

            <p className="font-medium">{summary[0]}</p>

            {summary.slice(1).length > 0 && (
              <ul className="list-disc list-inside">
                {summary.slice(1).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

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
