import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LocationState {
  userNotFound?: boolean;
}

interface LookupResponse {
  user_identifier?: string;
  message?: string;
}

const UserLookupPage: React.FC = () => {
  const [targetUser, setTargetUser] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.userNotFound) {
      setError('Username atau ID pengguna tidak ditemukan.');
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!targetUser.trim()) {
      setError('Username atau ID pengguna jangan lupa diisi ya.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/user/lookup/${encodeURIComponent(targetUser.trim())}`,
      );

      const rawData: unknown = await response.json();
      const data = rawData as LookupResponse;

      if (response.ok && data.user_identifier) {
        navigate(`/ke/${data.user_identifier}`);
      } else {
        setError(data.message ?? 'Pengguna tidak ditemukan atau terjadi kesalahan.');
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex items-center justify-center px-4 relative">
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
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎯</div>
          <h1 className="text-2xl font-bold text-gray-800">Mau Kasih Feedback ke Siapa?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Masukkan username atau ID pengguna yang ingin kamu kasih feedback.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            void handleSubmit(e); 
          }}
          className="space-y-4"
        >
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <label htmlFor="targetUser" className="block text-sm font-medium text-gray-700 mb-1">
              Username atau ID
            </label>
            <input
              type="text"
              id="targetUser"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="cth: iganarendra"
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow"
          >
            {isLoading ? 'Mencari...' : 'Lanjut Kasih Feedback'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          Pastikan kamu tau username yang bener ya, biar feedbacknya nyampe ke orangnya 🙏
        </p>
      </div>
    </div>
  );
};

export default UserLookupPage;
