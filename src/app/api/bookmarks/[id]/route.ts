import { NextResponse } from "next/server"
import { bookmarks } from "../store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bookmark = bookmarks.find((b: any) => b.id === id)
    
    if (!bookmark) {
      return NextResponse.json({ success: false, error: "Bookmark not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: bookmark })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}