/*
  山海关乡土美食科普小游戏主逻辑

  给非计算机专业队员的修改提示：
  - 页面文字和门店信息主要在 data.js 修改。
  - 本文件主要负责按钮点击、闯关判断、地图渲染和弹窗显示。
*/

const foods = window.FOOD_GAME_DATA;
const progressKey = 'qinhuangdao_food_game_unlocked';

const state = {
  activeFoodId: null,
  currentStepIndex: 0,
  unlockedFoodIds: loadProgress(),
  leafletMap: null
};

const levelTab = document.getElementById('levelTab');
const mapTab = document.getElementById('mapTab');
const levelView = document.getElementById('levelView');
const mapView = document.getElementById('mapView');
const foodCards = document.getElementById('foodCards');
const challengePanel = document.getElementById('challengePanel');
const mapLegend = document.getElementById('mapLegend');
const infoModal = document.getElementById('infoModal');
const modalContent = document.getElementById('modalContent');
const closeModalButton = document.getElementById('closeModalButton');
const resetProgressButton = document.getElementById('resetProgressButton');

levelTab.addEventListener('click', () => switchView('level'));
mapTab.addEventListener('click', () => switchView('map'));
closeModalButton.addEventListener('click', closeModal);
infoModal.querySelector('.modal-mask').addEventListener('click', closeModal);
resetProgressButton.addEventListener('click', resetProgress);

renderFoodCards();

function switchView(viewName) {
  const isLevel = viewName === 'level';
  levelTab.classList.toggle('active', isLevel);
  mapTab.classList.toggle('active', !isLevel);
  levelView.classList.toggle('active-view', isLevel);
  mapView.classList.toggle('active-view', !isLevel);

  if (!isLevel) {
    initMap();
  }
}

function initMap() {
  if (state.leafletMap) {
    state.leafletMap.remove();
    state.leafletMap = null;
  }

  const map = L.map('realMap', {
    center: [39.98, 119.69],
    zoom: 11,
    zoomControl: true
  });

  state.leafletMap = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  const colors = {
    boluoye: '#a7442b',
    icecream: '#3a7abf',
    peanutcake: '#d7a14b'
  };

  foods.forEach((food) => {
    const unlocked = state.unlockedFoodIds.includes(food.id);
    const color = unlocked ? colors[food.id] : '#9a948b';

    food.stores.forEach((store) => {
      const markerHtml = `
        <div style="
          width:38px; height:38px; border-radius:50%;
          background:${color}; border:3px solid #fff;
          box-shadow:0 4px 12px rgba(0,0,0,0.22);
          display:flex; align-items:center; justify-content:center;
          font-size:18px; cursor:pointer;
        ">${food.emoji}</div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([store.lat, store.lng], { icon }).addTo(map);

      const phoneRow = store.phone
        ? `<div class="popup-row"><span class="popup-label">电话：</span>${store.phone}</div>`
        : '';
      const lockedTip = !unlocked
        ? `<div class="popup-locked">完成"${food.name}"闯关后可解锁高亮显示</div>`
        : '';

      const popupHtml = `
        <div class="popup-name">${store.name}</div>
        <div class="popup-row"><span class="popup-label">分类：</span>${food.name}</div>
        <div class="popup-row"><span class="popup-label">地址：</span>${store.address}</div>
        ${phoneRow}
        <div class="popup-row"><span class="popup-label">营业时间：</span>${store.openTime}</div>
        <div class="popup-row"><span class="popup-label">区域：</span>${store.area}</div>
        ${lockedTip}
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });
    });
  });

  updateMapLegend();

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

function updateMapLegend() {
  const unlockedCount = state.unlockedFoodIds.length;
  const total = foods.length;
  mapLegend.innerHTML = `
    已解锁 ${unlockedCount} / ${total} 类美食高亮点位。
    🟤 桲椤叶饼&nbsp;&nbsp;🔵 山海关冰糕&nbsp;&nbsp;🟡 花生糕<br>
    灰色标记表示未通关，点击仍可查看门店详细信息。
  `;
}

