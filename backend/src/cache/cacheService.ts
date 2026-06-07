/**
 * CacheService — dependency-abstracted cache layer.
 *
 * Currently backed by node-cache (in-memory).
 * To swap to Redis, implement the same ICacheService interface
 * and replace the `cacheService` export below — no route or service
 * changes required.
 */

import NodeCache from 'node-cache';

const TTL = Number(process.env.CACHE_TTL) || 60; // seconds

/** Contract for any cache implementation */
export interface ICacheService {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlSeconds?: number): void;
  del(key: string): void;
  flush(): void;
}

/** node-cache backed implementation */
class NodeCacheService implements ICacheService {
  private cache: NodeCache;

  constructor(defaultTtl: number) {
    this.cache = new NodeCache({ stdTTL: defaultTtl, checkperiod: defaultTtl * 0.2 });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    this.cache.set(key, value, ttlSeconds ?? TTL);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }
}

/** Singleton exported for use across the app */
export const cacheService: ICacheService = new NodeCacheService(TTL);
