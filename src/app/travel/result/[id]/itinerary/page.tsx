"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

// API Key 占位符 - 请替换为实际密钥
const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || "your_amap_key_here"
const PANHE_KEY = process.env.NEXT_PUBLIC_PANHE_KEY || "your_panhe_key_here"

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

interface Attraction {
  name: string
  location: string
  ticketPrice: number | null
  rating: number
  category: string
}

interface DayPlan {
  dayIndex: number
  date: string
  title: string
  activities: Activity[]
  attractions?: Attraction[]
  meals: Meal[]
  transportCost: number
  totalCost: number
}

interface Meal {
  type: string
  restaurant: string
  cost: number
  recommendation: string
}

export default function ItineraryPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [error, setError] = useState<string>("")
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/trips/" + params.id)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setTrip(data.data)
        else router.push("/travel")
      })
      .catch(() => router.push("/travel"))
      .finally(() => setLoading(false))
  }, [params.id])

  const fetchAttractions = async (city: string) => {
    try {
      // 调用后端 API 获取景点信息
      const res = await fetch("/api/attractions/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, key: AMAP_KEY })
      })
      const data = await res.json()
      return data.attractions || []
    } catch (e) {
      console.error("获取景点失败:", e)
      return []
    }
  }

  const generateItinerary = async () => {
    if (!trip) return
    setGenerating(true)
    setError("")
    try {
      const res = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          toCity: trip.toCity,
          days: trip.days,
          budget: trip.budget,
          adultCount: trip.adultCount,
          childCount: trip.childCount,
          startDate: trip.startDate
        })
      })
      const data = await res.json()
      if (data.success) {
        setDayPlans(data.data.dayPlans)
      } else {
        setError(data.error || "生成失败")
      }
    } catch (e) {
      setError("生成行程时出错: " + (e as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  const handleRegenerate = () => {
    setDayPlans([])
    generateItinerary()
  }
  const handleSave = async () => {
    if (!trip) return
    setSaving(true)
    try {
      const calcTotal = dayPlans.reduce((s: number, d: any) => s + (Number(d.totalCost) || 0), 0)
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          title: trip.toCity + " " + trip.days + "日游",
          toCity: trip.toCity,
          days: trip.days,
          budget: trip.budget,
          adultCount: trip.adultCount,
          childCount: trip.childCount,
          startDate: trip.startDate,
          itineraryData: dayPlans,
          totalCost: calcTotal
        })
      })
      const data = await res.json()
      if (data.success) {
        setSaveSuccess(true)
        setShowSaveModal(true)
        setTimeout(() => { setSaveSuccess(false); setShowSaveModal(false) }, 10000)
      } else {
        console.error("保存失败", data.error)
      }
    } catch (e) {
      console.error("保存失败", e)
    } finally {
      setSaving(false)
    }
  }


  if (loading) return (
    <div className="min-h-screen bg-mostar-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-mostar-stone">正在加载行程...</p>
      </div>
    </div>
  )
  if (!trip) return null

  return (
    <div className="min-h-screen bg-mostar-cream">
      <nav className="bg-white/80 backdrop-blur-md border-b border-mostar-sand/30 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-mostar-water">旅途智选</h1>
          <Link href={`/travel/result/${params.id}`} className="text-mostar-stone hover:text-mostar-water text-sm">← 返回概览</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-mostar-dark mb-2">旅行规划</h2>
        <p className="text-mostar-stone mb-6">{trip.toCity} · {trip.days}天详细行程</p>

        {/* 生成按钮 */}
        <div className="text-center mb-8">
          {!dayPlans.length ? (
            <button
              onClick={generateItinerary}
              disabled={generating}
              className="btn-cinematic px-8 py-3"
            >
              {generating ? "⏳ 生成中..." : "✨ 生成旅行攻略"}
            </button>
          ) : null}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* 行程列表 */}
        {dayPlans.length > 0 && (
          <div className="space-y-4">
            {dayPlans.map((day) => (
              <DayCard
                key={day.dayIndex}
                day={day}
                expanded={expandedDay === day.dayIndex}
                onToggle={() => setExpandedDay(expandedDay === day.dayIndex ? null : day.dayIndex)}
              />
            ))}

            {/* 费用汇总 */}
            <div className="cinematic-card shadow-md p-6 mt-6">
              <h3 className="font-bold text-mostar-dark mb-4">💰 费用明细</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-mostar-sand/20">
                  <span className="text-mostar-stone">🚄 大交通往返</span>
                  <span className="font-bold text-mostar-dark">¥{((trip.transports || []).reduce((s: any, t: any) => s + (Number(t.price) || 0), 0))}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-mostar-sand/20">
                  <span className="text-mostar-stone">🏨 酒店住宿</span>
                  <span className="font-bold text-mostar-dark">¥{((trip.hotels || []).length > 0 ? (Number(trip.hotels[0].price) || 300) * trip.days * Math.max(1, Math.ceil((trip.adultCount || 1) / 2)) : 300 * trip.days * Math.max(1, Math.ceil((trip.adultCount || 1) / 2)))}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-mostar-sand/20">
                  <span className="text-mostar-stone">🎯 行程活动（门票+餐饮+当地交通）</span>
                  <span className="font-bold text-mostar-dark">¥{dayPlans.reduce((s: any, d: any) => s + (Number(d.totalCost) || 0), 0)}</span>
                </div>
                <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-mostar-water/30">
                  <span className="font-bold text-mostar-dark text-lg">总费用</span>
                  <span className="text-2xl font-bold text-mostar-water">¥{((trip.transports || []).reduce((s: any, t: any) => s + (Number(t.price) || 0), 0)) + ((trip.hotels || []).length > 0 ? (Number(trip.hotels[0].price) || 300) * trip.days * Math.max(1, Math.ceil((trip.adultCount || 1) / 2)) : 300 * trip.days * Math.max(1, Math.ceil((trip.adultCount || 1) / 2))) + dayPlans.reduce((s: any, d: any) => s + (Number(d.totalCost) || 0), 0)}</span>
                </div>
              </div>
              <p className="text-xs text-mostar-stone/60 mt-3">* 大交通={trip.fromCity}→{trip.toCity} · 酒店按{trip.roomType || '舒适'}型估算 · 活动费=景点门票+餐饮+当地交通</p>
            </div>

            {/* 注意事项 */}
            <div className="bg-mostar-warm/10 rounded-xl p-6 mt-4">
              <h4 className="font-medium text-mostar-stone mb-3">⚠️ 出行注意事项</h4>
              <ul className="text-sm text-mostar-stone/80 space-y-2 list-disc list-inside">
                <li>以上行程基于实时景点数据生成，请以景区实际开放情况为准</li>
                <li>门票价格可能随季节调整，建议提前在官方渠道预订</li>
                <li>建议携带身份证、充电宝、常用药品等物品</li>
                <li>关注目的地天气预报，合理安排出行时间</li>
              </ul>
            </div>
          </div>
        )}

        {/* 底部操作按钮 */}
        {dayPlans.length > 0 && (
          <div className="flex flex-col items-center gap-3 mt-8 pb-8">
            <div className="flex gap-4 w-full max-w-md">
              <button
                onClick={handleRegenerate}
                className="btn-cinematic flex-1 px-4 py-3 text-base rounded-lg"
              >
                🔄 重新生成行程
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-cinematic flex-1 px-4 py-3 text-base rounded-lg"
              >
                {saveSuccess ? "✓ 已保存" : "💾 保存行程"}
              </button>
            </div>
            <p className="text-sm text-mostar-stone">对行程不满意？点击按钮为小主重新生成</p>
          </div>
        )}

        {/* 保存成功弹框 */}
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSaveModal(false)}></div>
            <div className="bg-white rounded-2xl p-10 max-w-sm w-full mx-4 shadow-2xl relative z-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-display font-bold text-mostar-dark mb-2">行程已保存</h3>
              <p className="text-mostar-stone text-sm mb-8">您的旅行规划已保存至书签页</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowSaveModal(false)} className="px-8 py-3 bg-white border-2 border-mostar-stone/30 text-mostar-dark font-medium hover:bg-mostar-sand transition-all rounded-lg flex-1 text-center">继续浏览</button>
                <button onClick={() => { setShowSaveModal(false); window.location.href = "/bookmarks" }} className="px-8 py-3 bg-mostar-water text-white font-medium hover:bg-mostar-water/90 transition-all rounded-lg flex-1 text-center">去书签页</button>
              </div>
            </div>
          </div>
        )}
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
            {(day.activities || day.attractions || []).length > 0 ? (day.activities || day.attractions).map((attr: any, i: number) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-mostar-sand/20 last:border-0">
                <span className="text-mostar-water font-bold w-6">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-mostar-dark">{attr.name}</span>
                    <span className="text-mostar-warm font-bold">
                      {attr.ticketPrice !== null ? `¥${attr.ticketPrice}` : "票价信息暂缺"}
                    </span>
                  </div>
                  <p className="text-sm text-mostar-stone">{attr.category} · {attr.location}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-mostar-stone/60 italic">暂未找到该地景点</p>
            )}
          </div>

          {/* 美食推荐 */}
          <div className="py-3 border-t border-mostar-sand/20">
            <h4 className="font-medium text-mostar-dark mb-3">🍽️ 美食推荐</h4>
            {day.meals.map((meal, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <span className="text-mostar-stone/60 w-16">{meal.type}</span>
                <div className="flex-1">
                  <span className="font-medium text-mostar-dark">{meal.restaurant}</span>
                  <span className="text-sm text-mostar-stone ml-2">{meal.recommendation}</span>
                  <span className="text-sm text-mostar-warm ml-2">¥{meal.cost}/人</span>
                </div>
              </div>
            ))}
          </div>

          {/* 交通信息 */}
          <div className="py-3 border-t border-mostar-sand/20">
            <h4 className="font-medium text-mostar-dark mb-2">🚗 交通信息</h4>
            <p className="text-sm text-mostar-stone">景点间交通费用约 ¥{day.transportCost}</p>
          </div>
        </div>
      )}
    </div>
  )
}