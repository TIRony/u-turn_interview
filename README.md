# U-Turn - Driver Matching API

Finds the nearest available drivers based on your location. Built for speed and simplicity.

## Built With

- **Node.js + Express** - API server
- **PostgreSQL + Prisma** - Database
- **Supabase** - Hosted PostgreSQL

## Features

- Finds drivers within your radius (e.g., 5km)
- Sorts by distance (closest first)
- **Smart caching** - Results cached for 30 seconds. Nearby searches get instant responses without hitting the database
- Validates all inputs automatically
- Database indexes for fast queries

## Cache Benefits

Real-world performance improvement:

- **First request:** 600ms (database query)
- **Cached request:** 5ms (120x faster!)

The 30-second cache dramatically reduces response time for nearby searches.

## Production Test

**Live API:** https://u-turn-rony.up.railway.app/

Test with Postman:

1. Open Postman → **Import** button
2. Upload `postman_collection.json`
3. In the collection, change the base URL from `http://localhost:3000` to `https://u-turn-rony.up.railway.app`
4. Send requests to test the live API

## Dev Test

Test locally with Postman:

1. Make sure your server is running (`pnpm dev`)
2. Open Postman → **Import** button
3. Upload `postman_collection.json`
4. Use the pre-configured requests (Area 1, Area 2)
5. The collection uses `http://localhost:3000` by default

## Project Structure

```
src/
├── server.js              # Application entry point
├── config/                # Configuration files
│   ├── database.js        # Prisma client setup
│   ├── constants.js       # App constants
│   └── performance.js     # Performance settings
├── controllers/           # Request handlers
│   └── ride.controller.js
├── services/              # Business logic
│   └── ride.service.js
├── middleware/            # Express middleware
│   ├── validator.js       # Input validation
│   ├── errorHandler.js    # Error handling
│   └── performance.js     # Request tracking
├── routes/                # API routes
│   ├── index.js
│   └── ride.routes.js
└── utils/                 # Helper functions
    ├── distance.js        # Haversine calculations
    ├── cache.js          # Caching logic
    └── responseFormatter.js
```

## Local Development

**1. Clone and install**

```bash
git clone <repo-url>
cd u-turn
pnpm install
```

**2. Set up environment**

Create `.env` file:

```env
DATABASE_URL="your-postgresql-connection-string"
NODE_ENV="development"
PORT=3000
```

**3. Set up database**

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed test data (10 drivers around Dhaka)
pnpm prisma:seed
```

**4. Start the server**

```bash
pnpm dev
```

Server runs at `http://localhost:3000`

## API Usage

### Request a Ride

**Endpoint:** `POST /api/ride/request`

**Request:**

```json
{
  "user_id": 1,
  "pickup_lat": 23.8103,
  "pickup_lng": 90.4125,
  "radius_km": 5
}
```

**Parameters:**
- `user_id` - Positive number
- `pickup_lat` - Latitude (-90 to 90)
- `pickup_lng` - Longitude (-180 to 180)
- `radius_km` - Search radius (0.1 to 100 km)

**Response:**

```json
{
  "success": true,
  "message": "Found 5 driver(s) within 5km",
  "request_details": {
    "user_id": 1,
    "pickup_location": {
      "lat": 23.8103,
      "lng": 90.4125
    },
    "radius_km": 5
  },
  "available_drivers": [
    {
      "driver_id": 5,
      "driver_name": "Farhan Islam",
      "car_model": "Honda Accord",
      "plate_number": "DHK-5678",
      "distance_km": 0.3,
      "location": {
        "lat": 23.809,
        "lng": 90.41
      }
    }
  ]
}
```

Drivers are sorted by distance (closest first).

## How It Works

1. **Validation** - Checks if inputs are valid
2. **Cache check** - Returns cached results if available (30 second TTL)
3. **User verification** - Confirms user exists
4. **Bounding box filter** - Creates a rough box around your location to narrow the search
5. **Database query** - Fetches available drivers in that area
6. **Haversine calculation** - Calculates exact distances
7. **Filter & sort** - Keeps only drivers within radius, sorts by distance
8. **Cache & respond** - Saves results and sends response

Typical response time: <50ms (thanks to caching and indexes)

## Why This Structure?

Each file has one clear purpose:
- Easy to test individual pieces
- Changes don't affect the whole codebase
- New developers understand it quickly
- Components are reusable

## Performance Optimizations

**Caching** - Search results cached 30s, user data 5min. Dramatically reduces database load for nearby searches.

**Database indexes** - Queries stay fast even with thousands of drivers.

**Bounding box** - Eliminates 90% of drivers before distance calculation.

**Smart queries** - Only fetch fields we need.

**Request tracking** - Logs slow requests (>1 second) for optimization.

## Database Schema

**Users**
- id, name, phone, timestamps

**Drivers**
- id, name, is_available, current_lat, current_lng, timestamps
- Indexes: is_available, location fields

**Cars**
- id, driver_id, model, plate_number, timestamps

## Project Timeline

**Total: ~8-10 hours**

**Phase 1: Setup (1 hour)**
- Project structure
- Database schema (Users, Drivers, Cars)
- Prisma configuration

**Phase 2: Core Development (4-5 hours)**
- Ride request endpoint
- Haversine distance formula
- Bounding box optimization
- Validation & error handling

**Phase 3: Optimization (2-3 hours)**
- Caching system
- Performance monitoring
- Database indexing
- Modular refactoring

**Phase 4: Testing & Polish (1-2 hours)**
- Seed data with realistic locations
- Postman collection
- Documentation
- Final testing

---

**Built by Rony** | [Production](https://u-turn-rony.up.railway.app/)
