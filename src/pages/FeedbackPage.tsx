// src/pages/FeedbackPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import FeedbackForm from '../components/FeedbackForm'
import { Card, CardContent } from '@/components/ui/card'

const FeedbackPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setUserExists(false);
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    setChecking(true);
    fetch(`${API_URL}/api/user/lookup/${userId}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('User not found');
      })
      .then(data => {
        if (data && data.user_identifier) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      })
      .catch(() => setUserExists(false))
      .finally(() => setChecking(false));
  }, [userId]);

  useEffect(() => {
    if (userExists === false) {
      navigate('/ke', { state: { userNotFound: true } });
    }
  }, [userExists, navigate]);

  if (!userId) {
    console.warn("No userId found in URL, redirecting to landing page.");
    return <Navigate to="/" replace />;
  }
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Mengecek pengguna...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  if (userExists === false) {
    return null; // Will redirect
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <FeedbackForm recipientUsername={userId} />
    </div>
  )
};

export default FeedbackPage;
