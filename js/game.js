const content = window.BIRTHDAY_CONTENT;
const chapters = [...document.querySelectorAll(".chapter")];
const progressDots = [...document.querySelectorAll(".progress-dot")];

document.querySelectorAll('[data-bind="name"]').forEach((element) => {
  element.textContent = content.hero.name;
});

function showChapter(id) {
  chapters.forEach((chapter) => chapter.classList.toggle("active", chapter.id === id));
  progressDots.forEach((dot) => dot.classList.toggle("active", dot.dataset.target === id));
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "finale") {
    resetCoinGame();
  } else if (typeof gameRunning !== "undefined") {
    gameRunning = false;
    cancelAnimationFrame(animationFrame);
    ducking = false;
  }
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showChapter(button.dataset.next));
});

progressDots.forEach((dot) => dot.addEventListener("click", () => showChapter(dot.dataset.target)));
document.querySelector("#restart").addEventListener("click", () => showChapter("briefing"));

const routeMap = document.querySelector("#route-map");
content.route.forEach((stop, index) => {
  const item = document.createElement("article");
  item.className = "route-stop";
  item.innerHTML = `
    <div class="route-icon">${stop.icon}</div>
    <div><small>STOP ${String(index + 1).padStart(2, "0")}</small><h3>${stop.label}</h3><p>${stop.detail}</p></div>
  `;
  routeMap.appendChild(item);
});

const garageGrid = document.querySelector("#garage-grid");
const showroomImage = document.querySelector("#showroom-image");
const showroomName = document.querySelector("#showroom-name");
const showroomType = document.querySelector("#showroom-type");
const showroomStat = document.querySelector("#showroom-stat");
const showroomCity = document.querySelector("#showroom-city");

function selectVehicle(vehicle, card) {
  document.querySelectorAll(".vehicle-card").forEach((item) => item.classList.toggle("selected", item === card));
  showroomImage.classList.remove("vehicle-enter");
  void showroomImage.offsetWidth;
  showroomImage.src = vehicle.image;
  showroomImage.alt = `${vehicle.vehicle} showcase`;
  showroomName.textContent = vehicle.vehicle;
  showroomType.textContent = `${vehicle.type} // SELECTED`;
  showroomStat.textContent = vehicle.stat;
  showroomCity.textContent = `${vehicle.city.toUpperCase()} GARAGE`;
  showroomImage.classList.add("vehicle-enter");
}

content.garage.forEach((vehicle, index) => {
  const card = document.createElement("button");
  card.className = `vehicle-card${index === 0 ? " selected" : ""}`;
  card.type = "button";
  card.innerHTML = `
    <span class="vehicle-thumb"><img src="${vehicle.image}" alt=""></span>
    <span class="vehicle-card-copy">
      <span class="vehicle-type">${vehicle.type}</span>
      <small>${vehicle.city.toUpperCase()} GARAGE</small>
      <strong>${vehicle.vehicle}</strong>
      <span class="vehicle-stat">${vehicle.stat}</span>
    </span>
  `;
  card.addEventListener("click", () => selectVehicle(vehicle, card));
  garageGrid.appendChild(card);
});

document.querySelector("#final-message").textContent = content.finalMessage;

const coinArena = document.querySelector("#coin-arena");
const gamePlayer = document.querySelector("#game-player");
const runnerItems = document.querySelector("#runner-items");
const coinCount = document.querySelector("#coin-count");
const currentAge = document.querySelector("#current-age");
const playerAge = document.querySelector("#player-age");
const levelFill = document.querySelector("#level-fill");
const birthdayReveal = document.querySelector("#birthday-reveal");
const gameMessage = document.querySelector("#game-message");
const obstacleKinds = ["barrier", "cone", "puddle", "sign"];
let collectedCoins = 0;
let gameRunning = false;
let lastFrame = 0;
let animationFrame;
let activeRunnerItem = null;
let runnerPhase = "obstacle";
let jumpHeight = 0;
let jumpVelocity = 0;
let ducking = false;
let invulnerableUntil = 0;
let spawnTimer = 0;

