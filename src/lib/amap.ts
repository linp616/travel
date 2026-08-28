"use server"

const AMAP_KEY = process.env.AMAP_KEY || "your_amap_key_here"

export async function geocode(city: string) {
  try {
    const res = await fetch(
      "https://restapi.amap.com/v3/geocode/geo?key=" + AMAP_KEY + "&address=" + encodeURIComponent(city)
    )
    const data = await res.json()
    if (data.status === "1" && data.geocodes.length > 0) {
      const [lng, lat] = data.geocodes[0].location.split(",")
      return { lat: parseFloat(lat), lng: parseFloat(lng) }
    }
  } catch (e) {
    console.error("[Amap] geocode error:", e)
  }
  return null
}

export async function getWeather(city: string) {
  try {
    const res = await fetch(
      "https://restapi.amap.com/v3/weather/weatherInfo?key=" + AMAP_KEY + "&city=" + encodeURIComponent(city)
    )
    const data = await res.json()
    if (data.status === "1" && data.weatherinfos && data.weatherinfos[0]) {
      const w = data.weatherinfos[0]
      return { temp: w.temperature, weather: w.weather }
    }
  } catch (e) {
    console.error("[Amap] getWeather error:", e)
  }
  return null
}

export async function searchPOIs(keyword: string, city: string, types: string, pageSize: number = 20) {
  try {
    const res = await fetch(
      "https://restapi.amap.com/v3/place/text?key=" + AMAP_KEY +
      "&keywords=" + encodeURIComponent(keyword) +
      "&city=" + encodeURIComponent(city) +
      "&type=" + types +
      "&pageSize=" + pageSize +
      "&output=JSON"
    )
    const data = await res.json()
    if (data.status === "1" && data.pois) {
      return data.pois.map((p: any) => ({
        id: p.id,
        name: p.name,
        address: p.address,
        location: p.location,
        tel: p.tel,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        distance: p.distance,
      }))
    }
  } catch (e) {
    console.error("[Amap] searchPOIs error:", e)
  }
  return []
}

export async function planRoute(origin: string, destination: string, mode: "driving" | "transit" = "driving") {
  try {
    const url =
      mode === "transit"
        ? "https://restapi.amap.com/v3/direction/transit/intelligent?key=" + AMAP_KEY +
          "&origin=" + origin + "&destination=" + destination + "&city=BJ&output=JSON"
        : "https://restapi.amap.com/v3/direction/driving?key=" + AMAP_KEY +
          "&origin=" + origin + "&destination=" + destination + "&output=JSON"
    const res = await fetch(url)
    const data = await res.json()
    if (data.status === "1") {
      if (mode === "driving" && data.route && data.route.paths && data.route.paths[0]) {
        const path = data.route.paths[0]
        return { distance: path.distance, duration: path.duration }
      }
      if (mode === "transit" && data.route) {
        return {
          distance: data.route.distances?.[0] || "0",
          duration: data.route.durations?.[0] || "0",
          cost: data.route.costs[0]?.money,
        }
      }
    }
  } catch (e) {
    console.error("[Amap] planRoute error:", e)
  }
  return null
}
