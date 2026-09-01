const fs = require('fs');
const filePath = 'src/components/trip/TripForm.tsx';
let content = fs.readFileSync(filePath, 'utf8');
const oldStr = 'router.push(\"/travel/result/\" + data.data.trip.id)';
const newStr = 'window.location.href = \"/travel/result/\" + data.data.trip.id';
if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replacement done');
} else {
  console.log('Pattern not found');
  console.log(content.substring(2800, 2950));
}
