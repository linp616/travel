"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Activity { timeSlot: string; name: string; duration: string; ticketPrice: number; commuteFrom: string; commuteTime: string; address: string; miniProgram?: string; bookingTime?: string }
interface Attraction { name: string; location: string; ticketPrice: number | null; rating: number; category: string }
interface DayPlan { dayIndex: number; date: string; title: string; activities: Activity[]; attractions?: Attraction[]; meals: Meal[]; transportCost: number; totalCost: number }
interface Meal { type: string; restaurant: string; cost: number; recommendation: string }

export default function BookmarkViewPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  useEffect(() => {
    fetch(" /api/bookmarks/" + params.id).then(r => r.json()).then(data => {
      if (data.success && data.data) {
        const d = data.data.itineraryData || {}
        setTrip({ id: data.data.tripId, toCity: data.data.toCity, days: data.data.days, budget: data.data.budget, adultCount: data.data.adultCount, childCount: data.data.childCount, roomType: data.data.roomType || "舒适", fromCity: data.data.fromCity || "出发地", transports: data.data.transports || [], hotels: data.data.hotels || [] })
        if (d.dayPlans && d.dayPlans.length > 0) {
          setDayPlans(d.dayPlans)
        } else {
          
        }
      } else router.push(" /bookmarks")
    }).catch(() => router.push(" /bookmarks")).finally(() => setLoading(false))
  }, [params.id])
  if (loading) return <div className="min-h-screen bg-mostar-cream flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-4">★⭐</div><p className="text-mostar-stone">正在加载行程...</p></div></div>
  if (!trip) return null
  const transportCost = (trip.transports || []).reduce((s: any, t: any) => s + (Number(t.price) || 0), 0)
  const hotelCost = (trip.hotels || []).length > 0 ? (Number(trip.hotels[0].price) || 300) * trip.days * Math.max(1, Math.ceil((trip.adultCount || 1) / 2)) : 300 * trip.days * Math.max(1, Math.ceil((trip.adultCount || 1) / 2))
  const activityCost = dayPlans.reduce((s: any, d: any) => s + (Number(d.totalCost) || 0), 0)
  const totalCost = transportCost + hotelCost + activityCost
  return (
    <div className="min-h-screen bg-mostar-cream">
      <nav className="bg-white/80 backdrop-blur-md border-b border-mostar-sand/30 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-mostar-water">旅途智选</h1>
          <Link href="/bookmarks" className="text-mostar-stone hover:text-mostar-water text-sm">← 返回书签</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-mostar-dark mb-2">旅行规划</h2>
        <p className="text-mostar-stone mb-6">{trip.toCity} · {trip.days}天详细行程 · 已保存</p>
        {dayPlans.length > 0 && <div className="space-y-4">
          {dayPlans.map((day) => <DayCard key={day.dayIndex} day={day} expanded={expandedDay === day.dayIndex} onToggle={() => setExpandedDay(expandedDay === day.dayIndex ? null : day.dayIndex)} />)}
          <div className="cinematic-card shadow-md p-6 mt-6">
            <h3 className="font-bold text-mostar-dark mb-4">💰 费用明细</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-mostar-sand/20"><span className="text-mostar-stone">🚄 大交通往返</span><span className="font-bold text-mostar-dark">¥{transportCost}</span></div>
              <div className="flex justify-between items-center py-2 border-b border-mostar-sand/20"><span className="text-mostar-stone">🏨 酒店住宿</span><span className="font-bold text-mostar-dark">¥{hotelCost}</span></div>
              <div className="flex justify-between items-center py-2 border-b border-mostar-sand/20"><span className="text-mostar-stone">🎯 行程活动</span><span className="font-bold text-mostar-dark">¥{activityCost}</span></div>
              <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-mostar-water/30"><span className="font-bold text-mostar-dark text-lg">总费用</span><span className="text-2xl font-bold text-mostar-water">¥{totalCost}</span></div>
            </div>
            <p className="text-xs text-mostar-stone/60 mt-3">* 大交通={trip.fromCity}→{trip.toCity} · 酒店按{trip.roomType||"舒适"}型估算</p>
          </div>
          <div className="bg-mostar-warm/10 rounded-xl p-6 mt-4">
            <h4 className="font-medium text-mostar-stone mb-3">⚠️ 出行注意事项</h4>
            <ul className="text-sm text-mostar-stone/80 space-y-2 list-disc list-inside">
              <li>以上行程基于实时景点数据生成，请以景区实际开放情况为准</li>
              <li>门票价格可能随季节调整，建议提前在官方渠道预订</li>
              <li>建议携带身份证、充电宝、常用药品等物品</li>
              <li>关注目的地天气预报，合理安排出行时间</li>
            </ul>
          </div>
        </div>}
        {dayPlans.length > 0 && <div className="mt-8 text-center"><p className="text-sm text-mostar-stone/60">📖 您正在查看已保存的行程规划</p></div>}
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
          <div><h3 className="font-bold text-mostar-dark">{day.title}</h3><p className="text-sm text-mostar-stone">{day.date}</p></div>
        </div>
        <div className="text-right"><span className="text-mostar-water font-bold">¥{day.totalCost}</span><span className="text-mostar-stone/60 ml-2">{expanded} ? "▼" : "▶"</span></div>
      </button>
      {expanded && <div className="px-4 pb-4 border-t border-mostar-sand/20">
        <div className="py-3"><h4 className="font-medium text-mostar-dark mb-3">📍 游玩景点</h4>
          {(day.activities || day.attractions || []).length > 0 ? (day.activities || day.attractions).map((attr: any, i: number) => <div key={i} className="flex items-start gap-3 py-2 border-b border-mostar-sand/20 last:border-0"><span className="text-mostar-water font-bold w-6">{i + 1}</span><div className="flex-1"><div className="flex justify-between"><span className="font-medium text-mostar-dark">{attr.name}</span><span className="text-mostar-warm font-bold">{attr.ticketPrice} !== null ? "¥"+ : "票价信息暂缺"</span></div><p className="text-sm text-mostar-stone">{attr.category} · {attr.location}</p></div></div>) : <p className="text-sm text-mostar-stone/60 italic">暂未找到该地景点</p>}
        </div>
        <div className="py-3 border-t border-mostar-sand/20"><h4 className="font-medium text-mostar-dark mb-3">🍽️ 美食推荐</h4>
          {day.meals.map((meal, i) => <div key={i} className="flex items-start gap-3 py-2"><span className="text-mostar-stone/60 w-16">{meal.type}</span><div className="flex-1"><span className="font-medium text-mostar-dark">{meal.restaurant}</span><span className="text-sm text-mostar-stone ml-2">{meal.recommendation}</span><span className="text-sm text-mostar-warm ml-2">¥{meal.cost}/人</span></div></div>)}
        </div>
        <div className="py-3 border-t border-mostar-sand/20"><h4 className="font-medium text-mostar-dark mb-2">🚗 交通信息</h4><p className="text-sm text-mostar-stone">景点间交通费用约 ¥{day.transportCost}</p></div>
      </div>}
    </div>
  )
}