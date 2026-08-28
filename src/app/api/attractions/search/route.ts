import { NextResponse } from "next/server"

const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || "your_amap_key_here"
const PANHE_KEY = process.env.NEXT_PUBLIC_PANHE_KEY || "your_panhe_key_here"

export async function POST(req: Request) {
  try {
    const { city, key } = await req.json()
    
    if (!city || key === "your_amap_key_here") {
      return NextResponse.json({ 
        success: false, 
        error: "请先配置高德地图 API Key" 
      }, { status: 400 })
    }

    // 调用高德地图 API 搜索景点
    const amapRes = await fetch(
      `https://restapi.amap.com/v3/place/text?key=${key}&keywords=${encodeURIComponent(city + "景点")}&type=150000&city=${encodeURIComponent(city)}&pageSize=20&output=JSON`
    )
    const amapData = await amapRes.json()

    if (amapData.status !== "1" || !amapData.pois) {
      return NextResponse.json({ 
        success: true, 
        attractions: [],
        message: "暂未找到该地景点"
      })
    }

    // 调用磐河 API 获取票价
    const attractions = await Promise.all(
      amapData.pois.map(async (poi: any) => {
        let ticketPrice = null
        try {
          const panheRes = await fetch(
            `http://open.shpanhe.com/api/ticket?key=${PANHE_KEY}&keyWord=${encodeURIComponent(poi.name)}`
          )
          const panheData = await panheRes.json()
          
          if (panheData.success && panheData.scenicList && panheData.scenicList.length > 0) {
            const scenic = panheData.scenicList[0]
            if (scenic.ticketProducts && scenic.ticketProducts.length > 0) {
              ticketPrice = scenic.ticketProducts[0].marketPrice || scenic.ticketProducts[0].settlePrice || null
            }
          }
        } catch (e) {
          console.error("获取票价失败:", e)
        }

        return {
          name: poi.name,
          location: poi.adname || city,
          ticketPrice,
          rating: parseFloat(poi.rating) || 0,
          category: poi.type || "景点"
        }
      })
    )

    return NextResponse.json({ success: true, attractions })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}