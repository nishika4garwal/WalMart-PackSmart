import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScanPage = () => {
  const [items, setItems] = useState([]);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  const fetchItemDetails = async (barcodeId) => {
    try {
      // Replace this with your actual backend call
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/items/${barcodeId}`);
      // return response.data;

      // Mock response for now
      return {
        id: barcodeId,
        name: `Item ${barcodeId}`,
        weight: Math.floor(Math.random() * 10 + 1),
        volume: Math.floor(Math.random() * 5 + 1),
      };
    } catch (error) {
      console.error('Error fetching item:', error);
      return null;
    }
  };

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner('scanner', { fps: 10, qrbox: 250 }, false);
      scanner.render(
        async (decodedText) => {
          setScanning(false); // Stop scanning
          const item = await fetchItemDetails(decodedText);
          if (item) {
            setItems((prev) => [...prev, item]);
          }
          scanner.clear(); // Stop scanner after each scan
        },
        (err) => {
          console.warn('Scan error:', err);
        }
      );
      scannerRef.current = scanner;
    }

    return () => {
      scannerRef.current?.clear();
    };
  }, [scanning]);

  const handleAddItem = () => {
    setScanning(true); // Re-enable scanner
  };

  const handleCalculate = async () => {
    try {
      // Send scanned items to backend for ML prediction
      await axios.post(`${import.meta.env.VITE_BASE_URL}/box/predict`, { items });

      // Then redirect to BestBox page
      navigate('/bestbox');
    } catch (error) {
      console.error('Error sending items to backend:', error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBFB] to-[#EBEDFF] px-6 py-10 flex flex-col lg:flex-row justify-center gap-10 items-start">
        {/* Scanner */}
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold text-trueblue mb-4 text-center">Scan Barcode</h2>
          <div id="scanner" className="w-full" />
          <button
            onClick={handleAddItem}
            className="mt-6 w-full bg-trueblue text-white py-2 rounded-md hover:text-sparkyellow transition"
          >
            Add Item
          </button>
        </div>

        {/* Item Table */}
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-trueblue mb-4 text-center">Scanned Items</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Weight</th>
                <th className="border border-gray-300 px-4 py-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.weight} kg</td>
                  <td className="border px-4 py-2">{item.volume} L</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">No items scanned yet</td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full bg-trueblue text-white py-2 rounded-md hover:text-sparkyellow transition"
          >
            Calculate Best Box
          </button>
        </div>
      </div>
    </>
  );
};

export default ScanPage;
