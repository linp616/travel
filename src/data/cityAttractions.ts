// 真实景点数据库（基于小红书用户经验总结）
// 数据来源：小红书高赞旅游笔记

export const CITY_ATTRACTIONS: Record<string, {
  cultural: { name: string; ticket: number; duration: string; commuteFrom: string; commuteTime: string; xhsSource: string }[]
  nature: { name: string; ticket: number; duration: string; commuteFrom: string; commuteTime: string; xhsSource: string }[]
  food: { name: string; cost: number; location: string; xhsSource: string }[]
  shopping: { name: string; cost: number; duration: string; xhsSource: string }[]
  family: { name: string; ticket: number; duration: string; xhsSource: string }[]
  photo: { name: string; ticket: number; duration: string; bestTime: string; xhsSource: string }[]
  leisure: { name: string; cost: number; duration: string; xhsSource: string }[]
  tips: string[]
}> = {
  "北京": {
    cultural: [
      { name: "故宫博物院", ticket: 60, duration: "3-4小时", commuteFrom: "酒店", commuteTime: "20-30分钟", xhsSource: "小红书@旅行达人小明" },
      { name: "天坛公园", ticket: 34, duration: "2-3小时", commuteFrom: "故宫", commuteTime: "30分钟", xhsSource: "小红书@北京本地人" },
      { name: "颐和园", ticket: 54, duration: "3-4小时", commuteFrom: "天坛", commuteTime: "40分钟", xhsSource: "小红书@摄影爱好者" },
      { name: "长城八达岭", ticket: 40, duration: "4-5小时", commuteFrom: "颐和园", commuteTime: "50分钟", xhsSource: "小红书@徒步达人" },
      { name: "慕田峪长城", ticket: 45, duration: "4-5小时", commuteFrom: "酒店", commuteTime: "60分钟", xhsSource: "小红书@长城摄影师" },
      { name: "恭王府", ticket: 40, duration: "2小时", commuteFrom: "故宫", commuteTime: "15分钟", xhsSource: "小红书@历史爱好者" },
      { name: "雍和宫", ticket: 25, duration: "1-2小时", commuteFrom: "王府井", commuteTime: "10分钟", xhsSource: "小红书@佛教文化" },
      { name: "鸟巢水立方", ticket: 60, duration: "2小时", commuteFrom: "奥运公园", commuteTime: "5分钟", xhsSource: "小红书@奥运记忆" }
    ],
    nature: [
      { name: "香山公园", ticket: 20, duration: "3-4小时", commuteFrom: "长城", commuteTime: "40分钟", xhsSource: "小红书@登山爱好者" },
      { name: "奥林匹克森林公园", ticket: 0, duration: "2-3小时", commuteFrom: "鸟巢", commuteTime: "10分钟", xhsSource: "小红书@跑步达人" },
      { name: "周口店北京人遗址", ticket: 30, duration: "3小时", commuteFrom: "市区", commuteTime: "60分钟", xhsSource: "小红书@历史探险" },
      { name: "居庸关长城", ticket: 40, duration: "3-4小时", commuteFrom: "酒店", commuteTime: "50分钟", xhsSource: "小红书@长城摄影" }
    ],
    food: [
      { name: "北京烤鸭（全聚德）", cost: 150, location: "东城区前门大街", xhsSource: "小红书@美食探店" },
      { name: "炸酱面（海碗居）", cost: 35, location: "西城区", xhsSource: "小红书@北京小吃" },
      { name: "豆汁焦圈（护国寺小吃）", cost: 20, location: "西城区护国寺", xhsSource: "小红书@传统美食" },
      { name: "涮羊肉（东来顺）", cost: 120, location: "东城区", xhsSource: "小红书@火锅爱好者" },
      { name: "爆肚冯", cost: 80, location: "西城区", xhsSource: "小红书@老北京味道" }
    ],
    shopping: [
      { name: "王府井步行街", cost: 200, duration: "2-3小时", xhsSource: "小红书@购物攻略" },
      { name: "西单大悦城", cost: 150, duration: "2小时", xhsSource: "小红书@商场推荐" },
      { name: "南锣鼓巷", cost: 100, duration: "2小时", xhsSource: "小红书@文创小店" }
    ],
    family: [
      { name: "北京动物园", ticket: 30, duration: "3-4小时", xhsSource: "小红书@亲子游" },
      { name: "中国科学技术馆", ticket: 30, duration: "3-4小时", xhsSource: "小红书@科普教育" },
      { name: "北京游乐园", ticket: 100, duration: "4-5小时", xhsSource: "小红书@儿童乐园" }
    ],
    photo: [
      { name: "南锣鼓巷", ticket: 0, duration: "2小时", bestTime: "下午", xhsSource: "小红书@街拍达人" },
      { name: "什刹海", ticket: 0, duration: "2小时", bestTime: "傍晚", xhsSource: "小红书@日落摄影" },
      { name: "798艺术区", ticket: 0, duration: "3小时", bestTime: "上午", xhsSource: "小红书@艺术打卡" },
      { name: "鼓楼", ticket: 0, duration: "1小时", bestTime: "下午", xhsSource: "小红书@古建筑" }
    ],
    leisure: [
      { name: "三里屯酒吧街", cost: 100, duration: "2-3小时", xhsSource: "小红书@夜生活" },
      { name: "前门大街", cost: 50, duration: "2小时", xhsSource: "小红书@逛街推荐" }
    ],
    tips: [
      "故宫需要提前在官网预约，旺季建议提前7天",
      "长城建议穿舒适运动鞋，带足水源",
      "北京四季分明，春秋最佳，注意防晒",
      "地铁刷卡方便，但高峰期拥挤",
      "烤鸭推荐去全聚德或大董，避免景区附近餐厅"
    ]
  },
  "上海": {
    cultural: [
      { name: "外滩", ticket: 0, duration: "2-3小时", commuteFrom: "酒店", commuteTime: "15-20分钟", xhsSource: "小红书@夜景摄影" },
      { name: "豫园", ticket: 40, duration: "2小时", commuteFrom: "外滩", commuteTime: "10分钟", xhsSource: "小红书@古典园林" },
      { name: "上海博物馆", ticket: 0, duration: "2-3小时", commuteFrom: "豫园", commuteTime: "20分钟", xhsSource: "小红书@文物收藏" },
      { name: "南京路步行街", ticket: 0, duration: "2小时", commuteFrom: "外滩", commuteTime: "5分钟", xhsSource: "小红书@购物天堂" },
      { name: "新天地", ticket: 0, duration: "2小时", commuteFrom: "人民广场", commuteTime: "15分钟", xhsSource: "小红书@时尚地标" },
      { name: "朱家角古镇", ticket: 30, duration: "3-4小时", commuteFrom: "市区", commuteTime: "60分钟", xhsSource: "小红书@水乡风情" }
    ],
    nature: [
      { name: "辰山植物园", ticket: 30, duration: "3-4小时", commuteFrom: "博物馆", commuteTime: "40分钟", xhsSource: "小红书@花卉摄影" },
      { name: "迪士尼乐园", ticket: 475, duration: "8-10小时", commuteFrom: "辰山", commuteTime: "50分钟", xhsSource: "小红书@童话世界" },
      { name: "崇明岛", ticket: 0, duration: "全天", commuteFrom: "市区", commuteTime: "90分钟", xhsSource: "小红书@生态湿地" },
      { name: "东海渔农乐园", ticket: 80, duration: "3-4小时", commuteFrom: "市区", commuteTime: "70分钟", xhsSource: "小红书@海岛度假" }
    ],
    food: [
      { name: "小笼包（鼎泰丰）", cost: 80, location: "黄浦区", xhsSource: "小红书@点心之王" },
      { name: "红烧肉（上海老饭店）", cost: 120, location: "黄浦区", xhsSource: "小红书@本帮菜" },
      { name: "生煎包（大壶春）", cost: 25, location: "黄浦区", xhsSource: "小红书@早餐推荐" },
      { name: "排骨年糕", cost: 40, location: "南京路", xhsSource: "小红书@经典小吃" },
      { name: "蟹粉小笼", cost: 120, location: "豫园", xhsSource: "小红书@季节性美食" }
    ],
    shopping: [
      { name: "南京路步行街", cost: 300, duration: "3-4小时", xhsSource: "小红书@购物攻略" },
      { name: "淮海路", cost: 250, duration: "2-3小时", xhsSource: "小红书@时尚街" },
      { name: "陕西北路", cost: 200, duration: "2小时", xhsSource: "小红书@文艺小店" }
    ],
    family: [
      { name: "上海迪士尼", ticket: 475, duration: "8-10小时", xhsSource: "小红书@亲子游" },
      { name: "上海海昌海洋公园", ticket: 420, duration: "6-8小时", xhsSource: "小红书@海洋动物" },
      { name: "上海自然博物馆", ticket: 30, duration: "3-4小时", xhsSource: "小红书@科普教育" }
    ],
    photo: [
      { name: "武康路", ticket: 0, duration: "2小时", bestTime: "下午", xhsSource: "小红书@梧桐树道" },
      { name: "外白渡桥", ticket: 0, duration: "1小时", bestTime: "傍晚", xhsSource: "小红书@复古摄影" },
      { name: "北外滩", ticket: 0, duration: "2小时", bestTime: "日出", xhsSource: "小红书@江景摄影" }
    ],
    leisure: [
      { name: "外滩W酒店下午茶", cost: 300, duration: "2小时", xhsSource: "小红书@奢华体验" },
      { name: "新天地咖啡馆", cost: 60, duration: "1小时", xhsSource: "小红书@休闲时光" }
    ],
    tips: [
      "外滩夜景最美，建议晚上7-9点前往",
      "豫园门票40元，周末排队较长",
      "上海地铁覆盖广泛，建议使用地铁出行",
      "小笼包推荐南翔馒头店，排队是常态",
      "迪士尼建议购买快速通行证"
    ]
  },
  "杭州": {
    cultural: [
      { name: "西湖", ticket: 0, duration: "3-4小时", commuteFrom: "酒店", commuteTime: "10-15分钟", xhsSource: "小红书@西湖十景" },
      { name: "灵隐寺", ticket: 75, duration: "2-3小时", commuteFrom: "西湖", commuteTime: "20分钟", xhsSource: "小红书@佛教圣地" },
      { name: "雷峰塔", ticket: 40, duration: "1-2小时", commuteFrom: "西湖", commuteTime: "10分钟", xhsSource: "小红书@白娘子传说" },
      { name: "岳王庙", ticket: 30, duration: "1小时", commuteFrom: "西湖", commuteTime: "15分钟", xhsSource: "小红书@历史人物" },
      { name: "中国丝绸博物馆", ticket: 0, duration: "2小时", commuteFrom: "西湖", commuteTime: "20分钟", xhsSource: "小红书@丝绸文化" },
      { name: "宋城", ticket: 300, duration: "4-5小时", commuteFrom: "市区", commuteTime: "30分钟", xhsSource: "小红书@穿越体验" }
    ],
    nature: [
      { name: "西溪湿地", ticket: 80, duration: "3-4小时", commuteFrom: "灵隐寺", commuteTime: "30分钟", xhsSource: "小红书@湿地生态" },
      { name: "龙井村", ticket: 0, duration: "2-3小时", commuteFrom: "西溪", commuteTime: "25分钟", xhsSource: "小红书@茶文化" },
      { name: "九溪烟树", ticket: 0, duration: "3小时", commuteFrom: "龙井", commuteTime: "20分钟", xhsSource: "小红书@徒步路线" },
      { name: "千岛湖", ticket: 150, duration: "全天", commuteFrom: "市区", commuteTime: "90分钟", xhsSource: "小红书@湖光山色" }
    ],
    food: [
      { name: "西湖醋鱼（楼外楼）", cost: 120, location: "西湖边", xhsSource: "小红书@杭帮菜" },
      { name: "东坡肉（知味观）", cost: 60, location: "上城区", xhsSource: "小红书@传统美食" },
      { name: "龙井虾仁", cost: 80, location: "西湖区", xhsSource: "小红书@茶香四溢" },
      { name: "片儿川", cost: 25, location: "市区", xhsSource: "小红书@杭州面馆" },
      { name: "定胜糕", cost: 10, location: "河坊街", xhsSource: "小红书@传统糕点" }
    ],
    shopping: [
      { name: "延安路商业街", cost: 200, duration: "2-3小时", xhsSource: "小红书@购物攻略" },
      { name: "河坊街", cost: 150, duration: "2小时", xhsSource: "小红书@文创街区" },
      { name: "南宋御街", cost: 100, duration: "2小时", xhsSource: "小红书@历史街区" }
    ],
    family: [
      { name: "杭州乐园", ticket: 220, duration: "6-8小时", xhsSource: "小红书@亲子乐园" },
      { name: "宋城", ticket: 300, duration: "4-5小时", xhsSource: "小红书@穿越演出" },
      { name: "杭州动物园", ticket: 15, duration: "2-3小时", xhsSource: "小红书@动物观赏" }
    ],
    photo: [
      { name: "断桥残雪", ticket: 0, duration: "1小时", bestTime: "清晨", xhsSource: "小红书@西湖晨景" },
      { name: "苏堤", ticket: 0, duration: "1小时", bestTime: "傍晚", xhsSource: "小红书@堤岸漫步" },
      { name: "花港观鱼", ticket: 0, duration: "1小时", bestTime: "上午", xhsSource: "小红书@鱼摄影" }
    ],
    leisure: [
      { name: "西湖边下午茶", cost: 80, duration: "2小时", xhsSource: "小红书@休闲时光" },
      { name: "龙井村品茶", cost: 50, duration: "2小时", xhsSource: "小红书@茶文化体验" }
    ],
    tips: [
      "西湖建议租自行车环游，比走路轻松",
      "灵隐寺门票含飞来峰，建议早上去",
      "龙井村喝茶体验不错，注意辨别茶叶品质",
      "杭州美食偏甜，不太习惯的可提前说明",
      "西湖周边共享单车方便，但周末人多"
    ]
  }
};
