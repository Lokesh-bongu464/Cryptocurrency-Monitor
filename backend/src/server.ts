import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

import { connectRedis } from './config/redis';
import { startPriceScheduler } from './utils/scheduler';
import alertRoutes from './routes/alertRoutes';
import { setupWebSocket } from './config/websocket';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', alertRoutes);

// Database and Redis connections
mongoose.connect('mongodb://127.0.0.1:27017/crypto-monitor')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

connectRedis();

// Setup WebSocket and scheduled tasks
setupWebSocket(io);
startPriceScheduler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));