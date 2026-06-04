import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, departments: 0 });

  useEffect(() => {
    if (!localStorage.getItem('loggedIn')) navigate('/');
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/dashboard-stats');
      setStats(res.data);
    } catch (err) { console.log(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-700 to-purple-800 text-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
            <span className="text-3xl">🎓</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">NMS College</h2>
            <p className="text-xs text-blue-200">Staff Portal</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <Link to="/dashboard" className="w-full text-left p-3 rounded-lg bg-white/20 font-semibold flex items-center gap-3">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/students" className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3">
            <span>👥</span> Students
          </Link>
          <Link to="/departments" className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3">
            <span>🏢</span> Departments
          </Link>
          <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3 mt-8">
            <span>🚪</span> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/students" className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white hover:scale-105 transition-transform cursor-pointer">
            <p className="text-blue-100 text-sm font-medium">Total Students</p>
            <p className="text-4xl font-bold mt-2">{stats.total}</p>
            <p className="text-xs mt-3 text-blue-200">Click to view all →</p>
          </Link>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <p className="text-green-100 text-sm font-medium">Active Students</p>
            <p className="text-4xl font-bold mt-2">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
            <p className="text-red-100 text-sm font-medium">Inactive Students</p>
            <p className="text-4xl font-bold mt-2">{stats.inactive}</p>
          </div>
          <Link to="/departments" className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white hover:scale-105 transition-transform cursor-pointer">
            <p className="text-purple-100 text-sm font-medium">Departments</p>
            <p className="text-4xl font-bold mt-2">{stats.departments}</p>
            <p className="text-xs mt-3 text-purple-200">Click to view all →</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;