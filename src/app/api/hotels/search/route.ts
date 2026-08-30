import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"

function getNow() {
  return new Date().toISOString().replace(/T/, " ").replace(/\\.\\d{3}Z/, "")
}

const REAL_HOTELS: Record<string, any[]> = require("./cities-hotels.json")
const DEFAULT_HOTELS = ["{city}国际大酒店", "{city}皇冠假日酒店", "{city}万豪酒店"]

export async function POST(req: Request) {
  try {
    const { city, budget, days, tripId, guests = 1 } = await req.json()
    if (!city) return NextResponse.json({ success: false, error: "Missing city" }, { status: 400 })
    const hotels = (REAL_HOTELS[city] || []).map((h: any) => ({ ...h, price: h.price1 }))
    if (tripId) {
      await prisma.hotelRecommendation.deleteMany({ where: { tripId: tripId } } as any)
      for (const h of hotels) {
        await prisma.hotelRecommendation.create({ data: { id: randomBytes(12).toString("hex"), tripId, name: h.name, price: h.price, rating: h.rating, address: h.address, source: h.source, sourceLabel: h.sourceLabel, url: h.url, tag: h.tag, createdAt: getNow() } })
      }
    }
    return NextResponse.json({ success: true, data: hotels })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}