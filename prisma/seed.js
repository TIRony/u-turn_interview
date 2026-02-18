require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.car.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👤 Creating users...');
  const users = await prisma.user.createMany({
    data: [
      { name: 'John Doe', phone: '+8801712345678' },
      { name: 'Jane Smith', phone: '+8801812345679' },
      { name: 'Ahmed Hassan', phone: '+8801912345680' },
    ],
  });
  console.log(`✅ Created ${users.count} users`);

  // Create drivers with their locations (around Dhaka, Bangladesh)
  console.log('🚗 Creating drivers...');
  
  const driversData = [
    // Near Gulshan area
    { 
      name: 'Karim Rahman', 
      is_available: true, 
      current_lat: 23.7808, 
      current_lng: 90.4152,
      car: { model: 'Toyota Axio', plate_number: 'DHK-1234' }
    },
    // Near Dhanmondi area
    { 
      name: 'Rahim Uddin', 
      is_available: true, 
      current_lat: 23.7461, 
      current_lng: 90.3742,
      car: { model: 'Honda Civic', plate_number: 'DHK-2345' }
    },
    // Near Uttara area
    { 
      name: 'Salim Hossain', 
      is_available: true, 
      current_lat: 23.8756, 
      current_lng: 90.3795,
      car: { model: 'Toyota Corolla', plate_number: 'DHK-3456' }
    },
    // Near Mirpur area
    { 
      name: 'Jamal Ahmed', 
      is_available: true, 
      current_lat: 23.8223, 
      current_lng: 90.3654,
      car: { model: 'Toyota Premio', plate_number: 'DHK-4567' }
    },
    // Near Banani area (close to test location)
    { 
      name: 'Farhan Islam', 
      is_available: true, 
      current_lat: 23.8090, 
      current_lng: 90.4100,
      car: { model: 'Honda Accord', plate_number: 'DHK-5678' }
    },
    // Near Mohakhali area
    { 
      name: 'Rashid Khan', 
      is_available: true, 
      current_lat: 23.7808, 
      current_lng: 90.4046,
      car: { model: 'Nissan Sunny', plate_number: 'DHK-6789' }
    },
    // Near Badda area
    { 
      name: 'Monsur Ali', 
      is_available: true, 
      current_lat: 23.7805, 
      current_lng: 90.4285,
      car: { model: 'Suzuki Ciaz', plate_number: 'DHK-7890' }
    },
    // Near Jatrabari area (far from test location)
    { 
      name: 'Kabir Sheikh', 
      is_available: true, 
      current_lat: 23.7104, 
      current_lng: 90.4314,
      car: { model: 'Toyota Allion', plate_number: 'DHK-8901' }
    },
    // Near Motijheel area
    { 
      name: 'Hafiz Rahman', 
      is_available: false, // Not available
      current_lat: 23.7330, 
      current_lng: 90.4172,
      car: { model: 'Honda City', plate_number: 'DHK-9012' }
    },
    // Near Farmgate area
    { 
      name: 'Nasir Ahmed', 
      is_available: true, 
      current_lat: 23.7563, 
      current_lng: 90.3892,
      car: { model: 'Mitsubishi Lancer', plate_number: 'DHK-0123' }
    },
  ];

  for (const driverData of driversData) {
    const { car, ...driverInfo } = driverData;
    const driver = await prisma.driver.create({
      data: {
        ...driverInfo,
        car: {
          create: car,
        },
      },
      include: {
        car: true,
      },
    });
    console.log(`  ✓ Created driver: ${driver.name} (${driver.car.model})`);
  }

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${users.count}`);
  console.log(`   Drivers: ${driversData.length}`);
  console.log(`   Cars: ${driversData.length}`);
  console.log('\n📍 Test Coordinates (Near Banani, Dhaka):');
  console.log('   Latitude: 23.8103');
  console.log('   Longitude: 90.4125');
  console.log('   Radius: 5 km');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
