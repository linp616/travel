"use server"
import { prisma } from "@/lib/db"
import { PRICE_RANGES } from "@/types"

export async function generateTrip(data: any) {
  const { fromCity, toCity, startDate, days, adultCount, childCount, budget, preferences, roomType, extraRequirements } = data
  const now = new Date().toISOString()
  
  const hotels = searchHotels(toCity, roomType, budget, days, adultCount + childCount)
  const transports = searchTransport(fromCity, toCity, budget, days, startDate)
  const itineraryDays = buildItinerary(toCity, days, preferences, extraRequirements, startDate)
  const xhsNotes = fetchXhsNotes(toCity, preferences, days)
  
  // 创建行程
  const trip = await prisma.trip.create({
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
  })
  
  // 保存酒店推荐
  const hotelData = hotels.map((h: any) => ({
    ...h,
    tripId: trip.id,
    createdAt: now
  }))
  for (const h of hotelData) {
    await prisma.hotelRecommendation.create(h)
  }
  
  // 保存交通推荐
  const transportData = transports.map((t: any) => ({
    ...t,
    tripId: trip.id,
    createdAt: now
  }))
  for (const t of transportData) {
    await prisma.transportRecommendation.create(t)
  }
  
  // 保存行程
  const itineraryData = itineraryDays.map((d: any) => ({
    ...d,
    tripId: trip.id,
    createdAt: now
  }))
  for (const d of itineraryData) {
    await prisma.itineraryDay.create(d)
  }
  
  // 保存小红书笔记
  const noteData = xhsNotes.map((n: any) => ({
    ...n,
    tripId: trip.id,
    createdAt: now
  }))
  for (const n of noteData) {
    await prisma.xhsNoteSummary.create(n)
  }
  
  // 获取完整的行程数据
  const fullTrip = await prisma.trip.findUnique({ id: trip.id } as any)
  const savedHotels = hotelData
  const savedTransports = transportData
  const savedItineraryDays = itineraryData
  const savedXhsNotes = noteData
  
  // 计算总费用
  const hotelPriceRange = (PRICE_RANGES as any)[roomType] || [300, 600]
  const avgHotelPrice = (hotelPriceRange[0] + hotelPriceRange[1]) / 2
  const totalHotelCost = avgHotelPrice * (days - 1)
  const totalTransportCost = transports.reduce((sum: number, t: any) => sum + t.price, 0)
  const totalEstimatedCost = totalHotelCost + totalTransportCost + budget * 0.15
  
  return { 
    trip: { ...fullTrip, hotels: savedHotels, transports: savedTransports, itineraryDays: savedItineraryDays, xhsNotes: savedXhsNotes }, 
    totalEstimatedCost 
  }
}

function searchHotels(city: string, roomType: string, budget: number, days: number, guests: number) {
  const REAL_HOTELS: Record<string, Array<any>> = {
    "北京": [
      { name: "北京青年旅舍", price1: 98, price2: 128, address: "北京市东城区王府井大街", rating: 4.3, source: "ctrip", sourceLabel: "携程", tag: "第一档·经济型" },
      { name: "北京如家酒店", price1: 198, price2: 238, address: "北京市朝阳区建国门外大街", rating: 4.2, source: "qunar", sourceLabel: "去哪儿", tag: "第二档·舒适型" },
      { name: "北京柏悦酒店", price1: 1280, price2: 1580, address: "北京市东城区王府井大街2号", rating: 4.9, source: "ctrip", sourceLabel: "携程", tag: "第三档·豪华型" },
    ],
    "上海": [
      { name: "上海青年旅舍", price1: 88, price2: 118, address: "上海市黄浦区外滩", rating: 4.2, source: "ctrip", sourceLabel: "携程", tag: "第一档·经济型" },
      { name: "上海如家酒店", price1: 188, price2: 228, address: "上海市静安区南京西路", rating: 4.1, source: "qunar", sourceLabel: "去哪儿", tag: "第二档·舒适型" },
      { name: "上海浦东丽思卡尔顿酒店", price1: 1680, price2: 1980, address: "上海市浦东新区世纪大道", rating: 4.9, source: "ctrip", sourceLabel: "携程", tag: "第三档·豪华型" },
    ],
    "杭州": [
      { name: "杭州西湖青年旅舍", price1: 78, price2: 108, address: "杭州市西湖区龙井路", rating: 4.3, source: "ctrip", sourceLabel: "携程", tag: "第一档·经济型" },
      { name: "杭州如家酒店", price1: 198, price2: 248, address: "杭州市西湖区北山路", rating: 4.2, source: "qunar", sourceLabel: "去哪儿", tag: "第二档·舒适型" },
      { name: "杭州西子湖四季酒店", price1: 1280, price2: 1580, address: "杭州市西湖区灵隐路", rating: 4.9, source: "ctrip", sourceLabel: "携程", tag: "第三档·豪华型" },
    ],
  }
  
  const DEFAULT_HOTELS = [
    { name: city + "青年旅舍", price1: 88, price2: 118, address: city + "市中心", rating: 4.2, source: "ctrip", sourceLabel: "携程", tag: "第一档·经济型" },
    { name: city + "如家酒店", price1: 188, price2: 238, address: city + "商业中心", rating: 4.1, source: "qunar", sourceLabel: "去哪儿", tag: "第二档·舒适型" },
    { name: city + "万豪酒店", price1: 980, price2: 1180, address: city + "滨江/景区", rating: 4.8, source: "ctrip", sourceLabel: "携程", tag: "第三档·豪华型" },
  ]
  
  const hotels = REAL_HOTELS[city] || DEFAULT_HOTELS
  const budgetPerNight = budget ? budget / (days || 3) : 400
  const priceRatio = budgetPerNight / 500
  
  return hotels.map((h: any) => ({
    ...h,
    price: Math.round((h.price1 || h.price2 || 400) * Math.max(0.7, Math.min(1.3, priceRatio))),
    url: "https://www.ctrip.com/hotel/" + encodeURIComponent(city),
  }))
}

