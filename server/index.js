require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-auth';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(e=>console.error('Mongo error', e));

app.post('/api/register', async (req,res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email & password required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email in use' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash: hash });
  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email });
});

app.post('/api/login', async (req,res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email }});
});

app.get('/api/me', async (req,res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(payload.id).select('-passwordHash');
    res.json({ user });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server on', PORT));
