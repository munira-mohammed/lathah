const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB with connection options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

// Handle connection errors separately
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Require models after connecting to avoid issues with initialization order
require('./Recipe');
