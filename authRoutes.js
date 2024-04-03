// authRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./db');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("in signup");
    console.log(username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(query, [username, hashedPassword], (error, results) => {
      if (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (error, results) => {
      if (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      res.json({ message: 'Login successful' });
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
