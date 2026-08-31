'use client'
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Trip {
  id: string
  fromCity: string
  toCity: string
  startDate: string
  days: number
  adultCount: number
  childCount: number
  roomType: string
  budget: number
  preferences: string[]
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

export default function OverviewPage() {
  const router = useRouter()
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const preferences = typeof trip?.preferences === 'string' ? JSON.parse(trip.preferences) : (trip?.preferences || [])

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
        setSaveSuccess(true)
        setShowSaveModal(true)
        setTimeout(() => { setSaveSuccess(false); setShowSaveModal(false) }, 10000)
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
        <div className="text-6xl mb-4 animate-pulse">⏳</div>
        <p className="text-mostar-stone text-lg font-display">正在加载行程概览...</p>
      </div>
    </div>
  )

  if (!trip) return null

  const imageUrl = CITY_IMAGES[trip.toCity] || CITY_IMAGES["三亚"]

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
          <Link href="/travel" className="text-mostar-dark hover:text-mostar-sky font-medium transition-colors text-sm">
            ← 返回主页
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-cinematic">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url('${imageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-white/80 text-sm mb-2 font-medium tracking-widest uppercase">您的专属 cinematic 旅行方案</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              {trip.fromCity} <span className="text-mostar-sky">→</span> {trip.toCity}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-sm">
              <span>📅 {trip.startDate}</span>
              <span>🕐 {trip.days} 天</span>
              <span>👥 {trip.adultCount}成人{trip.childCount > 0 ? "+" + trip.childCount + "儿童" : ""}</span>
              <span>💰 预算 ¥{trip.budget}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href={`/travel/result/${params.id}/transport`} className="cinematic-card p-8 text-center hover:border-mostar-warm/50 transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-water-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🚗</span>
            </div>
            <h3 className="text-xl font-display font-bold text-mostar-dark mb-2">交通方案</h3>
            <p className="text-mostar-stone text-sm">大交通+当地出行推荐</p>
          </Link>
          <Link href={`/travel/result/${params.id}/hotel`} className="cinematic-card p-8 text-center hover:border-mostar-warm/50 transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warm-100 to-sand-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🏨</span>
            </div>
            <h3 className="text-xl font-display font-bold text-mostar-dark mb-2">酒店推荐</h3>
            <p className="text-mostar-stone text-sm">精选住宿方案推荐</p>
          </Link>
          <Link href={`/travel/result/${params.id}/itinerary`} className="cinematic-card p-8 text-center hover:border-mostar-warm/50 transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-display font-bold text-mostar-dark mb-2">行程规划</h3>
            <p className="text-mostar-stone text-sm">每日详细行程安排</p>
          </Link>
        </div>

        {/* Preferences Summary */}
        {preferences.length > 0 && (
          <div className="cinematic-card p-8 mb-12">
            <h3 className="text-xl font-display font-bold text-mostar-dark mb-4">旅行偏好</h3>
            <div className="flex flex-wrap gap-3">
              {preferences.map((p: string, i: number) => (
                <span key={i} className="bg-mostar-sand text-mostar-dark px-4 py-2 rounded-full text-sm">{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* Save to Bookmarks */}
        <div className="text-center space-y-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-cinematic inline-block px-12 py-4 text-lg"
          >
            {saveSuccess ? "✓已保存到书签" : saving ? "保存中..." : "💾保存行程"}
          </button>
          <Link href="/bookmarks" className="inline-block text-mostar-stone hover:text-mostar-water transition-colors text-sm">
            查看已保存的行程
          </Link>
        </div>

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
                <button onClick={() => { setShowSaveModal(false); router.push("/bookmarks") }} className="px-8 py-3 bg-mostar-water text-white font-medium hover:bg-mostar-water/90 transition-all rounded-lg flex-1 text-center">去书签页</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}