import { Injectable } from "@nestjs/common";
import { IStorage } from "./storage.interface";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class RedisService implements IStorage {
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    this.client = new Redis({
      host: config.get<string>("REDIS_HOST"),
      port: config.get<number>("REDIS_PORT")
    })
  };

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  };

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  };

  async del(key: string): Promise<void> {
    await this.client.del(key);
  };
}