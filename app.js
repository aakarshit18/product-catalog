const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const rateLimiter = require('./middlewares/rateLimiter.middleware');

const app = express();
dotenv.config();

// Serve static files (like images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable body parsing for all formats:
app.use(express.json()); // For JSON (application/json)
app.use(express.urlencoded({ extended: true })); // For x-www-form-urlencoded (HTML form)

// Routes
app.use(rateLimiter); // Global rate limit for all routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorites', favoriteRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('DB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
