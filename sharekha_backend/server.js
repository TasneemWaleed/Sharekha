const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/ratings', require('./routes/ratings'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Sharekha API is running...' });
});

// Error handler for 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});