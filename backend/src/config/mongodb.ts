// backend/src/config/mongodb.ts
import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-monitor';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};