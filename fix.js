const fs=require('fs');
const f='src/components/trip/TripForm.tsx';
let c=fs.readFileSync(f,'utf8');
c=c.replace('router.push(\"/travel/result/\" + data.data.trip.id)', 'window.location.href = \"/travel/result/\" + data.data.trip.id');
fs.writeFileSync(f,c,'utf8');
console.log('Done');
