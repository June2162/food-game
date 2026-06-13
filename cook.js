/*
  互动制作模块 - 拖动食材体验制作过程
  支持触屏拖拽（手机端）和鼠标拖拽（电脑端）
*/

var COOK_DATA = [
  {
    id: 'boluoye',
    name: '桲椤叶饼',
    emoji: '🥟',
    desc: '体验桲椤叶饼的传统制作工艺',
    steps: [
      {
        instruction: '第一步：清洗桲椤叶，去除杂质让叶片柔软',
        correctIngredient: 'leaf',
        resultText: '桲椤叶清洗干净了，散发着淡淡清香',
        resultEmoji: '🌿'
      },
      {
        instruction: '第二步：调制玉米面糊，搅拌均匀',
        correctIngredient: 'flour',
        resultText: '面糊调好了，稀稠适中',
        resultEmoji: '🫗'
      },
      {
        instruction: '第三步：准备韭菜鸡蛋馅料，切碎拌匀',
        correctIngredient: 'filling',
        resultText: '馅料拌好了，韭菜鸡蛋香气扑鼻',
        resultEmoji: '🥬'
      },
      {
        instruction: '第四步：将面糊和馅料放在桲椤叶上包合',
        correctIngredient: 'wrap',
        resultText: '包好了！叶片裹住了面糊和馅料',
        resultEmoji: '🫔'
      },
      {
        instruction: '第五步：放入蒸锅，大火蒸15分钟',
        correctIngredient: 'steam',
        resultText: '蒸熟了！桲椤叶饼散发着叶香和面香',
        resultEmoji: '♨️'
      }
    ],
    ingredients: [
      { id: 'leaf', emoji: '🍃', name: '桲椤叶' },
      { id: 'flour', emoji: '🌾', name: '玉米面' },
      { id: 'filling', emoji: '🥚', name: '韭菜鸡蛋' },
      { id: 'wrap', emoji: '🤲', name: '包合' },
      { id: 'steam', emoji: '🔥', name: '上蒸锅' },
      { id: 'oil', emoji: '🫒', name: '食用油' },
      { id: 'ice', emoji: '🧊', name: '冰块' }
    ]
  },
  {
    id: 'icecream',
    name: '山海关冰糕',
    emoji: '🍦',
    desc: '体验老城冰糕的制作过程',
    steps: [
      {
        instruction: '第一步：准备新鲜牛奶和白砂糖',
        correctIngredient: 'milk',
        resultText: '牛奶和糖准备好了',
        resultEmoji: '🥛'
      },
      {
        instruction: '第二步：加热搅拌让糖完全溶解',
        correctIngredient: 'heat',
        resultText: '糖已经完全溶解在牛奶里了',
        resultEmoji: '🫕'
      },
      {
        instruction: '第三步：加入果味配料增加风味',
        correctIngredient: 'fruit',
        resultText: '加入了果味配料，颜色变得好看了',
        resultEmoji: '🍓'
      },
      {
        instruction: '第四步：倒入冰糕模具定型',
        correctIngredient: 'mold',
        resultText: '液体倒入模具，形状整齐',
        resultEmoji: '🧊'
      },
      {
        instruction: '第五步：放入冰柜冷冻成型',
        correctIngredient: 'freeze',
        resultText: '冰糕冻好了！清凉甜蜜',
        resultEmoji: '🍨'
      }
    ],
    ingredients: [
      { id: 'milk', emoji: '🥛', name: '牛奶+糖' },
      { id: 'heat', emoji: '🔥', name: '加热搅拌' },
      { id: 'fruit', emoji: '🍓', name: '果味配料' },
      { id: 'mold', emoji: '🧊', name: '倒入模具' },
      { id: 'freeze', emoji: '❄️', name: '冷冻成型' },
      { id: 'salt', emoji: '🧂', name: '盐巴' },
      { id: 'chili', emoji: '🌶️', name: '辣椒' }
    ]
  },
  {
    id: 'peanutcake',
    name: '花生糕',
    emoji: '🥜',
    desc: '体验古城花生糕的手工制作',
    steps: [
      {
        instruction: '第一步：挑选饱满花生，去壳备用',
        correctIngredient: 'select',
        resultText: '花生挑选好了，颗颗饱满',
        resultEmoji: '🥜'
      },
      {
        instruction: '第二步：下锅炒香，翻炒至金黄',
        correctIngredient: 'roast',
        resultText: '花生炒香了，满屋飘香',
        resultEmoji: '🍳'
      },
      {
        instruction: '第三步：去皮研磨成花生碎',
        correctIngredient: 'grind',
        resultText: '花生碎磨好了，细腻均匀',
        resultEmoji: '🫗'
      },
      {
        instruction: '第四步：熬制糖浆至拉丝状态',
        correctIngredient: 'syrup',
        resultText: '糖浆熬好了，色泽金黄可以拉丝',
        resultEmoji: '🍯'
      },
      {
        instruction: '第五步：花生碎与糖浆混合，压模整形',
        correctIngredient: 'press',
        resultText: '压模成型了！花生糕形状整齐漂亮',
        resultEmoji: '🧱'
      },
      {
        instruction: '第六步：冷却后切块包装',
        correctIngredient: 'cut',
        resultText: '花生糕做好了！酥脆香甜，入口即化',
        resultEmoji: '🎁'
      }
    ],
    ingredients: [
      { id: 'select', emoji: '🥜', name: '挑选花生' },
      { id: 'roast', emoji: '🍳', name: '炒香' },
      { id: 'grind', emoji: '⚙️', name: '研磨' },
      { id: 'syrup', emoji: '🍯', name: '熬糖浆' },
      { id: 'press', emoji: '🤜', name: '压模整形' },
      { id: 'cut', emoji: '🔪', name: '切块包装' },
      { id: 'water', emoji: '💧', name: '清水' },
      { id: 'leaf2', emoji: '🍃', name: '树叶' }
    ]
  }
];

