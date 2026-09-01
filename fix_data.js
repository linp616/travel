const fs = require('fs');

const data = {
  "三亚": {
    attractions: [
      { name: "亚龙湾", ticket: 0, duration: "3小时", location: "海边", commuteTime: "15分钟", address: "三亚亚龙湾" },
      { name: "大东海", ticket: 0, duration: "2小时", location: "海滨", commuteTime: "20分钟", address: "三亚大东海" },
      { name: "天涯海角", ticket: 80, duration: "2小时", location: "景区", commuteTime: "30分钟", address: "三亚天涯区" },
      { name: "南山文化旅游区", ticket: 120, duration: "3小时", location: "景区", commuteTime: "40分钟", address: "三亚崖州区" }
    ],
    foods: [
      { name: "椰子鸡", cost: 120, recommendation: "正宗海南味", location: "市区" },
      { name: "海鲜大餐", cost: 200, recommendation: "新鲜美味", location: "第一市场" },
      { name: "清补凉", cost: 30, recommendation: "清凉解暑", location: "街头小店" }
    ],
    tips: ["注意防晒", "避开节假日", "提前预订酒店"]
  },
  "北京": {
    attractions: [
      { name: "故宫", ticket: 60, duration: "3小时", location: "市中心", commuteTime: "10分钟", address: "东城区景山前街" },
      { name: "长城", ticket: 40, duration: "4小时", location: "延庆", commuteTime: "60分钟", address: "延庆区居庸关" },
      { name: "天坛", ticket: 15, duration: "2小时", location: "市区", commuteTime: "15分钟", address: "东城区天坛路" },
      { name: "颐和园", ticket: 30, duration: "3小时", location: "海淀区", commuteTime: "20分钟", address: "海淀区新建宫门路" }
    ],
    foods: [
      { name: "北京烤鸭", cost: 150, recommendation: "全聚德", location: "前门" },
      { name: "炸酱面", cost: 40, recommendation: "老北京味道", location: "胡同里" },
      { name: "铜锅涮肉", cost: 180, recommendation: "东来顺", location: "西城区" }
    ],
    tips: ["提前预约门票", "穿舒适鞋子", "注意天气变化"]
  },
  "上海": {
    attractions: [
      { name: "外滩", ticket: 0, duration: "2小时", location: "黄浦区", commuteTime: "10分钟", address: "黄浦区中山东一路" },
      { name: "豫园", ticket: 40, duration: "2小时", location: "老城区", commuteTime: "15分钟", address: "黄浦区福建中路" },
      { name: "东方明珠", ticket: 199, duration: "3小时", location: "浦东", commuteTime: "20分钟", address: "浦东新区世纪大道" },
      { name: "南京路", ticket: 0, duration: "2小时", location: "商业中心", commuteTime: "10分钟", address: "黄浦区南京路" }
    ],
    foods: [
      { name: "小笼包", cost: 50, recommendation: "南翔馒头店", location: "豫园" },
      { name: "生煎包", cost: 30, recommendation: "大壶春", location: "黄浦区" },
      { name: "本帮菜", cost: 120, recommendation: "上海味道", location: "静安区" }
    ],
    tips: ["地铁出行方便", "外滩夜景更美", "豫园人多注意财物"]
  },
  "成都": {
    attractions: [
      { name: "宽窄巷子", ticket: 0, duration: "2小时", location: "市区", commuteTime: "10分钟", address: "青羊区长顺街" },
      { name: "武侯祠", ticket: 50, duration: "2小时", location: "南区", commuteTime: "15分钟", address: "武侯区武侯祠大街" },
      { name: "杜甫草堂", ticket: 50, duration: "2小时", location: "西区", commuteTime: "20分钟", address: "青羊区草堂路" },
      { name: "大熊猫基地", ticket: 55, duration: "3小时", location: "北区", commuteTime: "30分钟", address: "成华区熊猫大道" }
    ],
    foods: [
      { name: "火锅", cost: 120, recommendation: "蜀大侠", location: "春熙路" },
      { name: "串串香", cost: 80, recommendation: "小龙坎", location: "全市" },
      { name: "担担面", cost: 20, recommendation: "传统小吃", location: "街头" }
    ],
    tips: ["辣度可选", "熊猫基地早去", "穿舒适鞋子"]
  },
  "杭州": {
    attractions: [
      { name: "西湖", ticket: 0, duration: "4小时", location: "市区", commuteTime: "10分钟", address: "西湖区" },
      { name: "灵隐寺", ticket: 75, duration: "2小时", location: "山区", commuteTime: "30分钟", address: "西湖区灵隐路" },
      { name: "千岛湖", ticket: 150, duration: "5小时", location: "淳安县", commuteTime: "90分钟", address: "淳安县千岛湖镇" },
      { name: "宋城", ticket: 300, duration: "4小时", location: "西湖区", commuteTime: "20分钟", address: "西湖区之江路" }
    ],
    foods: [
      { name: "东坡肉", cost: 68, recommendation: "传统名菜", location: "楼外楼" },
      { name: "西湖醋鱼", cost: 88, recommendation: "西湖味道", location: "奎元馆" },
      { name: "龙井虾仁", cost: 78, recommendation: "清新可口", location: "绿茶餐厅" }
    ],
    tips: ["西湖建议骑行", "龙井村品茶", "避开周末人流"]
  },
  "西安": {
    attractions: [
      { name: "兵马俑", ticket: 120, duration: "3小时", location: "临潼区", commuteTime: "40分钟", address: "临潼区秦始皇陵" },
      { name: "大雁塔", ticket: 30, duration: "2小时", location: "城区", commuteTime: "15分钟", address: "雁塔区大雁塔" },
      { name: "古城墙", ticket: 54, duration: "2小时", location: "城区", commuteTime: "10分钟", address: "碑林区城墙路" },
      { name: "华清池", ticket: 120, duration: "3小时", location: "临潼区", commuteTime: "40分钟", address: "临潼区华清路" }
    ],
    foods: [
      { name: "肉夹馍", cost: 15, recommendation: "秦豫肉夹馍", location: "全市" },
      { name: "凉皮", cost: 10, recommendation: "魏家凉皮", location: "全市" },
      { name: "羊肉泡馍", cost: 45, recommendation: "同盛祥", location: "回民街" }
    ],
    tips: ["兵马俑请导游", "回民街人多", "城墙骑车好玩"]
  },
  "厦门": {
    attractions: [
      { name: "鼓浪屿", ticket: 0, duration: "4小时", location: "岛屿", commuteTime: "20分钟", address: "思明区鼓浪屿" },
      { name: "南普陀寺", ticket: 0, duration: "1小时", location: "市区", commuteTime: "10分钟", address: "思明区思明南路" },
      { name: "曾厝垵", ticket: 0, duration: "2小时", location: "景区", commuteTime: "15分钟", address: "思明区曾厝垵" },
      { name: "环岛路", ticket: 0, duration: "3小时", location: "海边", commuteTime: "20分钟", address: "思明区环岛路" }
    ],
    foods: [
      { name: "沙茶面", cost: 25, recommendation: "traditional", location: "街头" },
      { name: "海蛎煎", cost: 20, recommendation: "闽南特色", location: "曾厝垵" },
      { name: "花生汤", cost: 15, recommendation: "早餐首选", location: "全市" }
    ],
    tips: ["鼓浪屿提前买票", "环岛路骑行", "曾厝垵商业化"]
  },
  "丽江": {
    attractions: [
      { name: "丽江古城", ticket: 0, duration: "3小时", location: "古城区", commuteTime: "10分钟", address: "古城区光义街" },
      { name: "玉龙雪山", ticket: 140, duration: "5小时", location: "雪山景区", commuteTime: "40分钟", address: "玉龙纳西族自治县" },
      { name: "束河古镇", ticket: 0, duration: "2小时", location: "古镇", commuteTime: "20分钟", address: "古城区束河镇" },
      { name: "蓝月谷", ticket: 0, duration: "2小时", location: "雪山脚下", commuteTime: "30分钟", address: "玉龙雪山景区内" }
    ],
    foods: [
      { name: "腊排骨", cost: 80, recommendation: "纳西特色", location: "古城内" },
      { name: "野生菌火锅", cost: 150, recommendation: "季节性美食", location: "古城周边" },
      { name: "酥油茶", cost: 20, recommendation: "藏式饮品", location: "古城内" }
    ],
    tips: ["高原注意防晒", "古城石板路穿平底鞋", "旺季提前订房"]
  }
};

fs.writeFileSync('src/app/data/cityTravelData.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed cityTravelData.json with', Object.keys(data).length, 'cities');
