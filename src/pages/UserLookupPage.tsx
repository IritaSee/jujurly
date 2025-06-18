import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Search, Users, Send } from 'lucide-react'

const UserLookupPage: React.FC = () => {
  const [targetUser, setTargetUser] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    setIsVisible(true);
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.05),transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className={`w-full max-w-lg transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {/* Clean Card */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg rounded-2xl overflow-hidden">
              {/* Header with Icon */}
              <CardHeader className="text-center pb-6 pt-10">
                <div className="mx-auto mb-6 w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Users className="h-7 w-7 text-white" />
                </div>
                
                <CardTitle className="text-2xl font-medium text-gray-800 mb-3">
                  Mau Kasih Feedback ke Siapa Nih?
                </CardTitle>
                
                <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
                  Tulis username atau ID unik orang yang mau kamu kasih feedback.
                </p>
              </CardHeader>
              
              <CardContent className="px-10 pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  
                  {/* Input Field */}
                  <div className="space-y-3">
                    <Label htmlFor="targetUser" className="text-gray-700 font-medium text-sm">
                      Username atau ID Pengguna
                    </Label>
                    <Input
                      type="text"
                      id="targetUser"
                      value={targetUser}
                      onChange={(e) => setTargetUser(e.target.value)}
                      placeholder="cth: iganarendra atau user123abc"
                      disabled={isLoading}
                      autoFocus
                      className="w-full mt-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-base shadow-sm hover:shadow-md"
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200 text-base flex items-center justify-center gap-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Mencari...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        <span>Lanjut Kasih Feedback</span>
                      </>
                    )}
                  </Button>
                </form>
                
                {/* Footer Message */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    💡 <strong className="text-indigo-600">Tips:</strong> Pastikan kamu tau username atau ID yang bener ya, biar feedbacknya nyampe ke orang yang tepat.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
};

export default UserLookupPage;