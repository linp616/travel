import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const TRIPS_FILE = join(process.cwd(), "data", "trips.json")

function loadTrips(): any {
  if (!existsSync(TRIPS_FILE)) return { trips: [], hotels: [], transports: [], itineraryDays: [], xhsNotes: [] }
  try { return JSON.parse(readFileSync(TRIPS_FILE, "utf8")) } catch { return { trips: [], hotels: [], transports: [], itineraryDays: [], xhsNotes: [] } }
}

let tripData: any = loadTrips()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const trip = tripData.trips.find((t: any) => t.id === params.id)
    if (!trip) return NextResponse.json({ success: false, error: "行程不存在" }, { status: 404 })
    const hotels = tripData.hotels.filter((h: any) => h.tripId === params.id)
    const transports = tripData.transports.filter((t: any) => t.tripId === params.id)
    const itineraryDays = tripData.itineraryDays.filter((i: any) => i.tripId === params.id)
    const xhsNotes = tripData.xhsNotes.filter((n: any) => n.tripId === params.id)
    return NextResponse.json({ success: true, data: { ...trip, hotels, transports, itineraryDays, xhsNotes } })
  } catch (e: any) {
    console.error("ERROR:", e.message)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}