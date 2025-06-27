// src/components/FeedbackForm.tsx
import { useState, useEffect } from 'react';
import '../App.css';

interface FeedbackFormProps {
  userId: string;
}

interface FeedbackResponse {
  message?: string;
}

function FeedbackForm({ userId }: FeedbackFormProps) {
  const [step, setStep] = useState(1);
  const [anonIdentifier, setAnonIdentifier] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackContext, setFeedbackContext] = useState('');
  const [emailOptIn, setEmailOptIn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [targetUserName, setTargetUserName] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setTargetUserName(userId);
    } else {
      setTargetUserName(null);
    }
  }, [userId]);

  const nextStep = () => setStep((prev) => prev + 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!userId) {
      setMessage(
        'Error: User ID tidak ditemukan. Pastikan URLnya benar, contoh: jujurly.space/ke/namauser'
      );
      setIsLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    try {
      const response = await fetch(`${API_URL}/api/feedback/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anon_identifier: anonIdentifier,
          feedback_text: feedbackText,
          context_text: feedbackContext,
          anon_email: emailOptIn,
        }),
      });

      const result: FeedbackResponse = await response.json();

      if (response.ok) {
        setMessage(result.message ?? 'Makasih ya feedbacknya! Udah kesimpen nih.');
        setStep(1);
        setAnonIdentifier('');
        setFeedbackText('');
        setFeedbackContext('');
        setEmailOptIn('');
      } else {
        setMessage(result.message ?? 'Gagal mengirim feedback. Coba lagi ya.');
      }
    } catch {
      setMessage('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <main>
        <section className="feedback-form-container">
          <h2>Error</h2>
          <p>Waduh, kayaknya ada yang salah sama linknya atau user ID tidak ditemukan.</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <header>
        <h1>Jujurly</h1>
      </header>
      <main>
        <section className="feedback-form-container">
          <h2>Kasih Feedback Anonim Dong {targetUserName ? `buat ${targetUserName}` : ''}</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(e);
            }}
          >
            {step === 1 && (
              <div>
                <label htmlFor="anonIdentifier">Kenal doi darimana? atau siapa nih?</label>
                <small className="label-subtitle">
                  lo boleh kasih tau nama, atau stay anon, tapi kabarin elu kenal dia dimana. Biar apa?
                  Biar AI kita bisa paham, terus dia kita kasih paham LOL
                </small>
                <input
                  type="text"
                  id="anonIdentifier"
                  placeholder="cth: temen sekelas, rekan kerja proyek X"
                  value={anonIdentifier}
                  onChange={(e) => setAnonIdentifier(e.target.value)}
                  required
                />
                <button type="button" onClick={nextStep}>
                  Lanjut
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <label htmlFor="feedbackText">yang pengen lo sampein</label>
                <small className="label-subtitle">
                  santai sih, doi ga bisa liat langsung, tunjukkin aja semua yang lo rasain ke dia, mengumpat
                  bila perlu
                </small>
                <textarea
                  id="feedbackText"
                  rows={5}
                  placeholder="'Gue suka cara lo presentasi' atau 'parah banget, kerjaan kacau babiii'"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                ></textarea>
                <button type="button" onClick={nextStep}>
                  Lanjut
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <label htmlFor="feedbackContext">
                  Konteks feedbacknya apa nih? (opsional, karena kita pake AI, biar makin kena nih ke doi)
                </label>
                <input
                  type="text"
                  id="feedbackContext"
                  placeholder="cth: pas proyek X, abis presentasi"
                  value={feedbackContext}
                  onChange={(e) => setFeedbackContext(e.target.value)}
                />
                <button type="button" onClick={nextStep}>
                  Lanjut
                </button>
              </div>
            )}

            {step === 4 && (
              <div>
                <label htmlFor="emailOptIn">Email lo (opsional):</label>
                <small className="label-subtitle">
                  doi ga bisa liat email lo, ini buat persiapan future feature: kita bisa email ke lo buat
                  ngasih tau pas feedback lo dibaca sama orangnya
                </small>
                <input
                  type="email"
                  id="emailOptIn"
                  placeholder="email.lo@example.com"
                  value={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Mengirim...' : 'Kirim Feedback'}
                </button>
              </div>
            )}
          </form>
          {message && <p className="form-message">{message}</p>}
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Jujurly... maap frontend masi jele</p>
      </footer>
    </>
  );
}

export default FeedbackForm;
