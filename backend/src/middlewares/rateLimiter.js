
const config = require('../config');

// In-memory store for rate limiting
// In production, consider using Redis or a database
const requestStore = new Map();

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  const expiredKeys = [];
  
  for (const [key, data] of requestStore.entries()) {
    if (now - data.firstRequest > config.rateLimit.windowMs) {
      expiredKeys.push(key);
    }
  }
  
  expiredKeys.forEach(key => requestStore.delete(key));
  
  if (expiredKeys.length > 0) {
    console.log(`🧹 Cleaned up ${expiredKeys.length} expired rate limit entries`);
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredEntries, 60 * 60 * 1000);

/**
 * Rate limiting middleware
 * Limits requests per IP address
 */
function rateLimiter(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  if (!clientIP) {
    console.warn('⚠️  Unable to determine client IP address');
    return res.status(400).json({
      error: 'Unable to process request',
      message: 'Client identification failed'
    });
  }

  const now = Date.now();
  const key = `ratelimit:${clientIP}`;
  
  // Get existing data for this IP
  let requestData = requestStore.get(key);
  
  if (!requestData) {
    // First request from this IP
    requestData = {
      count: 0,
      firstRequest: now,
      lastRequest: now
    };
  }

  // Check if the window has expired
  if (now - requestData.firstRequest > config.rateLimit.windowMs) {
    // Reset the window
    requestData = {
      count: 0,
      firstRequest: now,
      lastRequest: now
    };
  }

  // Check if limit is exceeded
  if (requestData.count >= config.rateLimit.maxRequestsPerWindow) {
    const timeRemaining = config.rateLimit.windowMs - (now - requestData.firstRequest);
    const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60));
    
    console.log(`🚫 Rate limit exceeded for IP ${clientIP}`);
    
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `You can only request funds once every 24 hours. Please try again in ${hoursRemaining} hour(s).`,
      retryAfter: Math.ceil(timeRemaining / 1000),
      resetTime: new Date(requestData.firstRequest + config.rateLimit.windowMs).toISOString()
    });
  }

  // Increment counter
  requestData.count += 1;
  requestData.lastRequest = now;
  
  // Store updated data
  requestStore.set(key, requestData);
  
  console.log(`📊 Rate limit status for ${clientIP}: ${requestData.count}/${config.rateLimit.maxRequestsPerWindow} requests`);
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': config.rateLimit.maxRequestsPerWindow,
    'X-RateLimit-Remaining': config.rateLimit.maxRequestsPerWindow - requestData.count,
    'X-RateLimit-Reset': new Date(requestData.firstRequest + config.rateLimit.windowMs).toISOString()
  });
  
  next();
}

/**
 * Get current rate limit stats
 * @returns {Object} Statistics about current rate limits
 */
function getRateLimitStats() {
  const now = Date.now();
  const active = [];
  const expired = [];
  
  for (const [key, data] of requestStore.entries()) {
    if (now - data.firstRequest > config.rateLimit.windowMs) {
      expired.push(key);
    } else {
      active.push({
        ip: key.replace('ratelimit:', ''),
        requests: data.count,
        firstRequest: new Date(data.firstRequest).toISOString(),
        timeRemaining: config.rateLimit.windowMs - (now - data.firstRequest)
      });
    }
  }
  
  return {
    activeEntries: active.length,
    expiredEntries: expired.length,
    totalEntries: requestStore.size,
    activeDetails: active
  };
}

module.exports = rateLimiter;
module.exports.getRateLimitStats = getRateLimitStats;
module.exports.cleanupExpiredEntries = cleanupExpiredEntries;
