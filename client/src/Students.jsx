import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', status: 'Active', photo: null, document: null
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('loggedIn')) navigate('/');
    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/students');
      setStudents(res.data);
    } catch (err) {
      console.log('Students fetch error:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '', status: 'Active', photo: null, document: null });
    setPreviewPhoto(null);
    setEditingStudent(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, photo: file});
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({...formData, document: file});
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('department', formData.department);
    data.append('status', formData.status);
    if (formData.photo) data.append('photo', formData.photo);
    if (formData.document) data.append('document', formData.document);

    try {
      await axios.post('http://localhost:5000/add-student', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Student added successfully da!');
      setShowAddForm(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      console.log(err);
      alert('Error: ' + err.message + ' | ' + err.response?.data?.error?.sqlMessage);
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
      status: student.status,
      photo: null,
      document: null
    });
    setPreviewPhoto(student.photo? `http://localhost:5000/uploads/${student.photo}` : null);
    setShowEditForm(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('department', formData.department);
    data.append('status', formData.status);
    if (formData.photo) data.append('photo', formData.photo);
    if (formData.document) data.append('document', formData.document);

    try {
      await axios.put(`http://localhost:5000/update-student/${editingStudent.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Student updated successfully da!');
      setShowEditForm(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      console.log(err);
      alert('Error: ' + err.message + ' | ' + err.response?.data?.error?.sqlMessage);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" ah delete pannanuma da? Photo, document lam delete aagirum!`)) {
      try {
        await axios.delete(`http://localhost:5000/delete-student/${id}`);
        alert('Student deleted successfully da!');
        fetchStudents();
      } catch (err) {
        console.log(err);
        alert('Delete error: ' + err.message);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Link to="/students" className="w-full text-left p-3 rounded-lg bg-white/20 font-semibold flex items-center gap-3">
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Students</h1>
          <button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <span>➕</span> Add New Student
          </button>
        </div>

        <input 
          type="text" 
          placeholder="Search by name, email, department..." 
          className="w-full p-3 border-2 border-gray-200 rounded-lg mb-6 focus:border-purple-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Photo</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Department</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        {student.photo? (
                          <img src={`http://localhost:5000/uploads/${student.photo}`} alt="student" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
                        )}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">{student.name}</td>
                      <td className="p-3 text-gray-700">{student.email}</td>
                      <td className="p-3 text-gray-700">{student.department}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === 'Active'? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(student)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id, student.name)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td className="p-3 text-gray-500 text-center" colSpan="6">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Student</h2>
            <form onSubmit={handleAddStudent}>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Student Photo</label>
                <div className="flex items-center gap-4">
                  {previewPhoto? <img src={previewPhoto} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" /> : <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">👤</div>}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Student Name</label>
                <input type="text" required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <input type="email" required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Department</label>
                <select required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option><option value="IT">IT</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Upload Document</label>
                <input type="file" accept=".pdf,.jpg,.png,.jpeg" onChange={handleDocumentChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
                {formData.document && <p className="text-xs text-green-600 mt-1">✓ {formData.document.name}</p>}
              </div>
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
                <select className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option><option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold">Add Student</button>
                <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Student</h2>
            <form onSubmit={handleUpdateStudent}>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Student Photo</label>
                <div className="flex items-center gap-4">
                  {previewPhoto? <img src={previewPhoto} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" /> : <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">👤</div>}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing photo</p>
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Student Name</label>
                <input type="text" required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <input type="email" required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Department</label>
                <select required className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option><option value="IT">IT</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Upload Document</label>
                <input type="file" accept=".pdf,.jpg,.png,.jpeg" onChange={handleDocumentChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
                {formData.document && <p className="text-xs text-green-600 mt-1">✓ {formData.document.name}</p>}
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing document</p>
              </div>
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
                <select className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option><option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-lg font-semibold">Update Student</button>
                <button type="button" onClick={() => { setShowEditForm(false); resetForm(); }} className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;