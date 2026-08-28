import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_FILE = join(process.cwd(), "data", "trips.json")

function load() {
  if (!existsSync(DATA_FILE)) return { trips: [], hotels: [], transports: [], itineraryDays: [], xhsNotes: [] }
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"))
  } catch {
    return { trips: [], hotels: [], transports: [], itineraryDays: [], xhsNotes: [] }
  }
}

function save(data: any) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const d = load()
    const trip = d.trips.find((t: any) => t.id === params.id)
    if (!trip) return NextResponse.json({ success: false, error: "行程不存在" }, { status: 404 })
    const hotels = d.hotels.filter((h: any) => h.tripId === params.id)
    const transports = d.transports.filter((t: any) => t.tripId === params.id)
    const itineraryDays = d.itineraryDays.filter((i: any) => i.tripId === params.id)
    const xhsNotes = d.xhsNotes.filter((n: any) => n.tripId === params.id)
    return NextResponse.json({ success: true, data: { ...trip, hotels, transports, itineraryDays, xhsNotes } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}