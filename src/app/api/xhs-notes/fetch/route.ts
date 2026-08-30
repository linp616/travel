import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"

function getNow() {
  const now = new Date()
  return now.toISOString().replace(/T/, " ").replace(/\\\.\d{3}Z/, "")
}

export async function POST(req: Request) {
  try {
    const { city, preferences, days, tripId } = await req.json()
    if (!city) return NextResponse.json({ success: false, error: "缺少城市参数" }, { status: 400 })
    const prefs = typeof preferences === "string" ? JSON.parse(preferences) : (preferences || [])
    const prefsStr = prefs.join("-")
    const tags = ["#" + city, "#" + prefsStr, "#旅游攻略", "#避坑指南"]

    const noteTemplates = [
      { title: city + "必去景点推荐！本地人带路", excerpt: "第一次来" + city + "一定要去这几个地方...人均" + Math.round(300 + Math.random() * 400) + "元搞定", author: "旅行达人" + Math.floor(Math.random() * 100), likes: Math.floor(Math.random() * 5000 + 500) },
      { title: city + "美食攻略｜这家店排队2小时也值得", excerpt: "吃了" + city + "十几家餐厅，这家排第一...人均" + Math.round(50 + Math.random() * 150) + "元", author: "吃货小" + Math.floor(Math.random() * 99), likes: Math.floor(Math.random() * 3000 + 300) },
      { title: city + "3天2晚旅游攻略｜超详细避坑指南", excerpt: "去了" + city + "3天，总结了一份详细攻略...总花费" + Math.round(days * (200 + Math.random() * 300)) + "元/人", author: "背包客" + Math.floor(Math.random() * 200), likes: Math.floor(Math.random() * 8000 + 1000) },
      { title: "避坑！来" + city + "前一定要看", excerpt: "在" + city + "踩了很多坑，整理出来给大家避坑...建议收藏", author: "小" + Math.floor(Math.random() * 99) + "旅行", likes: Math.floor(Math.random() * 6000 + 800) },
      { title: city + "住宿推荐｜这几家酒店性价比超高", excerpt: "住了" + city + "十几家酒店，这几家最值得推荐...均价" + Math.round(200 + Math.random() * 300) + "元/晚", author: "酒店测评师" + Math.floor(Math.random() * 100), likes: Math.floor(Math.random() * 4000 + 500) },
      { title: city + "小众玩法｜避开人群的秘密基地", excerpt: "本地人都去这些小众景点...不挤不贵", author: "探秘者" + Math.floor(Math.random() * 99), likes: Math.floor(Math.random() * 2000 + 200) },
    ]

    const results = noteTemplates.slice(0, Math.min(12, 6 + prefs.length)).map((n: any) => ({
      ...n, sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=" + encodeURIComponent(city + "旅游攻略"),
      tags: JSON.stringify(tags), createdAt: getNow()
    }))

    if (tripId) {
      await prisma.xhsNoteSummary.deleteMany({ where: { tripId } } as any)
      for (const r of results) {
        await prisma.xhsNoteSummary.create({ id: randomBytes(12).toString("hex"), tripId, ...r } as any)
      }
    }
    return NextResponse.json({ success: true, data: results })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
