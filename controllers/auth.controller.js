const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateTokens = (user) => {
  const payload = { userId: user._id, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// In-memory store for refresh tokens (for demo purposes)
let refreshTokens = [];

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    const tokens = generateTokens(user);
    refreshTokens.push(tokens.refreshToken);

    res.status(201).json({ userId: user._id, ...tokens });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const tokens = generateTokens(user);
    refreshTokens.push(tokens.refreshToken);

    res.json({ userId: user._id, ...tokens });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ msg: 'Invalid refresh token' });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);

    const newTokens = generateTokens(payload);
    refreshTokens = refreshTokens.filter(t => t !== token);
    refreshTokens.push(newTokens.refreshToken);

    res.json(newTokens);
  } catch (err) {
    res.status(403).json({ msg: 'Token expired or invalid' });
  }
};

exports.logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.json({ msg: 'Logged out successfully' });
};
