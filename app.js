/*
  秦皇岛乡土非遗美食数字体验馆主逻辑
*/

var foods = window.FOOD_GAME_DATA;
var progressKey = 'qinhuangdao_food_game_unlocked';

var state = {
  activeFoodId: null,
  currentStepIndex: 0,
  unlockedFoodIds: loadProgress(),
  leafletMap: null
};

var levelTab = document.getElementById('levelTab');
var cookTab = document.getElementById('cookTab');
var resultTab = document.getElementById('resultTab');
var mapTab = document.getElementById('mapTab');
var levelView = document.getElementById('levelView');
var cookView = document.getElementById('cookView');
var resultView = document.getElementById('resultView');
var mapView = document.getElementById('mapView');
var foodCards = document.getElementById('foodCards');
var challengePanel = document.getElementById('challengePanel');
var mapLegend = document.getElementById('mapLegend');
var infoModal = document.getElementById('infoModal');
var modalContent = document.getElementById('modalContent');
var closeModalButton = document.getElementById('closeModalButton');
var resetProgressButton = document.getElementById('resetProgressButton');

levelTab.addEventListener('click', function() { switchView('level'); });
cookTab.addEventListener('click', function() { switchView('cook'); });
resultTab.addEventListener('click', function() { switchView('result'); });
mapTab.addEventListener('click', function() { switchView('map'); });
closeModalButton.addEventListener('click', closeModal);
infoModal.querySelector('.modal-mask').addEventListener('click', closeModal);
resetProgressButton.addEventListener('click', resetProgress);

renderFoodCards();

function switchView(viewName) {
  levelTab.classList.toggle('active', viewName === 'level');
  cookTab.classList.toggle('active', viewName === 'cook');
  resultTab.classList.toggle('active', viewName === 'result');
  mapTab.classList.toggle('active', viewName === 'map');
  levelView.classList.toggle('active-view', viewName === 'level');
  cookView.classList.toggle('active-view', viewName === 'cook');
  resultView.classList.toggle('active-view', viewName === 'result');
  mapView.classList.toggle('active-view', viewName === 'map');

  if (viewName === 'map') {
    setTimeout(function() { initMap(); }, 300);
  }
}

function initMap() {
  if (state.leafletMap) {
    state.leafletMap.invalidateSize();
    return;
  }

  var mapEl = document.getElementById('realMap');
  if (!mapEl) return;

  var map = L.map('realMap', {
    center: [40.01, 119.77],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: true
  });

  state.leafletMap = map;

  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    attribution: '高德地图',
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 18
  }).addTo(map);

  addMarkers(map);
  updateMapLegend();
  setTimeout(function() { map.invalidateSize(); }, 400);
}

function addMarkers(map) {
  var colors = {
    boluoye: '#a7442b',
    lvshi_ice: '#3a7abf',
    ligao_tang: '#d7a14b'
  };

  foods.forEach(function(food) {
    var unlocked = state.unlockedFoodIds.indexOf(food.id) !== -1;
    var color = unlocked ? colors[food.id] : '#9a948b';

    food.stores.forEach(function(store) {
      var markerHtml = '<div style="width:38px;height:38px;border-radius:50%;background:' + color + ';border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:18px;">' + food.emoji + '</div>';
      var icon = L.divIcon({ html: markerHtml, className: '', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -40] });
      var phoneRow = store.phone ? '<div class="popup-row"><span class="popup-label">电话：</span>' + store.phone + '</div>' : '';
      var popupHtml = '<div class="popup-name">' + store.name + '</div>'
        + '<div class="popup-row"><span class="popup-label">类别：</span>' + food.name + '</div>'
        + '<div class="popup-row"><span class="popup-label">地址：</span>' + store.address + '</div>'
        + phoneRow
        + '<div class="popup-row"><span class="popup-label">营业/采访时间：</span>' + store.openTime + '</div>'
        + '<div class="popup-row"><span class="popup-label">区域：</span>' + store.area + '</div>'
        + '<div class="popup-locked">后续可接入实地照片、视频与采访摘要</div>';
      L.marker([store.lat, store.lng], { icon: icon }).addTo(map).bindPopup(popupHtml, { maxWidth: 270 });
    });
  });
}

function updateMapLegend() {
  var unlockedCount = state.unlockedFoodIds.length;
  mapLegend.innerHTML = '已解锁 ' + unlockedCount + ' / ' + foods.length + ' 类美食档案高亮点位。<br>🥟 桲椤叶饼&nbsp;&nbsp;🍦 吕氏老冰糕&nbsp;&nbsp;🍐 梨膏糖';
}

