
const { ethers } = require('ethers');
const config = require('../config');

class FaucetService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize the service with provider and wallet
   */
  init() {
    try {
      // Create provider
      this.provider = new ethers.JsonRpcProvider(config.sepolia.rpcUrl);
      
      // Create wallet
      if (!config.sepolia.privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required');
      }
      
      this.wallet = new ethers.Wallet(config.sepolia.privateKey, this.provider);
      this.isInitialized = true;
      
      console.log(`🔗 Connected to Sepolia network`);
      console.log(`💰 Faucet wallet address: ${this.wallet.address}`);
      
      // Check wallet balance on startup
      this.checkBalance();
      
    } catch (error) {
      console.error('❌ Failed to initialize faucet service:', error.message);
      this.isInitialized = false;
    }
  }

  /**
   * Check and log the current wallet balance
   */
  async checkBalance() {
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      const balanceInEth = ethers.formatEther(balance);
      console.log(`💰 Current faucet balance: ${balanceInEth} ETH`);
      
      if (parseFloat(balanceInEth) < 0.1) {
        console.warn(`⚠️  LOW BALANCE WARNING: Only ${balanceInEth} ETH remaining`);
      }
      
      return balanceInEth;
    } catch (error) {
      console.error('❌ Failed to check balance:', error.message);
      throw error;
    }
  }

  /**
   * Send funds to the specified address
   * @param {string} toAddress - Recipient address
   * @returns {Object} Transaction result
   */
  async sendFunds(toAddress) {
    if (!this.isInitialized) {
      throw new Error('Faucet service not properly initialized');
    }

    try {
      // Check if address is ENS and resolve it
      let resolvedAddress = toAddress;
      if (toAddress.endsWith('.eth')) {
        console.log(`🔍 Resolving ENS name: ${toAddress}`);
        resolvedAddress = await this.provider.resolveName(toAddress);
        if (!resolvedAddress) {
          throw new Error(`Unable to resolve ENS name: ${toAddress}`);
        }
        console.log(`✅ ENS resolved to: ${resolvedAddress}`);
      }

      // Validate the resolved address
      if (!ethers.isAddress(resolvedAddress)) {
        throw new Error(`Invalid Ethereum address: ${resolvedAddress}`);
      }

      // Check faucet balance before sending
      const faucetBalance = await this.provider.getBalance(this.wallet.address);
      const amountToSend = ethers.parseEther(config.faucet.amount);
      
      if (faucetBalance < amountToSend) {
        throw new Error(`Insufficient funds in faucet wallet. Balance: ${ethers.formatEther(faucetBalance)} ETH`);
      }

      // Get current gas price and nonce
      const feeData = await this.provider.getFeeData();
      const nonce = await this.provider.getTransactionCount(this.wallet.address, 'pending');

      // Prepare transaction
      const transaction = {
        to: resolvedAddress,
        value: amountToSend,
        nonce: nonce,
        gasLimit: config.faucet.gasLimit,
        maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('20', 'gwei'),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei'),
        type: 2 // EIP-1559 transaction
      };

      console.log(`📤 Sending ${config.faucet.amount} ETH to ${resolvedAddress}`);
      console.log(`⛽ Gas limit: ${transaction.gasLimit}, Max fee: ${ethers.formatUnits(transaction.maxFeePerGas, 'gwei')} gwei`);

      // Send transaction
      const txResponse = await this.wallet.sendTransaction(transaction);
      console.log(`🚀 Transaction sent: ${txResponse.hash}`);

      // Wait for confirmation
      console.log(`⏳ Waiting for transaction confirmation...`);
      const receipt = await txResponse.wait(1);
      
      if (receipt.status === 1) {
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Log the new balance
        setTimeout(() => this.checkBalance(), 2000);
        
        return {
          txHash: txResponse.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          effectiveGasPrice: receipt.gasPrice?.toString(),
          to: resolvedAddress,
          amount: config.faucet.amount
        };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error) {
      console.error(`❌ Send funds error:`, error.message);
      
      // Re-throw with more context for specific errors
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds in faucet wallet');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network connection error');
      } else if (error.message.includes('gas')) {
        throw new Error('Gas estimation failed - transaction may fail');
      }
      
      throw error;
    }
  }

  /**
   * Get faucet status and statistics
   * @returns {Object} Status information
   */
  async getFaucetStatus() {
    try {
      const balance = await this.checkBalance();
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      return {
        isOnline: this.isInitialized,
        network: {
          name: network.name,
          chainId: network.chainId.toString()
        },
        faucetAddress: this.wallet.address,
        balance: balance,
        currentBlock: blockNumber,
        amount: config.faucet.amount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Unable to get faucet status: ${error.message}`);
    }
  }
}

// Create singleton instance
const faucetService = new FaucetService();

module.exports = faucetService;
