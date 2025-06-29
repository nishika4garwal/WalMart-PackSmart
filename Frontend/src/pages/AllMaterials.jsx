import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/bg page.png';

const AllMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  const fetchMaterialsFromLocalStorage = () => {
    try {
      const itemsJSON = localStorage.getItem('scannedItems');
      if (!itemsJSON) {
        setMaterials(['No items found in storage.']);
        return;
      }

      const items = JSON.parse(itemsJSON);
      const allMaterials = items.flatMap(item => item.layerMaterials || []);
      const uniqueMaterials = [...new Set(allMaterials)];
      setMaterials(uniqueMaterials);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setMaterials(['Error loading materials.']);
    }
  };

  useEffect(() => {
    fetchMaterialsFromLocalStorage();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
        style={{ backgroundImage: `url(${bg})` }}
      >

        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">

          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Materials to Use</h2>

          {materials.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {materials.map((material, index) => (
                <span
                  key={index}
                  className="bg-yellow-400 text-black font-medium px-4 py-2 shadow hover:shadow-md transition"
                >
                  {material}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-6">No materials found.</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/last')}
              className="px-6 py-2 bg-blue-700 text-white rounded-md font-semibold hover:text-yellow-400 transition"
            >
              Complete Packaging
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllMaterials;
