function transformDriverToResponse(driver, distance) {
  return {
    driver_id: driver.id,
    driver_name: driver.name,
    car_model: driver.car?.model || 'N/A',
    plate_number: driver.car?.plate_number || 'N/A',
    distance_km: distance,
    location: {
      lat: driver.current_lat,
      lng: driver.current_lng,
    },
  };
}

function transformRideRequestResponse(userId, pickupLat, pickupLng, radiusKm, drivers) {
  return {
    request_details: {
      user_id: userId,
      pickup_location: {
        lat: pickupLat,
        lng: pickupLng,
      },
      radius_km: radiusKm,
    },
    total_drivers_found: drivers.length,
    available_drivers: drivers,
  };
}

module.exports = {
  transformDriverToResponse,
  transformRideRequestResponse,
};
