import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const fixSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/matgarco');
    console.log('📦 Connected to MongoDB');

    const email = 'admin@matgarco.com';
    const user = await User.findOne({ email });

    if (user) {
      // The pre-save hook will hash this plain text password once.
      user.password = 'admin123456';
      await user.save();
      console.log('✅ Super Admin password fixed successfully! (admin123456)');
    } else {
      console.log('⚠️ Super Admin not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to fix:', error);
    process.exit(1);
  }
};

fixSuperAdmin();
