import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")
    if (!city) return NextResponse.json({ success: false, error: "缺少城市参数" }, { status: 400 })
    
    const amapKey = process.env.AMAP_KEY
    if (!amapKey || amapKey === "your_amap_key_here") {
      return NextResponse.json({ success: true, data: [], message: "请先配置 AMAP_KEY 环境变量" })
    }
    
    const res = await fetch(
      `https://restapi.amap.com/v3/place/text?key=${amapKey}&keywords=${encodeURIComponent(city + "酒店")}&type=050000&city=${encodeURIComponent(city)}&pageSize=10&output=JSON`
    )
    const data = await res.json()
    
    if (data.status === "1" && data.pois) {
      return NextResponse.json({ success: true, data: data.pois })
    }
    return NextResponse.json({ success: false, error: "搜索失败" }, { status: 500 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}