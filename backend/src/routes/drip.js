const express = require('express');
const router = express.Router();
const faucetService = require('../services/faucetService');
const rateLimiter = require('../middlewares/rateLimiter');
const { validateAddress } = require('../utils/validateAddress');

// Apply rate limiting
router.use('/drip', rateLimiter);

/**
 * POST /api/drip
 */
router.post('/drip', async (req, res) => {
  const startTime = Date.now();

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Missing required field', message: 'Address is required' });
    }

    const validationResult = validateAddress(address.trim());
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'Invalid address',
        message: validationResult.error || 'Please provide a valid Ethereum address or ENS name'
      });
    }

    const cleanAddress = validationResult.address;

    console.log(`💧 Drip request from ${req.ip} for address: ${cleanAddress}`);

    const result = await faucetService.sendFunds(cleanAddress);
    const processingTime = Date.now() - startTime;

    console.log(`✅ Funds sent to ${cleanAddress} in ${processingTime}ms`);
    console.log(`📊 Transaction hash: ${result.txHash}`);

    return res.status(200).json({
      success: true,
      message: `Successfully sent 0.05 Sepolia ETH to ${cleanAddress}`,
      txHash: result.txHash,
      amount: '0.05',
      network: 'Sepolia',
      processingTime: `${processingTime}ms`
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Drip failed in ${processingTime}ms:`, error.message);

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

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Unable to process your request. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * GET /api/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await faucetService.getFaucetStatus();
    return res.status(200).json(status);
  } catch (error) {
    console.error('Status check failed:', error.message);
    return res.status(500).json({
      error: 'Unable to get faucet status',
      message: error.message
    });
  }
});

module.exports = router;