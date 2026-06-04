import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import nmsLogo from './assets/nms-logo.png'; // Idhu mukkiyam

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('loggedIn', 'true');
        navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Server ah connect panna mudiyala da. Server oodudha?');
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-white/20">
        <div className="text-center mb-8">
          {/* CAP AH THOOKITEN DA - IPO LOGO */}
          <img 
            src={nmsLogo} 
            alt="NMS College Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NMS Staff Portal
          </h1>
          <p className="text-gray-500 text-sm mt-2">Welcome back! Please login</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Username</label>
            <input
              type="text"
              placeholder="Enter username or email"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-5">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;