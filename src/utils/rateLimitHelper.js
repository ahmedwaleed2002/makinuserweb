// Utility to help manage rate limits

// Track last request times to prevent rapid successive calls
const lastRequestTimes = new Map();

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const withRateLimit = async (fn, delayMs = 1000, operationType = 'default') => {
  // Check if we need to wait based on last request time
  const now = Date.now();
  const lastTime = lastRequestTimes.get(operationType) || 0;
  const timeSinceLastRequest = now - lastTime;
  
  if (timeSinceLastRequest < delayMs) {
    const waitTime = delayMs - timeSinceLastRequest;
    console.log(`Waiting ${waitTime}ms before ${operationType} request...`);
    await delay(waitTime);
  }
  
  // Update last request time
  lastRequestTimes.set(operationType, Date.now());
  
  try {
    const result = await fn();
    return result;
  } catch (error) {
    if (error.message.includes('Rate limit') || error.code === 429) {
      console.log(`Rate limit hit, waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
      // Update time again after retry delay
      lastRequestTimes.set(operationType, Date.now());
      // Retry once after delay
      return await fn();
    }
    throw error;
  }
};

export const rateLimitConfig = {
  // Minimum delays between operations (reduced for development)
  auth: 500,       // 0.5 seconds between auth operations
  upload: 750,     // 0.75 seconds between uploads
  database: 300    // 0.3 seconds between database operations
};
