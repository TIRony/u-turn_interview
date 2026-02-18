# U-Turn - Ride Matching System

A backend system that helps riders find nearby drivers quickly and efficiently.

## What is this?

This is a ride-matching API that lets users request rides and instantly see all available drivers nearby. It calculates real distances using the Haversine formula and shows the closest drivers first.

## Built with

- Node.js & Express
- PostgreSQL with Prisma ORM
- Supabase for database hosting
- pnpm for package management

## What it does

- Finds available drivers within your specified search radius
- Calculates accurate distances between locations
- Returns drivers sorted from nearest to farthest
- Validates all inputs to prevent errors
- Handles errors gracefully with clear messages
- Uses smart caching for better performance
- Monitors request performance to catch slow queries

## Testing with Postman

I've included a Postman collection file to make testing super easy.

**How to import and test:**

1. Open Postman
2. Click "Import" button (top left)
3. Drag and drop `postman_collection.json` or click "Choose Files"
4. You'll see "U-Turn Ride Matching API" collection appear
5. Make sure your server is running (`pnpm dev`)
6. Click any request → Hit "Send"

The collection has 3 requests:
- **Root** - Check basic API info
- **Request Ride - Area 1** - Test from Banani area
- **Request Ride - Area 2** - Test from Gulshan area

That's it! No need to manually type requests or configure anything.

## How the code is organized

I've structured this project to be as clean and modular as possible. Each piece has its own job:

```
U-Turn/
├── prisma/
│   ├── schema.prisma              # Database structure
│   └── seed.js                    # Sample data to play with
├── src/
│   ├── config/                    # App settings and configs
│   ├── controllers/               # Handles API requests
│   ├── services/                  # Core business logic
│   ├── repositories/              # Talks to the database
│   ├── helpers/                   # Small utility functions
│   ├── transformers/              # Formats data for responses
│   ├── routes/                    # API endpoint definitions
│   ├── middleware/                # Request processing
│   ├── utils/                     # Shared helper tools
│   └── server.js                  # Main entry point
├── .env.example
├── package.json
└── README.md
```

## Getting started

### What you'll need

- Node.js (version 18 or newer)
- A PostgreSQL database (Supabase)
- pnpm or npm

### Setup

**1. Clone and install**
```bash
git clone <repository-url>
cd U-Turn
pnpm install
```

**2. Set up your environment**

```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
NODE_ENV=development
```

If you're using Supabase, just grab the connection string from your project settings.

**3. Set up the database**

```bash
# Generate Prisma client
pnpm prisma:generate

# Create database tables
pnpm prisma:migrate

# Add some test data (10 drivers around Dhaka)
pnpm prisma:seed
```

**4. Start the server**

```bash
pnpm dev
```

That's it! Your API should be running at `http://localhost:3000`

## Using the API

### Request a ride

Send a POST request with your location and search radius:

```bash
curl -X POST http://localhost:3000/api/ride/request \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "pickup_lat": 23.8103,
    "pickup_lng": 90.4125,
    "radius_km": 5
  }'
```

**What you need to send:**
- `user_id` - Your user ID (positive number)
- `pickup_lat` - Your latitude (-90 to 90)
- `pickup_lng` - Your longitude (-180 to 180)
- `radius_km` - How far to search (0.1 to 100 km)

**What you'll get back:**

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

The drivers are sorted by distance - closest first.

## How it works under the hood

When you make a request, here's what happens:

1. **Validation** - First, we check if your input makes sense (valid coordinates, reasonable radius, etc.)

2. **Check the cache** - We look if someone recently searched the same area. If yes, we return cached results instantly.

3. **User check** - We verify the user exists in our database.

4. **Smart filtering** - Instead of checking every driver in the database, we create a rough "bounding box" around your location. This narrows down the search area significantly.

5. **Database query** - We fetch only available drivers within that box.

6. **Precise calculation** - Now we calculate the exact distance to each driver using the Haversine formula (which accounts for Earth's curvature).

7. **Sort and filter** - We keep only drivers within your exact radius and sort them by distance.

8. **Cache it** - We save these results for 30 seconds, so if someone else searches nearby, they get instant results.

9. **Send response** - Finally, we format everything nicely and send it back to you.

The whole process typically takes less than 50ms thanks to database indexes and caching.

### Why this structure?

I broke the code into small, focused components because:

- Each file does one thing well
- It's easier to test individual pieces
- You can reuse components across features
- Changes don't ripple through the entire codebase
- New developers can understand what's happening quickly

For example, if you want to change how distances are calculated, you only touch one file. If you want to add a new database table, you add a new repository file. Simple as that.

## Performance tricks I used

**Caching** - Search results are cached for 30 seconds, user data for 5 minutes. This dramatically reduces database load.

**Database indexes** - Added indexes on driver availability and location fields. Queries are lightning fast even with thousands of drivers.

**Bounding box optimization** - Before calculating exact distances, we eliminate 90% of drivers using a simple rectangular filter. Much faster than checking everyone.

**Smart queries** - We only fetch the fields we actually need, not everything.

**Request tracking** - Every request gets an ID and we log how long it takes. If something is slow (>1 second), we get a warning.

## Database structure

Here's what the database looks like:

**Users table:**
- id, name, phone, timestamps

**Drivers table:**
- id, name, is_available (boolean), current_lat, current_lng, timestamps
- Indexes on: is_available, location fields

**Cars table:**
- id, driver_id, model, plate_number, timestamps

## Things to know

- The seed data puts drivers around Dhaka for testing
- Search results are cached for 30 seconds
- In-memory cache works fine for single-server deployments
- The Haversine formula is accurate enough for ride-hailing (error < 0.5%)
- The 5km radius is a good default for cities

## Project Timeline

**Total Time: ~8-10 hours**

Here's how I built this:

**Phase 1: Setup & Planning (1 hour)**
- Set up project structure
- Configured Prisma with PostgreSQL/Supabase
- Created database schema (Users, Drivers, Cars)
- Planned API architecture

**Phase 2: Core Development (4-5 hours)**
- Built ride request endpoint with distance calculations
- Implemented Haversine formula for accurate distances
- Added bounding box optimization for performance
- Set up validation middleware
- Created proper error handling

**Phase 3: Optimization & Features (2-3 hours)**
- Added in-memory caching system
- Implemented performance monitoring
- Database indexing for fast queries
- Refactored into modular components (repositories, helpers, transformers)
- Proper separation of concerns

**Phase 4: Testing & Polish (1-2 hours)**
- Created seed data with realistic driver locations
- Built Postman collection for easy testing
- Cleaned up code (removed comments, simplified logs)
- Wrote human-friendly README
- Final testing and bug fixes
---