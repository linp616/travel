"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import TripForm from "@/components/trip/TripForm"

export default function BookmarkEditPage() {
  const router = useRouter()
  const params = useParams()
  const [bookmark, setBookmark] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [prefillData, setPrefillData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/bookmarks/" + params.id)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setBookmark(data.data)
          setPrefillData({
            fromCity: data.data.fromCity || "",
            toCity: data.data.toCity || "",
            startDate: data.data.startDate || "",
            days: String(data.data.days || ""),
            adultCount: data.data.adultCount || 1,
            childCount: data.data.childCount || 0,
            budget: String(data.data.budget || ""),
            preferences: data.data.preferences ? JSON.parse(data.data.preferences) : [],
            roomType: data.data.roomType || "舒适",
            extraRequirements: data.data.extraRequirements || ""
          })
        } else {
          router.push("/bookmarks")
        }
      })
      .catch(() => router.push("/bookmarks"))
      .finally(() => setLoading(false))
  }, [params.id, router])

  const handleTripGenerated = (tripId: string) => {
    router.push("/travel/result/" + tripId)
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-500">正在加载...</p>
      </div>
    </div>
  )
  if (!bookmark) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">旅途智选</h1>
          <div className="space-x-4">
            <a href="/travel" className="text-gray-600 hover:text-blue-600">规划行程</a>
            <a href="/bookmarks" className="text-gray-600 hover:text-blue-600">书签</a>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">编辑行程 - {bookmark.title}</h2>
          <p className="text-gray-500 mt-2">修改出发地、目的地等信息后，将重新生成交通、酒店和行程规划</p>
        </div>
        {prefillData && (
          <TripForm initialData={prefillData} onTripGenerated={handleTripGenerated} />
        )}
      </main>
    </div>
  )
}