'use client'
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

const CITY_IMAGES: Record<string, {nature: string; culture: string; food: string}> = {
  "三亚": {nature: "/图片/三亚/自然景点.jpg", culture: "/图片/三亚/人文景点.jpg", food: "/图片/三亚/美食.jpg"},
  "上海": {nature: "/图片/上海/自然景点.jpg", culture: "/图片/上海/人文景点.jpg", food: "/图片/上海/美食.jpg"},
  "丽江": {nature: "/图片/丽江/自然景点.jpg", culture: "/图片/丽江/人文景点.jpg", food: "/图片/丽江/美食.jpg"},
  "北京": {nature: "/图片/北京/自然景点.jpg", culture: "/图片/北京/人文景点.jpg", food: "/图片/北京/美食.jpg"},
  "南京": {nature: "/图片/南京/自然景点.jpg", culture: "/图片/南京/人文景点.jpg", food: "/图片/南京/美食.jpg"},
  "厦门": {nature: "/图片/厦门/自然景点.jpg", culture: "/图片/厦门/人文景点.jpg", food: "/图片/厦门/美食.jpg"},
  "大理": {nature: "/图片/大理/自然景点.jpg", culture: "/图片/大理/人文景点.jpg", food: "/图片/大理/美食.jpg"},
  "大连": {nature: "/图片/大连/自然景点.jpg", culture: "/图片/大连/人文景点.jpg", food: "/图片/大连/美食.jpg"},
  "广州": {nature: "/图片/广州/自然景点.jpg", culture: "/图片/广州/人文景点.jpg", food: "/图片/广州/美食.jpg"},
  "张家界": {nature: "/图片/张家界/自然景点.jpg", culture: "/图片/张家界/人文景点.jpg", food: "/图片/张家界/美食.jpg"},
  "成都": {nature: "/图片/成都/自然景点.jpg", culture: "/图片/成都/人文景点.jpg", food: "/图片/成都/美食.jpg"},
  "昆明": {nature: "/图片/昆明/自然景点.jpg", culture: "/图片/昆明/人文景点.jpg", food: "/图片/昆明/美食.jpg"},
  "杭州": {nature: "/图片/杭州/自然景点.jpg", culture: "/图片/杭州/人文景点.jpg", food: "/图片/杭州/美食.jpg"},
  "桂林": {nature: "/图片/桂林/自然景点.jpg", culture: "/图片/桂林/人文景点.jpg", food: "/图片/桂林/美食.jpg"},
  "武汉": {nature: "/图片/武汉/自然景点.jpg", culture: "/图片/武汉/人文景点.jpg", food: "/图片/武汉/美食.jpg"},
  "深圳": {nature: "/图片/深圳/自然景点.jpg", culture: "/图片/深圳/人文景点.jpg", food: "/图片/深圳/美食.jpg"},
  "苏州": {nature: "/图片/苏州/自然景点.jpg", culture: "/图片/苏州/人文景点.jpg", food: "/图片/苏州/美食.jpg"},
  "西安": {nature: "/图片/西安/自然景点.jpg", culture: "/图片/西安/人文景点.jpg", food: "/图片/西安/美食.jpg"},
  "重庆": {nature: "/图片/重庆/自然景点.jpg", culture: "/图片/重庆/人文景点.jpg", food: "/图片/重庆/美食.jpg"},
  "青岛": {nature: "/图片/青岛/自然景点.jpg", culture: "/图片/青岛/人文景点.jpg", food: "/图片/青岛/美食.jpg"},
  "黄山": {nature: "/图片/黄山/自然景点.jpg", culture: "/图片/黄山/人文景点.jpg", food: "/图片/黄山/美食.jpg"},
}

interface HotelOption {
  id: string
  name: string
  price: number
  price1?: number
  price2?: number
  rating?: number
  address?: string
  source: string
  sourceLabel: string
  url?: string
  tag?: string
  isSample?: boolean
}

interface Trip {
  id: string
  toCity: string
  startDate: string
  days: number
  adultCount: number
  childCount: number
  hotels: HotelOption[]
}

