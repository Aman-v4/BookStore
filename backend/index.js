const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const checkJwt = require('./auth');
const userDataRoutes = require('./api/userRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection error:', err);
    process.exit(1); 
  }
};

connectMongoDB();

app.use('/api/userdata', checkJwt, userDataRoutes);

app.get('/', (req, res) => {
  res.send(' Bookstore Backend Running!');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
