require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const seedUser = async () => {
  try {
    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: 'admin@company.com' });
    
    if (existingUser) {
      console.log('✅ User already exists!');
      console.log('Email: admin@company.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create new user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@company.com');
    console.log('Password: password123');
    console.log('User ID:', user._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedUser();
