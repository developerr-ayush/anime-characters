const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const sourceDirs = [
  path.join(publicDir, 'anime characters by their eyes 1'),
  path.join(publicDir, 'anime characters by their eyes 2')
];

let allPairs = [];

for (const sourceDir of sourceDirs) {
  if (!fs.existsSync(sourceDir)) continue;
  
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'));
  // Find max pair number
  let maxNum = 0;
  for (const f of files) {
    const num = parseInt(f.split('.')[0]);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }
  
  const numPairs = Math.floor(maxNum / 2);
  for (let i = 1; i <= numPairs; i++) {
    const eyeFile = path.join(sourceDir, `${i*2 - 1}.jpg`);
    const revealFile = path.join(sourceDir, `${i*2}.jpg`);
    
    // Check if they exist, handle possible extensions if needed (assuming .jpg for now based on list_dir output)
    if (fs.existsSync(eyeFile) && fs.existsSync(revealFile)) {
      allPairs.push({ eye: eyeFile, reveal: revealFile });
    }
  }
}

console.log(`Found ${allPairs.length} pairs in total.`);

let packNum = 1;
let currentPairInPack = 1;

for (let i = 0; i < allPairs.length; i++) {
  const targetDirName = `anime characters by looking at eyes ${packNum}`;
  const targetDir = path.join(publicDir, targetDirName);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  
  const newEyePath = path.join(targetDir, `${currentPairInPack * 2 - 1}.jpg`);
  const newRevealPath = path.join(targetDir, `${currentPairInPack * 2}.jpg`);
  
  // copy files
  fs.copyFileSync(allPairs[i].eye, newEyePath);
  fs.copyFileSync(allPairs[i].reveal, newRevealPath);
  
  currentPairInPack++;
  if (currentPairInPack > 5) {
    packNum++;
    currentPairInPack = 1;
  }
}

console.log(`Created ${packNum} packs.`);
