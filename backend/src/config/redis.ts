import Redis from 'ioredis';

// Redis client instance
const redisClient = new Redis({
  port: 6379,
  host: '127.0.0.1',
});

// Event listener for a successful connection
redisClient.on('connect', () => {
  console.log('Redis connected successfully!');
});

// Event listener for connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Export a function to initiate the connection
export const connectRedis = () => {
  // This function simply triggers the connection logic defined above
  console.log('Attempting to connect to Redis...');
};

// Export the client instance for use in other files
export { redisClient };
