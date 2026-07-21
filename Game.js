var playing = false;
var score = 0;
var trialsleft = 3;
var sliced = false;
var fruits = ["🍋", "🍊", "🍓", "🍒", "🍎", "🍇", "🍍", "🥭", "🍑", "🍐"];
var fruitPool = [];
var gameTimer = null;
var elapsedTime = 0;
var currentLevel = 1;
var scoreHistoryKey = "fruitSlicerHighScores";

function $(selector) {
  return document.querySelector(selector);
}

function show(el) {
  if (el) el.style.display = "block";
}

function hide(el) {
  if (el) el.style.display = "none";
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function addEvent(el, event, handler) {
  if (el) el.addEventListener(event, handler);
}

function onReady(handler) {
  if (document.readyState !== "loading") {
    handler();
  } else {
    document.addEventListener("DOMContentLoaded", handler);
  }
}

onReady(function () {
  var front = $("#front");
  var lifeRow = $("#trialsleft");
  var gameOver = $("#gameOver");
  var fruit = $("#fruit1");
  var startReset = $("#startReset");
  var scoreValue = $("#scoreValue");
  var fruitContainer = $("#fruitcontainer");
  var resultPanel = $("#resultPanel");
  var historyTableBody = $("#scoreHistoryTable tbody");

  var fruitNames = {
    "🍋": "Lemon",
    "🍊": "Orange",
    "🍓": "Strawberry",
    "🍒": "Cherry",
    "🍎": "Apple",
    "🍇": "Grapes",
    "🍍": "Pineapple",
    "🥭": "Mango",
    "🍑": "Peach",
    "🍐": "Pear",
  };

  setText(scoreValue, score);
  show(front);
  hide(gameOver);
  hide(fruit);
  updateLives();
  renderScoreHistory(getHighScores());

  addEvent(startReset, "click", function () {
    if (playing) {
      location.reload();
      return;
    }

    playing = true;
    score = 0;
    trialsleft = 3;
    elapsedTime = 0;
    currentLevel = 1;
    setText(scoreValue, score);
    updateLives();
    hide(gameOver);
    hide(front);
    startReset.textContent = "Reset Game";
    startLevelTimer();
    renderScoreHistory(getHighScores());
    hideResultPanel();
    startAction();
  });

  function updateLives() {
    if (!lifeRow) return;
    lifeRow.innerHTML = "";
    for (var i = 0; i < trialsleft; i++) {
      var life = document.createElement("span");
      life.className = "life";
      life.textContent = "❤️";
      lifeRow.appendChild(life);
    }
  }

  function startLevelTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(function () {
      elapsedTime += 1;
      currentLevel = getCurrentLevel();
    }, 1000);
  }

  function getCurrentLevel() {
    return Math.min(12, 1 + Math.floor(elapsedTime / 8));
  }

  function getHighScores() {
    try {
      return JSON.parse(localStorage.getItem(scoreHistoryKey) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveHighScore(scoreValueToSave, levelValueToSave) {
    var scores = getHighScores();
    scores.push({
      score: scoreValueToSave,
      level: levelValueToSave,
      date: new Date().toLocaleDateString(),
    });
    scores.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return b.level - a.level;
    });
    scores = scores.slice(0, 5);

    try {
      localStorage.setItem(scoreHistoryKey, JSON.stringify(scores));
    } catch (error) {
      // ignore storage errors
    }

    renderScoreHistory(scores);
  }

  function renderScoreHistory(scores) {
    if (!historyTableBody) return;
    historyTableBody.innerHTML = "";

    if (!scores.length) {
      var emptyRow = document.createElement("tr");
      emptyRow.innerHTML = '<td class="emptyCell" colspan="3">No scores yet</td>';
      historyTableBody.appendChild(emptyRow);
      return;
    }

    scores.forEach(function (entry, index) {
      var row = document.createElement("tr");
      row.innerHTML =
        '<td>#' + (index + 1) + '</td>' +
        '<td>' + entry.score + '</td>' +
        '<td>' + entry.date + '</td>';
      historyTableBody.appendChild(row);
    });
  }

  function showResultPanel() {
    if (resultPanel) {
      resultPanel.classList.add("active");
    }
  }

  function hideResultPanel() {
    if (resultPanel) {
      resultPanel.classList.remove("active");
    }
  }

  function startAction() {
    clearAllFruits();
    sliced = false;
    currentLevel = getCurrentLevel();
    var targetFruitCount = Math.min(4, 2 + Math.floor(currentLevel / 3));

    for (var i = 0; i < targetFruitCount; i += 1) {
      spawnFruit();
    }
  }

  function clearAllFruits() {
    fruitPool.forEach(function (entry) {
      if (!entry) return;
      if (entry.timer) clearInterval(entry.timer);
      if (entry.el) {
        hide(entry.el);
        if (entry.el.parentNode) entry.el.parentNode.removeChild(entry.el);
      }
    });
    fruitPool = [];
  }

  function spawnFruit() {
    if (!playing || !fruitContainer) return;

    var element = document.createElement("div");
    element.className = "fruit";
    element.style.display = "flex";
    fruitContainer.appendChild(element);

    var entry = {
      el: element,
      timer: null,
      baseSpeed: 2 + Math.round(3 * Math.random()),
      sliced: false,
    };

    bindFruitEvents(element, entry);
    chooseRandom(entry.el);
    positionFruit(entry.el);
    entry.timer = setInterval(function () {
      moveFruit(entry);
    }, 30);
    fruitPool.push(entry);
  }

  function bindFruitEvents(el, entry) {
    ["mouseover", "click", "touchstart"].forEach(function (eventName) {
      addEvent(el, eventName, function () {
        if (!playing || !entry || entry.sliced) {
          return;
        }

        entry.sliced = true;
        sliced = true;
        score += 1;
        setText(scoreValue, score);
        playSliceSound();
        clearInterval(entry.timer);
        fadeOut(el, 400, function () {
          if (el.parentNode) el.parentNode.removeChild(el);
          removeFruit(entry);
          if (playing) spawnFruit();
        });
      });
    });
  }

  function removeFruit(entry) {
    fruitPool = fruitPool.filter(function (item) {
      return item !== entry;
    });
  }

  function moveFruit(entry) {
    if (!playing || !entry || !entry.el) return;
    var currentTop = positionTop(entry.el);
    var nextTop = currentTop + getFruitSpeed(entry);
    setPositionTop(entry.el, nextTop);

    if (nextTop > fruitContainer.clientHeight - 90) {
      clearInterval(entry.timer);
      if (entry.el.parentNode) entry.el.parentNode.removeChild(entry.el);
      removeFruit(entry);

      if (playing) {
        if (trialsleft > 1) {
          trialsleft -= 1;
          updateLives();
          spawnFruit();
        } else {
          endGame();
        }
      }
    }
  }

  function endGame() {
    playing = false;
    clearInterval(gameTimer);
    show(gameOver);
    if (gameOver) {
      gameOver.innerHTML =
        '<p class="gameOverTitle">Game Over!</p>' +
        '<p class="gameOverText">Your score is ' + score + '</p>' +
        '<p class="gameOverText">Level reached: ' + currentLevel + '</p>';
    }
    saveHighScore(score, currentLevel);
    showResultPanel();
    clearAllFruits();
    document.addEventListener(
      "click",
      function endSessionClick() {
        hide(gameOver);
      },
      { once: true }
    );
  }

  function chooseRandom(el) {
    if (!el) return;
    var currentFruit = fruits[Math.floor(Math.random() * fruits.length)];
    el.textContent = currentFruit;
    el.style.opacity = "1";
  }

  function positionFruit(el) {
    if (!el) return;
    var container = fruitContainer;
    var fruitWidth = parseInt(getComputedStyle(el).width, 10) || 100;
    var maxLeft = Math.max(20, container.clientWidth - fruitWidth - 40);
    el.style.left = Math.round(Math.random() * maxLeft) + "px";
    el.style.top = "-90px";
    el.style.display = "flex";
  }

  function getFruitSpeed(entry) {
    if (!entry) return 2;
    var difficultyStep = Math.min(5, Math.floor(elapsedTime / 6));
    return entry.baseSpeed + difficultyStep;
  }

  function positionTop(el) {
    return el ? el.offsetTop : 0;
  }

  function setPositionTop(el, value) {
    if (el) el.style.top = value + "px";
  }

  function fadeOut(el, duration, callback) {
    if (!el) return;
    el.style.transition = "opacity " + duration + "ms";
    el.style.opacity = 0;
    setTimeout(function () {
      hide(el);
      el.style.opacity = "";
      el.style.transition = "";
      if (callback) callback();
    }, duration);
  }

  function playSliceSound() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioCtx();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
  }
});
