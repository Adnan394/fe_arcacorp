import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { fetchPost } from './service/api';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/my');
    }
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        email,
        password,
      };

      const response = await fetchPost('/login', data); // Kirim langsung ke API kamu

      if (response.success) {
        alert('berhasil');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.userdata.username);
        localStorage.setItem('role', response.data.userdata.role);
        router.push('/my'); 
      } else {
        alert('gagal');
      }
    } catch (error) {
      alert('gagal');
    }
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <Head>
        <title>Login</title>
      </Head>
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
        <div className="text-3xl font-bold text-center mb-8 text-gray-700">Login</div>
        <form method="POST" onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email address
            </label>
            <input
              className="appearance-none rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:outline border border-gray-300"
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-gray-300"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


