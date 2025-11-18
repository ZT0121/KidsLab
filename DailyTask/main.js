const KEY_TASKS = 'hunterAssignments';
const KEY_POINTS = 'hunterPoints';
const KEY_REWARDS_USED = 'hunterRewardsUsed'; // ⭐ 新增：紀錄已兌換幾次

// === 日期工具 ===
function getDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// === LocalStorage ===
function loadAssignments() {
  try {
    return JSON.parse(localStorage.getItem(KEY_TASKS)) || {};
  } catch {
    return {};
  }
}
function saveAssignments(a) {
  localStorage.setItem(KEY_TASKS, JSON.stringify(a));
}
function loadPoints() {
  return parseInt(localStorage.getItem(KEY_POINTS) || '0');
}
function savePoints(p) {
  localStorage.setItem(KEY_POINTS, p);
}

// ⭐ 已兌換次數
function loadUsedRewards() {
  return parseInt(localStorage.getItem(KEY_REWARDS_USED) || '0');
}
function saveUsedRewards(n) {
  localStorage.setItem(KEY_REWARDS_USED, n);
}

// === 功能 ===
function randomTask() {
  return TASKS[Math.floor(Math.random() * TASKS.length)];
}

const todayTaskEl = document.getElementById('todayTask');
const xpFill = document.getElementById('xpFill');
const xpText = document.getElementById('xpText');
const rewardMsg = document.getElementById('rewardMsg');
const redeemBtn = document.getElementById('redeemBtn');
const historyListEl = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const clearPointsBtn = document.getElementById('clearPointsBtn');
const doneMark = document.getElementById('doneMark');
const usedTimesEl = document.getElementById('usedTimes');

function formatDateStr(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return `${y}-${m}-${day}（週${week}）`;
}

function render() {
  const a = loadAssignments();
  const todayKey = getDateKey();
  const today = a[todayKey];
  todayTaskEl.textContent = today ? today : '尚未指定';

  if (a['done_' + todayKey]) {
    doneMark.textContent = '✔ 今天的任務已完成 ✔';
  } else {
    doneMark.textContent = '';
  }

  const pts = loadPoints();
  const rewards = Math.floor(pts / 5);   // 每 5 點 = 1 次獎勵
  const current = pts % 5;               // 目前這一輪的進度
  const percent = (current / 5) * 100;
  const used = loadUsedRewards();        // 已兌換總次數

  xpFill.style.width = percent + "%";
  xpText.textContent = current + " / 5";

  // ⭐ 這裡改成你要的呈現方式
  if (rewardMsg) {
    rewardMsg.textContent = "可兌換：" + rewards + " 次";
  }
  if (usedTimesEl) {
    usedTimesEl.textContent = "已兌換：" + used + " 次";
  }

  // 任務歷史紀錄（最近 10 筆）
  const keys = Object.keys(a)
    .filter(k => !k.startsWith('done_'))
    .sort();
  const recent = keys.slice(-10);
  historyListEl.innerHTML = recent
    .map(k => `<li>${formatDateStr(k)}：${a[k]}</li>`)
    .join('');
}

// === 事件 ===
document.getElementById('drawBtn').onclick = () => {
  const a = loadAssignments();
  const todayKey = getDateKey();
  a[todayKey] = randomTask();
  saveAssignments(a);
  render();
};

document.getElementById('redrawBtn').onclick = () => {
  const a = loadAssignments();
  const todayKey = getDateKey();
  a[todayKey] = randomTask();
  saveAssignments(a);
  render();
};

document.getElementById('clearBtn').onclick = () => {
  const a = loadAssignments();
  const todayKey = getDateKey();
  delete a[todayKey];
  saveAssignments(a);
  render();
};

document.getElementById('completeBtn').onclick = () => {
  const todayKey = getDateKey();
  const a = loadAssignments();
  if (a['done_' + todayKey]) {
    alert("今天的任務已經完成過了！");
    return;
  }
  let pts = loadPoints();
  pts++;
  savePoints(pts);
  a['done_' + todayKey] = true;
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
  setTimeout(() => expText.remove(), 1000);

  render();
};

// 兌換：扣 5 點 + 已兌換次數 +1
redeemBtn.onclick = () => {
  let pts = loadPoints();
  const rewards = Math.floor(pts / 5);
  if (rewards <= 0) {
    alert("目前沒有可兌換的獎勵喔！");
    return;
  }
  pts -= 5;
  savePoints(pts);

  let used = loadUsedRewards();
  used++;
  saveUsedRewards(used);

  alert("已兌換 1 次：週六、週日各 +20 分鐘 Minecraft！");
  render();
};

clearPointsBtn.onclick = () => {
  if (!passwordCheck()) return;
  if (confirm("確定要清除所有積分嗎？")) {
    savePoints(0);
    render();
  }
};

function passwordCheck() {
  const input = prompt("請輸入密碼：");
  return input === "0329";
}

// 家長強制加分
document.getElementById('parentAddPointBtn').onclick = () => {
  if (!passwordCheck()) return;
  let pts = loadPoints();
  pts++;
  savePoints(pts);
  alert("已強制加 1 分！");
  render();
};

clearHistoryBtn.onclick = () => {
  if (!passwordCheck()) return;
  if (confirm("確定要清除歷史紀錄嗎？")) {
    const a = loadAssignments();
    for (const k of Object.keys(a)) {
      if (!k.startsWith('done_')) delete a[k];
    }
    saveAssignments(a);
    render();
  }
};

render();
