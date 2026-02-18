const cache = require('../utils/cache');
const performanceConfig = require('../config/performance');
const userRepository = require('../repositories/user.repository');

async function getUserWithCache(userId) {
  const cacheKey = cache.generateKey('user', userId);
  const cachedUser = cache.get(cacheKey);
  
  if (cachedUser) {
    return cachedUser;
  }

  const user = await userRepository.findById(userId);

  if (user) {
    cache.set(cacheKey, user, performanceConfig.CACHE.USER_TTL);
  }

  return user;
}

function generateSearchCacheKey(userId, lat, lng, radius) {
  return cache.generateKey(
    'search',
    userId,
    lat.toFixed(4),
    lng.toFixed(4),
    radius
  );
}

function cacheSearchResults(cacheKey, results) {
  cache.set(cacheKey, results, performanceConfig.CACHE.SEARCH_RESULTS_TTL);
}

function getSearchFromCache(cacheKey) {
  return cache.get(cacheKey);
}

module.exports = {
  getUserWithCache,
  generateSearchCacheKey,
  cacheSearchResults,
  getSearchFromCache,
};
