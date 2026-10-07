import { VanillaProject } from '../types';

export const DEFAULT_PROJECTS: VanillaProject[] = [
  {
    id: 'neon-breakout',
    title: 'Neon Breakout (2D Canvas Game)',
    description: 'Classic brick breaker arcade game with HTML5 Canvas, Web Audio sound synthesis, particle bursts, and high scores.',
    category: 'game',
    icon: 'Gamepad2',
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neon Breakout</title>
</head>
<body>
  <div class="game-container">
    <header class="game-header">
      <div class="stat-box">
        <span class="label">SCORE</span>
        <span id="scoreVal" class="value">0000</span>
      </div>
      <div class="title-wrap">
        <h1>NEON BREAKOUT</h1>
        <div class="sub">100% Vanilla Canvas & Web Audio</div>
      </div>
      <div class="stat-box">
        <span class="label">HIGH SCORE</span>
        <span id="highScoreVal" class="value">0000</span>
      </div>
    </header>

    <div class="canvas-wrapper">
      <canvas id="gameCanvas" width="600" height="420"></canvas>
      <div id="overlay" class="overlay">
        <div class="overlay-card">
          <h2 id="overlayTitle">PRESS START</h2>
          <p id="overlayDesc">Use Left/Right arrow keys, A/D, or drag the mouse/finger to steer the paddle.</p>
          <button id="startBtn" class="btn">START GAME</button>
        </div>
      </div>
    </div>

    <footer class="game-footer">
      <div class="lives-indicator">
        <span>LIVES:</span>
        <span id="livesContainer">❤️❤️❤️</span>
      </div>
      <div class="controls-hint">
        <span>◀ ▶ / Mouse / Touch</span>
        <button id="soundToggle" class="sub-btn">Audio: ON</button>
      </div>
    </footer>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #0d1117;
  color: #f0f6fc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  user-select: none;
}

.game-container {
  width: 100%;
  max-width: 640px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.title-wrap {
  text-align: center;
}

.title-wrap h1 {
  font-size: 1.25rem;
  letter-spacing: 2px;
  color: #38bdf8;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}

.title-wrap .sub {
  font-size: 0.7rem;
  color: #8b949e;
  margin-top: 2px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  background: #0d1117;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #21262d;
  min-width: 80px;
}

.stat-box .label {
  font-size: 0.65rem;
  color: #8b949e;
  letter-spacing: 1px;
}

.stat-box .value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f59e0b;
  font-variant-numeric: tabular-nums;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  background: #090d16;
  border-radius: 8px;
  border: 1px solid #30363d;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 600 / 420;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 17, 23, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
  transition: opacity 0.2s ease;
}

.overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.overlay-card {
  text-align: center;
  max-width: 360px;
}

.overlay-card h2 {
  font-size: 1.4rem;
  color: #f43f5e;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.overlay-card p {
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.4;
  margin-bottom: 16px;
}

.btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.btn:hover {
  background: #0369a1;
  transform: translateY(-1px);
}

.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  font-size: 0.8rem;
  color: #8b949e;
}

.lives-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.controls-hint {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sub-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.sub-btn:hover {
  background: #30363d;
}`,
    js: `// Neon Breakout - Pure Vanilla JS Game with Web Audio
(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreVal = document.getElementById('scoreVal');
  const highScoreVal = document.getElementById('highScoreVal');
  const livesContainer = document.getElementById('livesContainer');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const startBtn = document.getElementById('startBtn');
  const soundToggle = document.getElementById('soundToggle');

  let audioEnabled = true;
  let audioCtx = null;

  // Web Audio synth for sounds
  function playSound(freq, duration, type = 'sine') {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  // Game state
  let score = 0;
  let highScore = Number(localStorage.getItem('breakout_high') || 0);
  let lives = 3;
  let isRunning = false;
  let animationId = null;

  highScoreVal.textContent = String(highScore).padStart(4, '0');

  // Paddle
  const paddle = {
    w: 90,
    h: 12,
    x: (canvas.width - 90) / 2,
    y: canvas.height - 24,
    speed: 7,
    dx: 0
  };

  // Ball
  const ball = {
    x: canvas.width / 2,
    y: canvas.height - 40,
    radius: 6,
    speed: 5,
    dx: 3.5,
    dy: -3.5
  };

  // Bricks configuration
  const brickRows = 5;
  const brickCols = 8;
  const brickPad = 8;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 25;
  const brickW = (canvas.width - brickOffsetLeft * 2 - (brickCols - 1) * brickPad) / brickCols;
  const brickH = 16;
  const brickColors = ['#f43f5e', '#fb923c', '#eab308', '#22c55e', '#38bdf8'];

  let bricks = [];
  let particles = [];

  function initBricks() {
    bricks = [];
    for (let r = 0; r < brickRows; r++) {
      bricks[r] = [];
      for (let c = 0; c < brickCols; c++) {
        bricks[r][c] = {
          x: brickOffsetLeft + c * (brickW + brickPad),
          y: brickOffsetTop + r * (brickH + brickPad),
          status: 1,
          color: brickColors[r % brickColors.length]
        };
      }
    }
  }

  function addParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        radius: Math.random() * 3 + 1,
        color: color,
        life: 1
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawBricks() {
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        const b = bricks[r][c];
        if (b.status === 1) {
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, brickW, brickH, 4);
          ctx.fillStyle = b.color;
          ctx.fill();
        }
      }
    }
  }

  function resetBall() {
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - 12;
    const angle = (Math.random() * 0.6 - 0.3) * Math.PI;
    ball.dx = 4.5 * Math.sin(angle);
    ball.dy = -4.5;
  }

  function collisionDetection() {
    let allCleared = true;
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        const b = bricks[r][c];
        if (b.status === 1) {
          allCleared = false;
          if (
            ball.x + ball.radius > b.x &&
            ball.x - ball.radius < b.x + brickW &&
            ball.y + ball.radius > b.y &&
            ball.y - ball.radius < b.y + brickH
          ) {
            ball.dy = -ball.dy;
            b.status = 0;
            score += 20;
            scoreVal.textContent = String(score).padStart(4, '0');
            addParticles(ball.x, ball.y, b.color);
            playSound(440 + r * 60, 0.1, 'triangle');

            if (score > highScore) {
              highScore = score;
              highScoreVal.textContent = String(highScore).padStart(4, '0');
              localStorage.setItem('breakout_high', highScore);
            }
          }
        }
      }
    }

    if (allCleared) {
      endGame(true);
    }
  }

  function update() {
    // Move paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall bounce
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
      playSound(280, 0.08);
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      playSound(280, 0.08);
    }

    // Paddle hit
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.h &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.w
    ) {
      const hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.dx = hitPos * 5;
      ball.dy = -Math.abs(ball.dy);
      playSound(520, 0.12, 'square');
    }

    // Bottom loss
    if (ball.y + ball.radius > canvas.height) {
      lives--;
      updateLivesDisplay();
      playSound(150, 0.3, 'sawtooth');
      if (lives <= 0) {
        endGame(false);
        return;
      } else {
        resetBall();
      }
    }

    collisionDetection();
    updateParticles();
  }

  function updateLivesDisplay() {
    livesContainer.textContent = '❤️'.repeat(Math.max(lives, 0));
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    drawParticles();
  }

  function loop() {
    if (!isRunning) return;
    update();
    render();
    animationId = requestAnimationFrame(loop);
  }

  function startGame() {
    score = 0;
    lives = 3;
    scoreVal.textContent = '0000';
    updateLivesDisplay();
    initBricks();
    particles = [];
    paddle.x = (canvas.width - paddle.w) / 2;
    resetBall();
    overlay.classList.add('hidden');
    isRunning = true;
    loop();
    console.log('Neon Breakout game started!');
  }

  function endGame(isWin) {
    isRunning = false;
    cancelAnimationFrame(animationId);
    overlay.classList.remove('hidden');
    overlayTitle.textContent = isWin ? 'VICTORY! 🏆' : 'GAME OVER';
    overlayDesc.textContent = isWin
      ? \`Outstanding! You cleared all bricks with \${score} points!\`
      : \`You scored \${score} points. High score is \${highScore}.\`;
    startBtn.textContent = 'PLAY AGAIN';
    console.log(isWin ? 'Game won!' : 'Game over with score:', score);
  }

  // Controls
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      paddle.dx = -paddle.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      paddle.dx = paddle.speed;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (
      e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
      e.key === 'a' || e.key === 'd' ||
      e.key === 'A' || e.key === 'D'
    ) {
      paddle.dx = 0;
    }
  });

  // Mouse & Touch control
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mouseX - paddle.w / 2));
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, touchX - paddle.w / 2));
  }, { passive: false });

  startBtn.addEventListener('click', startGame);

  soundToggle.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    soundToggle.textContent = 'Audio: ' + (audioEnabled ? 'ON' : 'OFF');
    console.log('Sound toggled:', audioEnabled);
  });

  // Initial draw
  initBricks();
  render();
})();`
  },
  {
    id: 'vanilla-kanban',
    title: 'Vanilla Kanban Board (Drag & Drop)',
    description: 'Production-ready task board utilizing the native HTML5 Drag and Drop API, localStorage persistence, and inline task editing.',
    category: 'app',
    icon: 'KanbanSquare',
    createdAt: 1710000001000,
    updatedAt: 1710000001000,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanilla Kanban Board</title>
</head>
<body>
  <div class="app">
    <header class="navbar">
      <div class="brand">
        <h1>VanillaFlow Kanban</h1>
        <span>Native Drag & Drop • 100% Offline</span>
      </div>
      <div class="actions">
        <button id="addCardBtn" class="primary-btn">+ New Task</button>
        <button id="resetDemoBtn" class="ghost-btn">Reset Board</button>
      </div>
    </header>

    <main class="board" id="board">
      <!-- To Do -->
      <section class="column" data-status="todo">
        <div class="column-header">
          <div class="col-title-wrap">
            <span class="status-dot dot-todo"></span>
            <h2>To Do</h2>
          </div>
          <span class="count-badge" id="count-todo">0</span>
        </div>
        <div class="card-list" id="col-todo" data-status="todo"></div>
      </section>

      <!-- In Progress -->
      <section class="column" data-status="in-progress">
        <div class="column-header">
          <div class="col-title-wrap">
            <span class="status-dot dot-progress"></span>
            <h2>In Progress</h2>
          </div>
          <span class="count-badge" id="count-in-progress">0</span>
        </div>
        <div class="card-list" id="col-in-progress" data-status="in-progress"></div>
      </section>

      <!-- Done -->
      <section class="column" data-status="done">
        <div class="column-header">
          <div class="col-title-wrap">
            <span class="status-dot dot-done"></span>
            <h2>Done</h2>
          </div>
          <span class="count-badge" id="count-done">0</span>
        </div>
        <div class="card-list" id="col-done" data-status="done"></div>
      </section>
    </main>

    <!-- Modal for new task -->
    <div id="taskModal" class="modal-backdrop hidden">
      <div class="modal">
        <h3 id="modalTitle">Create New Task</h3>
        <form id="taskForm">
          <label>
            <span>Task Title</span>
            <input type="text" id="taskTitleInput" placeholder="e.g. Implement offline caching" required />
          </label>
          <label>
            <span>Description</span>
            <textarea id="taskDescInput" rows="3" placeholder="Add task details..."></textarea>
          </label>
          <div class="form-row">
            <label>
              <span>Priority</span>
              <select id="taskPriorityInput">
                <option value="low">Low Priority</option>
                <option value="medium" selected>Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </label>
            <label>
              <span>Column</span>
              <select id="taskColumnInput">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
          </div>
          <div class="modal-actions">
            <button type="button" id="cancelModalBtn" class="ghost-btn">Cancel</button>
            <button type="submit" class="primary-btn">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.brand h1 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #38bdf8;
}

