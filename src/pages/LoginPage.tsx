import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!emailOrUsername || !password) {
      setError('Email/Username dan password tidak boleh kosong.');
      setLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: emailOrUsername, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        let errorDisplayMessage = 'Login gagal. Periksa kembali email/username dan password kamu.';
        try {
          const errorData = (await response.json()) as { message?: string };
          if (errorData?.message) {
            errorDisplayMessage = errorData.message;
          }
        } catch {
          // Jika parsing gagal, gunakan pesan default
        }
        setError(errorDisplayMessage);
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi nanti ya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4 relative">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="absolute top-6 left-6 flex items-center gap-2 text-white bg-sky-500 hover:bg-sky-600 font-medium px-4 py-2 rounded-lg shadow transition duration-200"
      style={{ backgroundColor: '#0ea5e9' }}
    >

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      Kembali
    </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 mt-2">
          Masuk ke <span className="text-blue-600">Jujurly</span>
        </h2>
        <p className="text-sm text-center text-gray-500 mb-2">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
        <p className="text-sm text-center text-gray-500 mb-4">
          Lupa password?{' '}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Reset di sini
          </Link>
        </p>

        {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-1">
              Email atau Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="username atau email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password kamu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-lg shadow-md transition"
            disabled={loading}
          >
            {loading ? 'Lagi diproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
