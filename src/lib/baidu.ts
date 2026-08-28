"use server"

const BAIDU_KEY = process.env.BAIDU_MAP_KEY || "your_baidu_key_here"

export async function geocode(city: string) {
  try {
    const res = await fetch(
      "https://api.map.baidu.com/geocoding/v3/?address=" + encodeURIComponent(city) + "&output=json&ak=" + BAIDU_KEY
    )
    const data = await res.json()
    if (data.status === 0 && data.result) {
      return { lat: data.result.location.lat, lng: data.result.location.lng }
    }
  } catch (e) {
    console.error("[Baidu] geocode error:", e)
  }
  return null
}

export async function planRoute(origin: string, destination: string) {
  try {
    const res = await fetch(
      "https://api.map.baidu.com/directionlite/v1/?origin=" + origin +
      "&destination=" + destination + "&mode=driving&output=json&ak=" + BAIDU_KEY
    )
    const data = await res.json()
    if (data.status === 0 && data.result && data.result.routes && data.result.routes[0]) {
      const route = data.result.routes[0]
      return {
        distance: route.distance ? route.distance + "m" : "0m",
        duration: route.duration ? Math.round(route.duration / 60) + "min" : "0min",
      }
    }
  } catch (e) {
    console.error("[Baidu] planRoute error:", e)
  }
  return null
}

export async function searchPOIs(keyword: string, city: string, category: string) {
  try {
    const res = await fetch(
      "https://api.map.baidu.com/place/v2/search?query=" + encodeURIComponent(keyword) +
      "&region=" + encodeURIComponent(city) +
      "&category=" + encodeURIComponent(category) +
      "&output=json&ak=" + BAIDU_KEY
    )
    const data = await res.json()
    if (data.status === 0 && data.results) {
      return data.results.map((item: any) => ({
        id: item.id,
        name: item.name,
        address: item.address,
        location: item.location ? item.location.lng + "," + item.location.lat : "0,0",
        phone: item.phone,
        rating: item.rating,
        price: item.price,
      }))
    }
  } catch (e) {
    console.error("[Baidu] searchPOIs error:", e)
  }
  return []
}
