import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const d = load()
    const bookmark = d.bookmarks.find((b: any) => b.id === id)
    
    if (!bookmark) {
      return NextResponse.json({ success: false, error: "Bookmark not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: bookmark })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