function renderFoodCards() {
  foodCards.innerHTML = foods.map(function(food) {
    var unlocked = state.unlockedFoodIds.indexOf(food.id) !== -1;
    return '<article class="food-card archive-card">'
      + '<div class="food-image archive-cover"><span>' + food.emoji + '</span><small>' + food.coverText + '</small></div>'
      + '<div>'
      + '<div class="archive-tag">' + food.archiveTag + '</div>'
      + '<h3>' + food.name + '</h3>'
      + '<p>' + food.intro + '</p>'
      + '<div class="interview-hint">' + food.interviewHint + '</div>'
      + '<div class="card-actions">'
      + '<span class="status-pill ' + (unlocked ? 'done' : '') + '">' + (unlocked ? '档案已解锁' : '待完成小测') + '</span>'
      + '<button class="primary-button" type="button" onclick="startChallenge(\'' + food.id + '\')">进入档案</button>'
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
  challengePanel.innerHTML = '<div class="challenge-head"><div><h3 class="challenge-title">' + food.name + '档案小测</h3><div class="step-progress">第 ' + currentNumber + ' / ' + total + ' 问</div></div><button class="text-button" type="button" onclick="hideChallenge()">收起</button></div>'
    + '<div class="story-box"><strong>' + step.question + '</strong><br><span>通过小测解锁该美食的地图高亮和采访档案展示。</span></div>'
    + '<div class="option-list">' + optionButtons + '</div>';
}

function chooseStep(optionIndex) {
  var food = getActiveFood();
  var step = food.steps[state.currentStepIndex];
  var option = step.options[optionIndex];
  var btns = challengePanel.querySelectorAll('.option-button');
  if (option === step.correct) {
    btns[optionIndex].classList.add('correct');
    showStepInfo(food, step);
    return;
  }
  btns[optionIndex].classList.add('wrong');
  openModal('<h3>再想一想</h3><p>' + step.wrongTip + '</p><button class="small-button" type="button" onclick="closeModal()">继续选择</button>');
}

function showStepInfo(food, step) {
  var isLast = state.currentStepIndex === food.steps.length - 1;
  openModal('<h3>' + (isLast ? '档案即将解锁' : '答对啦') + '</h3><div class="info-line"><strong>知识点：</strong>' + step.science + '</div><div class="info-line"><strong>采访补充位：</strong>' + step.folkTip + '</div><button class="small-button" type="button" onclick="goNextStep()">' + (isLast ? '完成档案小测' : '进入下一问') + '</button>');
}

function goNextStep() {
  closeModal();
  var food = getActiveFood();
  var isLast = state.currentStepIndex === food.steps.length - 1;
  if (isLast) {
    unlockFood(food.id);
    openModal('<h3>' + food.name + '档案已解锁</h3><p>' + food.unlockText + '</p><button class="small-button" type="button" onclick="closeModal(); switchView(\'cook\')">去互动制作</button><button class="small-button" type="button" onclick="closeModal(); switchView(\'map\')">看实地地图</button>');
    challengePanel.classList.add('hidden');
    renderFoodCards();
    if (state.leafletMap) { state.leafletMap.remove(); state.leafletMap = null; }
    return;
  }
  state.currentStepIndex += 1;
  renderChallenge();
}

function hideChallenge() { challengePanel.classList.add('hidden'); }
function openModal(html) { modalContent.innerHTML = html; infoModal.classList.remove('hidden'); }
function closeModal() { infoModal.classList.add('hidden'); }
function getActiveFood() { return foods.find(function(f) { return f.id === state.activeFoodId; }); }

function unlockFood(foodId) {
  if (state.unlockedFoodIds.indexOf(foodId) === -1) {
    state.unlockedFoodIds.push(foodId);
    saveProgress();
  }
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey)) || []; } catch (e) { return []; }
}

function saveProgress() { localStorage.setItem(progressKey, JSON.stringify(state.unlockedFoodIds)); }

function resetProgress() {
  state.unlockedFoodIds = [];
  localStorage.removeItem(progressKey);
  renderFoodCards();
  hideChallenge();
  if (state.leafletMap) { state.leafletMap.remove(); state.leafletMap = null; }
  openModal('<h3>进度已重置</h3><p>所有美食档案恢复为未解锁状态。</p><button class="small-button" type="button" onclick="closeModal()">好的</button>');
}
