"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Activity {
  timeSlot: string
  name: string
  duration: string
  ticketPrice: number
  commuteFrom: string
  commuteTime: string
  address: string
  miniProgram?: string
  bookingTime?: string
}

interface Meal {
  type: string
  restaurant: string
  cost: number
  recommendation: string
  location: string
}

interface DayPlan {
  dayIndex: number
  date: string
  title: string
  activities: Activity[]
  meals: Meal[]
  commuteInfo: Array<{from: string; to: string; method: string; duration: string}>
  transportCost: number
  totalCost: number
}

interface ItineraryData {
  dayPlans: DayPlan[]
  totalCost?: number
  tips?: string[]
}

export default function BookmarkViewPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [totalCost, setTotalCost] = useState(0)
  const [tips, setTips] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/bookmarks/" + params.id)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const bookmark = data.data
          const dayPlansFromApi: DayPlan[] = Array.isArray(bookmark.itineraryData) ? bookmark.itineraryData : (bookmark.itineraryData?.dayPlans || [])
          
          setTrip({
            id: bookmark.id,
            toCity: bookmark.toCity,
            days: bookmark.days,
            budget: bookmark.budget,
            adultCount: bookmark.adultCount,
            childCount: bookmark.childCount,
            roomType: bookmark.roomType || "舒适",
            fromCity: bookmark.fromCity || "出发地",
            startDate: bookmark.startDate
          })
          
          if (dayPlansFromApi && dayPlansFromApi.length > 0) {
            setDayPlans(dayPlansFromApi)
            // Calculate activity cost from dayPlans
            // Calculate total cost from dayPlans
            const tTotal = dayPlansFromApi.reduce((s: number, d: any) => s + (Number(d.totalCost) || 0), 0)
            setTotalCost(tTotal)
          }
          
          if (bookmark.tips) {
            setTips(bookmark.tips || [])
          }
        } else {
          router.push("/bookmarks")
        }
      })
      .catch(() => router.push("/bookmarks"))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-mostar-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">★</div>
        <p className="text-mostar-stone font-display">正在加载行程...</p>
      </div>
    </div>
  )

  if (!trip) return null

  return (
    <div className="min-h-screen bg-mostar-cream">
      <nav className="bg-white/80 backdrop-blur-md border-b border-mostar-sand/30 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-mostar-water">旅途智选</h1>
          <Link href="/bookmarks" className="text-mostar-stone hover:text-mostar-water text-sm">← 返回书签</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* 旅行规划标题 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-mostar-dark">旅行规划</h2>
          <p className="text-mostar-stone mt-1">{trip.toCity} · {trip.days}天详细行程 · 已保存</p>
        </div>

        {/* 每日行程卡片 */}
        <div className="space-y-4 mb-8">
          {dayPlans.map((day) => (
            <DayCard
              key={day.dayIndex}
              day={day}
              expanded={expandedDay === day.dayIndex}
              onToggle={() => setExpandedDay(expandedDay === day.dayIndex ? null : day.dayIndex)}
            />
          ))}
        </div>

        {/* 总费用 */}
        <div className="cinematic-card shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-mostar-stone text-lg">旅行总费用</span>
            <span className="text-3xl font-bold text-mostar-water">¥{totalCost}</span>
          </div>
          <p className="text-xs text-mostar-stone/60 mt-2">含交通、住宿、景点门票及餐饮</p>
        </div>

        {/* 注意事项 */}
        <div className="bg-mostar-warm/10 rounded-xl p-6 mb-6">
          <h4 className="font-medium text-mostar-stone mb-3">⚠️ 出行注意事项</h4>
          <ul className="text-sm text-mostar-stone/80 space-y-2 list-disc list-inside">
            <li>以上行程基于实时景点数据生成，请以景区实际开放情况为准</li>
            <li>门票价格可能随季节调整，建议提前在官方渠道预订</li>
            <li>建议携带身份证、充电宝、常用药品等物品</li>
            <li>关注目的地天气预报，合理安排出行时间</li>
          </ul>
        </div>

        {/* 底部提示 */}
        <div className="text-center py-4">
          <p className="text-sm text-mostar-stone/60">📖 您正在查看已保存的行程规划</p>
        </div>
      </main>
    </div>
  )
}

function DayCard({ day, expanded, onToggle }: { day: DayPlan; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="cinematic-card shadow-md overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-mostar-sand/20 transition text-left">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-mostar-water text-white flex items-center justify-center text-sm font-bold">{day.dayIndex}</span>
          <div>
            <h3 className="font-bold text-mostar-dark">{day.title}</h3>
            <p className="text-sm text-mostar-stone">{day.date}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-mostar-water font-bold">¥{day.totalCost}</span>
          <span className="text-mostar-stone/60 ml-2">{expanded ? "▼" : "▶"}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-mostar-sand/20">
          {/* 景点列表 */}
          <div className="py-3">
            <h4 className="font-medium text-mostar-dark mb-3">📍 游玩景点</h4>
            {day.activities.length > 0 ? day.activities.map((act: any, i: number) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-mostar-sand/20 last:border-0">
                <span className="text-mostar-water font-bold w-6">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-mostar-dark">{act.name}</span>
                    <span className="text-mostar-warm font-bold">
                      {act.ticketPrice > 0 ? `¥${act.ticketPrice}` : "免费"}
                    </span>
                  </div>
                  <p className="text-sm text-mostar-stone">{act.timeSlot} · {act.duration}</p>
                  {act.miniProgram && (
                    <p className="text-xs text-green-600 mt-1">小程序：{act.miniProgram} · 预约时间：{act.bookingTime}</p>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-sm text-mostar-stone/60 italic">自由安排</p>
            )}
          </div>

          {/* 美食推荐 */}
          {day.meals.length > 0 && (
            <div className="py-3 border-t border-mostar-sand/20">
              <h4 className="font-medium text-mostar-dark mb-3">🍽️ 美食推荐</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {day.meals.map((meal: any, i: number) => (
                  <div key={i} className="bg-mostar-cream/50 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-mostar-stone uppercase">{meal.type}</span>
                      <span className="text-mostar-warm font-bold text-sm">¥{meal.cost}/人</span>
                    </div>
                    <p className="font-medium text-mostar-dark text-sm">{meal.restaurant}</p>
                    <p className="text-xs text-mostar-stone mt-1">{meal.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 交通信息 */}
          <div className="py-3 border-t border-mostar-sand/20">
            <h4 className="font-medium text-mostar-dark mb-2">🚗 交通信息</h4>
            <p className="text-sm text-mostar-stone">当日交通费用约 ¥{day.transportCost}</p>
          </div>
        </div>
      )}
    </div>
  )
}
