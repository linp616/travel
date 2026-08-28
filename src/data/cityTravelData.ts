// 城市旅行数据（从 CSV 导入）
export const CITY_TRAVEL_DATA: Record<string, {
  attractions: Array<{name: string; ticket: number; duration: string; commute: string; commuteTime: string; address: string}>
  foods: Array<{name: string; cost: number; location: string}>
  hotels: Array<{name: string; price: number; address: string}>
  tips: string[]
}> = {}