function setGameMessage(message) {
  gameMessage.textContent = message;
  gameMessage.classList.remove("message-pop");
  void gameMessage.offsetWidth;
  gameMessage.classList.add("message-pop");
}

function createRunnerItem(type) {
  const item = document.createElement("div");
  const year = collectedCoins + 1;
  item.dataset.type = type;
  item.x = coinArena.clientWidth + 80;

  if (type === "coin") {
    item.className = "game-coin runner-item";
    item.innerHTML = `<span>${year}</span>`;
    item.dataset.kind = year % 3 === 0 ? "high" : "low";
    setGameMessage(`YEAR ${year} AHEAD`);
  } else {
    const kind = obstacleKinds[collectedCoins % obstacleKinds.length];
    item.className = `runner-obstacle runner-item obstacle-${kind}`;
    item.dataset.kind = kind;
    item.innerHTML = kind === "sign" ? "<span>LOW<br>BRIDGE</span>" : "<span></span>";
    setGameMessage(kind === "sign" ? "DUCK!" : "JUMP!");
  }

  runnerItems.replaceChildren(item);
  activeRunnerItem = item;
  positionRunnerItem();
}

function positionRunnerItem() {
  if (!activeRunnerItem) return;
  activeRunnerItem.style.transform = `translate3d(${activeRunnerItem.x}px, 0, 0)`;
}

function scheduleNextItem(type, delay = .55) {
  activeRunnerItem = null;
  runnerItems.replaceChildren();
  runnerPhase = type;
  spawnTimer = delay;
}

function resetCoinGame() {
  document.querySelector("#confetti").replaceChildren();
  collectedCoins = 0;
  gameRunning = true;
  jumpHeight = 0;
  jumpVelocity = 0;
  ducking = false;
  invulnerableUntil = 0;
  runnerPhase = "obstacle";
  spawnTimer = .7;
  activeRunnerItem = null;
  runnerItems.replaceChildren();
  coinCount.textContent = "0";
  currentAge.textContent = "0";
  playerAge.textContent = "0";
  levelFill.style.width = "0%";
  birthdayReveal.hidden = true;
  gamePlayer.classList.remove("ducking", "stumble");
  updateRunnerPlayer();
  setGameMessage("THE JOURNEY BEGINS");
  coinArena.focus({ preventScroll: true });
  lastFrame = performance.now();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(gameLoop);
}

function updateRunnerPlayer() {
  gamePlayer.style.setProperty("--jump-height", `${jumpHeight}px`);
  gamePlayer.classList.toggle("ducking", ducking);
}

function collectCoin() {
  collectedCoins += 1;
  coinCount.textContent = String(collectedCoins);
  currentAge.textContent = String(collectedCoins);
  playerAge.textContent = String(collectedCoins);
  levelFill.style.width = `${collectedCoins * 5}%`;
  activeRunnerItem?.classList.add("collected");
  setGameMessage(`AGE ${collectedCoins} UNLOCKED`);

  if (collectedCoins >= 20) {
    gameRunning = false;
    runnerItems.replaceChildren();
    birthdayReveal.hidden = false;
    launchConfetti();
    return;
  }
  scheduleNextItem("obstacle", .8);
}

function jump() {
  if (!gameRunning || jumpHeight > 1 || ducking) return;
  jumpVelocity = 640;
  gamePlayer.classList.add("jumping");
}

function setDuck(value) {
  if (!gameRunning || jumpHeight > 8) return;
  ducking = value;
  updateRunnerPlayer();
}

