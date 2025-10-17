const KEY_TASKS = 'hunterAssignments';
const KEY_POINTS = 'hunterPoints';

// === 日期工具 ===
function getDateKey(d=new Date()){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

// === LocalStorage ===
function loadAssignments(){
  try{ return JSON.parse(localStorage.getItem(KEY_TASKS))||{}; }catch{ return {}; }
}
function saveAssignments(a){ localStorage.setItem(KEY_TASKS, JSON.stringify(a)); }
function loadPoints(){ return parseInt(localStorage.getItem(KEY_POINTS)||'0'); }
function savePoints(p){ localStorage.setItem(KEY_POINTS, p); }

// === 功能 ===
function randomTask(){ return TASKS[Math.floor(Math.random()*TASKS.length)]; }

const todayTaskEl = document.getElementById('todayTask');
const nextTaskEl = document.getElementById('nextTask');
const xpFill = document.getElementById('xpFill');
const xpText = document.getElementById('xpText');
const rewardMsg = document.getElementById('rewardMsg');
const redeemBtn = document.getElementById('redeemBtn');
const historyListEl = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const clearPointsBtn = document.getElementById('clearPointsBtn');
const doneMark = document.getElementById('doneMark');

function isSchoolDay(d){
  const day = d.getDay();
  return day>=1 && day<=5; // 週一到週五
}

function moveNextToToday(){
  const a = loadAssignments();
  const todayKey = getDateKey();
  if(isSchoolDay(new Date()) && a['next']){
    a[todayKey] = a['next'];   // 強制搬移
    delete a['next'];
    saveAssignments(a);
  }
}

function formatDateStr(dateStr){
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const week = ['日','一','二','三','四','五','六'][d.getDay()];
  return `${y}-${m}-${day}（週${week}）`;
}

function render(){
  moveNextToToday();
  const a = loadAssignments();
  const todayKey = getDateKey();
  const today = a[todayKey];
  todayTaskEl.textContent = today? today : '尚未指定';

  if(a['done_'+todayKey]){
    doneMark.textContent = '✔ 今天的任務已完成 ✔';
  } else {
    doneMark.textContent = '';
  }

  const next = a['next'];
  nextTaskEl.textContent = next? next : '尚未抽籤';

  const pts = loadPoints();
  const rewards = Math.floor(pts / 5);  // 可兌換次數
  const current = pts % 5;              // 當前進度
  const percent = (current/5)*100;

  xpFill.style.width = percent+"%";
  xpText.textContent = current+" / 5 (可兌換 "+rewards+" 次)";

  if (rewards > 0){
    rewardMsg.textContent = "恭喜！你可以換 "+rewards+" 次 30 分鐘 Minecraft 🎮";
    redeemBtn.style.display = 'inline-block';
  } else {
    rewardMsg.textContent = "";
    redeemBtn.style.display = 'none';
  }

  // 任務歷史紀錄（最近 10 筆）
  const keys = Object.keys(a).filter(k=>k!=='next').sort();
  const recent = keys.slice(-10);
  historyListEl.innerHTML = recent.map(k=>`<li>${formatDateStr(k)}：${a[k]}</li>`).join('');
}

// === 事件 ===
document.getElementById('drawBtn').onclick=()=>{
  const a = loadAssignments();
  a['next'] = randomTask();
  saveAssignments(a);
  render();
};
document.getElementById('redrawBtn').onclick=()=>{
  const a = loadAssignments();
  a['next'] = randomTask();
  saveAssignments(a);
  render();
};
document.getElementById('clearBtn').onclick=()=>{
  const a = loadAssignments();
  delete a['next'];
  saveAssignments(a);
  render();
};

document.getElementById('completeBtn').onclick=()=>{
  const todayKey = getDateKey();
  const a = loadAssignments();
  if(a['done_'+todayKey]){
    alert("今天的任務已經完成過了！");
    return;
  }
  let pts = loadPoints();
  pts++;
  savePoints(pts);
  a['done_'+todayKey] = true; // 標記今天完成過
  saveAssignments(a);

  // +1 EXP 漂浮動畫
  const expText = document.createElement('div');
  expText.textContent = '+1 EXP';
  expText.style.position = 'fixed';
  expText.style.left = '50%';
  expText.style.top = '50%';
  expText.style.transform = 'translate(-50%, -50%)';
  expText.style.fontSize = '2rem';
  expText.style.color = '#0f0';
  expText.style.textShadow = '0 0 10px #0f0';
  expText.style.animation = 'floatUp 1s forwards';
  document.body.appendChild(expText);
  setTimeout(()=> expText.remove(), 1000);

  render();
};

redeemBtn.onclick=()=>{
  let pts = loadPoints();
  if(pts >= 5){
    pts -= 5;
    savePoints(pts);
    alert("已兌換 30 分鐘 Minecraft，積分扣除 5 點！");
    render();
  }
};

clearPointsBtn.onclick=()=>{
  if(!passwordCheck()) return;
  if(confirm("確定要清除所有積分嗎？")){
    savePoints(0);
    render();
  }
};

function passwordCheck(){
  const input = prompt("請輸入密碼：");
  return input === "0329"; // 可自行修改密碼
}

// 家長強制加分
document.getElementById('parentAddPointBtn').onclick=()=>{
  if(!passwordCheck()) return;
  let pts = loadPoints();
  pts++;
  savePoints(pts);
  alert("已強制加 1 分！");
  render();
};

document.getElementById('forceMoveBtn').onclick=()=>{
  if(!passwordCheck()) return;
  const a = loadAssignments();
  const todayKey = getDateKey();
  if(a['next']){
    a[todayKey] = a['next'];
    delete a['next'];
    saveAssignments(a);
    alert("已強制搬移：明天的任務改成今天的任務");
    render();
  } else {
    alert("目前沒有明天的任務可以搬移");
  }
};

clearHistoryBtn.onclick=()=>{
  if(!passwordCheck()) return;
  if(confirm("確定要清除歷史紀錄嗎？")){
    const a = loadAssignments();
    for(const k of Object.keys(a)){
      if(k!=='next') delete a[k];
    }
    saveAssignments(a);
    render();
  }
};

render();
