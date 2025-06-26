// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Permintaan reset password telah dikirim. Silakan cek email kamu.');
        setEmail(''); // Clear the input field
      } else {
        // Even if backend always returns 200 for this endpoint for security,
        // handle potential network errors or unexpected backend responses.
        setError(data.message || 'Gagal mengirim permintaan reset password. Coba lagi ya.');
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Lupa Password?</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Gak apa-apa, kita bantu reset password kamu.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Kamu</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                required
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <Mail className="h-4 w-4" />
                <span>{message}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Inget passwordnya?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Balik ke Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
