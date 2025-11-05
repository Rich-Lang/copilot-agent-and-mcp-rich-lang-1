const express = require('express');
const jwt = require('jsonwebtoken');

function createAuthRouter({ usersFile, readJSON, writeJSON, SECRET_KEY }) {
  const router = express.Router();

  router.post('/register', (req, res) => {
    const { username, password, userType } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    const users = readJSON(usersFile);
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: 'User already exists' });
    }
    // generated-by-copilot: Default to 'member' if userType is not provided
    const finalUserType = userType || 'member';
    users.push({ username, password, userType: finalUserType, favorites: [] });
    writeJSON(usersFile, users);
    res.status(201).json({ message: 'User registered' });
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSON(usersFile);
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    // generated-by-copilot: Include userType in JWT payload and response
    const token = jwt.sign({ username, userType: user.userType }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, userType: user.userType });
  });

  return router;
}

module.exports = createAuthRouter;
