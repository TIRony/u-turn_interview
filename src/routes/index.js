const express = require('express');
const rideRoutes = require('./ride.routes');

const router = express.Router();

router.use('/ride', rideRoutes);

module.exports = router;
