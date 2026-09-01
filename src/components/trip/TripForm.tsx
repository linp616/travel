'use client'

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ROOM_TYPES, PREFERENCES, CITY_LIST, type RoomType, type Preference } from "@/types"

export default function TripForm({ initialData, onTripGenerated, onCityChange }: { initialData?: any; onTripGenerated?: (id: string) => void; onCityChange?: (city: string) => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  
  useEffect(() => {
    if (toCity && onCityChange) {
      onCityChange(toCity)
    }
  }, [toCity, onCityChange])
  const [startDate, setStartDate] = useState("")
  const [days, setDays] = useState("")
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [budget, setBudget] = useState("")
  const [roomType, setRoomType] = useState<RoomType>("舒适")
  const [preferences, setPreferences] = useState<Preference[]>([])
  const [extraRequirements, setExtraRequirements] = useState("")

  useEffect(() => {
    if (initialData) {
      setFromCity(initialData.fromCity || "")
      setToCity(initialData.toCity || "")
      setStartDate(initialData.startDate || "")
      setDays(initialData.days || "")
      setAdultCount(initialData.adultCount || 1)
      setChildCount(initialData.childCount || 0)
      setBudget(initialData.budget || "")
      setPreferences(initialData.preferences || [])
      setRoomType(initialData.roomType || "舒适")
      setExtraRequirements(initialData.extraRequirements || "")
    }
  }, [initialData])

  const togglePreference = (pref: Preference) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!fromCity || !toCity || !startDate) {
      alert("请填写完整的出发地、目的地和出发日期")
      return
    }
    const daysNum = parseInt(days)
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 30) {
      alert("请输入1~30天的整数")
      return
    }
    const budgetNum = parseInt(budget)
    if (isNaN(budgetNum) || budgetNum < 500) {
      alert("请输入合理的预算金额（建议500元以上）")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCity, toCity, startDate,
          days: daysNum,
          adultCount, childCount,
          budget: budgetNum,
          preferences, roomType,
          extraRequirements,
        }),
      })
      const data = await res.json()
      if (data.success && data.data?.trip?.id) {
        window.location.href = "/travel/result/" + data.data.trip.id
      } else {
        alert("生成行程失败，请重试")
      }
    } catch (err) {
      alert("请求失败，请检查网络后重试")
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 出发地与目的地 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">出发城市<span style={{color:"#ef4444"}}>*</span></label>
          <select 
            value={fromCity} 
            onChange={(e) => setFromCity(e.target.value)} 
            className="input-cinematic" 
            required
          >
            <option value="">请选择出发城市</option>
            {CITY_LIST.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">目的地<span style={{color:"#ef4444"}}>*</span></label>
          <select 
            value={toCity} 
            onChange={(e) => setToCity(e.target.value)} 
            className="input-cinematic" 
            required
          >
            <option value="">请选择目的地</option>
            {CITY_LIST.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
      </div>

      {/* 日期和天数 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">出发日期<span style={{color:"#ef4444"}}>*</span></label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            min={minDate} 
            className="input-cinematic" 
            required 
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">游玩天数<span style={{color:"#ef4444"}}>*</span>（天）</label>
          <input
            type="number"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="请输入1~30天的整数"
            className="input-cinematic"
            required
          />
        </div>
      </div>

      {/* 游玩人数 */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">游玩人数<span style={{color:"#ef4444"}}>*</span></label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-mostar-stone uppercase">成人（位）</label>
            <input
              type="number"
              min={1}
              max={20}
              value={adultCount}
              onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
              className="input-cinematic"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-mostar-stone uppercase">儿童（位）</label>
            <input
              type="number"
              min={0}
              max={10}
              value={childCount}
              onChange={(e) => setChildCount(parseInt(e.target.value) || 0)}
              className="input-cinematic"
            />
          </div>
        </div>
      </div>

      {/* 预算 */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">总预算<span style={{color:"#ef4444"}}>*</span>（元）</label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-mostar-stone font-medium text-lg">¥</span>
          <input
            type="number"
            min={500}
            step={100}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="请输入预算金额"
            className="input-cinematic pl-12"
            required
          />
        </div>
      </div>

      {/* 房间类型 */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">房间类型<span style={{color:"#ef4444"}}>*</span></label>
        <div className="grid grid-cols-4 gap-4">
          {ROOM_TYPES.map((rt) => (
            <button 
              key={rt} 
              type="button" 
              onClick={() => setRoomType(rt)} 
              className={`py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
                roomType === rt 
                  ? "bg-gradient-to-br from-mostar-sky to-mostar-water text-white shadow-cinematic" 
                  : "bg-white/50 text-mostar-stone hover:bg-white border border-mostar-stone/20"
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      {/* 游玩偏好 */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">游玩偏好（可多选）</label>
        <div className="flex flex-wrap gap-3">
          {PREFERENCES.map((pref) => (
            <button 
              key={pref} 
              type="button" 
              onClick={() => togglePreference(pref)} 
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                preferences.includes(pref) 
                  ? "bg-mostar-warm text-white shadow-lg" 
                  : "bg-white/50 text-mostar-stone hover:bg-white border border-mostar-stone/20"
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* 额外需求 */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-mostar-dark uppercase tracking-wider">你还有什么要求？请告诉我们</label>
        <textarea
          value={extraRequirements}
          onChange={(e) => setExtraRequirements(e.target.value)}
          placeholder="例如：想体验当地特色民宿、不要安排太累的行程、希望包含亲子活动..."
          rows={4}
          className="input-cinematic resize-none"
        />
      </div>

      {/* 提交按钮 */}
      <button 
        type="submit" 
        disabled={loading} 
        className="btn-cinematic w-full flex items-center justify-center gap-3 text-lg"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在生成您的专属行程...</span>
          </>
        ) : (
          <>
            <span className="text-2xl">✈️</span>
            <span>生成我的专属行程</span>
          </>
        )}
      </button>
    </form>
  )
}




