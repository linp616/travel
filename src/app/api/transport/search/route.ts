import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"

const METHODS = ["高铁", "飞机", "火车", "大巴"]
const BASE_PRICES = [550, 800, 320, 180]
const BASE_DURS = [240, 120, 480, 360]
const SRC_LABELS = ["12306", "携程", "12306", "携程"]
const ROUTE_NOS = ["G1234", "CA1832", "K234", "长途专线"]
const DEPARTURES = ["08:00", "09:00", "22:00", "07:00"]
const ARRIVALS = ["12:00", "11:00", "06:00", "13:00"]
const DETAILS = ["示例 二等座", "示例 经济舱含机建燃油", "示例 硬卧", "示例 舒适大巴"]