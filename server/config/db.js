const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true, 
      sslValidate: true, 
      
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting to the database:', error);
  }
};

module.exports = connectDB;
