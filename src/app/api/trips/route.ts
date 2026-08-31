import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

// 内存存储（兼容 Netlify/Cloudflare Pages）
import { tripData } from "./store"

function getNow() {
  return new Date().toISOString()
}

function generateHotels(city: string, roomType: string, budget: number, days: number, guests: number) {
  const priceMap: Record<string, number> = { "经济": 150, "舒适": 300, "品质": 500, "豪华": 800 }
  const basePrice = priceMap[roomType] || 300
  return [
    { name: city + "经济型酒店", price: Math.round(basePrice * 0.7), rating: 4.0, address: city + "市中心", source: "ctrip", sourceLabel: "携程", tag: "第一档·经济型", url: "https://www.ctrip.com/hotel/" + encodeURIComponent(city) },
    { name: city + "舒适型酒店", price: basePrice, rating: 4.3, address: city + "商业中心", source: "qunar", sourceLabel: "去哪儿", tag: "第二档·舒适型", url: "https://www.ctrip.com/hotel/" + encodeURIComponent(city) },
    { name: city + "豪华型酒店", price: Math.round(basePrice * 2), rating: 4.7, address: city + "景区附近", source: "ctrip", sourceLabel: "携程", tag: "第三档·豪华型", url: "https://www.ctrip.com/hotel/" + encodeURIComponent(city) },
  ]
}

function generateTransports(from: string, to: string, budget: number, days: number, startDate: string) {
  return [
    { method: "高铁", routeNumber: "G1234", departureTime: "08:00", arrivalTime: "12:00", duration: 240, price: Math.round(400 + Math.random() * 200), origin: from, destination: to, source: "12306", sourceLabel: "铁路12306", isSample: true, url: "https://kyfw.12306.cn" },
    { method: "飞机", routeNumber: "CA1234", departureTime: "09:00", arrivalTime: "11:00", duration: 120, price: Math.round(800 + Math.random() * 400), origin: from, destination: to, source: "ctrip", sourceLabel: "携程", isSample: true, url: "https://flight.ctrip.com" },
    { method: "大巴", routeNumber: "K123", departureTime: "10:00", arrivalTime: "18:00", duration: 480, price: Math.round(150 + Math.random() * 50), origin: from, destination: to, source: "qunar", sourceLabel: "去哪儿", isSample: true, url: "https://bus.qunar.com" },
  ]
}

function generateItineraryDays(city: string, days: number, preferences: string[], extraRequirements: string, startDate: string) {
  const attractionMap: Record<string, string[]> = {
    "文化": ["博物馆", "历史遗迹", "古城墙", "文化街"],
    "自然": ["国家森林公园", "风景区", "自然保护区", "地质公园"],
    "美食": ["特色街", "美食广场", "夜市", "老字号餐厅"],
    "购物": ["购物中心", "商业街", "本地市场"],
    "亲子": ["游乐园", "动物园", "科技馆", "儿童公园"],
    "摄影": ["地标建筑", "自然景观", "老街", "观景台"],
    "休闲": ["温泉SPA", "咖啡街", "湿地公园", "体育中心"],
  }
  const prefs = preferences.slice(0, 4)
  const result = []
  const times = ["上午", "午餐时间", "下午", "晚上"]
  for (let i = 1; i <= days; i++) {
    const activities = []
    for (let j = 0; j < Math.min(prefs.length, 3); j++) {
      const spots = attractionMap[prefs[j]] || ["景点"]
      activities.push({ name: spots[j % spots.length], duration: "2-3小时", timeSlot: times[j] })
    }
    if (extraRequirements) activities.push({ name: extraRequirements.substring(0, 15) + "...", duration: "1-2小时", timeSlot: "晚上" })
    const date = new Date(startDate)
    date.setDate(date.getDate() + i - 1)
    const dateStr = date.toISOString().split("T")[0]
    result.push({ dayIndex: i, title: "探索" + city + "第" + i + "天 - " + dateStr, activities: JSON.stringify(activities) })
  }
  return result
}

function generateXhsNotes(city: string, preferences: string[], days: number) {
  return [
    { title: city + "必去景点推荐", excerpt: "第一次来" + city + "一定要去这几个地方", author: "旅行达人", likes: Math.floor(Math.random() * 5000 + 500), sourceUrl: "https://www.xiaohongshu.com", tags: JSON.stringify(["#" + city, "#旅游攻略"]) },
    { title: city + "美食攻略", excerpt: "吃了" + city + "十几家餐厅，这家排第一", author: "吃货小", likes: Math.floor(Math.random() * 3000 + 300), sourceUrl: "https://www.xiaohongshu.com", tags: JSON.stringify(["#" + city, "#美食"]) },
    { title: city + "避坑指南", excerpt: "去了" + city + "总结的攻略", author: "背包客", likes: Math.floor(Math.random() * 8000 + 1000), sourceUrl: "https://www.xiaohongshu.com", tags: JSON.stringify(["#" + city, "#避坑"]) },
  ]
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { fromCity, toCity, startDate, days, adultCount, childCount, budget, preferences, roomType, extraRequirements } = data
    const now = getNow()
    const id = randomBytes(12).toString("hex")
    const hotels = generateHotels(toCity, roomType, budget, days, adultCount + childCount)
    const transports = generateTransports(fromCity, toCity, budget, days, startDate)
    const itineraryDays = generateItineraryDays(toCity, days, preferences, extraRequirements, startDate)
    const xhsNotes = generateXhsNotes(toCity, preferences, days)
    const trip = { id, fromCity, toCity, startDate, days, adultCount, childCount, budget, preferences: JSON.stringify(preferences), roomType, extraRequirements, status: "generated", createdAt: now, updatedAt: now }
    tripData.trips.push(trip as any)
    tripData.hotels.push(...hotels.map((h: any) => ({ ...h, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    tripData.transports.push(...transports.map((t: any) => ({ ...t, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    tripData.itineraryDays.push(...itineraryDays.map((i: any) => ({ ...i, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    tripData.xhsNotes.push(...xhsNotes.map((n: any) => ({ ...n, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    return NextResponse.json({ success: true, data: { trip, hotels, transports, itineraryDays, xhsNotes } })
  } catch (e: any) {
    console.error("ERROR:", e.message)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const trips = [...tripData.trips].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20)
    return NextResponse.json({ success: true, data: trips })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}


