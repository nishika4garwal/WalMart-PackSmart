import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScanPage = () => {
  const [items, setItems] = useState([]);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const navigate = useNavigate();

  const fetchItemDetails = async (barcodeId) => {
    return {
      id: barcodeId,
      name: `Item ${barcodeId}`,
      weight: Math.floor(Math.random() * 10 + 1),
      volume: Math.floor(Math.random() * 5 + 1),
    };
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
              setItems((prev) => [...prev, { ...item, quantity }]);
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
    if (scanning) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const handleCalculate = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/box/predict`, { items });
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
          <video
            ref={videoRef}
            className="w-full rounded-md"
            muted
            playsInline
            style={{ backgroundColor: 'black' }}
          ></video>
          <button
            onClick={handleToggleScan}
            className={`mt-6 w-full py-2 rounded-md text-white transition ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-trueblue hover:text-sparkyellow'
              }`}
          >
            {scanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-trueblue mb-4 text-center">Scanned Items</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Weight</th>
                <th className="border border-gray-300 px-4 py-2">Volume</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.weight} kg</td>
                  <td className="border px-4 py-2">{item.volume} L</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No items scanned yet
                  </td>
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
