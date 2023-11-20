import { Fortuna } from "./Fortuna.strategy";
import { Seed } from "../Seed";
import { RedisClient } from "redis";
import { Buffer } from "node:buffer";

export class RedisFortuna extends Fortuna {
  private redisClient: RedisClient;
  private channelName: string;

  constructor(seed: Seed, redisClient: RedisClient, channelName: string) {
    super(seed);

    this.redisClient = redisClient;
    this.channelName = channelName;
    this.subscribe();
  }

  private subscribe() {
    try {
      this.redisClient.subscribe(this.channelName);
      this.redisClient.on("message", (channel: string, message: string) => {
        if (channel === this.channelName) {
          this.addEvent(Buffer.from(message));
        }
      });
    } catch (error: any) {
      throw new Error(`[RedisFortuna] Error subscribing to Redis channel: ${error.message}`);
    }
  }
}
