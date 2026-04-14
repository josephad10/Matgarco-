import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import User from '../models/User';
import Merchant from '../models/Merchant';

dotenv.config();

const seedDemoAccount = async () => {
  try {
    console.log('🌱 Starting demo account seed...');
    
    // Connect to database
    await connectDatabase();
    
    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@matgarco.com' });
    if (existingUser) {
      console.log('✅ Demo user already exists!');
      
      // Check if merchant exists
      const merchant = await Merchant.findOne({ ownerId: existingUser._id });
      if (merchant) {
        console.log(`✅ Demo merchant exists: ${merchant.subdomain}.matgarco.com`);
      }
      
      process.exit(0);
      return;
    }
    
    // Create demo user
    const demoUser = await User.create({
      email: 'demo@matgarco.com',
      password: 'Demo1234', // Will be hashed by User model pre-save hook
      firstName: 'Demo',
      lastName: 'Account',
      role: 'merchant_owner',
      emailVerified: true,
      isActive: true,
    });
    
    console.log('✅ Demo user created:', demoUser.email);
    
    // Create demo merchant
    const demoMerchant = await Merchant.create({
      storeName: 'Demo Store',
      subdomain: 'demo-store',
      businessName: 'Demo Business',
      description: 'This is a demo store for testing Matgarco platform',
      email: 'demo@matgarco.com',
      ownerId: demoUser._id,
      subscriptionPlan: 'professional',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      currency: 'EGP',
      language: 'ar',
      timezone: 'Africa/Cairo',
      limits: {
        maxProducts: 1000,
        maxStaffUsers: 5,
        aiCreditsPerMonth: 50,
        aiCreditsUsed: 0,
      },
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
      },
      isActive: true,
      onboardingCompleted: true,
    });
    
    console.log('✅ Demo merchant created:', demoMerchant.subdomain + '.matgarco.com');
    
    // Link merchant to user
    demoUser.merchantId = demoMerchant._id;
    await demoUser.save();
    
    console.log('✅ User linked to merchant');
    
    console.log('\n🎉 Demo account setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    demo@matgarco.com');
    console.log('🔑 Password: Demo1234');
    console.log('🏪 Store:    demo-store.matgarco.com');
    console.log('📦 Plan:     Professional (Free for demo)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding demo account:', error);
    process.exit(1);
  }
};

seedDemoAccount();
