import { CodeTemplate } from '@/types';

export const TEMPLATES: Record<string, CodeTemplate> = {
  starter: {
    name: 'Default Starter (Card & Button)',
    html: `<div class="card">
  <div class="card-icon">🚀</div>
  <h2>Interactive Web Playground</h2>
  <p>Live HTML, CSS, and JavaScript compiler. Edit code and watch the magic happen live!</p>
  <button id="counterBtn" class="btn">Clicked <span id="count">0</span> times</button>
</div>`,
    css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #60a5fa;
}

p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}`,
    js: `let count = 0;
const countEl = document.getElementById('count');
const btn = document.getElementById('counterBtn');

btn.addEventListener('click', () => {
  count++;
  countEl.textContent = count;
  console.log('Button clicked! New count:', count);
});

console.info('Starter template loaded successfully!');`
  },

  canvas: {
    name: 'Matrix Digital Rain (Canvas)',
    html: `<canvas id="matrixCanvas"></canvas>`,
    css: `body {
  margin: 0;
  background: #000;
  overflow: hidden;
}
canvas {
  display: block;
}`,
    js: `const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '0123456789ABCDEF@#$%&*+-=~';
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00ff66';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 33);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

console.log('Matrix digital rain active!');`
  },

  cube3d: {
    name: 'Interactive 3D CSS Cube',
    html: `<div class="scene">
  <div class="cube" id="cube">
    <div class="face front">FRONT</div>
    <div class="face back">BACK</div>
    <div class="face right">RIGHT</div>
    <div class="face left">LEFT</div>
    <div class="face top">TOP</div>
    <div class="face bottom">BOTTOM</div>
  </div>
</div>
<div class="hint">CSS 3D Transform Rendering</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  background: #090d16;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 800px;
  overflow: hidden;
  font-family: system-ui, sans-serif;
}

.scene {
  width: 180px;
  height: 180px;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(-30deg);
  animation: spin 12s infinite linear;
}

.face {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 2px solid rgba(59, 130, 246, 0.8);
  background: rgba(30, 58, 138, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #93c5fd;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
}

.front  { transform: rotateY(  0deg) translateZ(90px); }
.back   { transform: rotateY(180deg) translateZ(90px); }
.right  { transform: rotateY( 90deg) translateZ(90px); }
.left   { transform: rotateY(-90deg) translateZ(90px); }
.top    { transform: rotateX( 90deg) translateZ(90px); }
.bottom { transform: rotateX(-90deg) translateZ(90px); }

@keyframes spin {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}

.hint {
  color: #64748b;
  margin-top: 40px;
  font-size: 13px;
}`,
    js: `console.log('3D CSS Cube initialized');`
  },

  tailwind: {
    name: 'Tailwind CSS Modern Dashboard',
    html: `<div class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
  <div class="max-w-md w-full bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white">⚡</div>
        <div>
          <h3 class="font-bold text-lg">Analytics Overview</h3>
          <p class="text-xs text-slate-400">Live Workspace Status</p>
        </div>
      </div>
      <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Operational</span>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
        <span class="text-xs text-slate-400">Requests Today</span>
        <div class="text-2xl font-bold text-blue-400 mt-1">42,891</div>
        <span class="text-[11px] text-emerald-400">↑ 14.8% vs last week</span>
      </div>
      <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
        <span class="text-xs text-slate-400">Avg Latency</span>
        <div class="text-2xl font-bold text-purple-400 mt-1">18 ms</div>
        <span class="text-[11px] text-emerald-400">↓ 3 ms faster</span>
      </div>
    </div>

    <button class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/30">
      View Detailed Reports
    </button>
  </div>
</div>`,
    css: `/* Tailwind CSS is dynamically loaded via CDN */`,
    js: `console.log('Tailwind UI template active!');`,
    requiredCdns: ['https://cdn.tailwindcss.com']
  },

  calc: {
    name: 'Glassmorphism Calculator',
    html: `<div class="calc-box">
  <input type="text" id="display" class="calc-screen" readonly value="0">
  <div class="keys">
    <button class="key op" onclick="clearDisplay()">C</button>
    <button class="key op" onclick="append('/')">÷</button>
    <button class="key op" onclick="append('*')">×</button>
    <button class="key op" onclick="del()">⌫</button>
    
    <button class="key" onclick="append('7')">7</button>
    <button class="key" onclick="append('8')">8</button>
    <button class="key" onclick="append('9')">9</button>
    <button class="key op" onclick="append('-')">−</button>
    
    <button class="key" onclick="append('4')">4</button>
    <button class="key" onclick="append('5')">5</button>
    <button class="key" onclick="append('6')">6</button>
    <button class="key op" onclick="append('+')">+</button>
    
    <button class="key" onclick="append('1')">1</button>
    <button class="key" onclick="append('2')">2</button>
    <button class="key" onclick="append('3')">3</button>
    <button class="key equal" onclick="calculate()">=</button>
    
    <button class="key zero" onclick="append('0')">0</button>
    <button class="key" onclick="append('.')">.</button>
  </div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  font-family: system-ui, sans-serif;
}
.calc-box {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 280px;
}
.calc-screen {
  width: 100%;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 28px;
  text-align: right;
  margin-bottom: 20px;
  font-family: monospace;
}
.keys {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.key {
  height: 50px;
  border: none;
  background: rgba(51, 65, 85, 0.5);
  color: white;
  font-size: 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.1s;
}
.key:hover { background: rgba(71, 85, 105, 0.8); }
.key.op { background: #3b82f6; color: white; font-weight: bold; }
.key.equal { background: #10b981; grid-row: span 2; height: 110px; }
.key.zero { grid-column: span 2; }`,
    js: `const display = document.getElementById('display');
window.append = (val) => {
  if (display.value === '0' && val !== '.') display.value = '';
  display.value += val;
};
window.clearDisplay = () => { display.value = '0'; };
window.del = () => {
  display.value = display.value.slice(0, -1) || '0';
};
window.calculate = () => {
  try {
    display.value = eval(display.value) || 0;
  } catch(e) {
    display.value = 'Error';
  }
};
console.log('Calculator ready!');`
  },

  threejs: {
    name: 'Three.js 3D Animated Sphere',
    html: `<div id="canvas-container"></div>`,
    css: `body {
  margin: 0;
  overflow: hidden;
  background: #020617;
}
#canvas-container {
  width: 100vw;
  height: 100vh;
}`,
    js: `// Three.js animated wireframe sphere
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.IcosahedronGeometry(2, 4);
const material = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.005;
  sphere.rotation.y += 0.008;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('Three.js scene rendering smoothly!');`,
    requiredCdns: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js']
  }
};
