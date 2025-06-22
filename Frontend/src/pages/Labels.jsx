import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios';
import axios from 'axios';

const Labels = () => {
  const [matchedLabels, setMatchedLabels] = useState([]);
  const navigate = useNavigate();

  const fetchLabelInfo = async () => {
    try {
      const response = await instance.get(`/labels`);
      const labels = response.data; // [{ name, icon, autoApplyTags }]

      const storedItems = JSON.parse(localStorage.getItem('scannedItems')) || [];

      const labelSet = new Map();

      for (const item of storedItems) {
        const combinedText = `${item.name} ${item.tags?.join(' ')}`.toLowerCase();

        for (const label of labels) {
          const tags = (label.autoApplyTags || []).map(tag => tag.toLowerCase());

          const isMatch = tags.some(tag => combinedText.includes(tag));

          if (isMatch && !labelSet.has(label.name)) {
            console.log(label.icon);
            labelSet.set(label.name, label.icon); // Store icon with name
          }
        }
      }

      if (labelSet.size > 0) {
        const matched = Array.from(labelSet.entries()).map(([name, icon]) => ({ name, icon }));
        setMatchedLabels(matched);
      } else {
        setMatchedLabels([]);
      }

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
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] flex flex-col items-center justify-center px-4">
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 left-[-100px]"></div>
        <div className="absolute w-96 h-96 bg-trueblue opacity-30 rounded-full blur-3xl top-10 right-[-100px]"></div>

        <div className="bg-[#DDEEDF] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center relative z-10">
          <h2 className="text-2xl font-bold text-trueblue mb-4">Label(s) to Put</h2>

          {matchedLabels.length > 0 ? (
            <ul className="space-y-4">
              {matchedLabels.map((label, index) => (
                <li key={index} className="flex items-center gap-3 justify-start text-left">
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
            className="mt-6 bg-trueblue text-white font-semibold px-6 py-2 rounded-md hover:text-sparkyellow transition duration-300"
          >
            Materials to Use
          </button>
        </div>
      </div>
    </>
  );
};

export default Labels;
