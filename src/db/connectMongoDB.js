import mongoose from 'mongoose';
import dns from 'dns';

export async function connectMongoDB() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    }

    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}
