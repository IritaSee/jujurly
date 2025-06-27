import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const isAuthenticated = () => false

  const handleCollectFeedbackClick = () => {
    navigate(isAuthenticated() ? '/dashboard' : '/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow">
          Jujurly
        </h1>
        <p className="text-xl text-gray-600">Feedback jujur, biar makin mujur 💬</p>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCollectFeedbackClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition duration-200"
        >
          Mau Kumpulin Feedback
        </button>
        <Link
          to="/ke"
          className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl font-medium shadow-sm transition duration-200"
        >
          Mau Kasih Feedback
        </Link>
      </div>

      {/* Info */}
      <div className="mt-10 text-center text-sm text-gray-500 space-y-2 max-w-md">
        <p>🛠 Platform Honesty as a Service 🇮🇩</p>
        <p>
          Kasih feedback? Harus tau link unik atau username orangnya ya!
        </p>
        <p>
          Contoh:{' '}
          <a
            href="https://jujurly.space/ke/username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            https://jujurly.space/ke/username
          </a>
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Jujurly — Hans Situmeang
      </footer>
    </div>
  )
}

export default LandingPage
