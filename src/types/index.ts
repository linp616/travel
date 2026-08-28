// 房间类型
export type RoomType = "经济" | "舒适" | "品质" | "豪华";

// 游玩偏好
export type Preference = "文化" | "自然" | "美食" | "购物" | "亲子" | "摄影" | "休闲";

// 旅行状态
export type TripStatus = "generated" | "saved" | "completed";

// 表单数据
export interface TripFormData {
  fromCity: string;
  toCity: string;
  startDate: string;
  days: number;
  adultCount: number;
  childCount: number;
  budget: number;
  preferences: Preference[];
  roomType: RoomType;
  extraRequirements: string;
}

// 推荐酒店
export interface HotelRecommendation {
  id: string;
  tripId: string;
  name: string;
  price: number;
  rating?: number;
  address?: string;
  lat?: number;
  lng?: number;
  source: string;
  sourceLabel: string;
  url?: string;
  tag?: string;
  createdAt: string;
}

// 交通推荐
export interface TransportRecommendation {
  id: string;
  tripId: string;
  origin: string;
  destination: string;
  method: string;
  price: number;
  duration: number;
  source: string;
  sourceLabel: string;
  url?: string;
  details?: string;
  createdAt: string;
  departureTime?: string;
  arrivalTime?: string;
  routeNumber?: string;
  score?: number;
  isRecommended?: boolean;
  isSample?: boolean;
}

// 小红书笔记摘要
export interface XhsNoteSummary {
  id: string;
  tripId: string;
  title: string;
  excerpt: string;
  author: string;
  likes: number;
  sourceUrl: string;
  tags: string;
  createdAt: string;
}

// 每日行程
export interface ItineraryDay {
  id: string;
  tripId: string;
  dayIndex: number;
  title: string;
  activities: string;
  meals?: string;
  totalCost?: number;
  commuteInfo?: string;
  createdAt: string;
}

// 完整行程
export interface Trip {
  id: string;
  fromCity: string;
  toCity: string;
  startDate: string;
  days: number;
  adultCount: number;
  childCount: number;
  budget: number;
  preferences: string;
  roomType: string;
  extraRequirements: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  hotels: HotelRecommendation[];
  transports: TransportRecommendation[];
  itineraryDays: ItineraryDay[];
  xhsNotes: XhsNoteSummary[];
}

// API 响应
export interface TripResult {
  trip: Trip;
  hotels: HotelRecommendation[];
  transports: TransportRecommendation[];
  itineraryDays: ItineraryDay[];
  xhsNotes: XhsNoteSummary[];
  totalEstimatedCost: number;
}

// 常量配置
export const ROOM_TYPES: RoomType[] = ["经济", "舒适", "品质", "豪华"];

export const PREFERENCES: Preference[] = ["文化", "自然", "美食", "购物", "亲子", "摄影", "休闲"];

export const CITY_LIST: string[] = [
  "北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "西安",
  "厦门", "三亚", "昆明", "大理", "丽江", "桂林", "黄山", "张家界",
  "青岛", "大连", "苏州", "南京", "武汉", "长沙", "福州", "宁波",
  "贵阳", "拉萨", "敦煌", "乌鲁木齐", "哈尔滨"
];

// 价格区间配置 (每晚)
export const PRICE_RANGES: Record<RoomType, [number, number]> = {
  "经济": [100, 300],
  "舒适": [300, 600],
  "品质": [600, 1000],
  "豪华": [1000, 3000],
};