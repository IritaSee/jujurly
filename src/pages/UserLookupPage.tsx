import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserLookupPage.css';

const UserLookupPage: React.FC = () => {
  const [targetUser, setTargetUser] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  React.useEffect(() => {
    if (location.state && location.state.userNotFound) {
      setError('Username atau ID pengguna tidak ditemukan.');
    }
  }, [location.state]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!targetUser.trim()) {
      setError('Username atau ID pengguna jangan lupa diisi ya.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/user/lookup/${targetUser.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.user_identifier) {
          setUserData(data);
          navigate(`/ke/${data.user_identifier}`);
        } else {
          setError("Gagal mendapatkan link feedback untuk pengguna ini.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Pengguna tidak ditemukan atau terjadi kesalahan.");
      }
    } catch (err) {
      console.error("User lookup error:", err);
      setError('Terjadi kesalahan saat menghubungi server. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-lookup-container">
      <div className="user-lookup-box">
        <h1>Mau Kasih Feedback ke Siapa Nih?</h1>
        <p className="subtitle">Tulis username atau ID unik orang yang mau kamu kasih feedback.</p>
        <form onSubmit={handleSubmit} className="user-lookup-form">
          {error && <p className="error-message">{error}</p>}
          {userData && (
            <div className="user-data">
              <h2>User Data:</h2>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="targetUser">Username atau ID Pengguna</label>
            <input
              type="text"
              id="targetUser"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="cth:iganarendra atau user123abc"
              disabled={isLoading}
              autoFocus
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Mencari...' : 'Lanjut Kasih Feedback'}
          </button>
        </form>
        <p className="info-text">
          Pastikan kamu tau username atau ID yang bener ya, biar feedbacknya nyampe ke orang yang tepat.
        </p>
      </div>
    </div>
  );
};

export default UserLookupPage;