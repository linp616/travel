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

interface Trip {
  id: string
  toCity: string
  days: number
  budget: number
  adultCount: number
  childCount: number
  startDate: string
}

export default function ItineraryPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [error, setError] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [totalCost, setTotalCost] = useState(0)
  const [tips, setTips] = useState<string[]>([])

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
        setTotalCost(data.data.totalCost || 0)
        setTips(data.data.tips || [])
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
    setSaveSuccess(false)
    generateItinerary()
  }

  const handleSave = async () => {
    if (!trip) return
    setSaving(true)
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          title: trip.toCity + " " + trip.days + "日游",
          itineraryDays: dayPlans,
          totalCost: totalCost
        })
      })
      const data = await res.json()
      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
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
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <p className="text-mostar-stone font-display">正在加载行程...</p>
      </div>
    </div>
  )
  if (!trip) return null

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
        <div className="mb-12 animate-cinematic-fade">
          <h2 className="text-4xl font-display font-bold text-cinematic mb-3">
            {trip.toCity} <span className="text-mostar-sky">·</span> {trip.days}天详细行程
          </h2>
          <p className="text-mostar-stone text-lg">根据您的偏好精心策划的每一刻</p>
        </div>

        {/* 按钮区域 - 始终在同一行，统一样式 */}
        <div className="flex justify-center items-center gap-6 mb-12">
          {!dayPlans.length ? (
            <button
              onClick={generateItinerary}
              disabled={generating}
              className="btn-cinematic px-8 py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  <span className="text-xl mr-2">✨</span>
                  生成旅行攻略
                </>
              )}
            </button>
          ) : (
            <>
              <p className="text-sm text-mostar-stone">对行程不满意？点击下方按钮为小主重新生成</p>
              <button
                onClick={handleRegenerate}
                className="btn-cinematic px-6 py-3 text-base"
              >
                🔄 重新生成行程
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-cinematic px-6 py-3 text-base"
              >
                {saveSuccess ? "✓ 已保存" : "💾 保存行程"}
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="text-center mb-8 p-4 bg-red-50 rounded-2xl border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 行程列表 */}
        {dayPlans.length > 0 && (
          <div className="space-y-6">
            {dayPlans.map((day) => (
              <DayCard
                key={day.dayIndex}
                day={day}
                expanded={expandedDay === day.dayIndex}
                onToggle={() => setExpandedDay(expandedDay === day.dayIndex ? null : day.dayIndex)}
              />
            ))}
            
            {/* 总计与注意事项 */}
            <div className="cinematic-card p-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-mostar-sky/10 to-mostar-water/10 rounded-2xl p-6">
                  <p className="text-sm text-mostar-stone mb-2 uppercase tracking-wider">行程总费用</p>
                  <p className="text-3xl font-bold text-mostar-sky">¥{totalCost}</p>
                  <p className="text-sm text-mostar-stone mt-2">含景点门票 + 餐饮 + 市内交通</p>
                </div>
                <div className="bg-gradient-to-br from-mostar-warm/10 to-mostar-stone/10 rounded-2xl p-6">
                  <p className="text-sm text-mostar-stone mb-2 uppercase tracking-wider">出行预算</p>
                  <p className="text-3xl font-bold text-mostar-warm">¥{trip.budget}</p>
                  <p className="text-sm text-mostar-stone mt-2">剩余预算: ¥{trip.budget - totalCost}</p>
                </div>
              </div>
              
              {tips.length > 0 && (
                <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    ⚠️ 出行注意事项
                  </h4>
                  <ul className="space-y-2">
                    {tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-yellow-700">
                        <span>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
function DayCard({ day, expanded, onToggle }: { day: DayPlan; expanded: boolean; onToggle: () => void }) {
  const morningActivities = day.activities.filter((a: Activity) => a.timeSlot.includes("上午") || a.timeSlot.includes("早上"))
  const noonActivities = day.activities.filter((a: Activity) => a.timeSlot.includes("中午") || a.timeSlot.includes("午后"))
  const afternoonActivities = day.activities.filter((a: Activity) => a.timeSlot.includes("下午"))
  const eveningActivities = day.activities.filter((a: Activity) => a.timeSlot.includes("晚间") || a.timeSlot.includes("晚上"))

  return (
    <div className="cinematic-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-display font-bold text-xl text-mostar-dark">{day.title}</h3>
          <p className="text-sm text-mostar-stone mt-1">{day.date} · {day.activities.length}个景点 · ¥{day.totalCost}</p>
        </div>
        <span className="text-gray-400 text-2xl">{expanded ? "▼" : "▶"}</span>
      </button>
      
      {expanded && (
        <div className="px-8 pb-8 space-y-6">
          {/* 上午行程 */}
          {morningActivities.length > 0 && (
            <div className="py-4 border-b border-gray-100">
              <h4 className="font-medium text-mostar-sky mb-3 flex items-center gap-2">
                <span>🌅</span> 上午
              </h4>
              {morningActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-4 py-3">
                  <span className="text-mostar-sky font-bold w-6">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-mostar-dark text-lg">{act.name}</span>
                      <span className="text-mostar-warm font-bold bg-mostar-warm/10 px-3 py-1 rounded-full">
                        {act.ticketPrice > 0 ? `¥${act.ticketPrice}` : "免费"}
                      </span>
                    </div>
                    <p className="text-sm text-mostar-stone mt-1">⏱ {act.duration} · 📍 {act.address}</p>
                    {act.miniProgram && (
                      <p className="text-xs text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                        📱 小程序：{act.miniProgram} · 预约时间：{act.bookingTime}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">🚗 从上一景点出发，约{act.commuteTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 中午行程 */}
          {noonActivities.length > 0 && (
            <div className="py-4 border-b border-gray-100">
              <h4 className="font-medium text-mostar-warm mb-3 flex items-center gap-2">
                <span>☀️</span> 中午
              </h4>
              {noonActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-4 py-3">
                  <span className="text-mostar-warm font-bold w-6">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-mostar-dark text-lg">{act.name}</span>
                      <span className="text-mostar-warm font-bold bg-mostar-warm/10 px-3 py-1 rounded-full">
                        {act.ticketPrice > 0 ? `¥${act.ticketPrice}` : "免费"}
                      </span>
                    </div>
                    <p className="text-sm text-mostar-stone mt-1">⏱ {act.duration} · 📍 {act.address}</p>
                    {act.miniProgram && (
                      <p className="text-xs text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                        📱 小程序：{act.miniProgram} · 预约时间：{act.bookingTime}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">🚗 从上一景点出发，约{act.commuteTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 下午行程 */}
          {afternoonActivities.length > 0 && (
            <div className="py-4 border-b border-gray-100">
              <h4 className="font-medium text-purple-500 mb-3 flex items-center gap-2">
                <span>🌇</span> 下午
              </h4>
              {afternoonActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-4 py-3">
                  <span className="text-purple-500 font-bold w-6">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-mostar-dark text-lg">{act.name}</span>
                      <span className="text-mostar-warm font-bold bg-mostar-warm/10 px-3 py-1 rounded-full">
                        {act.ticketPrice > 0 ? `¥${act.ticketPrice}` : "免费"}
                      </span>
                    </div>
                    <p className="text-sm text-mostar-stone mt-1">⏱ {act.duration} · 📍 {act.address}</p>
                    {act.miniProgram && (
                      <p className="text-xs text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                        📱 小程序：{act.miniProgram} · 预约时间：{act.bookingTime}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">🚗 从上一景点出发，约{act.commuteTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 晚间行程 */}
          {eveningActivities.length > 0 && (
            <div className="py-4 border-b border-gray-100">
              <h4 className="font-medium text-indigo-500 mb-3 flex items-center gap-2">
                <span>🌙</span> 晚间
              </h4>
              {eveningActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-4 py-3">
                  <span className="text-indigo-500 font-bold w-6">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-mostar-dark text-lg">{act.name}</span>
                      <span className="text-mostar-warm font-bold bg-mostar-warm/10 px-3 py-1 rounded-full">
                        {act.ticketPrice > 0 ? `¥${act.ticketPrice}` : "免费"}
                      </span>
                    </div>
                    <p className="text-sm text-mostar-stone mt-1">⏱ {act.duration} · 📍 {act.address}</p>
                    {act.miniProgram && (
                      <p className="text-xs text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                        📱 小程序：{act.miniProgram} · 预约时间：{act.bookingTime}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">🚗 从上一景点出发，约{act.commuteTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 美食推荐 */}
          <div className="py-4 border-b border-gray-100">
            <h4 className="font-medium text-mostar-dark mb-3 flex items-center gap-2">
              <span>🍽️</span> 美食推荐
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {day.meals.map((meal, i) => (
                <div key={i} className="bg-mostar-cream/50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-mostar-stone uppercase">{meal.type}</span>
                    <span className="text-mostar-warm font-bold">¥{meal.cost}/人</span>
                  </div>
                  <p className="font-medium text-mostar-dark">{meal.restaurant}</p>
                  <p className="text-sm text-mostar-stone mt-1">📍 {meal.location}</p>
                  <p className="text-xs text-gray-400 mt-2">{meal.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 交通信息 */}
          <div className="py-4">
            <h4 className="font-medium text-mostar-dark mb-3 flex items-center gap-2">
              <span>🚗</span> 交通信息
            </h4>
            <p className="text-sm text-mostar-stone">当日交通费用约 <span className="text-mostar-warm font-bold">¥{day.transportCost}</span></p>
            {day.commuteInfo.map((c, i) => (
              <p key={i} className="text-xs text-gray-400 mt-1">
                {c.from} → {c.to} ({c.method}，约{c.duration})
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}