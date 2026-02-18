const { body, validationResult } = require('express-validator');

const rideRequestValidation = [
  body('user_id')
    .exists()
    .withMessage('user_id is required')
    .notEmpty()
    .withMessage('user_id cannot be empty')
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('user_id must be a positive integer between 1 and 2147483647')
    .custom((value) => {
      if (value === 0) {
        throw new Error('user_id cannot be 0');
      }
      return true;
    }),
  
  body('pickup_lat')
    .exists()
    .withMessage('pickup_lat is required')
    .notEmpty()
    .withMessage('pickup_lat cannot be empty')
    .isFloat({ min: -90, max: 90 })
    .withMessage('pickup_lat must be a valid latitude between -90 and 90 degrees')
    .custom((value) => {
      if (value === 0 && !isValidEquatorLocation(value)) {
        throw new Error('pickup_lat appears to be invalid (0,0 coordinates)');
      }
      // Check if latitude is reasonable for real-world usage
      if (Math.abs(value) < 0.0001 && Math.abs(value) > 0) {
        throw new Error('pickup_lat value is too precise, please use reasonable coordinates');
      }
      return true;
    }),
  
  body('pickup_lng')
    .exists()
    .withMessage('pickup_lng is required')
    .notEmpty()
    .withMessage('pickup_lng cannot be empty')
    .isFloat({ min: -180, max: 180 })
    .withMessage('pickup_lng must be a valid longitude between -180 and 180 degrees')
    .custom((value) => {
      if (Math.abs(value) < 0.0001 && Math.abs(value) > 0) {
        throw new Error('pickup_lng value is too precise, please use reasonable coordinates');
      }
      return true;
    }),
  
  body('radius_km')
    .exists()
    .withMessage('radius_km is required')
    .notEmpty()
    .withMessage('radius_km cannot be empty')
    .isFloat()
    .withMessage('radius_km must be a number')
    .custom((value) => {
      if (value === 0) {
        throw new Error('radius_km cannot be 0. Minimum radius is 0.1 km (100 meters)');
      }
      if (value < 0) {
        throw new Error('radius_km cannot be negative. Please provide a positive value');
      }
      if (value > 0 && value < 0.1) {
        throw new Error('radius_km is too small. Minimum radius is 0.1 km (100 meters)');
      }
      if (value > 100) {
        throw new Error('radius_km is too large. Maximum radius is 100 km');
      }
      if (!isFinite(value)) {
        throw new Error('radius_km must be a finite number');
      }
      if (isNaN(value)) {
        throw new Error('radius_km must be a valid number');
      }
      return true;
    }),

  body().custom((value, { req }) => {
    const { pickup_lat, pickup_lng } = req.body;
    
    if (pickup_lat === 0 && pickup_lng === 0) {
      throw new Error('Invalid coordinates: Location (0, 0) is in the middle of the ocean. Please provide valid pickup coordinates');
    }

    return true;
  }),
];

function isValidEquatorLocation(lat) {
  return false;
}

function validate(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Please check your input and try again',
      details: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
}

module.exports = {
  rideRequestValidation,
  validate,
};
