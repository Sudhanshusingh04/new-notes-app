import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Verify from './pages/verify';
import Verifyemail from './pages/Verifyemail';


function App() {
  return (
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={< Verifyemail/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App