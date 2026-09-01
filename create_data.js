const fs = require('fs');
const cities = ['三亚','上海','丽江','北京','南京','厦门','大理','大连','广州','张家界','成都','昆明','杭州','桂林','武汉','深圳','苏州','西安','重庆','青岛','黄山'];
const data = {};
cities.forEach(c => {
  data[c] = {
    attractions: [
      { name: c + '海滨', ticket: 0, duration: '3小时', location: '海边', commuteTime: '15分钟', address: c + '滨海路' },
      { name: c + '古镇', ticket: 50, duration: '2小时', location: '古城', commuteTime: '20分钟', address: c + '古城景区' },
      { name: c + '博物馆', ticket: 0, duration: '1.5小时', location: '市中心', commuteTime: '10分钟', address: c + '文化街' }
    ],
    foods: [
      { name: '特色小吃', cost: 30, recommendation: '本地必吃', location: '小吃街' },
      { name: '海鲜大餐', cost: 120, recommendation: '新鲜美味', location: '海鲜市场' },
      { name: '传统餐厅', cost: 80, recommendation: '地道口味', location: '老城区' }
    ],
    tips: ['提前预订酒店', '避开节假日出行', '穿舒适的鞋子']
  };
});
fs.writeFileSync('src/app/data/cityTravelData.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Created cityTravelData.json');
