import { createClient } from "redis";
import { RedisClientType } from "@redis/client";

export class Redis {
  private static instance: Redis;
  private redisClient?: RedisClientType;

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }

  initialize(redisURL?: string) {
    if (!redisURL) {
      console.error("Redis URL must be provided.");
      return;
    }

    this.redisClient = createClient({ url: redisURL });

    this.redisClient.on("error", (err: Error) => {
      console.error("Redis connection error:", err);
    });

    this.redisClient.on("connect", () => {
      console.info("Connected to Redis.");
    });
  }

  async connect() {
    if (!this.redisClient) {
      console.error("Redis client is not initialized.");
      return;
    }

    try {
      await this.redisClient.connect();
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
    }
  }

  getClient() {
    return this.redisClient;
  }
}
