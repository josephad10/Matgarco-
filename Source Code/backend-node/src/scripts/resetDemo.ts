import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import User from '../models/User';
import Merchant from '../models/Merchant';

dotenv.config();

const resetDemoAccount = async () => {
  try {
    console.log('🗑️  Resetting demo account...');
    
    // Connect to database
    await connectDatabase();
    
    // Delete existing demo user and merchant
    const existingUser = await User.findOne({ email: 'demo@matgarco.com' });
    if (existingUser) {
      await Merchant.deleteOne({ ownerId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('✅ Old demo account deleted');
    }
    
    await mongoose.connection.close();
    console.log('✅ Reset complete! Now run: npm run seed:demo');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error resetting demo account:', error);
    process.exit(1);
  }
};

resetDemoAccount();
