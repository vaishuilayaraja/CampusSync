import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Departments = () => {
  const navigate = useNavigate();
  const [departmentStats, setDepartmentStats] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('loggedIn')) navigate('/');
    fetchDepartmentStats();
  }, [navigate]);

  const fetchDepartmentStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/department-stats');
      setDepartmentStats(res.data);
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
          <Link to="/dashboard" className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/students" className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3">
            <span>👥</span> Students
          </Link>
          <Link to="/departments" className="w-full text-left p-3 rounded-lg bg-white/20 font-semibold flex items-center gap-3">
            <span>🏢</span> Departments
          </Link>
          <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3 mt-8">
            <span>🚪</span> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Departments Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentStats.map((dept) => (
            <div key={dept.department} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{dept.department}</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">{dept.count}</p>
              <p className="text-sm text-gray-500">Students</p>
              <div className="mt-4 flex gap-4 text-sm">
                <span className="text-green-600">Active: {dept.active}</span>
                <span className="text-red-600">Inactive: {dept.inactive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;