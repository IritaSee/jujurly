import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type APIResponse = {
  message?: string;
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleFormSubmit = async (): Promise<void> => {
    setError('');
    setMessage('');
    setLoading(true);

    if (!email) {
      setError('Email jangan lupa diisi ya.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format emailnya kayaknya salah deh.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as APIResponse;

      if (res.ok) {
        setMessage(data.message ?? 'Permintaan reset password telah dikirim ke email kamu.');
        setEmail('');
      } else {
        setError(data.message ?? 'Gagal mengirim link reset. Coba lagi ya.');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center px-4 relative">
      {/* Back Button */}
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

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/40">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 .556-.21 1.05-.585 1.415C11.05 12.79 10.556 13 10 13c-.556 0-1.05-.21-1.415-.585C8.21 12.05 8 11.556 8 11c0-.556.21-1.05.585-1.415C9.05 9.21 9.556 9 10 9c.556 0 1.05.21 1.415.585C11.79 9.95 12 10.444 12 11zM20 11a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Lupa Password?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tenang, kami bantu kirimkan link reset ke email kamu.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleFormSubmit();
          }}
          className="space-y-4"
        >
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Kamu
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailkamu@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          Inget passwordnya?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            Balik ke Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
