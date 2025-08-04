const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./Models/userModel')
dotenv.config(); 

const MONGO_URI = process.env.MONGODB_CONNECTION;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);

      const adminUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        image: 'default.png',
      });

      await adminUser.save();
      console.log('✅ Admin user created: admin@example.com / 123456');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedAdmin();
