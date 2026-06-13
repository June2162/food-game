/*
  山海关乡土美食科普小游戏主逻辑

  给非计算机专业队员的修改提示：
  - 页面文字和门店信息主要在 data.js 修改。
  - 本文件主要负责按钮点击、闯关判断、地图高亮和弹窗显示。
  - 不需要改动复杂框架，也没有引入付费插件。
*/

const foods = window.FOOD_GAME_DATA;
const progressKey = 'qinhuangdao_food_game_unlocked';

const state = {
  activeFoodId: null,
  currentStepIndex: 0,
  unlockedFoodIds: loadProgress()
};

const levelTab = document.getElementById('levelTab');
const mapTab = document.getElementById('mapTab');
const levelView = document.getElementById('levelView');
const mapView = document.getElementById('mapView');
const foodCards = document.getElementById('foodCards');
const challengePanel = document.getElementById('challengePanel');
const mapMarkers = document.getElementById('mapMarkers');
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
renderMap();

function switchView(viewName) {
  const isLevel = viewName === 'level';
  levelTab.classList.toggle('active', isLevel);
  mapTab.classList.toggle('active', !isLevel);
  levelView.classList.toggle('active-view', isLevel);
  mapView.classList.toggle('active-view', !isLevel);
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
      <span>答对后会弹出食材科普和本地民俗故事。你可以在 data.js 中替换这些预留文案。</span>
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
    renderMap();
    return;
  }

  state.currentStepIndex += 1;
  renderChallenge();
}

function hideChallenge() {
  challengePanel.classList.add('hidden');
}

function renderMap() {
  mapMarkers.innerHTML = foods.map((food) => {
    const unlocked = state.unlockedFoodIds.includes(food.id);
    return `
      <button
        class="map-marker ${unlocked ? '' : 'locked'}"
        style="left:${food.mapPosition.x}%; top:${food.mapPosition.y}%;"
        type="button"
        onclick="showStoreInfo('${food.id}')"
        aria-label="查看${food.name}门店信息"
      >
        ${food.shortName}
      </button>
    `;
  }).join('');

  const unlockedCount = state.unlockedFoodIds.length;
  mapLegend.innerHTML = `已解锁 ${unlockedCount} / ${foods.length} 个高亮点位。灰色图标表示尚未通关，但仍可点击查看完整门店信息。`;
}

function showStoreInfo(foodId) {
  const food = foods.find((item) => item.id === foodId);
  const unlocked = state.unlockedFoodIds.includes(foodId);
  const photoContent = food.store.photo
    ? `<img class="store-photo" src="${food.store.photo}" alt="${food.store.name}实拍图" />`
    : `<div class="store-photo">${food.store.photoPlaceholder}</div>`;

  openModal(`
    <h3>${food.store.name}</h3>
    ${photoContent}
    <div class="info-line"><strong>解锁状态：</strong>${unlocked ? '已通关，高亮展示' : '未通关，地图置灰但可浏览'}</div>
    <div class="info-line"><strong>详细地址：</strong>${food.store.address}</div>
    <div class="info-line"><strong>营业时间：</strong>${food.store.openTime}</div>
    <div class="info-line"><strong>特色点评：</strong>${food.store.comment}</div>
    <button class="small-button" type="button" onclick="closeModal()">我知道了</button>
  `);
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
  renderMap();
  hideChallenge();
  openModal(`
    <h3>进度已重置</h3>
    <p>三个美食点位已恢复为未通关状态，地图图标会重新置灰。</p>
    <button class="small-button" type="button" onclick="closeModal()">好的</button>
  `);
}
