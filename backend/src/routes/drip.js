import Cors from 'cors';

// Init middleware
const cors = Cors({
  origin: '*', // Or specify: ['https://sepolia-faucet-lilac.vercel.app']
  methods: ['POST', 'GET', 'OPTIONS'],
});

const express = require('express');
const router = express.Router();
const faucetService = require('../services/faucetService');
const rateLimiter = require('../middlewares/rateLimiter');
const { validateAddress } = require('../utils/validateAddress');

// Apply rate limiting middleware
router.use('/drip', rateLimiter);

/**
 * POST /api/drip
 * Send Sepolia ETH to the specified address
 */
router.post('/drip', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { address } = req.body;
    
    // Input validation
    if (!address) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'Address is required'
      });
    }

    // Validate Ethereum address format
    const validationResult = validateAddress(address.trim());
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'Invalid address',
        message: validationResult.error || 'Please provide a valid Ethereum address or ENS name'
      });
    }

    const cleanAddress = validationResult.address;
    
    // Log the request
    console.log(`💧 Drip request from ${req.ip} for address: ${cleanAddress}`);
    
    // Send the funds
    const result = await faucetService.sendFunds(cleanAddress);
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Successfully sent funds to ${cleanAddress} in ${processingTime}ms`);
    console.log(`📊 Transaction hash: ${result.txHash}`);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: `Successfully sent 0.05 Sepolia ETH to ${cleanAddress}`,
      txHash: result.txHash,
      amount: '0.05',
      network: 'Sepolia',
      processingTime: `${processingTime}ms`
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Drip request failed in ${processingTime}ms:`, error.message);
    
    // Handle specific error types
    if (error.message.includes('insufficient funds')) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Faucet wallet has insufficient funds. Please try again later.'
      });
    }
    
    if (error.message.includes('network')) {
      return res.status(503).json({
        error: 'Network error',
        message: 'Unable to connect to Sepolia network. Please try again later.'
      });
    }
    
    if (error.message.includes('gas')) {
      return res.status(503).json({
        error: 'Transaction failed',
        message: 'Transaction failed due to gas estimation error. Please try again.'
      });
    }
    
    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      message: 'Unable to process your request. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * GET /api/status
 * Get faucet status and statistics
 */
router.get('/status', async (req, res) => {
  try {
    const status = await faucetService.getFaucetStatus();
    res.status(200).json(status);
  } catch (error) {
    console.error('Status check failed:', error.message);
    res.status(500).json({
      error: 'Unable to get faucet status',
      message: error.message
    });
  }
});

module.exports = router;
