// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Summary from './pages/Summary';
import Login from './pages/Login';
import ScanPage from './pages/ScanPage';
import BestBox from './pages/BestBox';
import Labels from './pages/Labels';
import AllMaterials from './pages/AllMaterials';
import Last from './pages/Last';
import Logout from './pages/Logout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/login" element={<Login />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/bestbox" element={<BestBox />} />
      <Route path="/labels" element={<Labels />} />
      <Route path="/materials" element={<AllMaterials />} />
      <Route path="/last" element={<Last />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;