export default function HotelPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("selectedHotel_" + params.id)
    if (stored) setSelectedHotel(stored)
  }, [params.id])

  useEffect(() => {
    fetch("/api/trips/" + params.id)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setTrip(data.data)
        else router.push("/travel")
      })
      .catch(() => router.push("/travel"))
      .finally(() => setLoading(false))
  }, [params.id, router])

  if (loading) return (
    <div className="min-h-screen bg-mostar-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🏨</div>
        <p className="text-mostar-stone text-lg font-display">正在加载酒店推荐...</p>
      </div>
    </div>
  )
  if (!trip) return null

  const handleBooking = (platform: string, city: string) => {
    const url = `https://www.ctrip.com/hotel/${encodeURIComponent(city)}`
    window.open(url, "_blank")
  }
  const handleSelect = (id: string) => {
    setSelectedHotel(id)
    localStorage.setItem("selectedHotel_" + params.id, id)
  }

  const getPriceRange = (hotel: HotelOption) => {
    const price1 = hotel.price1 || hotel.price
    const price2 = hotel.price2 || hotel.price
    if (price1 === price2) return `¥${price1}/晚`
    return `¥${price1}-${price2}/晚`
  }

  return (
    <div className="min-h-screen bg-mostar-cream">
      
      {/* Hero Image */}
      <div 
        className="relative h-[400px] md:h-[500px] bg-cover bg-center relative"
        style={{backgroundImage: `url('/图片/${trip?.toCity || "三亚"}/自然景点.jpg')`}}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white drop-shadow-lg">
            旅行目的地
          </h1>
        </div>
      </div>

      <nav className="nav-cinematic">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mostar-sky to-mostar-water flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">途</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-cinematic">旅途智选</h1>
          </div>
          <Link href={`/travel/result/${params.id}`} className="text-mostar-dark hover:text-mostar-sky font-medium transition-colors">
            ← 返回概览
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-16 px-6">
        <div className="mb-12 animate-cinematic-fade">
          <div className="img-with-real-photo img-placeholder-lg mb-8" style={{backgroundImage: `url('/图片/${trip.toCity}/人文景点.jpg')`, backgroundSize: `cover`, backgroundPosition: `center`}}>            <div className="text-center"><p className="text-white font-display text-3xl font-bold drop-shadow-lg">{trip.toCity}</p></div>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-display font-bold text-cinematic mb-4">酒店推荐</h2>
            <p className="text-mostar-stone text-lg">
              {trip.toCity} · {trip.days}天{trip.days > 1 ? trip.days - 1 : 0}晚
              {trip.adultCount > 0 && <span className="ml-2 text-sm text-gray-400">{trip.adultCount}成人{trip.childCount > 0 ? `+${trip.childCount}儿童` : ''}</span>}
            </p>
          </div>
        </div>

        <div className="space-y-8 mb-12">
          {trip.hotels.map((hotel) => {
            const isSelected = selectedHotel === hotel.id
            return (
              <div
                key={hotel.id}
                className={`cinematic-card p-10 transition-all duration-500 ${isSelected ? 'border-mostar-warm ring-2 ring-mostar-warm' : 'hover:border-mostar-warm/50'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mostar-warm to-mostar-stone flex items-center justify-center shadow-cinematic">
                        <span className="text-3xl">🏨</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-display font-bold text-mostar-dark">{hotel.name}</h3>
                          {hotel.tag && (
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              hotel.tag.includes("第一档") ? "bg-green-100 text-green-700" :
                              hotel.tag.includes("第二档") ? "bg-blue-100 text-blue-700" :
                              "bg-purple-100 text-purple-700"
                            }`}>{hotel.tag}</span>
                          )}
                        </div>
                        <p className="text-mostar-stone mt-1">📍 {hotel.address}</p>
                        <div className="flex gap-2 mt-2">
                          {hotel.rating && (
                            <span className="text-xs text-orange-500">⭐ {hotel.rating}</span>
                          )}
                          <span className="text-xs text-gray-400">来源：{hotel.sourceLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-8">
                    <p className="text-sm text-mostar-stone mb-2">价格</p>
                    <p className="text-4xl font-display font-bold text-mostar-warm mb-4">{getPriceRange(hotel)}</p>
                    <p className="text-xs text-gray-400 mb-4">起/晚 (总价¥{(hotel.price||hotel.price1||0)*(trip.days-1)})</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBooking(hotel.sourceLabel, trip.toCity) }}
                      className="btn-cinematic mb-3 w-full"
                    >
                      预订
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelect(hotel.id) }}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        isSelected ? 'bg-green-500 text-white' : 'bg-mostar-cream text-mostar-dark hover:bg-mostar-sand'
                      }`}
                    >
                      {isSelected ? '✓ 已选择' : '选择'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center animate-cinematic-slide">
          <Link
            href={`/travel/result/${params.id}`}
            className="btn-cinematic inline-block px-12 py-4 text-lg"
          >
            我已完成选择
          </Link>
        </div>
      
         {/* Image Gallery */}
         <div className="mt-12 grid grid-cols-3 gap-4">
           <div className="img-with-real-photo rounded-2xl h-40" style={{backgroundImage: `url('/图片/${trip?.toCity || "三亚"}/自然景点.jpg')`}}></div>
           <div className="img-with-real-photo rounded-2xl h-40" style={{backgroundImage: `url('/图片/${trip?.toCity || "三亚"}/人文景点.jpg')`}}></div>
           <div className="img-with-real-photo rounded-2xl h-40" style={{backgroundImage: `url('/图片/${trip?.toCity || "三亚"}/美食.jpg')`}}></div>
         </div>
       
      {/* Top Cities */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">热门城市</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="img-with-real-photo rounded-2xl h-40" style={{backgroundImage: `url('/图片/${trip?.toCity || "三亚"}/自然景点.jpg')`}}></div>
          <div className="img-with-real-photo rounded-2xl h-40" style={{backgroundImage: `url('/图片/厦门/自然景点.jpg')`}}></div>
          <div className="img-with-real-photo rounded-2xl h-40" style={{backgroundImage: `url('/图片/大理/自然景点.jpg')`}}></div>
        </div>
      </div>
</main>
    </div>
  )
}
// refreshed