.brand span {
  font-size: 0.75rem;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 10px;
}

.primary-btn {
  background: #0284c7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.primary-btn:hover {
  background: #0369a1;
}

.ghost-btn {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #475569;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.ghost-btn:hover {
  background: #334155;
  color: #f8fafc;
}

.board {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 24px;
  align-items: start;
}

.column {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 120px);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;
}

.col-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.col-title-wrap h2 {
  font-size: 0.95rem;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-todo { background: #94a3b8; }
.dot-progress { background: #38bdf8; }
.dot-done { background: #10b981; }

.count-badge {
  font-size: 0.75rem;
  color: #94a3b8;
  background: #0f172a;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.card-list {
  padding: 12px;
  min-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background-color 0.15s;
}

.card-list.drag-over {
  background-color: #0f172a;
  outline: 2px dashed #38bdf8;
  outline-offset: -4px;
}

.card {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px;
  cursor: grab;
  transition: transform 0.1s, box-shadow 0.15s, border-color 0.15s;
}

.card:hover {
  border-color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card.dragging {
  opacity: 0.4;
  cursor: grabbing;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.3;
}

.delete-card-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 4px;
  line-height: 1;
}

.delete-card-btn:hover {
  color: #f43f5e;
}

.card-desc {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.4;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
}

.priority-tag {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-high { color: #f43f5e; }
.priority-medium { color: #f59e0b; }
.priority-low { color: #10b981; }

.card-date {
  color: #64748b;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.modal-backdrop.hidden {
  display: none;
}

.modal {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 440px;
}

.modal h3 {
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.modal input,
.modal textarea,
.modal select {
  background: #0f172a;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.85rem;
}

.modal input:focus,
.modal textarea:focus,
.modal select:focus {
  outline: none;
  border-color: #38bdf8;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}`,
    js: `// VanillaFlow Kanban - Pure Native HTML5 Drag and Drop
(function () {
  const STORAGE_KEY = 'vanilla_kanban_tasks';

  const defaultTasks = [
    {
      id: 'task-1',
      title: 'Setup Offline Manifest & Storage',
      desc: 'Ensure all assets are locally cached with HTML5 local storage API.',
      priority: 'high',
      status: 'done',
      date: 'Today'
    },
    {
      id: 'task-2',
      title: 'Implement Canvas Graphics Pipeline',
      desc: 'Use native requestAnimationFrame and 2D canvas context for zero-dependency rendering.',
      priority: 'medium',
      status: 'in-progress',
      date: 'Today'
    },
    {
      id: 'task-3',
      title: 'Add Pure Web Audio Synthesizer',
      desc: 'Generate waveforms and sound cues with native AudioContext nodes.',
      priority: 'low',
      status: 'todo',
      date: 'Tomorrow'
    }
  ];

  let tasks = loadTasks();

  function loadTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultTasks;
    } catch (e) {
      return defaultTasks;
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // DOM Elements
  const colTodo = document.getElementById('col-todo');
  const colInProgress = document.getElementById('col-in-progress');
  const colDone = document.getElementById('col-done');
  const countTodo = document.getElementById('count-todo');
  const countInProgress = document.getElementById('count-in-progress');
  const countDone = document.getElementById('count-done');
  const addCardBtn = document.getElementById('addCardBtn');
  const resetDemoBtn = document.getElementById('resetDemoBtn');
  const taskModal = document.getElementById('taskModal');
  const taskForm = document.getElementById('taskForm');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  function renderBoard() {
    colTodo.innerHTML = '';
    colInProgress.innerHTML = '';
    colDone.innerHTML = '';

    let todoCount = 0;
    let progressCount = 0;
    let doneCount = 0;

    tasks.forEach(task => {
      const card = createCardElement(task);
      if (task.status === 'todo') {
        colTodo.appendChild(card);
        todoCount++;
      } else if (task.status === 'in-progress') {
        colInProgress.appendChild(card);
        progressCount++;
      } else if (task.status === 'done') {
        colDone.appendChild(card);
        doneCount++;
      }
    });

    countTodo.textContent = todoCount;
    countInProgress.textContent = progressCount;
    countDone.textContent = doneCount;
  }

  function createCardElement(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = task.id;

    card.innerHTML = \`
      <div class="card-header">
        <h4 class="card-title">\${escapeHTML(task.title)}</h4>
        <button class="delete-card-btn" title="Delete task">&times;</button>
      </div>
      \${task.desc ? \`<p class="card-desc">\${escapeHTML(task.desc)}</p>\` : ''}
      <div class="card-footer">
        <span class="priority-tag priority-\${task.priority}">\${task.priority}</span>
        <span class="card-date">\${task.date || 'Active'}</span>
      </div>
    \`;

    // Drag handlers
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    // Delete handler
    card.querySelector('.delete-card-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    return card;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderBoard();
    console.log('Task deleted:', id);
  }

  // Setup Column Drop zones
  const columns = [colTodo, colInProgress, colDone];
  columns.forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');
      }
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = col.dataset.status;

      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        task.status = newStatus;
        saveTasks();
        renderBoard();
        console.log(\`Task \${taskId} moved to \${newStatus}\`);
      }
    });
  });

  // Modal handlers
  addCardBtn.addEventListener('click', () => {
    taskForm.reset();
    taskModal.classList.remove('hidden');
    document.getElementById('taskTitleInput').focus();
  });

  cancelModalBtn.addEventListener('click', () => {
    taskModal.classList.add('hidden');
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitleInput').value.trim();
    const desc = document.getElementById('taskDescInput').value.trim();
    const priority = document.getElementById('taskPriorityInput').value;
    const status = document.getElementById('taskColumnInput').value;

    if (!title) return;

    const newTask = {
      id: 'task-' + Date.now(),
      title,
      desc,
      priority,
      status,
      date: 'Just now'
    };

    tasks.push(newTask);
    saveTasks();
    renderBoard();
    taskModal.classList.add('hidden');
    console.log('New task created:', newTask);
  });

  resetDemoBtn.addEventListener('click', () => {
    tasks = defaultTasks;
    saveTasks();
    renderBoard();
    console.log('Kanban board reset to default state');
  });

  // Initialize
  renderBoard();
  console.log('Vanilla Kanban ready with', tasks.length, 'tasks.');
})();`
  },
  {
    id: 'vanilla-synth',
    title: 'NeonWave Synthesizer (Web Audio API)',
    description: 'Real-time audio synthesizer and oscilloscope visualizer written in pure Web Audio API & Canvas without any audio samples.',
    category: 'audio',
    icon: 'Music',
    createdAt: 1710000002000,
    updatedAt: 1710000002000,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeonWave Web Audio Synthesizer</title>
</head>
<body>
  <div class="synth-wrapper">
    <header class="synth-header">
      <div class="title-group">
        <h1>NEONWAVE SYNTHESIZER</h1>
        <p>Pure Web Audio API • Oscillator + Filter + Real-time Oscilloscope</p>
      </div>
      <button id="powerBtn" class="power-btn">INITIALIZE AUDIO</button>
    </header>

    <!-- Visualizer Canvas -->
    <div class="visualizer-box">
      <canvas id="scopeCanvas" width="600" height="150"></canvas>
    </div>

    <!-- Controls Panel -->
    <div class="controls-grid">
      <div class="control-card">
        <h3>1. Waveform</h3>
        <div class="wave-buttons" id="waveGroup">
          <button class="wave-btn active" data-wave="sine">Sine</button>
          <button class="wave-btn" data-wave="sawtooth">Saw</button>
          <button class="wave-btn" data-wave="square">Square</button>
          <button class="wave-btn" data-wave="triangle">Tri</button>
        </div>
      </div>

      <div class="control-card">
        <h3>2. Low-Pass Filter</h3>
        <div class="slider-row">
          <label>Cutoff: <span id="cutoffVal">2000 Hz</span></label>
          <input type="range" id="cutoffSlider" min="200" max="6000" step="50" value="2000">
        </div>
        <div class="slider-row">
          <label>Resonance (Q): <span id="resVal">3</span></label>
          <input type="range" id="resSlider" min="0" max="15" step="0.5" value="3">
        </div>
      </div>

      <div class="control-card">
        <h3>3. Master Output</h3>
        <div class="slider-row">
          <label>Master Volume: <span id="volumeVal">70%</span></label>
          <input type="range" id="volumeSlider" min="0" max="100" value="70">
        </div>
        <div class="slider-row">
          <label>Release Time: <span id="releaseVal">0.3s</span></label>
          <input type="range" id="releaseSlider" min="0.05" max="1.5" step="0.05" value="0.3">
        </div>
      </div>
    </div>

    <!-- Virtual Keyboard -->
    <div class="keyboard-container">
      <div class="keys-wrapper" id="keyboard">
        <!-- Generated by JavaScript for octave C4-C5 -->
      </div>
      <div class="keyboard-hint">
        Play via mouse, touch, or computer keys: <strong>A S D F G H J K</strong> (Whites) and <strong>W E T Y U</strong> (Blacks)
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #090b10;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.synth-wrapper {
  width: 100%;
  max-width: 680px;
  background: #11141e;
  border: 1px solid #1e2638;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.7);
}

.synth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-group h1 {
  font-size: 1.2rem;
  letter-spacing: 2px;
  color: #38bdf8;
}

.title-group p {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 2px;
}

.power-btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.15s;
}

.power-btn.active {
  background: #10b981;
}

.visualizer-box {
  background: #06080d;
  border: 1px solid #1e2638;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 140px;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.control-card {
  background: #0a0d14;
  border: 1px solid #1e2638;
  border-radius: 8px;
  padding: 14px;
}

.control-card h3 {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.wave-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.wave-btn {
  background: #161c28;
  border: 1px solid #232d42;
  color: #94a3b8;
  padding: 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}

.wave-btn.active {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
  font-weight: 600;
}

.slider-row {
  margin-bottom: 10px;
}

.slider-row:last-child {
  margin-bottom: 0;
}

.slider-row label {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
  cursor: pointer;
}

.keyboard-container {
  background: #06080d;
  border: 1px solid #1e2638;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.keys-wrapper {
  position: relative;
  display: flex;
  height: 160px;
  user-select: none;
}

.key-white {
  width: 44px;
  height: 100%;
  background: #ffffff;
  border: 1px solid #94a3b8;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #1e293b;
  transition: background 0.08s;
}

.key-white.active, .key-white:active {
  background: #38bdf8;
  color: #ffffff;
}

.key-black {
  position: absolute;
  width: 28px;
  height: 100px;
  background: #0f172a;
  border-radius: 0 0 4px 4px;
  z-index: 2;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  font-size: 0.65rem;
  color: #94a3b8;
  transition: background 0.08s;
}

.key-black.active, .key-black:active {
  background: #f43f5e;
  color: #ffffff;
}

.keyboard-hint {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 12px;
  text-align: center;
}`,
    js: `// NeonWave Synthesizer - 100% Vanilla Web Audio API
(function () {
  let audioCtx = null;
  let masterGain = null;
  let biquadFilter = null;
  let analyser = null;
  let isPowered = false;

  const notes = [
    { note: 'C4', freq: 261.63, key: 'a', isBlack: false },
    { note: 'C#4', freq: 277.18, key: 'w', isBlack: true, offset: 30 },
    { note: 'D4', freq: 293.66, key: 's', isBlack: false },
    { note: 'D#4', freq: 311.13, key: 'e', isBlack: true, offset: 74 },
    { note: 'E4', freq: 329.63, key: 'd', isBlack: false },
    { note: 'F4', freq: 349.23, key: 'f', isBlack: false },
    { note: 'F#4', freq: 369.99, key: 't', isBlack: true, offset: 162 },
    { note: 'G4', freq: 392.00, key: 'g', isBlack: false },
    { note: 'G#4', freq: 415.30, key: 'y', isBlack: true, offset: 206 },
    { note: 'A4', freq: 440.00, key: 'h', isBlack: false },
    { note: 'A#4', freq: 466.16, key: 'u', isBlack: true, offset: 250 },
    { note: 'B4', freq: 493.88, key: 'j', isBlack: false },
    { note: 'C5', freq: 523.25, key: 'k', isBlack: false }
  ];

  let currentWaveform = 'sine';
  let releaseTime = 0.3;
  const activeOscillators = {};

  // Setup DOM
  const powerBtn = document.getElementById('powerBtn');
  const scopeCanvas = document.getElementById('scopeCanvas');
  const scopeCtx = scopeCanvas.getContext('2d');
  const keyboard = document.getElementById('keyboard');
  const waveGroup = document.getElementById('waveGroup');
  const cutoffSlider = document.getElementById('cutoffSlider');
  const cutoffVal = document.getElementById('cutoffVal');
  const resSlider = document.getElementById('resSlider');
  const resVal = document.getElementById('resVal');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeVal = document.getElementById('volumeVal');
  const releaseSlider = document.getElementById('releaseSlider');
  const releaseVal = document.getElementById('releaseVal');

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      biquadFilter = audioCtx.createBiquadFilter();
      analyser = audioCtx.createAnalyser();

      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.setValueAtTime(Number(cutoffSlider.value), audioCtx.currentTime);
      biquadFilter.Q.setValueAtTime(Number(resSlider.value), audioCtx.currentTime);

      masterGain.gain.setValueAtTime(Number(volumeSlider.value) / 100 * 0.4, audioCtx.currentTime);

      analyser.fftSize = 2048;

      biquadFilter.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      isPowered = true;
      powerBtn.textContent = 'SYNTH ACTIVE';
      powerBtn.classList.add('active');

      drawOscilloscope();
      console.log('Web Audio Context initialized');
    } catch (e) {
      console.error('Audio initialization error:', e);
    }
  }

  function noteOn(noteObj) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (activeOscillators[noteObj.note]) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = currentWaveform;
    osc.frequency.setValueAtTime(noteObj.freq, audioCtx.currentTime);

    noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
    noteGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.02);

    osc.connect(noteGain);
    noteGain.connect(biquadFilter);

    osc.start();

    activeOscillators[noteObj.note] = { osc, noteGain };

    // Highlight key
    const el = document.querySelector(\`[data-note="\${noteObj.note}"]\`);
    if (el) el.classList.add('active');
  }

  function noteOff(noteObj) {
    if (!activeOscillators[noteObj.note]) return;

    const { osc, noteGain } = activeOscillators[noteObj.note];
    const now = audioCtx.currentTime;

    noteGain.gain.cancelScheduledValues(now);
    noteGain.gain.setValueAtTime(noteGain.gain.value, now);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

    osc.stop(now + releaseTime);

    delete activeOscillators[noteObj.note];

    const el = document.querySelector(\`[data-note="\${noteObj.note}"]\`);
    if (el) el.classList.remove('active');
  }

  // Draw Keyboard
  function renderKeyboard() {
    keyboard.innerHTML = '';
    notes.forEach(n => {
      const el = document.createElement('div');
      el.dataset.note = n.note;

      if (n.isBlack) {
        el.className = 'key-black';
        el.style.left = \`\${n.offset}px\`;
        el.textContent = n.key.toUpperCase();
      } else {
        el.className = 'key-white';
        el.textContent = n.key.toUpperCase();
      }

      el.addEventListener('mousedown', () => noteOn(n));
      el.addEventListener('mouseup', () => noteOff(n));
      el.addEventListener('mouseleave', () => noteOff(n));

      el.addEventListener('touchstart', (e) => { e.preventDefault(); noteOn(n); });
      el.addEventListener('touchend', (e) => { e.preventDefault(); noteOff(n); });

      keyboard.appendChild(el);
    });
  }

  // Oscilloscope Canvas Loop
  function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope);

    const width = scopeCanvas.width;
    const height = scopeCanvas.height;

    scopeCtx.fillStyle = '#06080d';
    scopeCtx.fillRect(0, 0, width, height);

    if (!analyser) {
      scopeCtx.strokeStyle = '#1e2638';
      scopeCtx.lineWidth = 2;
      scopeCtx.beginPath();
      scopeCtx.moveTo(0, height / 2);
      scopeCtx.lineTo(width, height / 2);
      scopeCtx.stroke();
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    scopeCtx.lineWidth = 2;
    scopeCtx.strokeStyle = '#38bdf8';
    scopeCtx.shadowColor = '#38bdf8';
    scopeCtx.shadowBlur = 8;
    scopeCtx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        scopeCtx.moveTo(x, y);
      } else {
        scopeCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    scopeCtx.lineTo(width, height / 2);
    scopeCtx.stroke();
    scopeCtx.shadowBlur = 0;
  }

  // Wave selector
  waveGroup.querySelectorAll('.wave-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      waveGroup.querySelectorAll('.wave-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWaveform = btn.dataset.wave;
      console.log('Waveform changed to:', currentWaveform);
    });
  });

  // Slider events
  cutoffSlider.addEventListener('input', () => {
    const val = Number(cutoffSlider.value);
    cutoffVal.textContent = val + ' Hz';
    if (biquadFilter && audioCtx) {
      biquadFilter.frequency.setValueAtTime(val, audioCtx.currentTime);
    }
  });

  resSlider.addEventListener('input', () => {
    const val = Number(resSlider.value);
    resVal.textContent = val;
    if (biquadFilter && audioCtx) {
      biquadFilter.Q.setValueAtTime(val, audioCtx.currentTime);
    }
  });

  volumeSlider.addEventListener('input', () => {
    const val = Number(volumeSlider.value);
    volumeVal.textContent = val + '%';
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime((val / 100) * 0.4, audioCtx.currentTime);
    }
  });

  releaseSlider.addEventListener('input', () => {
    releaseTime = Number(releaseSlider.value);
    releaseVal.textContent = releaseTime.toFixed(2) + 's';
  });

  powerBtn.addEventListener('click', initAudio);

  // Keyboard mapping
  const keyMap = {};
  notes.forEach(n => {
    keyMap[n.key.toLowerCase()] = n;
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const noteObj = keyMap[e.key.toLowerCase()];
    if (noteObj) {
      noteOn(noteObj);
    }
  });

  window.addEventListener('keyup', (e) => {
    const noteObj = keyMap[e.key.toLowerCase()];
    if (noteObj) {
      noteOff(noteObj);
    }
  });

  renderKeyboard();
  drawOscilloscope();
})();`
  },
  {
    id: 'vanilla-markdown',
    title: 'PureMark (Vanilla Markdown Editor)',
    description: 'Instant offline Markdown editor with live preview, word & reading time counter, table support, and export.',
    category: 'tool',
    icon: 'FileText',
    createdAt: 1710000003000,
    updatedAt: 1710000003000,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PureMark - Vanilla Markdown Editor</title>
</head>
<body>
  <div class="app-layout">
    <header class="toolbar">
      <div class="logo">
        <strong>PureMark</strong>
        <span>100% Vanilla Parser</span>
      </div>
      <div class="toolbar-tools">
        <button class="tool-btn" data-tag="bold" title="Bold (Ctrl+B)"><b>B</b></button>
        <button class="tool-btn" data-tag="italic" title="Italic (Ctrl+I)"><i>I</i></button>
        <button class="tool-btn" data-tag="h2" title="Heading 2">H2</button>
        <button class="tool-btn" data-tag="quote" title="Quote">&ldquo;</button>
        <button class="tool-btn" data-tag="code" title="Code Block">&lt;/&gt;</button>
        <button class="tool-btn" data-tag="list" title="Bulleted List">&bull; List</button>
        <button class="tool-btn" data-tag="table" title="Table">Table</button>
      </div>
      <div class="toolbar-actions">
        <button id="copyHtmlBtn" class="action-btn">Copy HTML</button>
        <button id="clearBtn" class="action-btn ghost">Clear</button>
      </div>
    </header>

    <main class="panes-container">
      <div class="pane editor-pane">
        <div class="pane-header">
          <span>MARKDOWN SOURCE</span>
          <span id="charCount">0 words • 0 chars</span>
        </div>
        <textarea id="markdownInput" spellcheck="false" placeholder="Type vanilla markdown here..."></textarea>
      </div>

      <div class="pane preview-pane">
        <div class="pane-header">
          <span>LIVE RENDERED HTML</span>
          <span id="readingTime">0 min read</span>
        </div>
        <div id="htmlPreview" class="preview-content"></div>
      </div>
    </main>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  gap: 12px;
  flex-wrap: wrap;
}

.logo strong {
  font-size: 1rem;
  color: #38bdf8;
  margin-right: 6px;
}

.logo span {
  font-size: 0.72rem;
  color: #94a3b8;
}

.toolbar-tools {
  display: flex;
  gap: 4px;
}

.tool-btn {
  background: #0f172a;
  border: 1px solid #334155;
  color: #cbd5e1;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: #334155;
  color: #ffffff;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.action-btn:hover {
  background: #0369a1;
}

.action-btn.ghost {
  background: transparent;
  border: 1px solid #475569;
  color: #94a3b8;
}

.action-btn.ghost:hover {
  background: #334155;
  color: #f8fafc;
}

.panes-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
}

@media (max-width: 768px) {
  .panes-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}

.pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.editor-pane {
  border-right: 1px solid #334155;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #111827;
  border-bottom: 1px solid #1f2937;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

#markdownInput {
  flex: 1;
  background: #0b0f19;
  color: #e2e8f0;
  border: none;
  padding: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.88rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.preview-content {
  flex: 1;
  background: #0f172a;
  padding: 24px;
  overflow-y: auto;
  line-height: 1.65;
  font-size: 0.95rem;
}

/* Rendered markdown typography */
.preview-content h1 {
  font-size: 1.8rem;
  color: #f8fafc;
  border-bottom: 1px solid #334155;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.preview-content h2 {
  font-size: 1.4rem;
  color: #38bdf8;
  margin-top: 20px;
  margin-bottom: 10px;
}

.preview-content h3 {
  font-size: 1.15rem;
  color: #f1f5f9;
  margin-top: 16px;
  margin-bottom: 8px;
}

.preview-content p {
  margin-bottom: 14px;
  color: #cbd5e1;
}

.preview-content ul, .preview-content ol {
  margin-left: 24px;
  margin-bottom: 16px;
  color: #cbd5e1;
}

.preview-content li {
  margin-bottom: 4px;
}

.preview-content blockquote {
  border-left: 4px solid #38bdf8;
  padding: 8px 16px;
  margin: 14px 0;
  background: #1e293b;
  color: #94a3b8;
  border-radius: 0 6px 6px 0;
}

.preview-content pre {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  margin: 14px 0;
}

.preview-content code {
  font-family: monospace;
  font-size: 0.85rem;
  color: #38bdf8;
}

.preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.preview-content th, .preview-content td {
  border: 1px solid #334155;
  padding: 8px 12px;
  text-align: left;
}

.preview-content th {
  background: #1e293b;
  color: #f8fafc;
}`,
    js: `// PureMark - Vanilla regex-based Markdown Renderer
(function () {
  const STORAGE_KEY = 'puremark_draft';

  const defaultMarkdown = "# Welcome to PureMark\\n" +
    "A 100% offline **Vanilla JavaScript** Markdown compiler.\\n\\n" +
    "## Core Features\\n" +
    "* Zero external libraries or heavy dependencies\\n" +
    "* Real-time preview with instantaneous parsing\\n" +
    "* Native browser storage persistence\\n" +
    "* Exportable clean HTML\\n\\n" +
    "> \\"Simple things should be simple, complex things should be possible.\\" — Alan Kay\\n\\n" +
    "### Code Example\\n" +
    "\\x60\\x60\\x60javascript\\n" +
    "// Vanilla DOM manipulation\\n" +
    "const button = document.createElement('button');\\n" +
    "button.textContent = 'Click me';\\n" +
    "button.addEventListener('click', () => {\\n" +
    "  console.log('Vanilla JS in action!');\\n" +
    "});\\n" +
    "document.body.appendChild(button);\\n" +
    "\\x60\\x60\\x60\\n\\n" +
    "### Comparison Table\\n" +
    "| Feature | Vanilla Approach | Heavy Framework |\\n" +
    "| :--- | :--- | :--- |\\n" +
    "| Dependencies | 0 KB | 500+ KB |\\n" +
    "| Offline Ready | 100% | Often Needs CDNs |\\n" +
    "| Load Time | Near Instant | Higher Latency |";

  const input = document.getElementById('markdownInput');
  const preview = document.getElementById('htmlPreview');
  const charCount = document.getElementById('charCount');
  const readingTime = document.getElementById('readingTime');
  const copyHtmlBtn = document.getElementById('copyHtmlBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Lightweight Vanilla Markdown Parser
  function parseMarkdown(md) {
    if (!md) return '';

    let html = md;

    // Code blocks
    html = html.replace(/\\x60\\x60\\x60([a-z]*)\\n([\\s\\S]*?)\\x60\\x60\\x60/g, function (match, lang, code) {
      return '<pre><code>' + escapeHTML(code.trim()) + '</code></pre>';
    });

    // Inline code
    html = html.replace(/\\x60([^\\x60]+)\\x60/g, '<code>$1</code>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquotes
    html = html.replace(/^\\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bold & Italics
    html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
    html = html.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');

    // Lists
    html = html.replace(/^\\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>');

    // Tables
    html = parseTables(html);

    // Paragraphs
    const lines = html.split(/\\n\\n+/);
    html = lines.map(line => {
      line = line.trim();
      if (!line) return '';
      if (/^<(h1|h2|h3|ul|li|pre|blockquote|table)/.test(line)) {
        return line;
      }
      return '<p>' + line.replace(/\\n/g, '<br>') + '</p>';
    }).join('\\n');

    return html;
  }

  function parseTables(text) {
    return text.replace(/((?:\\|[^\\n]+\\|\\n?)+)/g, function (match) {
      const rows = match.trim().split('\\n').map(r => r.trim());
      if (rows.length < 2) return match;

      let tableHtml = '<table>';
      rows.forEach((row, index) => {
        // Skip separator row | --- | --- |
        if (/^\\|?\\s*:?-+:?\\s*(\\|\\s*:?-+:?\\s*)*\\|?$/.test(row)) return;

        const cells = row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
        if (cells.length === 0) return;

        const tag = index === 0 ? 'th' : 'td';
        tableHtml += '<tr>' + cells.map(c => '<' + tag + '>' + c + '</' + tag + '>').join('') + '</tr>';
      });
      tableHtml += '</table>';
      return tableHtml;
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function render() {
    const text = input.value;
    const html = parseMarkdown(text);
    preview.innerHTML = html;

    // Word stats
    const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
    const chars = text.length;
    charCount.textContent = \`\${words} words • \${chars} chars\`;

    const mins = Math.ceil(words / 200);
    readingTime.textContent = \`\${mins} min read\`;

    localStorage.setItem(STORAGE_KEY, text);
  }

  // Formatting helpers
  const tools = {
    bold: { before: '**', after: '**' },
    italic: { before: '*', after: '*' },
    h2: { before: '## ', after: '' },
    quote: { before: '> ', after: '' },
    code: { before: '\\x60\\x60\\x60javascript\\n', after: '\\n\\x60\\x60\\x60' },
    list: { before: '* ', after: '' },
    table: { before: '| Col 1 | Col 2 |\\n| :--- | :--- |\\n| Data 1 | Data 2 |\\n', after: '' }
  };

  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const config = tools[tag];
      if (!config) return;

      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;
      const selected = val.substring(start, end) || 'text';

      input.value = val.substring(0, start) + config.before + selected + config.after + val.substring(end);
      input.focus();
      render();
    });
  });

  copyHtmlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.innerHTML).then(() => {
      copyHtmlBtn.textContent = 'Copied!';
      setTimeout(() => { copyHtmlBtn.textContent = 'Copy HTML'; }, 2000);
    });
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear the markdown document?')) {
      input.value = '';
      render();
    }
  });

  input.addEventListener('input', render);

  // Initialize
  const saved = localStorage.getItem(STORAGE_KEY);
  input.value = saved !== null ? saved : defaultMarkdown;
  render();
  console.log('PureMark editor initialized.');
})();`
  },
  {
    id: 'vanilla-sketch',
    title: 'SketchCraft (HTML5 Canvas Drawing)',
    description: 'Canvas drawing tool with color picker, dynamic brush stroke size, eraser, undo/redo state stack, and PNG image export.',
    category: 'tool',
    icon: 'Palette',
    createdAt: 1710000004000,
    updatedAt: 1710000004000,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SketchCraft Drawing Studio</title>
</head>
<body>
  <div class="sketch-app">
    <aside class="sidebar">
      <h2>SketchCraft</h2>

      <div class="tool-section">
        <label class="section-title">TOOLS</label>
        <div class="tool-grid">
          <button class="tool-btn active" id="brushTool" data-mode="brush">Brush</button>
          <button class="tool-btn" id="eraserTool" data-mode="eraser">Eraser</button>
        </div>
      </div>

      <div class="tool-section">
        <label class="section-title">COLOR</label>
        <div class="color-palette" id="colorPalette">
          <span class="color-swatch active" style="background:#f8fafc" data-color="#f8fafc"></span>
          <span class="color-swatch" style="background:#38bdf8" data-color="#38bdf8"></span>
          <span class="color-swatch" style="background:#34d399" data-color="#34d399"></span>
          <span class="color-swatch" style="background:#fbbf24" data-color="#fbbf24"></span>
          <span class="color-swatch" style="background:#f43f5e" data-color="#f43f5e"></span>
          <span class="color-swatch" style="background:#a855f7" data-color="#a855f7"></span>
        </div>
        <input type="color" id="customColor" value="#38bdf8" class="custom-color-picker">
      </div>

      <div class="tool-section">
        <label class="section-title">SIZE (<span id="brushSizeDisplay">6px</span>)</label>
        <input type="range" id="brushSize" min="1" max="40" value="6">
      </div>

      <div class="tool-section actions">
        <button id="undoBtn" class="action-btn">Undo</button>
        <button id="clearBtn" class="action-btn danger">Clear Canvas</button>
        <button id="downloadBtn" class="action-btn primary">Save PNG</button>
      </div>
    </aside>

    <main class="canvas-area">
      <canvas id="paintCanvas" width="800" height="600"></canvas>
    </main>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #0b0f19;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  height: 100vh;
  overflow: hidden;
}

.sketch-app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background: #111827;
  border-right: 1px solid #1f2937;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar h2 {
  font-size: 1.1rem;
  color: #38bdf8;
  letter-spacing: 0.5px;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
  margin-bottom: 8px;
  display: block;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.tool-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.tool-btn.active {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
  font-weight: 600;
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}

.color-swatch {
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.1s;
}

.color-swatch.active {
  border-color: #ffffff;
  transform: scale(1.15);
}

.custom-color-picker {
  width: 100%;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #f1f5f9;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.action-btn.primary {
  background: #0284c7;
  border-color: #0284c7;
}

.action-btn.danger {
  color: #f43f5e;
}

.action-btn:hover {
  filter: brightness(1.15);
}

.canvas-area {
  flex: 1;
  background: #06090e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: auto;
}

canvas {
  background: #11141e;
  border: 1px solid #1f2937;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  cursor: crosshair;
}`,
    js: `// SketchCraft - HTML5 Canvas Drawing App
(function () {
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');

  let isDrawing = false;
  let currentMode = 'brush'; // 'brush' or 'eraser'
  let currentColor = '#f8fafc';
  let brushSize = 6;
  let historyStack = [];
  const maxHistory = 20;

  // DOM
  const brushTool = document.getElementById('brushTool');
  const eraserTool = document.getElementById('eraserTool');
  const colorPalette = document.getElementById('colorPalette');
  const customColor = document.getElementById('customColor');
  const brushSizeInput = document.getElementById('brushSize');
  const brushSizeDisplay = document.getElementById('brushSizeDisplay');
  const undoBtn = document.getElementById('undoBtn');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  // Fill initial background
  function initCanvas() {
    ctx.fillStyle = '#11141e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }

  function saveState() {
    if (historyStack.length >= maxHistory) {
      historyStack.shift();
    }
    historyStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  function undo() {
    if (historyStack.length > 1) {
      historyStack.pop();
      const previousState = historyStack[historyStack.length - 1];
      ctx.putImageData(previousState, 0, 0);
      console.log('Undo performed');
    }
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    draw(e);
  }

  function draw(e) {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentMode === 'eraser') {
      ctx.strokeStyle = '#11141e';
    } else {
      ctx.strokeStyle = currentColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
      saveState();
    }
  }

  // Mouse & Touch events
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
  window.addEventListener('touchend', stopDraw);

  // Tools
  brushTool.addEventListener('click', () => {
    currentMode = 'brush';
    brushTool.classList.add('active');
    eraserTool.classList.remove('active');
  });

  eraserTool.addEventListener('click', () => {
    currentMode = 'eraser';
    eraserTool.classList.add('active');
    brushTool.classList.remove('active');
  });

  // Colors
  colorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-swatch')) {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
      currentColor = e.target.dataset.color;
      customColor.value = currentColor;
      currentMode = 'brush';
      brushTool.classList.add('active');
      eraserTool.classList.remove('active');
    }
  });

  customColor.addEventListener('input', (e) => {
    currentColor = e.target.value;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    currentMode = 'brush';
    brushTool.classList.add('active');
    eraserTool.classList.remove('active');
  });

  brushSizeInput.addEventListener('input', (e) => {
    brushSize = Number(e.target.value);
    brushSizeDisplay.textContent = brushSize + 'px';
  });

  undoBtn.addEventListener('click', undo);

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear entire sketch?')) {
      initCanvas();
    }
  });

  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'sketch-' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    console.log('Sketch saved to PNG');
  });

  initCanvas();
})();`
  },
  {
    id: 'vanilla-blank',
    title: 'Vanilla Blank Starter',
    description: 'Clean starter with semantic HTML5 markup, responsive modern CSS reset, and modular vanilla JavaScript script.',
    category: 'starter',
    icon: 'Code2',
    createdAt: 1710000005000,
    updatedAt: 1710000005000,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanilla Web Starter</title>
</head>
<body>
  <main class="container">
    <div class="card">
      <div class="badge">Pure Vanilla Web</div>
      <h1>Hello, World!</h1>
      <p>This is a 100% offline, zero-dependency HTML, CSS, and JavaScript project. You can edit this file, add styles in <code>styles.css</code>, and add interactions in <code>script.js</code>.</p>
      
      <div class="interactive-demo">
        <button id="counterBtn" class="btn">Clicks: <span id="count">0</span></button>
        <button id="colorBtn" class="btn secondary">Toggle Mood</button>
      </div>

      <div class="info-footer">
        <span>No bundler required • Open directly in any browser</span>
      </div>
    </div>
  </main>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  transition: background-color 0.3s;
}

body.theme-accent {
  background-color: #1e1b4b;
}

.container {
  width: 100%;
  max-width: 540px;
}

.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #38bdf8;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: #ffffff;
}

p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 24px;
}

code {
  background: #0f172a;
  color: #38bdf8;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.interactive-demo {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.btn {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, background 0.15s;
}

.btn:hover {
  background: #0369a1;
  transform: translateY(-1px);
}

.btn.secondary {
  background: #334155;
}

.btn.secondary:hover {
  background: #475569;
}

.info-footer {
  font-size: 0.75rem;
  color: #64748b;
  border-top: 1px solid #334155;
  padding-top: 16px;
}`,
    js: `// Vanilla Web Starter Interaction
document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const counterBtn = document.getElementById('counterBtn');
  const countSpan = document.getElementById('count');
  const colorBtn = document.getElementById('colorBtn');

  counterBtn.addEventListener('click', () => {
    count++;
    countSpan.textContent = count;
    console.log('Button clicked. Total count:', count);
  });

  colorBtn.addEventListener('click', () => {
    document.body.classList.toggle('theme-accent');
    console.log('Theme toggled');
  });

  console.log('Vanilla Starter initialized successfully.');
});`
  }
];
