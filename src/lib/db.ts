import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import { randomBytes } from "crypto"

const DATA_FILE = join(process.cwd(), "data", "trips.json")

export interface TripData {
  trips: Trip[]
  hotels: HotelRecommendation[]
  transports: TransportRecommendation[]
  itineraryDays: ItineraryDay[]
  xhsNotes: XhsNoteSummary[]
}

export interface Trip {
  id: string
  fromCity: string
  toCity: string
  startDate: string
  days: number
  budget: number
  adultCount: number
  childCount: number
  preferences: string
  roomType: string
  extraRequirements: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface HotelRecommendation {
  id: string
  tripId: string
  name: string
  price: number
  rating?: number
  address?: string
  source: string
  sourceLabel: string
  url?: string
  tag?: string
  createdAt: string
}

export interface TransportRecommendation {
  id: string
  tripId: string
  origin: string
  destination: string
  method: string
  price: number
  duration: number
  source: string
  sourceLabel: string
  url?: string
  details?: string
  routeNumber?: string
  departureTime?: string
  arrivalTime?: string
  isRecommended?: boolean
  isSample?: boolean
  createdAt: string
}

export interface ItineraryDay {
  id: string
  tripId: string
  dayIndex: number
  title: string
  activities: string
  meals?: string
  totalCost?: number
  commuteInfo?: string
  createdAt: string
}

export interface XhsNoteSummary {
  id: string
  tripId: string
  title: string
  excerpt: string
  author: string
  likes: number
  sourceUrl: string
  tags: string
  createdAt: string
}

function load(): TripData {
  if (!existsSync(DATA_FILE)) {
    return { trips: [], hotels: [], transports: [], itineraryDays: [], xhsNotes: [] }
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"))
  } catch {
    return { trips: [], hotels: [], transports: [], itineraryDays: [], xhsNotes: [] }
  }
}

function save(data: TripData) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
}

export const fileDb = {
  trip: {
    create: (data: Partial<Trip>) => {
      const d = load()
      const trip: Trip = {
        id: randomBytes(12).toString("hex"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "generated",
        adultCount: 1,
        childCount: 0,
        budget: 0,
        days: 1,
        fromCity: "",
        toCity: "",
        startDate: "",
        preferences: "[]",
        roomType: "鑸掗€?,
        extraRequirements: "",
        ...data
      }
      d.trips.push(trip)
      save(d)
      return trip
    },
    findUnique: (where: { id: string }) => {
      const d = load()
      return d.trips.find((t) => t.id === where.id) || null
    },
    findMany: (opts?: { orderBy?: { createdAt: "asc" | "desc" }; take?: number }) => {
      const d = load()
      let list = [...d.trips]
      if (opts?.orderBy?.createdAt) {
        list.sort((a, b) => 
          opts.orderBy.createdAt === "desc" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)
        )
      }
      if (opts?.take) list = list.slice(0, opts.take)
      return list
    }
  },
  hotelRecommendation: {
    create: (data: Partial<HotelRecommendation>) => {
      const d = load()
      const hotel: HotelRecommendation = {
        id: randomBytes(12).toString("hex"),
        tripId: "",
        name: "",
        price: 0,
        source: "",
        sourceLabel: "",
        createdAt: new Date().toISOString(),
        ...data
      }
      d.hotels.push(hotel)
      save(d)
      return hotel
    },
    deleteMany: (where: { tripId: string }) => {
      const d = load()
      d.hotels = d.hotels.filter((h: any) => h.tripId !== where.tripId)
      save(d)
    }
  },
  transportRecommendation: {
    create: (data: Partial<TransportRecommendation>) => {
      const d = load()
      const transport: TransportRecommendation = {
        id: randomBytes(12).toString("hex"),
        tripId: "",
        origin: "",
        destination: "",
        method: "",
        price: 0,
        duration: 0,
        source: "",
        sourceLabel: "",
        createdAt: new Date().toISOString(),
        ...data
      }
      d.transports.push(transport)
      save(d)
      return transport
    },
    deleteMany: (where: { tripId: string }) => {
      const d = load()
      d.transports = d.transports.filter((t: any) => t.tripId !== where.tripId)
      save(d)
    }
  },
  itineraryDay: {
    create: (data: Partial<ItineraryDay>) => {
      const d = load()
      const itinerary: ItineraryDay = {
        id: randomBytes(12).toString("hex"),
        tripId: "",
        dayIndex: 1,
        title: "",
        activities: "[]",
        createdAt: new Date().toISOString(),
        ...data
      }
      d.itineraryDays.push(itinerary)
      save(d)
      return itinerary
    },
    deleteMany: (where: { tripId: string }) => {
      const d = load()
      d.itineraryDays = d.itineraryDays.filter((i: any) => i.tripId !== where.tripId)
      save(d)
    },
    findMany: (where: { tripId: string }, opts?: { orderBy?: { dayIndex: "asc" | "desc" } }) => {
      const d = load()
      let list = d.itineraryDays.filter((i: any) => i.tripId === where.tripId)
      if (opts?.orderBy?.dayIndex) {
        list.sort((a, b) => opts.orderBy.dayIndex === "desc" ? b.dayIndex - a.dayIndex : a.dayIndex - b.dayIndex)
      }
      return list
    }
  },
  xhsNoteSummary: {
    create: (data: Partial<XhsNoteSummary>) => {
      const d = load()
      const note: XhsNoteSummary = {
        id: randomBytes(12).toString("hex"),
        tripId: "",
        title: "",
        excerpt: "",
        author: "",
        likes: 0,
        sourceUrl: "",
        tags: "[]",
        createdAt: new Date().toISOString(),
        ...data
      }
      d.xhsNotes.push(note)
      save(d)
      return note
    },
    deleteMany: (where: { tripId: string }) => {
      const d = load()
      d.xhsNotes = d.xhsNotes.filter((n: any) => n.tripId !== where.tripId)
      save(d)
    }
  }
}

// 瀵煎嚭涓€涓?prisma 鍏煎鐨勫璞?export const prisma = {
  trip: fileDb.trip,
  hotelRecommendation: fileDb.hotelRecommendation,
  transportRecommendation: fileDb.transportRecommendation,
  itineraryDay: fileDb.itineraryDay,
  xhsNoteSummary: fileDb.xhsNoteSummary
}

export default prisma