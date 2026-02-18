const { calculateDistance } = require('../utils/distance');
const { isValidDriverCoordinates, isValidDistance } = require('../helpers/geo.validator');
const { transformDriverToResponse } = require('../transformers/ride.transformer');

function processDrivers(drivers, pickupLat, pickupLng, radiusKm) {
  const result = [];

  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];

    if (!isValidDriverCoordinates(driver)) {
      continue;
    }

    const distance = calculateDistance(
      pickupLat,
      pickupLng,
      driver.current_lat,
      driver.current_lng
    );

    if (!isValidDistance(distance, radiusKm)) {
      continue;
    }

    result.push(transformDriverToResponse(driver, distance));
  }

  return result;
}

function sortDriversByDistance(drivers) {
  return drivers.sort((a, b) => a.distance_km - b.distance_km);
}

module.exports = {
  processDrivers,
  sortDriversByDistance,
};
