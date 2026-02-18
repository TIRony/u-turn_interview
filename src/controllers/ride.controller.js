const rideService = require('../services/ride.service');
const { transformRideRequestResponse } = require('../transformers/ride.transformer');
const { successResponse } = require('../utils/responseFormatter');
const constants = require('../config/constants');

async function requestRide(req, res, next) {
  try {
    const { user_id, pickup_lat, pickup_lng, radius_km } = req.body;

    const availableDrivers = await rideService.findNearbyDrivers(
      user_id,
      pickup_lat,
      pickup_lng,
      radius_km
    );

    const responseData = transformRideRequestResponse(
      user_id,
      pickup_lat,
      pickup_lng,
      radius_km,
      availableDrivers
    );

    const message = availableDrivers.length > 0
      ? constants.MESSAGES.SUCCESS.DRIVERS_FOUND(availableDrivers.length, radius_km)
      : constants.MESSAGES.SUCCESS.NO_DRIVERS;

    return successResponse(res, responseData, message);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  requestRide,
};
