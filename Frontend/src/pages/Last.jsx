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

  // Simulate backend call
  const fetchData = async () => {
    try {
      // Replace with actual API:
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/summary`);
      // setScore(response.data.score);
      // setSummary(response.data.summary);

      // Mock data
      setScore(85); // mock score
      setSummary([
        'Box Type: EcoBox Small',
        'Label: Fragile - Handle With Care',
        'Materials: Corrugated Box, Paper Tape, Biodegradable Wrap'
      ]);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setScore(0);
      setSummary(['Failed to load summary.']);
    }
  };

  // Generate feedback based on score
  const getFeedback = () => {
    if (score >= 100) return '🎉 Yay! You contributed to the Earth!';
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
            onClick={() => navigate('/')}
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
