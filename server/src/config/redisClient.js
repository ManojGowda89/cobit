/**
 * Redis Client replacement using in-memory Map
 * 
 * Current Date and Time: 2025-08-29 09:38:18 (UTC)
 * User: ManojGowda89
 */

const cache = new Map();

/**
 * Connect function (dummy for compatibility)
 */
export const connectRedis = async () => {
  console.log("✅ Using in-memory Map cache (Redis disabled)");
};

/**
 * Set key-value with 1-hour expiry
 * Automatically converts objects to JSON
 * @param {string} key 
 * @param {string|object} value 
 */
export const set = async (key, value) => {
  const val = typeof value === "object" ? JSON.stringify(value) : value;

  // Store with expiry timestamp
  const expiry = Date.now() + 3600 * 1000; // 1 hour
  cache.set(key, { value: val, expiry });
};

/**
 * Get value by key
 * Automatically parses JSON objects
 * @param {string} key 
 */
export const get = async (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  // Check expiry
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  try {
    return JSON.parse(entry.value);
  } catch {
    return entry.value;
  }
};

/**
 * Delete a key
 * @param {string} key 
 */
export const del = async (key) => {
  cache.delete(key);
};

/**
 * Scan for keys matching a pattern
 * Simple implementation of scanIterator for in-memory Map
 * @param {Object} options 
 * @returns {AsyncIterator} iterator of matching keys
 */
export const scanIterator = ({ MATCH }) => {
  // Convert Redis glob pattern to RegExp
  const pattern = MATCH.replace(/\*/g, '.*');
  const regex = new RegExp(`^${pattern}$`);
  
  // Return an async generator that yields matching keys
  return {
    [Symbol.asyncIterator]() {
      const keys = [...cache.keys()].filter(key => regex.test(key));
      let index = 0;
      
      return {
        async next() {
          if (index < keys.length) {
            return { value: keys[index++], done: false };
          } else {
            return { done: true };
          }
        }
      };
    }
  };
};

// Create client object with all methods for compatibility
const client = {
  scanIterator,
  del,
  // Add any other methods that might be accessed directly
};

// Export the client as default and all individual methods
export default client;