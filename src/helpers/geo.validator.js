const constants = require('../config/constants');

function isValidBoundingBox(boundingBox) {
  if (!boundingBox) return false;
  
  const { minLat, maxLat, minLng, maxLng } = boundingBox;
  
  if (!isFinite(minLat) || !isFinite(maxLat) || 
      !isFinite(minLng) || !isFinite(maxLng)) {
    return false;
  }
  
  if (minLat >= maxLat || minLng >= maxLng) {
    return false;
  }
  
  if (minLat < constants.VALIDATION.LATITUDE.MIN || 
      maxLat > constants.VALIDATION.LATITUDE.MAX || 
      minLng < constants.VALIDATION.LONGITUDE.MIN || 
      maxLng > constants.VALIDATION.LONGITUDE.MAX) {
    return false;
  }
  
  return true;
}

function isValidDriverCoordinates(driver) {
  return (
    driver.current_lat &&
    driver.current_lng &&
    isFinite(driver.current_lat) &&
    isFinite(driver.current_lng)
  );
}

function isValidDistance(distance, maxRadius) {
  return isFinite(distance) && distance >= 0 && distance <= maxRadius;
}

module.exports = {
  isValidBoundingBox,
  isValidDriverCoordinates,
  isValidDistance,
};
