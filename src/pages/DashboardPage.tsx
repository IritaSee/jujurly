import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface FeedbackItem {
  id: number;
  timestamp: string;
  sender: string;
  context: string;
  sentiment: string;
  summary: string;
  constructiveCriticism: string;
}

const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const getSentimentClass = (sentimentString: string): string => {
  const lowerSentiment = sentimentString.toLowerCase();
  if (lowerSentiment.includes('positif')) return 'sentiment-positif';
  if (lowerSentiment.includes('negatif')) return 'sentiment-negatif';
  return 'sentiment-netral';
};

const fetchFeedbacksForUser = async (user: string): Promise<FeedbackItem[]> => {
  // Removed console.log to avoid no-console warning
  const response = await fetch(`${API_URL}/api/users/${user}/feedbacks`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch feedbacks and parse error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as FeedbackItem[];
  return data;
};

const DashboardPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  useEffect(() => {
    const loadFeedbacks = async () => {
      setIsLoading(true);
      setError(null);

      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        setError('Username tidak ditemukan. Silakan login kembali.');
        setIsLoading(false);
        return;
      }

      // Try parse and validate username
      let userData: unknown;
      try {
        userData = JSON.parse(storedUserData);
      } catch {
        setError('Data pengguna tidak valid. Silakan login kembali.');
        setIsLoading(false);
        return;
      }

      if (
        typeof userData === 'object' &&
        userData !== null &&
        'username' in userData &&
        typeof (userData as Record<string, unknown>).username === 'string'
      ) {
        const username = (userData as { username: string }).username;
        try {
          const fetchedFeedbacks = await fetchFeedbacksForUser(username);
          setFeedbacks(fetchedFeedbacks);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Duh, gagal ngambil feedback nih. Coba lagi nanti ya.';
          setError(message);
        }
      } else {
        setError('Username tidak ditemukan. Silakan login kembali.');
      }

      setIsLoading(false);
    };

    if (true /* replace with your real auth check */) {
      void loadFeedbacks(); // eslint-disable-line @typescript-eslint/no-floating-promises
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Safe get username for render
  let username = '';
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    try {
      const parsed = JSON.parse(storedUserData);
      if (typeof parsed === 'object' && parsed !== null && 'username' in parsed && typeof parsed.username === 'string') {
        username = parsed.username;
      }
    } catch {
      // fallback username empty
    }
  }

  const feedbackLink = `https://jujur.ly/ke/${username}`;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Punya {username || 'User'}</h1>
        <p>
          Link spesial buat kamu bagiin:{' '}
          <a href={feedbackLink} target="_blank" rel="noopener noreferrer">
            {feedbackLink}
          </a>
        </p>
        <button onClick={handleLogout} className="logout-button" type="button">
          Logout
        </button>
      </header>
      <main className="dashboard-main">
        <h2>Ini Dia Feedback Buat Kamu:</h2>
        {isLoading && <p>Lagi ngambil feedback, sabar ya...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && feedbacks.length === 0 && <p>Belum ada feedback nih. Coba sebarin link kamu gih!</p>}
        {!isLoading && !error && feedbacks.length > 0 && (
          <div className="feedback-list">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="feedback-item">
                <h3>Feedback #{fb.id}</h3>
                <p>
                  <strong>Pengirim:</strong> {fb.sender || 'Anonim'}
                </p>
                <p>
                  <strong>Waktu:</strong> {formatTimestamp(fb.timestamp)}
                </p>
                {fb.context && fb.context !== '-' && (
                  <p>
                    <strong>Konteks:</strong> {fb.context}
                  </p>
                )}
                <p>
                  <strong>Sentimen:</strong>{' '}
                  <span className={`sentiment ${getSentimentClass(fb.sentiment)}`}>{fb.sentiment}</span>
                </p>
                <div className="feedback-content">
                  <h4>Ringkasan (dari LLM):</h4>
                  <p>{fb.summary}</p>
                  <h4>Saran Konstruktif (dari LLM):</h4>
                  <p>{fb.constructiveCriticism}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Jujurly</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
