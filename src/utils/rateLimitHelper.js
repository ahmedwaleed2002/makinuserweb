// Utility to help manage rate limits

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const withRateLimit = async (fn, delayMs = 1000) => {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    if (error.message.includes('Rate limit') || error.code === 429) {
      console.log(`Rate limit hit, waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
      // Retry once after delay
      return await fn();
    }
    throw error;
  }
};

export const rateLimitConfig = {
  // Minimum delays between operations
  auth: 2000,      // 2 seconds between auth operations
  upload: 1500,    // 1.5 seconds between uploads
  database: 1000   // 1 second between database operations
};
