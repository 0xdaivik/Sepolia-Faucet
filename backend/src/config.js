
require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  
  // Ethereum configuration
  sepolia: {
    rpcUrl: process.env.SEPOLIA_RPC || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    privateKey: process.env.PRIVATE_KEY || '',
    chainId: 11155111,
    name: 'Sepolia'
  },
  
  // Faucet settings
  faucet: {
    amount: '0.05', // ETH amount to send
    gasLimit: 21000,
    maxFeePerGas: '20000000000', // 20 gwei
    maxPriorityFeePerGas: '2000000000' // 2 gwei
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 24 * 60 * 60 * 1000, // 24 hours
    maxRequestsPerWindow: 1,
    skipSuccessfulRequests: false,
    skipFailedRequests: true
  },
  
  // Application settings
  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development'
  }
};

// Validation
if (!config.sepolia.privateKey) {
  console.warn('⚠️  WARNING: PRIVATE_KEY not set in environment variables');
}

if (config.sepolia.rpcUrl.includes('YOUR_INFURA_KEY')) {
  console.warn('⚠️  WARNING: Please update SEPOLIA_RPC with your actual Infura/Alchemy URL');
}

module.exports = config;
