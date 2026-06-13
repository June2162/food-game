/*
  山海关乡土美食科普小游戏主逻辑
  给非计算机专业队员的修改提示：页面文字和门店信息主要在 data.js 修改。
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

levelTab.addEventListener('click', function() { switchView('level'); });
mapTab.addEventListener('click', function() { switchView('map'); });
closeModalButton.addEventListener('click', closeModal);
infoModal.querySelector('.modal-mask').addEventListener('click', closeModal);
resetProgressButton.addEventListener('click', resetProgress);

renderFoodCards();

function switchView(viewName) {
  var isLevel = viewName === 'level';
  levelTab.classList.toggle('active', isLevel);
  mapTab.classList.toggle('active', !isLevel);
  levelView.classList.toggle('active-view', isLevel);
  mapView.classList.toggle('active-view', !isLevel);

  if (!isLevel) {
    // 等容器完全显示后再初始化地图
    setTimeout(function() {
      initMap();
    }, 300);
  }
}

function initMap() {
  // 已初始化则刷新尺寸即可
  if (state.leafletMap) {
    state.leafletMap.invalidateSize();
    return;
  }

  var mapEl = document.getElementById('realMap');
  if (!mapEl) return;

  var map = L.map('realMap', {
    center: [39.98, 119.69],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: true
  });

  state.leafletMap = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  addMarkers(map);
  updateMapLegend();

  // 二次刷新确保手机端正确渲染
  setTimeout(function() {
    map.invalidateSize();
  }, 400);
}

function addMarkers(map) {
  var colors = {
    boluoye: '#a7442b',
    icecream: '#3a7abf',
    peanutcake: '#d7a14b'
  };

  foods.forEach(function(food) {
    var unlocked = state.unlockedFoodIds.indexOf(food.id) !== -1;
    var color = unlocked ? colors[food.id] : '#9a948b';

    food.stores.forEach(function(store) {
      var markerHtml = '<div style="'
        + 'width:36px;height:36px;border-radius:50%;'
        + 'background:' + color + ';border:3px solid #fff;'
        + 'box-shadow:0 3px 10px rgba(0,0,0,0.25);'
        + 'display:flex;align-items:center;justify-content:center;'
        + 'font-size:17px;'
        + '">' + food.emoji + '</div>';

      var icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38]
      });

      var phoneRow = store.phone
        ? '<div class="popup-row"><span class="popup-label">电话：</span>' + store.phone + '</div>'
        : '';

      var lockedTip = !unlocked
        ? '<div class="popup-locked">完成"' + food.name + '"闯关后可解锁高亮显示</div>'
        : '';

      var popupHtml = '<div class="popup-name">' + store.name + '</div>'
        + '<div class="popup-row"><span class="popup-label">分类：</span>' + food.name + '</div>'
        + '<div class="popup-row"><span class="popup-label">地址：</span>' + store.address + '</div>'
        + phoneRow
        + '<div class="popup-row"><span class="popup-label">营业时间：</span>' + store.openTime + '</div>'
        + '<div class="popup-row"><span class="popup-label">区域：</span>' + store.area + '</div>'
        + lockedTip;

      var marker = L.marker([store.lat, store.lng], { icon: icon }).addTo(map);
      marker.bindPopup(popupHtml, { maxWidth: 260 });
    });
  });
}

function updateMapLegend() {
  var unlockedCount = state.unlockedFoodIds.length;
  mapLegend.innerHTML = '已解锁 ' + unlockedCount + ' / ' + foods.length + ' 类美食高亮点位。'
    + '&nbsp;🟤 桲椤叶饼&nbsp;&nbsp;🔵 山海关冰糕&nbsp;&nbsp;🟡 花生糕<br>'
    + '灰色标记表示未通关，点击仍可查看门店详细信息。';
}

function renderFoodCards() {
  foodCards.innerHTML = foods.map(function(food) {
    var unlocked = state.unlockedFoodIds.indexOf(food.id) !== -1;
    return '<article class="food-card">'
      + '<div class="food-image">' + food.emoji + '<br>' + food.coverText + '</div>'
      + '<div>'
      + '<h3>' + food.name + '</h3>'
      + '<p>' + food.intro + '</p>'
      + '<div class="card-actions">'
      + '<span class="status-pill ' + (unlocked ? 'done' : '') + '">' + (unlocked ? '已通关' : '未通关') + '</span>'
      + '<button class="primary-button" type="button" onclick="startChallenge(\'' + food.id + '\')">开始闯关</button>'
      + '</div>'
      + '</div>'
      + '</article>';
  }).join('');
}

function startChallenge(foodId) {
  state.activeFoodId = foodId;
  state.currentStepIndex = 0;
  renderChallenge();
  challengePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderChallenge() {
  var food = getActiveFood();
  if (!food) return;

  var step = food.steps[state.currentStepIndex];
  var currentNumber = state.currentStepIndex + 1;
  var total = food.steps.length;

  var optionButtons = step.options.map(function(option, index) {
    return '<button class="option-button" type="button" onclick="chooseStep(' + index + ')">' + option + '</button>';
  }).join('');

  challengePanel.classList.remove('hidden');
  challengePanel.innerHTML = '<div class="challenge-head">'
    + '<div>'
    + '<h3 class="challenge-title">' + food.name + '制作闯关</h3>'
    + '<div class="step-progress">第 ' + currentNumber + ' / ' + total + ' 步</div>'
    + '</div>'
    + '<button class="text-button" type="button" onclick="hideChallenge()">收起</button>'
    + '</div>'
    + '<div class="story-box">'
    + '<strong>' + step.question + '</strong><br>'
    + '<span>答对后会弹出食材科普和本地民俗故事，你可以在 data.js 中替换这些预留文案。</span>'
    + '</div>'
    + '<div class="option-list">' + optionButtons + '</div>';
}

function chooseStep(optionIndex) {
  var food = getActiveFood();
  var step = food.steps[state.currentStepIndex];
  var option = step.options[optionIndex];
  var optionButtons = challengePanel.querySelectorAll('.option-button');
  var selectedButton = optionButtons[optionIndex];

  if (option === step.correct) {
    selectedButton.classList.add('correct');
    showStepInfo(food, step);
    return;
  }

  selectedButton.classList.add('wrong');
  openModal('<h3>再想一想</h3>'
    + '<p>' + step.wrongTip + '</p>'
    + '<button class="small-button" type="button" onclick="closeModal()">继续选择</button>');
}

function showStepInfo(food, step) {
  var isLastStep = state.currentStepIndex === food.steps.length - 1;
  openModal('<h3>' + (isLastStep ? '本关完成前的科普' : '答对啦') + '</h3>'
    + '<div class="info-line"><strong>食材科普：</strong>' + step.science + '</div>'
    + '<div class="info-line"><strong>本地民俗小故事：</strong>' + step.folkTip + '</div>'
    + '<button class="small-button" type="button" onclick="goNextStep()">'
    + (isLastStep ? '完成本关' : '进入下一步') + '</button>');
}

function goNextStep() {
  closeModal();
  var food = getActiveFood();
  var isLastStep = state.currentStepIndex === food.steps.length - 1;

  if (isLastStep) {
    unlockFood(food.id);
    openModal('<h3>' + food.name + '通关成功</h3>'
      + '<p>' + food.unlockText + '</p>'
      + '<button class="small-button" type="button" onclick="closeModal(); switchView(\'map\')">去地图看看</button>');
    challengePanel.classList.add('hidden');
    renderFoodCards();
    if (state.leafletMap) {
      state.leafletMap.remove();
      state.leafletMap = null;
    }
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
  return foods.find(function(food) { return food.id === state.activeFoodId; });
}

function unlockFood(foodId) {
  if (state.unlockedFoodIds.indexOf(foodId) === -1) {
    state.unlockedFoodIds.push(foodId);
    saveProgress();
  }
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey)) || [];
  } catch (e) {
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
  openModal('<h3>进度已重置</h3>'
    + '<p>三个美食点位已恢复为未通关状态，地图图标会重新置灰。</p>'
    + '<button class="small-button" type="button" onclick="closeModal()">好的</button>');
}
