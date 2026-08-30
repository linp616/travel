'use client'
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface TransportOption {
  id: string
  type: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  company: string
  seatType?: string
  source: string
  sourceLabel: string
}

interface Trip {
  id: string
  fromCity: string
  toCity: string
  startDate: string
  days: number
  adultCount: number
  childCount: number
}

const CITY_IMAGES: Record<string, string> = {
  "三亚": "/图片/三亚/自然景点.jpg",
  "上海": "/图片/上海/自然景点.jpg",
  "丽江": "/图片/丽江/自然景点.jpg",
  "北京": "/图片/北京/自然景点.jpg",
  "南京": "/图片/南京/自然景点.jpg",
  "厦门": "/图片/厦门/自然景点.jpg",
  "大理": "/图片/大理/自然景点.jpg",
  "大连": "/图片/大连/自然景点.jpg",
  "广州": "/图片/广州/自然景点.jpg",
  "张家界": "/图片/张家界/自然景点.jpg",
  "成都": "/图片/成都/自然景点.jpg",
  "昆明": "/图片/昆明/自然景点.jpg",
  "杭州": "/图片/杭州/自然景点.jpg",
  "桂林": "/图片/桂林/自然景点.jpg",
  "武汉": "/图片/武汉/自然景点.jpg",
  "深圳": "/图片/深圳/自然景点.jpg",
  "苏州": "/图片/苏州/自然景点.jpg",
  "西安": "/图片/西安/自然景点.jpg",
  "重庆": "/图片/重庆/自然景点.jpg",
  "青岛": "/图片/青岛/自然景点.jpg",
  "黄山": "/图片/黄山/自然景点.jpg",
}

export default function TransportPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("selectedTransport_" + params.id)
    if (stored) setSelectedTransport(stored)
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

  const handleSelect = (id: string) => {
    setSelectedTransport(id)
    localStorage.setItem("selectedTransport_" + params.id, id)
  }

  if (loading) return (
    <div className="min-h-screen bg-mostar-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🚗</div>
        <p className="text-mostar-stone text-lg font-display">正在加载交通方案...</p>
      </div>
    </div>
  )

  if (!trip) return null

  const transportData: TransportOption[] = [
    { id: "1", type: "飞机", from: trip.fromCity + "机场", to: trip.toCity + "机场", departureTime: "08:00", arrivalTime: "10:30", duration: "2h30m", price: 800, company: "国航", seatType: "经济舱", source: "携程", sourceLabel: "携程" },
    { id: "2", type: "飞机", from: trip.fromCity + "机场", to: trip.toCity + "机场", departureTime: "14:00", arrivalTime: "16:30", duration: "2h30m", price: 650, company: "南航", seatType: "经济舱", source: "携程", sourceLabel: "携程" },
    { id: "3", type: "高铁", from: trip.fromCity + "站", to: trip.toCity + "站", departureTime: "09:00", arrivalTime: "12:00", duration: "3h", price: 350, company: "高铁G字头", seatType: "二等座", source: "12306", sourceLabel: "12306" },
    { id: "4", type: "高铁", from: trip.fromCity + "站", to: trip.toCity + "站", departureTime: "15:00", arrivalTime: "18:30", duration: "3h30m", price: 350, company: "高铁G字头", seatType: "二等座", source: "12306", sourceLabel: "12306" },
  ]

  const totalPeople = trip.adultCount + (trip.childCount > 0 ? trip.childCount : 0)

  return (
    <div className="min-h-screen bg-mostar-cream">
      <nav className="nav-cinematic">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mostar-sky to-mostar-water flex items-center justify-center">
              <span className="text-white font-bold text-lg">途</span>
            </div>
            <h1 className="text-xl font-display font-bold text-cinematic">旅途智选</h1>
          </div>
          <Link href={`/travel/result/${params.id}`} className="text-mostar-dark hover:text-mostar-sky font-medium transition-colors text-sm">
            ← 返回概览
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-16 px-6">
        <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-cinematic">
          <div className="absolute inset-0" style={{ backgroundImage: `url('/图片/${trip.toCity}/自然景点.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-white/80 text-sm mb-2 font-medium">大交通方案</p>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white">
              {trip.fromCity} <span className="text-mostar-sky">→</span> {trip.toCity}
            </h1>
            <p className="text-white/70 mt-2">{trip.startDate} 出发 · {trip.days}天行程</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-mostar-dark mb-6">交通方案</h2>
          <div className="space-y-6">
            {transportData.map((t) => {
              const isSelected = selectedTransport === t.id
              return (
                <div
                  key={t.id}
                  className={`cinematic-card p-8 transition-all duration-500 ${isSelected ? "border-mostar-warm ring-2 ring-mostar-warm" : "hover:border-mostar-warm/50"}`}
                  onClick={() => handleSelect(t.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-water-100 flex items-center justify-center">
                          <span className="text-2xl">{t.type === "飞机" ? "✈️" : "🚄"}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-bold text-mostar-dark">{t.company} · {t.type}</h3>
                          <p className="text-mostar-stone text-sm mt-1">{t.from} → {t.to}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>🕐 {t.departureTime} - {t.arrivalTime}</span>
                            <span>⏱ {t.duration}</span>
                            {t.seatType && <span>💺 {t.seatType}</span>}
                          </div>
                          <span className="text-xs text-gray-400 mt-1 inline-block">来源：{t.sourceLabel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-8">
                      <p className="text-sm text-mostar-stone mb-2">人均价格</p>
                      <p className="text-3xl font-display font-bold text-mostar-warm mb-4">¥{t.price}</p>
                      <p className="text-xs text-gray-400 mb-4">共计 ¥{t.price * totalPeople}</p>
                      <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${isSelected ? "bg-green-500 text-white" : "bg-mostar-cream text-mostar-dark hover:bg-mostar-sand"}`}>
                        {isSelected ? "✓ 已选择" : "选择"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedTransport && (
          <div className="cinematic-card p-8 mb-12 animate-cinematic-slide">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-mostar-stone">大交通总费用</p>
                <p className="text-3xl font-display font-bold text-mostar-warm mt-1">                  ¥{((transportData.find(t => t.id === selectedTransport) || {} as any).price || 0) * totalPeople || 0}                </p>
              </div>
              <Link href={`/travel/result/${params.id}/hotel`} className="btn-cinematic px-10 py-4 text-lg">
                下一步：酒店选择 →
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="img-with-real-photo rounded-2xl h-40" style={{ backgroundImage: `url('/图片/${trip.toCity}/自然景点.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
          <div className="img-with-real-photo rounded-2xl h-40" style={{ backgroundImage: `url('/图片/${trip.toCity}/人文景点.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
          <div className="img-with-real-photo rounded-2xl h-40" style={{ backgroundImage: `url('/图片/${trip.toCity}/美食.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
        </div>
      </main>
    </div>
  )
}
