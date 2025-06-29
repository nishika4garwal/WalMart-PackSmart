import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScanPage = () => {
  const [items, setItems] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const navigate = useNavigate();

  const saveItemsToStorage = (items) => {
    localStorage.setItem('scannedItems', JSON.stringify(items));
  };

  const fetchItemDetails = async (barcodeId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/items/${barcodeId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert('Item not found in the system.');
        } else {
          alert(`Error: ${error.response.data.message || 'Something went wrong!'}`);
        }
      } else if (error.request) {
        alert('No response from server. Please try again.');
      } else {
        alert('Request error: ' + error.message);
      }
      return null;
    }
  };

  const handleManualAdd = async () => {
    if (!manualId.trim()) {
      alert('Please enter a valid Item ID.');
      return;
    }

    const item = await fetchItemDetails(manualId.trim());
    if (item) {
      const qty = prompt(`Enter quantity for ${item.name}:`, '1');
      const quantity = parseInt(qty);
      if (!isNaN(quantity) && quantity > 0) {
        setItems((prev) => {
          const updated = [...prev, { ...item, quantity }];
          saveItemsToStorage(updated);
          return updated;
        });
        setManualId('');
      } else {
        alert('Invalid quantity. Item not added.');
      }
    }
  };

  const startScanner = async () => {
    if (codeReaderRef.current) return;
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);

    const codeReader = new BrowserMultiFormatReader(hints);
    codeReaderRef.current = codeReader;

    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
    const deviceId = devices[0]?.deviceId;

    if (!deviceId) {
      console.error('No camera found');
      return;
    }

    setScanning(true);

    const controls = await codeReader.decodeFromVideoDevice(
      deviceId,
      videoRef.current,
      async (result, error) => {
        if (result) {
          const item = await fetchItemDetails(result.getText());
          if (item) {
            const qty = prompt(`Enter quantity for ${item.name}:`, '1');
            const quantity = parseInt(qty);
            if (!isNaN(quantity) && quantity > 0) {
              setItems((prev) => {
                const updated = [...prev, { ...item, quantity }];
                saveItemsToStorage(updated);
                return updated;
              });
            } else {
              alert('Invalid quantity. Item not added.');
            }
          }
          await stopScanner();
        }

        if (error && error.name !== 'NotFoundException') {
          console.warn('Scan error:', error);
        }
      },
      {
        videoConstraints: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment',
        },
      }
    );

    controlsRef.current = controls;
  };

  const stopScanner = async () => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      codeReaderRef.current = null;
      setScanning(false);
    } catch (e) {
      console.warn('Error stopping scanner:', e);
    }
  };

  const handleToggleScan = () => {
    scanning ? stopScanner() : startScanner();
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const handleCalculate = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/boxes/predict`, {
        items
      });

      const predictedBox = response.data;

      localStorage.setItem('predictedBox', JSON.stringify(predictedBox));
      saveItemsToStorage(items);
      navigate('/bestbox');
    } catch (error) {
      console.error('Error calculating best box:', error);
      alert('Failed to predict best box.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-[#fefefe] to-[#f1f5ff] px-6 py-10 flex flex-wrap justify-center gap-8 items-start">
        {/* Scanner Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md transition hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-trueblue mb-4 text-center">📷 Scan Barcode</h2>
          <video
            ref={videoRef}
            className="w-full h-60 object-cover rounded-md bg-black"
            muted
            playsInline
          />
          <button
            onClick={handleToggleScan}
            className={`mt-5 w-full py-2 font-semibold rounded-md transition text-white ${scanning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-trueblue hover:bg-blue-800'
              }`}
          >
            {scanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md transition hover:shadow-2xl">
          <h2 className="text-lg font-semibold text-trueblue mb-4 text-center">Manual Entry</h2>
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Item ID:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="e.g. 123456789012"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trueblue"
            />
            <button
              onClick={handleManualAdd}
              className="bg-trueblue text-white px-4 py-2 rounded-md hover:text-sparkyellow transition font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Scanned Items Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl transition hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-trueblue mb-4 text-center">📦 Scanned Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Weight</th>
                  <th className="border px-4 py-2">Volume</th>
                  <th className="border px-4 py-2">Qty</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i} className="text-center">
                      <td className="border px-4 py-2">{item.itemId}</td>
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2">{item.weight} kg</td>
                      <td className="border px-4 py-2">{item.volume} cm³</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No items scanned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-6 w-full bg-trueblue text-white py-2 rounded-md hover:text-sparkyellow font-semibold transition"
          >
            Calculate Best Box
          </button>
        </div>
      </div>
    </>
  );
};

export default ScanPage;