function handleObstacleCollision(time) {
  if (time < invulnerableUntil || !activeRunnerItem) return;
  const kind = activeRunnerItem.dataset.kind;
  const avoided = kind === "sign" ? ducking : jumpHeight > 58;
  if (avoided) return;
  invulnerableUntil = time + 1100;
  gamePlayer.classList.add("stumble");
  setGameMessage("TRY AGAIN!");
  window.setTimeout(() => gamePlayer.classList.remove("stumble"), 550);
  activeRunnerItem.x = coinArena.clientWidth + 140;
}

function gameLoop(time) {
  if (!gameRunning) return;
  const delta = Math.min((time - lastFrame) / 1000, .04);
  lastFrame = time;
  const speed = 330 + collectedCoins * 5;

  if (jumpHeight > 0 || jumpVelocity > 0) {
    jumpHeight += jumpVelocity * delta;
    jumpVelocity -= 1450 * delta;
    if (jumpHeight <= 0) {
      jumpHeight = 0;
      jumpVelocity = 0;
      gamePlayer.classList.remove("jumping");
    }
    updateRunnerPlayer();
  }

  if (!activeRunnerItem) {
    spawnTimer -= delta;
    if (spawnTimer <= 0) createRunnerItem(runnerPhase);
  } else {
    activeRunnerItem.x -= speed * delta;
    positionRunnerItem();
    const playerRect = gamePlayer.getBoundingClientRect();
    const itemRect = activeRunnerItem.getBoundingClientRect();
    const overlapping = playerRect.right - 10 > itemRect.left && playerRect.left + 10 < itemRect.right;

    if (overlapping) {
      if (activeRunnerItem.dataset.type === "coin") {
        const coinHigh = activeRunnerItem.dataset.kind === "high";
        if (!coinHigh || jumpHeight > 38) collectCoin();
      } else {
        handleObstacleCollision(time);
      }
    }

    if (activeRunnerItem && activeRunnerItem.x < -140) {
      if (activeRunnerItem.dataset.type === "coin") {
        activeRunnerItem.x = coinArena.clientWidth + 100;
        setGameMessage(activeRunnerItem.dataset.kind === "high" ? "JUMP FOR THE YEAR!" : "COLLECT THE YEAR!");
      } else {
        scheduleNextItem("coin", .45);
      }
    }
  }

  animationFrame = requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  if (!gameRunning) return;
  if (["ArrowUp", " ", "w", "W"].includes(event.key)) {
    event.preventDefault();
    jump();
  }
  if (["ArrowDown", "s", "S"].includes(event.key)) {
    event.preventDefault();
    setDuck(true);
  }
});

window.addEventListener("keyup", (event) => {
  if (["ArrowDown", "s", "S"].includes(event.key)) setDuck(false);
});

document.querySelector('[data-action="jump"]').addEventListener("pointerdown", (event) => {
  event.preventDefault();
  jump();
});

const duckButton = document.querySelector('[data-action="duck"]');
duckButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  setDuck(true);
});
["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
  duckButton.addEventListener(eventName, () => setDuck(false));
});

document.querySelector("#play-again-game").addEventListener("click", resetCoinGame);

function launchConfetti() {
  const container = document.querySelector("#confetti");
  container.replaceChildren();
  const colors = ["#efbd57", "#65bce8", "#e7a5bd", "#7ccdbd", "#806db5", "#fff6dc"];

  for (let index = 0; index < 150; index += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.borderRadius = index % 3 === 0 ? "50%" : "3px";
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${9 + Math.random() * 15}px`;
    piece.style.animationDelay = `${Math.random() * 1.4}s`;
    piece.style.animationDuration = `${2.4 + Math.random() * 2}s`;
    container.appendChild(piece);
  }
}

const soundToggle = document.querySelector("#sound-toggle");
soundToggle.addEventListener("click", () => {
  const enabled = soundToggle.dataset.enabled !== "true";
  soundToggle.dataset.enabled = String(enabled);
  soundToggle.textContent = enabled ? "SOUND ON" : "SOUND OFF";
});
