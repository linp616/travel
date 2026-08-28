import { CITY_ATTRACTIONS } from "@/data/cityAttractions";

export interface Attraction {
  name: string;
  ticket: number;
  duration: string;
  commuteFrom: string;
  commuteTime: string;
  xhsSource: string;
}

export interface Meal {
  name: string;
  cost: number;
  location: string;
  xhsSource: string;
}

export interface Activity {
  name: string;
  duration: string;
  timeSlot: string;
  cost: number;
  commuteFrom: string;
  commuteTime: string;
  xhsSource: string;
}

export interface CommuteInfo {
  from: string;
  to: string;
  duration: string;
  transport: string;
  cost: number;
}

export interface DayPlan {
  activities: Activity[];
  meals: Meal[];
  totalCost: number;
  commuteInfo: CommuteInfo[];
}

// 获取城市数据
export function getCityData(city: string) {
  return CITY_ATTRACTIONS[city] || null;
}

// 获取景点列表（根据偏好筛选）
export function getAttractionsByPreference(city: string, preferences: string[]): Attraction[] {
  const cityData = getCityData(city);
  if (!cityData) return [];
  
  const allAttractions: Attraction[] = [];
  const preferredTypes = preferences.length > 0 ? preferences : ["文化", "自然"];
  
  preferredTypes.forEach(pref => {
    const list = (cityData as any)[pref];
    if (list && Array.isArray(list)) {
      allAttractions.push(...list);
    }
  });
  
  // 去重
  const unique = new Map<string, Attraction>();
  allAttractions.forEach(a => unique.set(a.name, a));
  return Array.from(unique.values());
}

// 获取美食列表
export function getMeals(city: string, count: number): Meal[] {
  const cityData = getCityData(city);
  if (!cityData || !cityData.food) return [];
  
  const meals: Meal[] = [];
  const foodList = cityData.food;
  
  for (let i = 0; i < Math.min(count, foodList.length); i++) {
    const food = foodList[i];
    meals.push({
      name: food.name,
      cost: food.cost,
      location: food.location,
      xhsSource: food.xhsSource
    });
  }
  
  return meals;
}

// 生成每日行程
export function generateDayItinerary(
  city: string,
  dayIndex: number,
  preferences: string[],
  budgetPerDay: number,
  usedSpots: Set<string>
): DayPlan {
  const cityData = getCityData(city);
  if (!cityData) {
    return { activities: [], meals: [], totalCost: 0, commuteInfo: [] };
  }
  
  const activities: Activity[] = [];
  const meals: Meal[] = [];
  let totalCost = 0;
  
  // 获取可用景点（排除已使用的）
  const availableAttractions = getAttractionsByPreference(city, preferences).filter(
    a => !usedSpots.has(a.name)
  );
  
  // 根据预算和偏好选择景点（每天2-3个）
  const maxAttractions = Math.min(3, availableAttractions.length);
  const timeSlots = ["上午", "下午"];
  
  for (let i = 0; i < maxAttractions; i++) {
    const attraction = availableAttractions[i];
    if (!attraction) break;
    
    usedSpots.add(attraction.name);
    
    const timeSlot = timeSlots[i % timeSlots.length];
    activities.push({
      name: attraction.name,
      duration: attraction.duration,
      timeSlot,
      cost: attraction.ticket,
      commuteFrom: attraction.commuteFrom,
      commuteTime: attraction.commuteTime,
      xhsSource: attraction.xhsSource
    });
    
    totalCost += attraction.ticket;
  }
  
  // 添加餐食
  const breakfast = { name: "酒店早餐", cost: 30, location: "酒店", xhsSource: "用户自定" };
  const mealsList = getMeals(city, 3);
  const lunch = mealsList[0] || { name: "午餐", cost: 50, location: "景区附近", xhsSource: "小红书推荐" };
  const dinner = mealsList[1] || { name: "晚餐", cost: 80, location: "酒店附近", xhsSource: "小红书推荐" };
  
  meals.push(breakfast, lunch, dinner);
  totalCost += breakfast.cost + lunch.cost + dinner.cost;
  
  // 计算交通费用
  const commuteCost = activities.length * 25;
  totalCost += commuteCost;
  
  // 生成通勤信息
  const commuteInfo: CommuteInfo[] = [];
  if (activities.length > 0) {
    commuteInfo.push({
      from: "酒店",
      to: activities[0].name,
      duration: activities[0].commuteTime,
      transport: "出租车/地铁",
      cost: 25
    });
    
    for (let i = 1; i < activities.length; i++) {
      commuteInfo.push({
        from: activities[i - 1].name,
        to: activities[i].name,
        duration: activities[i].commuteTime,
        transport: "出租车/地铁",
        cost: 25
      });
    }
  }
  
  return { activities, meals, totalCost, commuteInfo };
}

// 生成注意事项
export function generateTips(city: string): string[] {
  const cityData = getCityData(city);
  return cityData?.tips || [
    "请携带身份证，部分景点需要实名预约",
    "注意天气变化，提前准备雨具或防晒用品",
    "景区餐厅价格较高，可考虑附近餐厅",
    "建议下载当地地铁APP，方便出行",
    "保管好随身物品，景区人流密集注意防盗"
  ];
}
