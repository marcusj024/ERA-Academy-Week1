const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000; 

app.use(express.json());
app.use(cors());

// Root route-confirms the server is running

app.get('/', (req, res) => {
    res.send('Backend is running with MYSQL');
});

// GET /students-return all students from MYSQL 

app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error getting students:', error);
            return res.status(500).json({ error: 'Failed to get students'});
        }
        res.json(results);
    });
});

// POST /students - this is going to revieve new students data and inserts into mysql
app.post('/students', (req, res) => {
    const { first_name, last_name, grade_level } = req.body;
    if (!first_name || !last_name || !grade_level) {
        return res.status(400).json({ error: 'first_name, last_name, grade_level are required' });
    }
    const sql = 'INSERT INTO students (first_name, last_name, grade_level) VALUES (?, ?, ?)';
    db.query(sql, [first_name, last_name, grade_level], (error, results) => {
        if (error) {
            console.error('Error adding student:', error);
            return res.status(500).json({ error: 'Failed to add student'});
        }
        res.status(201).json({ 
            message: 'Student added successfully',
            studentId: results.insertId
        });
    });
});

// Get /classes - return all classes from MYSQL

app.get('/classes', (req, res) => {
    const sql = 'SELECT * FROM classes';
    db.query(sql, (error, results) => {
        if (error) {
            console.error ('error getting classes:', error);
            return res.status(500).json({ error: 'Failed to get classes'});
        }
        res.json(results);
    });
});

// GET /enrollments - returns joined data (students_name+class_name)

app.get('/enrollments', (req, res) => {
    const sql = 'SELECT students.first_name, students.last_name, classes.class_name, classes.teacher_name FROM enrollments JOIN students ON enrollments.student_id = students.id JOIN classes ON enrollments.class_id = classes.id';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error getting enrollments:', error);
            return res.status(500).json({ error: 'Failed to get enrollments'});
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});