const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// CORS fix - idhu mukkiyam da
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Photo show aaga

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Vaishu@123', // UN PASSWORD AH INGA PODU
  database: 'nms_college'
});

db.connect(err => {
  if (err) {
    console.log('MySQL Error:', err);
    return;
  }
  console.log('MySQL Connected...');
});

// Multer setup - File upload ku
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 1. LOGIN API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM staff WHERE email =? AND password =?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.json({ error: err });
    if (result.length > 0) {
      res.json({ success: true, message: "Login Success" });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  });
});

// 2. DASHBOARD STATS API
app.get('/dashboard-stats', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive,
      COUNT(DISTINCT department) as departments
    FROM students
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result[0]);
  });
});

// 3. GET ALL STUDENTS API
app.get('/students', (req, res) => {
  const sql = "SELECT * FROM students ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

// 4. ADD STUDENT API - IDHU DHAN MUKKIYAM
app.post('/add-student', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), (req, res) => {
  const { name, email, department, status } = req.body;
  const photo = req.files['photo']? req.files['photo'][0].filename : null;
  const document = req.files['document']? req.files['document'][0].filename : null;
  
  const sql = "INSERT INTO students (name, email, department, status, photo, document) VALUES (?,?,?,?,?,?)";
  db.query(sql, [name, email, department, status, photo, document], (err, result) => {
    if (err) {
      console.log('SQL Error:', err);
      return res.status(500).json({ error: err });
    }
    res.json({ success: true, message: 'Student added successfully' });
  });
});
app.put('/update-student/:id', upload.fields([{ name: 'photo' }, { name: 'document' }]), (req, res) => {
  const { id } = req.params;
  const { name, email, department, status } = req.body;
  const photo = req.files['photo']? req.files['photo'][0].filename : null;
  const document = req.files['document']? req.files['document'][0].filename : null;

  let sql = `UPDATE students SET name=?, email=?, department=?, status=?`;
  let params = [name, email, department, status];

  if (photo) {
    sql += `, photo=?`;
    params.push(photo);
  }
  if (document) {
    sql += `, document=?`;
    params.push(document);
  }

  sql += ` WHERE id=?`;
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Student updated successfully' });
  });
});
app.get('/department-stats', (req, res) => {
  const sql = `
    SELECT 
      department,
      COUNT(*) as count,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive
    FROM students 
    GROUP BY department
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});
app.delete('/delete-student/:id', (req, res) => {
  const { id } = req.params;
  
  // First photo/document filename eduthuko file delete panna
  const getSql = `SELECT photo, document FROM students WHERE id =?`;
  db.query(getSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    
    const student = results[0];
    const fs = require('fs');
    
    // Files irundha delete pannu
    if (student.photo) {
      fs.unlink(`./uploads/${student.photo}`, (e) => {});
    }
    if (student.document) {
      fs.unlink(`./uploads/${student.document}`, (e) => {});
    }
    
    // DB la irundhu delete pannu
    const deleteSql = `DELETE FROM students WHERE id =?`;
    db.query(deleteSql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Student deleted successfully' });
    });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});