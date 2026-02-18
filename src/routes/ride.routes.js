const express = require('express');
const rideController = require('../controllers/ride.controller');
const { rideRequestValidation, validate } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/request',
  rideRequestValidation,
  validate,
  rideController.requestRide
);

module.exports = router;
