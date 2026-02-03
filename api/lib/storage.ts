// Storage abstraction - uses Upstash Redis in production, in-memory for local dev

interface StorageInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
}

// In-memory storage for local development
const memoryStore: Record<string, any> = {};

const memoryStorage: StorageInterface = {
  async get<T>(key: string): Promise<T | null> {
    return memoryStore[key] || null;
  },
  async set<T>(key: string, value: T): Promise<void> {
    memoryStore[key] = value;
  }
};

// Redis storage for production
let redisStorage: StorageInterface | null = null;

async function getRedisStorage(): Promise<StorageInterface> {
  if (redisStorage) return redisStorage;

  try {
    const { Redis } = await import('@upstash/redis');

    // Support Vercel KV env vars (migrated stores) and new Upstash env vars
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    const redis = new Redis({ url: url!, token: token! });

    redisStorage = {
      async get<T>(key: string): Promise<T | null> {
        return await redis.get<T>(key);
      },
      async set<T>(key: string, value: T): Promise<void> {
        await redis.set(key, value);
      }
    };
    return redisStorage;
  } catch (e) {
    console.warn('Upstash Redis not available, using in-memory storage');
    return memoryStorage;
  }
}

// Check if Redis is configured
function isRedisConfigured(): boolean {
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

// Get the appropriate storage backend
export async function getStorage(): Promise<StorageInterface> {
  if (isRedisConfigured()) {
    return getRedisStorage();
  }
  return memoryStorage;
}

export type { StorageInterface };