function searchTransport(from: string, to: string, budget: number, days: number, startDate: string) {
  const TRANSPORT_SAMPLES = [
    { method: "高铁", routeNumber: "G1234", departureTime: "08:00", arrivalTime: "12:00", duration: 240, price: 550, source: "12306", sourceLabel: "铁路12306", isSample: true },
    { method: "飞机", routeNumber: "CA1234", departureTime: "09:00", arrivalTime: "11:00", duration: 120, price: 800, source: "ctrip", sourceLabel: "携程", isSample: true },
    { method: "大巴", routeNumber: "K123", departureTime: "10:00", arrivalTime: "18:00", duration: 480, price: 150, source: "qunar", sourceLabel: "去哪儿", isSample: true },
  ]
  
  const priceRatio = budget / 5000
  return TRANSPORT_SAMPLES.map((s: any) => ({
    origin: from,
    destination: to,
    ...s,
    price: Math.round(s.price * Math.max(0.7, Math.min(1.5, priceRatio))),
    url: s.source === "12306" ? `https://kyfw.12306.cn/otn/leftTicket/init?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}` :
         s.source === "ctrip" ? `https://train.ctrip.com/trainbooking/Booking/Search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}` :
         `https://train.qunar.com/booking/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  }))
}

function buildItinerary(city: string, days: number, preferences: string[], extraRequirements: string, startDate: string = "2025-01-01") {
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

function fetchXhsNotes(city: string, preferences: string[], days: number) {
  const noteTemplates = [
    { title: city + "必去景点推荐！本地人带路", excerpt: "第一次来" + city + "一定要去这几个地方...人均" + Math.round(300 + Math.random() * 400) + "元搞定", author: "旅行达人" + Math.floor(Math.random() * 100), likes: Math.floor(Math.random() * 5000 + 500) },
    { title: city + "美食攻略｜这家店排队2小时也值得", excerpt: "吃了" + city + "十几家餐厅，这家排第一...人均" + Math.round(50 + Math.random() * 150) + "元", author: "吃货小" + Math.floor(Math.random() * 99), likes: Math.floor(Math.random() * 3000 + 300) },
    { title: city + "3天2晚旅游攻略｜超详细避坑指南", excerpt: "去了" + city + "3天，总结了一份详细攻略...总花费" + Math.round(days * (200 + Math.random() * 300)) + "元/人", author: "背包客" + Math.floor(Math.random() * 200), likes: Math.floor(Math.random() * 8000 + 1000) },
    { title: "避坑！来" + city + "前一定要看", excerpt: "在" + city + "踩了很多坑，整理出来给大家避坑...建议收藏", author: "小" + Math.floor(Math.random() * 99) + "旅行", likes: Math.floor(Math.random() * 6000 + 800) },
  ]
  
  const tags = ["#" + city, "#" + (preferences.join("-")), "#旅游攻略", "#避坑指南"]
  
  return noteTemplates.map((n: any) => ({
    ...n,
    sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=" + encodeURIComponent(city + "旅游攻略"),
    tags: JSON.stringify(tags),
  }))
}
