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

function getNow() {
  return new Date().toISOString()
}

function generateHotels(city: string, roomType: string, budget: number, days: number, guests: number) {
  const hotelDbPath = join(process.cwd(), '酒店数据', '城市酒店数据.json')
  let hotelDb: Record<string, any[]> = {}
  if (existsSync(hotelDbPath)) {
    try {
      let dbContent = readFileSync(hotelDbPath, 'utf8')
      if (dbContent.charCodeAt(0) === 0xFEFF) dbContent = dbContent.slice(1)
      hotelDb = JSON.parse(dbContent)
    } catch {}
  }
  const cityHotels = hotelDb[city] || []
  if (cityHotels.length === 0) {
    return [
      { name: city + '经济型酒店', price: 150, rating: 4.0, address: city + '市中心', source: 'ctrip', sourceLabel: '携程', tag: '第一档·经济型(<200元)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) },
      { name: city + '舒适型酒店', price: 300, rating: 4.3, address: city + '商业中心', source: 'qunar', sourceLabel: '去哪儿', tag: '第二档·舒适型(200-400元)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) },
      { name: city + '豪华型酒店', price: 800, rating: 4.7, address: city + '景区附近', source: 'ctrip', sourceLabel: '携程', tag: '第三档·豪华型(400元+)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) },
    ]
  }
  const economyHotels = cityHotels.filter((h: any) => h.price < 200).sort((a: any, b: any) => a.price - b.price)
  const comfortHotels = cityHotels.filter((h: any) => h.price >= 200 && h.price < 400).sort((a: any, b: any) => a.price - b.price)
  const luxuryHotels = cityHotels.filter((h: any) => h.price >= 400).sort((a: any, b: any) => b.price - a.price)
  const selectHotel = (arr: any[]) => arr.length > 0 ? arr[0] : null
  const result: any[] = []
  const h1 = selectHotel(economyHotels)
  const h2 = selectHotel(comfortHotels)
  const h3 = selectHotel(luxuryHotels)
  if (h1) result.push({ ...h1, tag: '第一档·经济型(<200元)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) })
  if (h2) result.push({ ...h2, tag: '第二档·舒适型(200-400元)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) })
  if (h3) result.push({ ...h3, tag: '第三档·豪华型(400元+)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) })
  while (result.length < 3) {
    const idx = result.length
    if (idx === 0) result.push({ name: city + '经济型酒店', price: 150, rating: 4.0, address: city + '市中心', source: 'ctrip', sourceLabel: '携程', tag: '第一档·经济型(<200元)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) })
    else if (idx === 1) result.push({ name: city + '舒适型酒店', price: 300, rating: 4.3, address: city + '商业中心', source: 'qunar', sourceLabel: '去哪儿', tag: '第二档·舒适型(200-400元)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) })
    else result.push({ name: city + '豪华型酒店', price: 800, rating: 4.7, address: city + '景区附近', source: 'ctrip', sourceLabel: '携程', tag: '第三档·豪华型(400元+)', url: 'https://www.ctrip.com/hotel/' + encodeURIComponent(city) })
  }
  return result.slice(0, 3)
}
function generateTransports(from: string, to: string, budget: number, days: number, startDate: string) {
  const dbPath = join(process.cwd(), "data", "transportDB.json")
  let transportDB: Record<string, any[]> = {}
  if (existsSync(dbPath)) {
    try { transportDB = JSON.parse(readFileSync(dbPath, "utf8")) } catch {}
  }
  const key1 = from + "-" + to
  const key2 = to + "-" + from
  const routeData = transportDB[key1] || transportDB[key2]
  if (routeData && routeData.length > 0) {
    const priceRatio = Math.max(0.7, Math.min(1.5, budget / 5000))
    return routeData.slice(0, 3).map((t: any) => ({
      ...t,
      origin: from,
      destination: to,
      price: Math.round(t.price * priceRatio),
      url: t.source === "12306" ? "https://kyfw.12306.cn/otn/leftTicket/init?from=" + encodeURIComponent(from) + "&" + "to=" + encodeURIComponent(to) : t.source === "ctrip" ? "https://train.ctrip.com/trainbooking/Booking/Search?from=" + encodeURIComponent(from) + "&" + "to=" + encodeURIComponent(to) : "https://train.qunar.com/booking/search?from=" + encodeURIComponent(from) + "&" + "to=" + encodeURIComponent(to),
      isSample: false,
    }))
  }
  const methods = [
    { method: "高铁", price: Math.round(400 + Math.random() * 300), duration: Math.round(180 + Math.random() * 300) },
    { method: "飞机", price: Math.round(800 + Math.random() * 600), duration: Math.round(100 + Math.random() * 100) },
    { method: "大巴", price: Math.round(150 + Math.random() * 100), duration: Math.round(400 + Math.random() * 200) },
  ]
  return methods.map((m: any, i: number) => ({
    ...m,
    routeNumber: i === 0 ? "G" + Math.floor(Math.random() * 9000 + 1000) : i === 1 ? "CA" + Math.floor(Math.random() * 9000 + 1000) : "长途专线",
    departureTime: ["07:00", "09:00", "08:00"][i],
    arrivalTime: (() => { const dur = m.duration; const h = 7 + Math.floor(dur/60); const mm = dur % 60; return h.toString().padStart(2,"0") + "\\:" + mm.toString().padStart(2,"0"); })(),
    origin: from,
    destination: to,
    price: Math.round(m.price * Math.max(0.7, Math.min(1.5, budget / 5000))),
    source: i === 0 ? "12306" : i === 1 ? "ctrip" : "qunar",
    sourceLabel: i === 0 ? "铁路12306" : i === 1 ? "携程" : "去哪儿",
    isSample: true,
    url: i === 0 ? "https://kyfw.12306.cn/otn/leftTicket/init?from=" + encodeURIComponent(from) + "&" + "to=" + encodeURIComponent(to) : i === 1 ? "https://train.ctrip.com/trainbooking/Booking/Search?from=" + encodeURIComponent(from) + "&" + "to=" + encodeURIComponent(to) : "https://train.qunar.com/booking/search?from=" + encodeURIComponent(from) + "&" + "to=" + encodeURIComponent(to),
  }))
}function generateItineraryDays(city: string, days: number, preferences: string[], extraRequirements: string, startDate: string) {
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
    
    result.push({
      dayIndex: i,
      title: `探索${city}第${i}天 - ${dateStr}`,
      activities: JSON.stringify(activities)
    })
  }
  return result
}

function generateXhsNotes(city: string, preferences: string[], days: number) {
  const noteTemplates = [
    { title: city + "必去景点推荐！本地人带路", excerpt: "第一次来" + city + "一定要去这几个地方...人均" + Math.round(300 + Math.random() * 400) + "元搞定", author: "旅行达人" + Math.floor(Math.random() * 100), likes: Math.floor(Math.random() * 5000 + 500) },
    { title: city + "美食攻略｜这家店排队2小时也值得", excerpt: "吃了" + city + "十几家餐厅，这家排第一...人均" + Math.round(50 + Math.random() * 150) + "元", author: "吃货小" + Math.floor(Math.random() * 99), likes: Math.floor(Math.random() * 3000 + 300) },
    { title: city + "3天2晚旅游攻略｜超详细避坑指南", excerpt: "去了" + city + "3天，总结了一份详细攻略...总花费" + Math.round(days * (200 + Math.random() * 300)) + "元/人", author: "背包客" + Math.floor(Math.random() * 200), likes: Math.floor(Math.random() * 8000 + 1000) },
  ]
  
  const tags = ["#" + city, "#" + (preferences.join("-")), "#旅游攻略", "#避坑指南"]
  
  return noteTemplates.map((n: any) => ({
    ...n,
    sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=" + encodeURIComponent(city + "旅游攻略"),
    tags: JSON.stringify(tags),
  }))
}

function calculateTotalCost(hotels: any[], transports: any[], budget: number) {
  const avgHotelPrice = hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length
  const totalHotelCost = avgHotelPrice * 2 // 假设2晚
  const totalTransportCost = transports.reduce((sum, t) => sum + t.price, 0)
  return totalHotelCost + totalTransportCost + budget * 0.15
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
    
    const trip = {
      id,
      fromCity,
      toCity,
      startDate,
      days,
      adultCount,
      childCount,
      budget,
      preferences: JSON.stringify(preferences),
      roomType,
      extraRequirements,
      status: "generated",
      createdAt: now,
      updatedAt: now
    }
    
    const d = load()
    d.trips.push(trip)
    d.hotels.push(...hotels.map((h: any) => ({ ...h, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    d.transports.push(...transports.map((t: any) => ({ ...t, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    d.itineraryDays.push(...itineraryDays.map((i: any) => ({ ...i, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    d.xhsNotes.push(...xhsNotes.map((n: any) => ({ ...n, tripId: id, id: randomBytes(12).toString("hex"), createdAt: now })))
    save(d)
    
    const totalEstimatedCost = calculateTotalCost(hotels, transports, budget)
    
    return NextResponse.json({ success: true, data: { trip, hotels, transports, itineraryDays, xhsNotes, totalEstimatedCost } })
  } catch (e: any) {
    console.error("POST /api/trips ERROR:", e.message)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const d = load()
    const trips = [...d.trips].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20)
    return NextResponse.json({ success: true, data: trips })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

