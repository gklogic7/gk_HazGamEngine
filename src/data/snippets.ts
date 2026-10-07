import { CodeSnippet } from '../types';

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'html-boilerplate',
    title: 'HTML5 Semantic Page',
    target: 'html',
    category: 'HTML Structure',
    description: 'Clean modern HTML5 semantic structure with header, main, and footer.',
    code: `<header class="site-header">
  <div class="logo">VanillaApp</div>
  <nav>
    <a href="#features">Features</a>
    <a href="#about">About</a>
  </nav>
</header>

<main class="main-content">
  <section class="hero">
    <h1>Build Faster with Pure Web Standards</h1>
    <p>Zero dependencies, zero build step, instant performance.</p>
    <button class="cta-button" id="ctaBtn">Get Started</button>
  </section>
</main>

<footer class="site-footer">
  <p>&copy; 2026 Pure Vanilla Project</p>
</footer>`
  },
  {
    id: 'html-dialog',
    title: 'Native HTML5 Dialog Element',
    target: 'html',
    category: 'HTML5 Features',
    description: 'Accessible modal dialog using the native <dialog> element and showModal() API.',
    code: `<dialog id="favDialog" class="modal-dialog">
  <form method="dialog">
    <h3>Native Dialog Modal</h3>
    <p>This uses the browser's built-in &lt;dialog&gt; API with zero extra JS libraries.</p>
    <menu>
      <button value="cancel">Close</button>
      <button id="confirmBtn" value="default">Confirm</button>
    </menu>
  </form>
</dialog>
<button id="openDialogBtn">Open Native Dialog</button>`
  },
  {
    id: 'css-reset',
    title: 'Modern CSS Reset',
    target: 'css',
    category: 'Layout & Reset',
    description: 'Sensible modern CSS reset with border-box and smooth font rendering.',
    code: `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  background-color: #0f172a;
  color: #f8fafc;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}`
  },
  {
    id: 'css-grid-responsive',
    title: 'Auto-Fit Responsive CSS Grid',
    target: 'css',
    category: 'Layout & Reset',
    description: 'No media query auto-fitting responsive card grid.',
    code: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.card-item {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}`
  },
  {
    id: 'css-flex-center',
    title: 'Flexbox Center Everything',
    target: 'css',
    category: 'Layout & Reset',
    description: 'Classic bulletproof viewport centering.',
    code: `.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}`
  },
  {
    id: 'js-dom-ready',
    title: 'DOMContentLoaded Listener',
    target: 'js',
    category: 'DOM & Events',
    description: 'Safe initialization once DOM structure is completely ready.',
    code: `document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  // Initialize application logic here
});`
  },
  {
    id: 'js-localstorage',
    title: 'LocalStorage Helper Wrapper',
    target: 'js',
    category: 'Storage',
    description: 'Safe typed JSON localStorage getter and setter with error handling.',
    code: `const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage read failed:', e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage write failed:', e);
      return false;
    }
  }
};`
  },
  {
    id: 'js-webaudio-beep',
    title: 'Web Audio Beep Generator',
    target: 'js',
    category: 'Audio API',
    description: 'Synthesizes clean audio beeps using native OscillatorNode without any sound files.',
    code: `function playTone(freq = 440, duration = 0.2, type = 'sine') {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}`
  },
  {
    id: 'js-canvas-loop',
    title: 'Canvas Animation Loop with requestAnimationFrame',
    target: 'js',
    category: 'Canvas 2D',
    description: '60fps optimized game/animation loop with delta time calculation.',
    code: `const canvas = document.querySelector('canvas') || document.createElement('canvas');
const ctx = canvas.getContext('2d');
let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // 1. Clear frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Update physics & render
  // ...

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);`
  },
  {
    id: 'js-event-delegation',
    title: 'Efficient Event Delegation',
    target: 'js',
    category: 'DOM & Events',
    description: 'Handle dynamic child clicks using a single parent listener.',
    code: `document.getElementById('listContainer')?.addEventListener('click', (e) => {
  const button = e.target.closest('[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  console.log('Action triggered:', action, 'ID:', id);
});`
  }
];
