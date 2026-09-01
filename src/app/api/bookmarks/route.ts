import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { bookmarks } from "./store"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { tripId, title, toCity, days, budget, adultCount, childCount, startDate, itineraryData } = data
    
    if (!tripId || !toCity) {
      return NextResponse.json({ success: false, error: "缺少必要参数" }, { status: 400 })
    }

    const now = new Date().toISOString()
    const bookmark = {
      id: randomBytes(12).toString("hex"),
      tripId,
      title: title || toCity + " " + days + "日游",
      toCity,
      days,
      budget,
      adultCount,
      childCount,
      startDate,
      itineraryData,
      createdAt: now,
      updatedAt: now
    }
    
    bookmarks.push(bookmark)
    return NextResponse.json({ success: true, data: bookmark })
  } catch (e: any) {
    console.error("保存书签失败:", e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    
    if (id) {
      const bookmark = bookmarks.find((b: any) => b.id === id)
      if (!bookmark) return NextResponse.json({ success: false, error: "Bookmark not found" }, { status: 404 })
      return NextResponse.json({ success: true, data: bookmark })
    }
    
    const sorted = [...bookmarks].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt))
    return NextResponse.json({ success: true, data: sorted })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ success: false, error: "缺少ID参数" }, { status: 400 })
    }
    
    const idx = bookmarks.findIndex((b: any) => b.id === id)
    if (idx !== -1) {
      bookmarks.splice(idx, 1)
    }
    
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}