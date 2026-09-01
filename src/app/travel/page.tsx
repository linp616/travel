"use client"

import TripForm from "@/components/trip/TripForm"
import { useState } from "react"

export default function TravelPage() {
  const [destCity, setDestCity] = useState("三亚")
  return (
    <div className="min-h-screen bg-mostar-cream">
      {/* Cinematic Navigation */}
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
            <a href="/bookmarks" className="text-mostar-dark hover:text-mostar-sky font-medium transition-colors">
              我的收藏
            </a>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Section with Dynamic Background */}
      <div className="cinematic-hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-mostar-sky/10 parallax-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-mostar-warm/10 parallax-slow" style={{animationDelay: "-5s"}}></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full bg-mostar-water/10 parallax-slow" style={{animationDelay: "-10s"}}></div>
        </div>

        <main className="relative z-10 max-w-6xl mx-auto py-20 px-6 w-full">
          <div className="text-center mb-16 animate-cinematic-fade">
            <div className="inline-block mb-6">
              <span className="badge-cinematic text-sm uppercase tracking-widest">
                ✨ Premium Travel Experience
              </span>
            </div>
            <h2 className="text-7xl md:text-9xl font-display font-bold text-gradient-cinematic mb-6">
              探索世界
            </h2>
            <p className="text-xl md:text-2xl text-mostar-stone max-w-2xl mx-auto leading-relaxed">
              定制您的完美行程，让每次出发都成为难忘的 cinematic 体验
            </p>
          </div>

          <div className="max-w-3xl mx-auto animate-cinematic-slide">
            <div className="cinematic-card p-10 md:p-12">
              <TripForm onCityChange={(city) => setDestCity(city || "三亚")} />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-mostar-dark text-mostar-cream py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-display font-bold mb-4">旅途智选</h3>
          <p className="text-mostar-stone mb-6">让旅行更简单，让每次出发都值得</p>
          <p className="text-sm text-gray-500">© 2026 旅途智选 · Cinematic Travel Planner</p>
        </div>
      </footer>
    </div>
  )
}