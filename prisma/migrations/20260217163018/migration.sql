-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "current_lat" DOUBLE PRECISION NOT NULL,
    "current_lng" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "drivers_is_available_idx" ON "drivers"("is_available");

-- CreateIndex
CREATE INDEX "drivers_current_lat_current_lng_idx" ON "drivers"("current_lat", "current_lng");

-- CreateIndex
CREATE UNIQUE INDEX "cars_driver_id_key" ON "cars"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "cars_plate_number_key" ON "cars"("plate_number");

-- CreateIndex
CREATE INDEX "cars_driver_id_idx" ON "cars"("driver_id");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