var cookState = {
  activeFoodId: null,
  currentStep: 0,
  draggedItem: null
};

var cookTab = document.getElementById('cookTab');
var cookView = document.getElementById('cookView');
var cookFoodSelect = document.getElementById('cookFoodSelect');
var cookingArea = document.getElementById('cookingArea');

cookTab.addEventListener('click', function() { switchView('cook'); });

renderCookFoodSelect();

function renderCookFoodSelect() {
  cookFoodSelect.innerHTML = COOK_DATA.map(function(food) {
    return '<button class="cook-food-btn" onclick="startCooking(\'' + food.id + '\')">'
      + '<span class="emoji">' + food.emoji + '</span>'
      + '<div class="info"><h4>' + food.name + '</h4><p>' + food.desc + '</p></div>'
      + '</button>';
  }).join('');
}

function startCooking(foodId) {
  cookState.activeFoodId = foodId;
  cookState.currentStep = 0;
  cookFoodSelect.classList.add('hidden');
  cookingArea.classList.remove('hidden');
  renderCookingStep();
}

function renderCookingStep() {
  var food = COOK_DATA.find(function(f) { return f.id === cookState.activeFoodId; });
  if (!food) return;

  var step = food.steps[cookState.currentStep];
  var total = food.steps.length;

  document.getElementById('cookingTitle').textContent = food.name + '制作';
  document.getElementById('cookingProgress').textContent = '步骤 ' + (cookState.currentStep + 1) + ' / ' + total;
  document.getElementById('cookingInstruction').textContent = step.instruction;

  var dropZone = document.getElementById('dropZone');
  dropZone.className = 'drop-zone';
  dropZone.innerHTML = '<div class="drop-zone-inner"><span class="drop-icon">🍳</span><span class="drop-text">拖动食材到这里</span></div>';

  var shuffled = food.ingredients.slice().sort(function() { return Math.random() - 0.5; });
  var ingredientList = document.getElementById('ingredientList');
  ingredientList.innerHTML = shuffled.map(function(ing) {
    var usedSteps = food.steps.slice(0, cookState.currentStep);
    var isUsed = usedSteps.some(function(s) { return s.correctIngredient === ing.id; });
    return '<div class="ingredient-item' + (isUsed ? ' used' : '') + '" data-id="' + ing.id + '"'
      + ' draggable="true">'
      + '<span class="emoji">' + ing.emoji + '</span>'
      + '<span class="name">' + ing.name + '</span>'
      + '</div>';
  }).join('');

  renderCompletedSteps(food);
  bindDragEvents();
}

function renderCompletedSteps(food) {
  var container = document.getElementById('completedSteps');
  if (cookState.currentStep === 0) {
    container.innerHTML = '';
    return;
  }
  var html = '';
  for (var i = 0; i < cookState.currentStep; i++) {
    html += '<div class="completed-step">'
      + '<span class="check">' + food.steps[i].resultEmoji + '</span>'
      + '<span class="step-text">' + food.steps[i].resultText + '</span>'
      + '</div>';
  }
  container.innerHTML = html;
}

function bindDragEvents() {
  var items = document.querySelectorAll('.ingredient-item:not(.used)');
  var dropZone = document.getElementById('dropZone');

  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchmove', handleTouchMove, { passive: false });
    item.addEventListener('touchend', handleTouchEnd);
  });

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
  cookState.draggedItem = e.target.closest('.ingredient-item');
  cookState.draggedItem.classList.add('dragging');
  e.dataTransfer.setData('text/plain', cookState.draggedItem.dataset.id);
}

