const { validateRideRequest } = require('../helpers/input.validator');
const { isValidBoundingBox } = require('../helpers/geo.validator');
const { getBoundingBox } = require('../utils/distance');
const { getUserWithCache, generateSearchCacheKey, cacheSearchResults, getSearchFromCache } = require('../helpers/cache.helper');
const { processDrivers, sortDriversByDistance } = require('../helpers/driver.processor');
const { createTimer, measureTime, logPerformance } = require('../helpers/performance.helper');
const { createUserNotFoundError, createInvalidCoordinatesError } = require('../helpers/error.helper');
const driverRepository = require('../repositories/driver.repository');

async function findNearbyDrivers(userId, pickupLat, pickupLng, radiusKm) {
  const timer = createTimer();

  validateRideRequest(userId, pickupLat, pickupLng, radiusKm);

  const cacheKey = generateSearchCacheKey(userId, pickupLat, pickupLng, radiusKm);
  const cachedResult = getSearchFromCache(cacheKey);
  
  if (cachedResult) {
    logPerformance('Cache HIT', measureTime(timer));
    return cachedResult;
  }

  const user = await getUserWithCache(userId);
  if (!user) {
    throw createUserNotFoundError();
  }

  const boundingBox = getBoundingBox(pickupLat, pickupLng, radiusKm);
  
  if (!isValidBoundingBox(boundingBox)) {
    throw createInvalidCoordinatesError();
  }

  const drivers = await driverRepository.findDriversByBoundingBox(boundingBox);

  if (!drivers || drivers.length === 0) {
    logPerformance('Driver search', measureTime(timer), { found: 0 });
    return [];
  }

  const processedDrivers = processDrivers(drivers, pickupLat, pickupLng, radiusKm);
  const sortedDrivers = sortDriversByDistance(processedDrivers);

  cacheSearchResults(cacheKey, sortedDrivers);

  logPerformance('Driver search', measureTime(timer), { found: sortedDrivers.length });

  return sortedDrivers;
}

module.exports = {
  findNearbyDrivers,
};
