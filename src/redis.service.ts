import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: any;

    constructor() {
        // Initialize the Redis client with your Redis server's host and port
        this.client = new Redis({
            username: "default",
            password: "neoshealthtech@redis",
            host: "localhost",
            port: 6379,
        });
    }

    getClient(): any {
        return this.client;
    }
}