function handleDragEnd(e) {
  if (cookState.draggedItem) {
    cookState.draggedItem.classList.remove('dragging');
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  var ingredientId = e.dataTransfer.getData('text/plain');
  checkIngredient(ingredientId);
}

var touchClone = null;
var touchStartX = 0;
var touchStartY = 0;

function handleTouchStart(e) {
  e.preventDefault();
  var item = e.target.closest('.ingredient-item');
  if (!item || item.classList.contains('used')) return;

  cookState.draggedItem = item;
  item.classList.add('dragging');

  var touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

  touchClone = item.cloneNode(true);
  touchClone.style.position = 'fixed';
  touchClone.style.zIndex = '9999';
  touchClone.style.pointerEvents = 'none';
  touchClone.style.opacity = '0.85';
  touchClone.style.transform = 'scale(1.1)';
  touchClone.style.left = (touch.clientX - 30) + 'px';
  touchClone.style.top = (touch.clientY - 30) + 'px';
  document.body.appendChild(touchClone);
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchClone) return;

  var touch = e.touches[0];
  touchClone.style.left = (touch.clientX - 30) + 'px';
  touchClone.style.top = (touch.clientY - 30) + 'px';

  var dropZone = document.getElementById('dropZone');
  var rect = dropZone.getBoundingClientRect();
  var isOver = touch.clientX >= rect.left && touch.clientX <= rect.right
    && touch.clientY >= rect.top && touch.clientY <= rect.bottom;

  if (isOver) {
    dropZone.classList.add('drag-over');
  } else {
    dropZone.classList.remove('drag-over');
  }
}

function handleTouchEnd(e) {
  if (!cookState.draggedItem) return;

  var dropZone = document.getElementById('dropZone');
  dropZone.classList.remove('drag-over');

  if (touchClone) {
    var touch = e.changedTouches[0];
    var rect = dropZone.getBoundingClientRect();
    var isOver = touch.clientX >= rect.left && touch.clientX <= rect.right
      && touch.clientY >= rect.top && touch.clientY <= rect.bottom;

    if (isOver) {
      checkIngredient(cookState.draggedItem.dataset.id);
    }

    document.body.removeChild(touchClone);
    touchClone = null;
  }

  cookState.draggedItem.classList.remove('dragging');
  cookState.draggedItem = null;
}

function checkIngredient(ingredientId) {
  var food = COOK_DATA.find(function(f) { return f.id === cookState.activeFoodId; });
  var step = food.steps[cookState.currentStep];
  var dropZone = document.getElementById('dropZone');

  if (ingredientId === step.correctIngredient) {
    dropZone.className = 'drop-zone correct';
    dropZone.innerHTML = '<div class="drop-zone-inner"><span class="drop-icon">' + step.resultEmoji + '</span><span class="drop-text">' + step.resultText + '</span></div>';

    setTimeout(function() {
      cookState.currentStep++;
      if (cookState.currentStep >= food.steps.length) {
        finishCooking(food);
      } else {
        renderCookingStep();
      }
    }, 1200);
  } else {
    dropZone.className = 'drop-zone wrong';
    dropZone.innerHTML = '<div class="drop-zone-inner"><span class="drop-icon">❌</span><span class="drop-text">这不是当前步骤需要的，再想想</span></div>';

    setTimeout(function() {
      dropZone.className = 'drop-zone';
      dropZone.innerHTML = '<div class="drop-zone-inner"><span class="drop-icon">🍳</span><span class="drop-text">拖动食材到这里</span></div>';
    }, 1000);
  }
}

function finishCooking(food) {
  cookingArea.innerHTML = '<div style="text-align:center;padding:30px 0;">'
    + '<div style="font-size:64px;margin-bottom:16px;">' + food.emoji + '</div>'
    + '<h3 style="font-size:24px;margin:0 0 12px;">' + food.name + '制作完成！</h3>'
    + '<p style="color:#806f5d;font-size:15px;line-height:1.6;margin:0 0 20px;">恭喜你完成了' + food.name + '的全部制作流程，<br>现在你已经了解了这道非遗美食的传统工艺。</p>'
    + '<div class="completed-steps" style="text-align:left;margin-bottom:20px;">'
    + food.steps.map(function(s) {
        return '<div class="completed-step"><span class="check">' + s.resultEmoji + '</span><span class="step-text">' + s.resultText + '</span></div>';
      }).join('')
    + '</div>'
    + '<button class="primary-button" onclick="backToCookSelect()">制作其他美食</button>'
    + '</div>';
}

function backToCookSelect() {
  cookState.activeFoodId = null;
  cookState.currentStep = 0;
  cookingArea.classList.add('hidden');
  cookingArea.innerHTML = '<div class="cooking-header"><h3 id="cookingTitle">制作中...</h3><div id="cookingProgress" class="cooking-progress">步骤 1 / 4</div></div><div class="cooking-instruction"><p id="cookingInstruction">请将正确的食材拖到制作台上</p></div><div id="dropZone" class="drop-zone"><div class="drop-zone-inner"><span class="drop-icon">🍳</span><span class="drop-text">拖动食材到这里</span></div></div><div id="ingredientList" class="ingredient-list"></div><div id="completedSteps" class="completed-steps"></div>';
  cookFoodSelect.classList.remove('hidden');
}
