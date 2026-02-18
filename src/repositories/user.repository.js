const prisma = require('../config/database');

async function findById(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

async function exists(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return !!user;
}

module.exports = {
  findById,
  exists,
};
