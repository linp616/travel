'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Bookmark {
  id: string
  title: string
  toCity: string
  days: number
  adultCount: number
  childCount: number
  budget: number
  startDate: string
}

export default function BookmarkPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage: number = 6

  useEffect(() => {
    fetch("/api/bookmarks")
      .then(r => r.json())
      .then(data => {
        if (data.success) setBookmarks(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个书签吗？")) return
    const res = await fetch("/api/bookmarks?id=" + id, { method: "DELETE" })
    if (res.ok) {
      setBookmarks(bookmarks.filter(b => b.id !== id))
    }
  }

  const handleView = (bookmark: Bookmark) => {
    router.push("/bookmarks/view/detail?id=" + bookmark.id)
  }

  const handleEdit = (bookmark: Bookmark) => {
    router.push("/bookmarks/edit/" + bookmark.id)
  }

  const totalPages: number = Math.ceil(bookmarks.length / itemsPerPage)
  const paginatedBookmarks: Bookmark[] = bookmarks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-mostar-cream flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-5xl mb-4">⌛</div>
          <p className="text-gray-500 text-lg">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mostar-cream">
      <nav className="nav-cinematic">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mostar-sky to-mostar-water flex items-center justify-center shadow-cinematic">
              <span className="text-white font-display font-bold text-xl">途</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-cinematic">旅途智选</h1>
              <p className="text-sm text-mostar-stone">Cinematic Travel Planner</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a href="/travel" className="text-mostar-dark hover:text-mostar-sky font-medium transition-colors">
              规划行程
            </a>
            <a href="/bookmarks" className="text-mostar-sky font-medium">
              我的收藏
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold text-gradient-cinematic mb-3">我的收藏</h2>
          <p className="text-mostar-stone text-lg">查看和管理您的旅行计划</p>
        </div>
        
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-500 text-lg mb-6">暂无书签，去规划您的第一次行程吧</p>
            <a href="/travel" className="btn-cinematic inline-block">
              开始规划
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedBookmarks.map((b: Bookmark) => (
                <div key={b.id} className="cinematic-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl">{b.title}</h3>
                      <p className="text-gray-500 mt-1">
                        {b.toCity} · {b.days}天 · {b.adultCount}成人
                        {b.childCount > 0 ? "+" + b.childCount + "儿童" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 font-bold text-xl">¥{b.budget}</p>
                      <p className="text-gray-400 text-sm">{b.startDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button onClick={() => handleView(b)} className="flex-1 py-2.5 rounded-xl bg-mostar-sky/10 text-mostar-water font-medium hover:bg-mostar-sky/20 transition-colors">
                      查看详情
                    </button>
                    <button onClick={() => handleEdit(b)} className="flex-1 py-2.5 rounded-xl bg-mostar-warm/10 text-mostar-stone font-medium hover:bg-mostar-warm/20 transition-colors">
                      编辑
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 font-medium hover:bg-red-100 transition-colors">
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-6 py-3 rounded-xl bg-white border border-mostar-sand text-mostar-dark font-medium disabled:opacity-50 hover:border-mostar-sky hover:text-mostar-sky transition-all">
                  ← 上一页
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl font-medium transition-all ${page === currentPage ? "bg-mostar-sky text-white shadow-lg" : "bg-white text-mostar-dark hover:bg-mostar-cream"}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-6 py-3 rounded-xl bg-white border border-mostar-sand text-mostar-dark font-medium disabled:opacity-50 hover:border-mostar-sky hover:text-mostar-sky transition-all">
                  下一页 →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-mostar-dark text-mostar-cream py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-display font-bold mb-4">旅途智选</h3>
          <p className="text-mostar-stone mb-6">让旅行更简单，让每次出发都值得</p>
          <p className="text-sm text-gray-500">© 2026 旅途智选 · Cinematic Travel Planner</p>
        </div>
      </footer>
    </div>
  )
}

// Trigger rebuild



