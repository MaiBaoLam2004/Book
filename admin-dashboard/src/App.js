import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';  // Giả sử bạn có một màn hình Home
import Login from './Login'; // Giả sử bạn có một màn hình Login
import TabWeb from './TabWeb'; // Giả sử bạn có một màn hình TabWeb
import PaymentWeb from './PaymentWeb'; // Giả sử bạn có một màn hình PaymentWeb

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tabweb" element={<TabWeb />} />
        <Route path="/paymentweb" element={<PaymentWeb />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
