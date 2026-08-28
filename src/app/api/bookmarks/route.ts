import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_FILE = join(process.cwd(), "data", "bookmarks.json")

function load() {
  if (!existsSync(DATA_FILE)) return { bookmarks: [] }
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"))
  } catch {
    return { bookmarks: [] }
  }
}

function save(data: any) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
}

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
    
    const d = load()
    d.bookmarks.push(bookmark)
    save(d)
    
    return NextResponse.json({ success: true, data: bookmark })
  } catch (e: any) {
    console.error("保存书签失败:", e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const d = load()
    const bookmarks = [...d.bookmarks].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt))
    return NextResponse.json({ success: true, data: bookmarks })
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
    
    const d = load()
    d.bookmarks = d.bookmarks.filter((b: any) => b.id !== id)
    save(d)
    
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}