-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "budget" REAL NOT NULL,
    "adultCount" INTEGER NOT NULL DEFAULT 1,
    "childCount" INTEGER NOT NULL DEFAULT 0,
    "preferences" TEXT NOT NULL,
    "roomType" TEXT NOT NULL DEFAULT 'comfort',
    "extraRequirements" TEXT,
    "status" TEXT NOT NULL DEFAULT 'generated',
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HotelRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "rating" REAL,
    "address" TEXT,
    "source" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "url" TEXT,
    "tag" TEXT,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "HotelRecommendation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransportRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "url" TEXT,
    "details" TEXT,
    "routeNumber" TEXT,
    "departureTime" TEXT,
    "arrivalTime" TEXT,
    "score" REAL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isSample" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "TransportRecommendation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "meals" TEXT,
    "totalCost" REAL,
    "commuteInfo" TEXT,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "ItineraryDay_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "XhsNoteSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "XhsNoteSummary_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "HotelRecommendation_tripId_idx" ON "HotelRecommendation"("tripId");

-- CreateIndex
CREATE INDEX "TransportRecommendation_tripId_idx" ON "TransportRecommendation"("tripId");

-- CreateIndex
CREATE INDEX "ItineraryDay_tripId_idx" ON "ItineraryDay"("tripId");

-- CreateIndex
CREATE INDEX "ItineraryDay_dayIndex_idx" ON "ItineraryDay"("dayIndex");

-- CreateIndex
CREATE INDEX "XhsNoteSummary_tripId_idx" ON "XhsNoteSummary"("tripId");
