import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios';
import bg from '../assets/bg page.png';

const Labels = () => {
  const [matchedLabels, setMatchedLabels] = useState([]);
  const navigate = useNavigate();

  const fetchLabelInfo = async () => {
    try {
      const response = await instance.get(`/labels`);
      const labels = response.data;
      const storedItems = JSON.parse(localStorage.getItem('scannedItems')) || [];

      const labelSet = new Map();

      for (const item of storedItems) {
        const combinedText = `${item.name} ${item.tags?.join(' ')}`.toLowerCase();
        for (const label of labels) {
          const tags = (label.autoApplyTags || []).map(tag => tag.toLowerCase());
          if (tags.some(tag => combinedText.includes(tag)) && !labelSet.has(label.name)) {
            labelSet.set(label.name, label.icon);
          }
        }
      }

      const matched = Array.from(labelSet.entries()).map(([name, icon]) => ({ name, icon }));
      setMatchedLabels(matched);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  useEffect(() => {
    fetchLabelInfo();
  }, []);

  return (
    <>
      <Navbar />
      <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
      >

        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">🏷️ Label(s) to Put</h2>

          {matchedLabels.length > 0 ? (
            <ul className="space-y-4 text-left max-w-md mx-auto">
              {matchedLabels.map((label, index) => (
                <li key={index} className="flex items-center gap-3">
                  <img
                    src={`${import.meta.env.VITE_ASSET_URL}${label.icon}`}
                    alt="icon"
                    className="w-6 h-6"
                  />
                  <span className="text-gray-800 font-medium">{label.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No specific labels matched. Use general safety labels.</p>
          )}

          <button
            onClick={() => navigate('/materials')}
            className="mt-6 bg-blue-700 text-white font-semibold px-6 py-2 rounded-md hover:text-yellow-400 transition duration-300"
          >
            Materials to Use
          </button>
        </div>
      </div>
    </>
  );
};

export default Labels;
