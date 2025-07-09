
const { ethers } = require('ethers');

/**
 * Validate Ethereum address or ENS name
 * @param {string} address - The address or ENS name to validate
 * @returns {Object} Validation result
 */
function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return {
      isValid: false,
      error: 'Address must be a non-empty string'
    };
  }

  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length === 0) {
    return {
      isValid: false,
      error: 'Address cannot be empty'
    };
  }

  // Check for Ethereum address format (0x followed by 40 hex characters)
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (ethAddressRegex.test(trimmedAddress)) {
    // Additional validation using ethers.js
    if (ethers.isAddress(trimmedAddress)) {
      return {
        isValid: true,
        address: ethers.getAddress(trimmedAddress), // Returns checksum address
        type: 'address'
      };
    } else {
      return {
        isValid: false,
        error: 'Invalid Ethereum address checksum'
      };
    }
  }

  // Check for ENS name format
  const ensRegex = /^[a-zA-Z0-9-]+\.eth$/;
  if (ensRegex.test(trimmedAddress.toLowerCase())) {
    // Basic ENS validation - actual resolution will happen in the service
    if (trimmedAddress.length < 7 || trimmedAddress.length > 253) {
      return {
        isValid: false,
        error: 'ENS name length must be between 7 and 253 characters'
      };
    }
    
    return {
      isValid: true,
      address: trimmedAddress.toLowerCase(),
      type: 'ens'
    };
  }

  return {
    isValid: false,
    error: 'Must be a valid Ethereum address (0x...) or ENS name (.eth)'
  };
}

/**
 * Check if an address is a valid Ethereum address
 * @param {string} address - The address to check
 * @returns {boolean} True if valid Ethereum address
 */
function isEthereumAddress(address) {
  const result = validateAddress(address);
  return result.isValid && result.type === 'address';
}

/**
 * Check if an address is a valid ENS name
 * @param {string} address - The address to check
 * @returns {boolean} True if valid ENS name
 */
function isENSName(address) {
  const result = validateAddress(address);
  return result.isValid && result.type === 'ens';
}

module.exports = {
  validateAddress,
  isEthereumAddress,
  isENSName
};
