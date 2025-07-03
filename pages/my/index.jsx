import Navbar from "../components/Navbar"
import React, { useState, useEffect } from 'react';
export default function My() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);


  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="container text-gray-700 flex flex-col items-center justify-center min-h-screen">
        <h1>Selamat Datang, {username}</h1>
      </div>
    </div>
  );
}
