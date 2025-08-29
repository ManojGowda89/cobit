// redisClient.js
import { createClient } from "redis";

const REDIS_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_REDIS_URL
    : process.env.LOCAL_REDIS_URL || "redis://localhost:6379";

const client = createClient({
  url: REDIS_URL,
});

client.on("error", (err) => console.error("Redis Client Error", err));

/**
 * Connect to Redis
 */
export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Connected to Redis");
  }
};

/**
 * Set key-value with 1-hour expiry
 * Automatically converts objects to JSON
 * @param {string} key 
 * @param {string|object} value 
 */
export const set = async (key, value) => {
  const val = typeof value === "object" ? JSON.stringify(value) : value;
  await client.set(key, val, { EX: 3600 }); // 1 hour expiry
};

/**
 * Get value by key
 * Automatically parses JSON objects
 * @param {string} key 
 */
export const get = async (key) => {
  const val = await client.get(key);
  if (!val) return null;

  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

/**
 * Delete a key
 * @param {string} key 
 */
export const del = async (key) => {
  await client.del(key);
};

/**
 * Export the raw client if needed
 */
export default client;