function renderFoodCards() {
  foodCards.innerHTML = foods.map((food) => {
    const unlocked = state.unlockedFoodIds.includes(food.id);
    return `
      <article class="food-card">
        <div class="food-image" aria-label="${food.name}图片替换位">${food.emoji}<br>${food.coverText}</div>
        <div>
          <h3>${food.name}</h3>
          <p>${food.intro}</p>
          <div class="card-actions">
            <span class="status-pill ${unlocked ? 'done' : ''}">${unlocked ? '已通关' : '未通关'}</span>
            <button class="primary-button" type="button" onclick="startChallenge('${food.id}')">开始闯关</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function startChallenge(foodId) {
  state.activeFoodId = foodId;
  state.currentStepIndex = 0;
  renderChallenge();
  challengePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderChallenge() {
  const food = getActiveFood();
  if (!food) return;

  const step = food.steps[state.currentStepIndex];
  const currentNumber = state.currentStepIndex + 1;
  const total = food.steps.length;

  challengePanel.classList.remove('hidden');
  challengePanel.innerHTML = `
    <div class="challenge-head">
      <div>
        <h3 class="challenge-title">${food.name}制作闯关</h3>
        <div class="step-progress">第 ${currentNumber} / ${total} 步</div>
      </div>
      <button class="text-button" type="button" onclick="hideChallenge()">收起</button>
    </div>
    <div class="story-box">
      <strong>${step.question}</strong><br>
      <span>答对后会弹出食材科普和本地民俗故事，你可以在 data.js 中替换这些预留文案。</span>
    </div>
    <div class="option-list">
      ${step.options.map((option, index) => `
        <button class="option-button" type="button" onclick="chooseStep(${index})">${option}</button>
      `).join('')}
    </div>
  `;
}

function chooseStep(optionIndex) {
  const food = getActiveFood();
  const step = food.steps[state.currentStepIndex];
  const option = step.options[optionIndex];
  const optionButtons = [...challengePanel.querySelectorAll('.option-button')];
  const selectedButton = optionButtons[optionIndex];

  if (option === step.correct) {
    selectedButton.classList.add('correct');
    showStepInfo(food, step);
    return;
  }

  selectedButton.classList.add('wrong');
  openModal(`
    <h3>再想一想</h3>
    <p>${step.wrongTip}</p>
    <button class="small-button" type="button" onclick="closeModal()">继续选择</button>
  `);
}

function showStepInfo(food, step) {
  const isLastStep = state.currentStepIndex === food.steps.length - 1;
  openModal(`
    <h3>${isLastStep ? '本关完成前的科普' : '答对啦'}</h3>
    <div class="info-line"><strong>食材科普：</strong>${step.science}</div>
    <div class="info-line"><strong>本地民俗小故事：</strong>${step.folkTip}</div>
    <button class="small-button" type="button" onclick="goNextStep()">${isLastStep ? '完成本关' : '进入下一步'}</button>
  `);
}

function goNextStep() {
  closeModal();
  const food = getActiveFood();
  const isLastStep = state.currentStepIndex === food.steps.length - 1;

  if (isLastStep) {
    unlockFood(food.id);
    openModal(`
      <h3>${food.name}通关成功</h3>
      <p>${food.unlockText}</p>
      <button class="small-button" type="button" onclick="closeModal(); switchView('map')">去地图看看</button>
    `);
    challengePanel.classList.add('hidden');
    renderFoodCards();
    return;
  }

  state.currentStepIndex += 1;
  renderChallenge();
}

function hideChallenge() {
  challengePanel.classList.add('hidden');
}

function openModal(html) {
  modalContent.innerHTML = html;
  infoModal.classList.remove('hidden');
}

function closeModal() {
  infoModal.classList.add('hidden');
}

function getActiveFood() {
  return foods.find((food) => food.id === state.activeFoodId);
}

function unlockFood(foodId) {
  if (!state.unlockedFoodIds.includes(foodId)) {
    state.unlockedFoodIds.push(foodId);
    saveProgress();
  }
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(progressKey, JSON.stringify(state.unlockedFoodIds));
}

function resetProgress() {
  state.unlockedFoodIds = [];
  localStorage.removeItem(progressKey);
  renderFoodCards();
  hideChallenge();
  if (state.leafletMap) {
    state.leafletMap.remove();
    state.leafletMap = null;
  }
  openModal(`
    <h3>进度已重置</h3>
    <p>三个美食点位已恢复为未通关状态，地图图标会重新置灰。</p>
    <button class="small-button" type="button" onclick="closeModal()">好的</button>
  `);
}
