import redis from 'redis';
import { promisify } from 'util';

/**
 * 
 * 
 */
class RedisClient{
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('connect', () => {
      // console.log('Connected to Redis server');
    });

  }

    /**
    *  Rturns true if the redis connection is alive
    */
    isAlive() {
      return this.client.connected;
  }

    /**
     * 
     * @param {*} key 
     * @returns 
     */
    async get(key) {
      const value = await this.getAsync(key)
      return value
  }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {*} time 
     */
    async set(key, value, time) {
      this.client.setex(key, time, value);
  }

    /**
     * 
     * @param {*} key 
     */
    async del(key) {
      this.client.del(key)
  }
}

const redisClient = new RedisClient();

export default redisClient;

