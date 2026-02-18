const prisma = require('../config/database');
const performanceConfig = require('../config/performance');

async function findDriversByBoundingBox(boundingBox) {
  return await prisma.driver.findMany({
    where: {
      is_available: true,
      current_lat: {
        gte: boundingBox.minLat,
        lte: boundingBox.maxLat,
      },
      current_lng: {
        gte: boundingBox.minLng,
        lte: boundingBox.maxLng,
      },
    },
    select: {
      id: true,
      name: true,
      current_lat: true,
      current_lng: true,
      car: {
        select: {
          model: true,
          plate_number: true,
        },
      },
    },
    take: performanceConfig.DATABASE.MAX_DRIVERS_FETCH,
  });
}

async function findUserById(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

module.exports = {
  findDriversByBoundingBox,
  findUserById,
};
