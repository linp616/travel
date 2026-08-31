import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_FILE = join(process.cwd(), "data", "cityTravelData.json")

function loadCityData() {
  if (!existsSync(DATA_FILE)) return {}
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"))
  } catch {
    return {}
  }
}

const DAILY_COSTS = {
  hotel: 300,
  meals: 150,
  transport: 50
}

export async function POST(req: Request) {
  try {
    const { tripId, toCity, days, budget, adultCount, childCount, startDate } = await req.json()
    
    if (!tripId || !toCity) {
      return NextResponse.json({ success: false, error: "缺少必要参数" }, { status: 400 })
    }

    const cityData = loadCityData()
    const cityInfo = cityData[toCity]
    
    if (!cityInfo) {
      return NextResponse.json({ 
        success: false, 
        error: "暂未找到" + toCity + "的行程数据，请选择其他目的地" 
      }, { status: 404 })
    }

    const attractions = cityInfo.attractions || []
    const foods = cityInfo.foods || []
    const tips = cityInfo.tips || []

    // 确保每日景点不重复：按天数平均分配景点，每天至少1-2个
    const dayAttractions: any[][] = []
    const usedIndices = new Set<number>()
    
    for (let i = 0; i < days; i++) {
      const dayAttrs: any[] = []
      // 优先使用未使用的景点
      let availableCount = 0
      for (let j = 0; j < attractions.length; j++) {
        if (!usedIndices.has(j)) availableCount++
      }
      
      // 每个景点分配1-2个时间段
      const slotsPerDay = Math.min(2, Math.max(1, Math.ceil(attractions.length / days)))
      let assigned = 0
      
      for (let j = 0; j < attractions.length && assigned < slotsPerDay; j++) {
        if (!usedIndices.has(j)) {
          dayAttrs.push(attractions[j])
          usedIndices.add(j)
          assigned++
        }
      }
      
      // 如果景点不够，重复使用（但不标记为已使用）
      if (dayAttrs.length === 0 && attractions.length > 0) {
        dayAttrs.push(attractions[i % attractions.length])
      }
      
      dayAttractions.push(dayAttrs)
    }

    // 确保每日美食不重复：早餐、午餐、晚餐分开
    const dayFoods: any[][] = []
    for (let i = 0; i < days; i++) {
      // 每天分配3个美食（早中晚）
      const startIdx = (i * 3) % foods.length
      const dayMeals = []
      for (let j = 0; j < 3; j++) {
        const foodIdx = (startIdx + j) % foods.length
        dayMeals.push(foods[foodIdx])
      }
      dayFoods.push(dayMeals)
    }

    const dayPlans = []
    
    for (let day = 1; day <= days; day++) {
      const dayAttrs = dayAttractions[day - 1] || [attractions[(day - 1) % attractions.length]]
      const dayMeals = dayFoods[day - 1] || [foods[0], foods[1], foods[2]]
      
      const activities: any[] = []
      const meals: any[] = []
      
      // 上午行程（景点1）
      if (dayAttrs[0]) {
        activities.push({
          timeSlot: "上午",
          name: dayAttrs[0].name,
          duration: dayAttrs[0].duration || "2-3小时",
          ticketPrice: dayAttrs[0].ticket || 0,
          commuteFrom: "酒店",
          commuteTime: dayAttrs[0].commuteTime || "15分钟",
          address: dayAttrs[0].address || toCity + "市中心",
          miniProgram: dayAttrs[0].miniProgram || "",
          bookingTime: dayAttrs[0].bookingTime || "当日可买"
        })
      } else {
        activities.push({
          timeSlot: "上午",
          name: "自由活动",
          duration: "2小时",
          ticketPrice: 0,
          commuteFrom: "酒店",
          commuteTime: "0分钟",
          address: "",
          miniProgram: "",
          bookingTime: ""
        })
      }
      
      // 中午行程（景点2或午餐后活动）
      if (dayAttrs[1]) {
        activities.push({
          timeSlot: "中午",
          name: dayAttrs[1].name,
          duration: dayAttrs[1].duration || "1.5小时",
          ticketPrice: dayAttrs[1].ticket || 0,
          commuteFrom: dayAttrs[0]?.name || "上一景点",
          commuteTime: dayAttrs[1].commuteTime || "15分钟",
          address: dayAttrs[1].address || toCity + "市中心",
          miniProgram: dayAttrs[1].miniProgram || "",
          bookingTime: dayAttrs[1].bookingTime || "当日可买"
        })
      } else {
        activities.push({
          timeSlot: "中午",
          name: "午餐休息",
          duration: "1小时",
          ticketPrice: 0,
          commuteFrom: dayAttrs[0]?.name || "上一景点",
          commuteTime: "10分钟",
          address: "",
          miniProgram: "",
          bookingTime: ""
        })
      }
      
      // 下午行程
      if (dayAttrs[2]) {
        activities.push({
          timeSlot: "下午",
          name: dayAttrs[2].name,
          duration: dayAttrs[2].duration || "2小时",
          ticketPrice: dayAttrs[2].ticket || 0,
          commuteFrom: dayAttrs[1]?.name || dayAttrs[0]?.name || "上一景点",
          commuteTime: dayAttrs[2].commuteTime || "15分钟",
          address: dayAttrs[2].address || toCity + "市中心",
          miniProgram: dayAttrs[2].miniProgram || "",
          bookingTime: dayAttrs[2].bookingTime || "当日可买"
        })
      } else {
        activities.push({
          timeSlot: "下午",
          name: "自由探索",
          duration: "2小时",
          ticketPrice: 0,
          commuteFrom: dayAttrs[1]?.name || dayAttrs[0]?.name || "上一景点",
          commuteTime: "10分钟",
          address: "",
          miniProgram: "",
          bookingTime: ""
        })
      }
      
      // 晚间行程
      activities.push({
        timeSlot: "晚间",
        name: "返回酒店休息",
        duration: "1小时",
        ticketPrice: 0,
        commuteFrom: dayAttrs[dayAttrs.length - 1]?.name || "上一景点",
        commuteTime: "20分钟",
        address: "",
        miniProgram: "",
        bookingTime: ""
      })

      // 餐食安排（早中晚）
      meals.push({
        type: "早餐",
        restaurant: dayMeals[0]?.name || "酒店早餐",
        cost: dayMeals[0]?.cost || 30,
        recommendation: dayMeals[0]?.recommendation || "丰富多样",
        location: dayMeals[0]?.location || "酒店附近"
      })
      meals.push({
        type: "午餐",
        restaurant: dayMeals[1]?.name || "当地特色餐厅",
        cost: dayMeals[1]?.cost || 60,
        recommendation: dayMeals[1]?.recommendation || "地道美食",
        location: dayMeals[1]?.location || "景区附近"
      })
      meals.push({
        type: "晚餐",
        restaurant: dayMeals[2]?.name || "网红餐厅",
        cost: dayMeals[2]?.cost || 80,
        recommendation: dayMeals[2]?.recommendation || "环境优雅",
        location: dayMeals[2]?.location || "商业区"
      })

      // 计算费用
      const ticketCost = activities.filter((a: any) => a.ticketPrice > 0).reduce((sum: number, a: any) => sum + a.ticketPrice, 0)
      const mealCost = meals.reduce((sum: number, m: any) => sum + m.cost, 0) * adultCount
      const totalCost = DAILY_COSTS.hotel + mealCost + DAILY_COSTS.transport + ticketCost

      const date = new Date(startDate)
      date.setDate(date.getDate() + day - 1)
      const dateStr = date.toISOString().split("T")[0]

      dayPlans.push({
        dayIndex: day,
        date: dateStr,
        title: toCity + "第" + day + "天",
        activities: activities,
        meals: meals,
        commuteInfo: activities.filter((a: any) => a.commuteFrom !== "酒店").slice(0, -1).map((a: any, i: number, arr: any[]) => ({
          from: arr[i]?.name || "起点",
          to: a.name,
          method: "公交/打车",
          duration: a.commuteTime || "15分钟"
        })),
        transportCost: DAILY_COSTS.transport,
        totalCost: Math.round(totalCost)
      })
    }

    const grandTotal = dayPlans.reduce((s: number, d: any) => s + d.totalCost, 0)

    return NextResponse.json({
      success: true,
      data: {
        dayPlans,
        totalCost: grandTotal,
        tips,
        cityInfo: {
          name: toCity,
          totalAttractions: attractions.length,
          totalFoods: foods.length
        }
      }
    })
  } catch (e: any) {
    console.error("生成行程失败:", e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}