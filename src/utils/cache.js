const performanceConfig = require('../config/performance');

const cache = new Map();

const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
};

function generateKey(prefix, ...parts) {
  return `${prefix}:${parts.join(':')}`;
}

function get(key) {
  if (!performanceConfig.CACHE.ENABLED) {
    return null;
  }

  const item = cache.get(key);
  
  if (!item) {
    stats.misses++;
    return null;
  }

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    stats.misses++;
    return null;
  }

  stats.hits++;
  return item.value;
}

function set(key, value, ttl = 60) {
  if (!performanceConfig.CACHE.ENABLED) {
    return;
  }

  cache.set(key, {
    value,
    expiresAt: Date.now() + (ttl * 1000),
  });
  
  stats.sets++;
}

function del(key) {
  cache.delete(key);
}

function clear() {
  cache.clear();
  console.log('Cache cleared');
}

function getStats() {
  return {
    ...stats,
    size: cache.size,
    hitRate: stats.hits + stats.misses > 0 
      ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2) + '%'
      : '0%',
  };
}

function cleanup() {
  const now = Date.now();
  let removed = 0;

  for (const [key, item] of cache.entries()) {
    if (now > item.expiresAt) {
      cache.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`Cache cleanup: Removed ${removed} expired entries`);
  }
}

if (performanceConfig.CACHE.ENABLED) {
  setInterval(cleanup, 5 * 60 * 1000);
}

module.exports = {
  get,
  set,
  del,
  clear,
  getStats,
  generateKey,
};
