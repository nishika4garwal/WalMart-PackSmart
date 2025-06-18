import React from 'react';
import Navbar from '../components/Navbar';

const Summary = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Summary Page</h2>
        <p className="mt-2 text-gray-700">Here you can track the key metrics and analytics.</p>
      </div>
    </>
  );
};

export default Summary;
