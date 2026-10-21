/**
 * Web Compiler Studio — Core Application
 * Fullscreen HTML, CSS, JS Live Compiler & IDE
 */

// ================= THEME & CONTROLS =================
const themeToggle = document.getElementById('themeToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const switcherBtn = document.getElementById('switcherBtn');
const switcherMenu = document.getElementById('switcherMenu');
const btnTemplates = document.getElementById('btnTemplates');
const templatesMenu = document.getElementById('templatesMenu');
const btnExportMenu = document.getElementById('btnExportMenu');
const exportMenu = document.getElementById('exportMenu');

// Theme persistence
const savedTheme = localStorage.getItem('compiler_theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme');
  if (isDark) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('compiler_theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('compiler_theme', 'dark');
  }
});

// Fullscreen
fullscreenToggle?.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    document.body.classList.add('fullscreen-mode');
  } else {
    document.exitFullscreen().catch(() => {});
    document.body.classList.remove('fullscreen-mode');
  }
});

// Dropdowns
function closeAllDropdowns() {
  switcherMenu?.classList.remove('show');
  templatesMenu?.classList.remove('show');
  exportMenu?.classList.remove('show');
}

switcherBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const show = switcherMenu.classList.contains('show');
  closeAllDropdowns();
  if (!show) switcherMenu.classList.add('show');
});

btnTemplates?.addEventListener('click', (e) => {
  e.stopPropagation();
  const show = templatesMenu.classList.contains('show');
  closeAllDropdowns();
  if (!show) templatesMenu.classList.add('show');
});

btnExportMenu?.addEventListener('click', (e) => {
  e.stopPropagation();
  const show = exportMenu.classList.contains('show');
  closeAllDropdowns();
  if (!show) exportMenu.classList.add('show');
});

document.addEventListener('click', closeAllDropdowns);

// ================= LAYOUT SWITCHER =================
const layoutToggles = document.querySelectorAll('.icon-toggle');
const editorTabsBar = document.getElementById('editorTabsBar');
const editorPaneTabs = document.querySelectorAll('.pane-tab-btn');

layoutToggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    layoutToggles.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const layout = btn.dataset.layout;
    document.body.classList.remove('layout-split', 'layout-stacked', 'layout-tabs');
    document.body.classList.add(`layout-${layout}`);

    if (layout === 'tabs') {
      setActiveEditorTab('html');
    }
  });
});

function setActiveEditorTab(name) {
  editorPaneTabs.forEach(t => t.classList.toggle('active', t.dataset.editor === name));
  document.querySelectorAll('.code-box').forEach(box => {
    box.classList.toggle('tab-active', box.id.toLowerCase().includes(name));
  });
}

editorPaneTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    setActiveEditorTab(tab.dataset.editor);
  });
});

// ================= CODE EDITORS & LINE NUMBERS =================
const codeHtml = document.getElementById('codeHtml');
const codeCss = document.getElementById('codeCss');
const codeJs = document.getElementById('codeJs');
const linesHtml = document.getElementById('linesHtml');
const linesCss = document.getElementById('linesCss');
const linesJs = document.getElementById('linesJs');

function updateLineNumbers(textarea, lineContainer) {
  const lineCount = textarea.value.split('\n').length;
  let numbersHtml = '';
  for (let i = 1; i <= lineCount; i++) {
    numbersHtml += `<div>${i}</div>`;
  }
  lineContainer.innerHTML = numbersHtml;
}

function setupEditor(textarea, lineContainer, storageKey) {
  // Sync scroll
  textarea.addEventListener('scroll', () => {
    lineContainer.scrollTop = textarea.scrollTop;
  });

  // Tab key & auto-close brackets
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      triggerCodeChange();
    } else if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      runCompiler();
    }
  });

  textarea.addEventListener('input', () => {
    updateLineNumbers(textarea, lineContainer);
    if (storageKey) localStorage.setItem(storageKey, textarea.value);
    triggerCodeChange();
  });

  updateLineNumbers(textarea, lineContainer);
}

setupEditor(codeHtml, linesHtml, 'compiler_html');
setupEditor(codeCss, linesCss, 'compiler_css');
setupEditor(codeJs, linesJs, 'compiler_js');

// Wrap & Clear buttons
['Html', 'Css', 'Js'].forEach((type) => {
  const textarea = document.getElementById(`code${type}`);
  const lines = document.getElementById(`lines${type}`);
  const btnFold = document.getElementById(`btnFold${type}`);
  const btnClear = document.getElementById(`btnClear${type}`);

  btnFold?.addEventListener('click', () => {
    textarea.classList.toggle('wrap-text');
    btnFold.classList.toggle('active');
  });

  btnClear?.addEventListener('click', () => {
    if (confirm(`Clear all ${type.toUpperCase()} code?`)) {
      textarea.value = '';
      updateLineNumbers(textarea, lines);
      triggerCodeChange();
    }
  });
});

// ================= COMPILER & SANDBOX EXECUTION =================
const previewFrame = document.getElementById('previewFrame');
const autoRunCheck = document.getElementById('autoRunCheck');
const btnRun = document.getElementById('btnRun');
const btnReloadFrame = document.getElementById('btnReloadFrame');
const btnOpenNewWindow = document.getElementById('btnOpenNewWindow');
const consoleCounter = document.getElementById('consoleCounter');
const consoleOutput = document.getElementById('consoleOutput');
const consoleDrawer = document.getElementById('consoleDrawer');
const btnToggleConsole = document.getElementById('btnToggleConsole');
const btnCloseConsole = document.getElementById('btnCloseConsole');
const btnClearConsole = document.getElementById('btnClearConsole');

let debounceTimer = null;
let consoleErrorsCount = 0;
let consoleLogs = [];

function triggerCodeChange() {
  if (autoRunCheck.checked) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runCompiler, 400);
  }
}

btnRun?.addEventListener('click', runCompiler);
btnReloadFrame?.addEventListener('click', runCompiler);

// Capture console messages from iframe via postMessage
window.addEventListener('message', (event) => {
  if (event.data && event.data.source === 'compiler-sandbox-console') {
    handleConsoleMessage(event.data.type, event.data.args);
  }
});

function handleConsoleMessage(type, args) {
  const line = document.createElement('div');
  line.className = `console-line type-${type}`;

  const prefix = document.createElement('span');
  prefix.style.fontWeight = '700';
  prefix.style.opacity = '0.7';
  prefix.textContent = `[${type.toUpperCase()}]`;
  line.appendChild(prefix);

  const content = document.createElement('span');
  content.textContent = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      try { return JSON.stringify(arg); } catch (e) { return String(arg); }
    }
    return String(arg);
  }).join(' ');
  line.appendChild(content);

  if (consoleOutput.querySelector('.console-empty')) {
    consoleOutput.innerHTML = '';
  }
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;

  consoleLogs.push({ type, element: line });

  if (type === 'error') {
    consoleErrorsCount++;
    consoleCounter.textContent = consoleErrorsCount;
    consoleCounter.classList.add('has-error');
  } else {
    consoleCounter.textContent = consoleLogs.length;
  }
}

function clearConsole() {
  consoleLogs = [];
  consoleErrorsCount = 0;
  consoleCounter.textContent = '0';
  consoleCounter.classList.remove('has-error');
  consoleOutput.innerHTML = '<div class="console-empty">Console cleared.</div>';
}

btnClearConsole?.addEventListener('click', clearConsole);

btnToggleConsole?.addEventListener('click', () => {
  consoleDrawer.classList.toggle('show');
});

btnCloseConsole?.addEventListener('click', () => {
  consoleDrawer.classList.remove('show');
});

// Console filter tabs
document.querySelectorAll('.console-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.console-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    consoleLogs.forEach(item => {
      if (filter === 'all' || item.type === filter) {
        item.element.style.display = 'flex';
      } else {
        item.element.style.display = 'none';
      }
    });
  });
});

// Device Width Switcher
document.querySelectorAll('.device-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const width = btn.dataset.width;
    previewFrame.style.width = width;
    if (width === '100%') {
      previewFrame.classList.remove('device-simulation');
    } else {
      previewFrame.classList.add('device-simulation');
    }
  });
});

// External Libraries state
const activeCdns = {
  css: [],
  js: []
};
const customCdns = [];

function getInjectedLibraries() {
  let cssLinks = '';
  let jsScripts = '';

  // Standard checked
  document.querySelectorAll('.lib-check-item input:checked').forEach(cb => {
    if (cb.dataset.css) cssLinks += `<link rel="stylesheet" href="${cb.dataset.css}">\n`;
    if (cb.dataset.js) jsScripts += `<script src="${cb.dataset.js}"><\/script>\n`;
  });

  // Custom CDNs
  customCdns.forEach(url => {
    if (url.endsWith('.css') || url.includes('/css')) {
      cssLinks += `<link rel="stylesheet" href="${url}">\n`;
    } else {
      jsScripts += `<script src="${url}"><\/script>\n`;
    }
  });

  return { cssLinks, jsScripts };
}

function updateActiveLibsBadge() {
  const checkedCount = document.querySelectorAll('.lib-check-item input:checked').length;
  const total = checkedCount + customCdns.length;
  const badge = document.getElementById('activeLibsCount');
  if (badge) badge.textContent = total;
}

function generateCompleteHtml() {
  const html = codeHtml.value;
  const css = codeCss.value;
  const js = codeJs.value;
  const { cssLinks, jsScripts } = getInjectedLibraries();

  // Console bridge script injected into iframe
  const consoleBridge = `
    <script>
      (function() {
        function send(type, args) {
          try {
            window.parent.postMessage({
              source: 'compiler-sandbox-console',
              type: type,
              args: Array.from(args).map(a => {
                if (typeof a === 'function') return a.toString();
                if (a instanceof Error) return a.message + '\\n' + a.stack;
                return a;
              })
            }, '*');
          } catch(e) {}
        }
        var origLog = console.log, origWarn = console.warn, origError = console.error, origInfo = console.info;
        console.log = function() { send('log', arguments); origLog.apply(console, arguments); };
        console.warn = function() { send('warn', arguments); origWarn.apply(console, arguments); };
        console.error = function() { send('error', arguments); origError.apply(console, arguments); };
        console.info = function() { send('info', arguments); origInfo.apply(console, arguments); };

        window.onerror = function(msg, url, line, col, err) {
          send('error', [msg + ' (Line ' + line + ':' + col + ')']);
          return false;
        };
      })();
    <\/script>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cssLinks}
  <style>
    ${css}
  </style>
  ${consoleBridge}
</head>
<body>
  ${html}
  ${jsScripts}
  <script>
    try {
      ${js}
    } catch(err) {
      console.error(err);
    }
  <\/script>
</body>
</html>`;
}

function runCompiler() {
  clearConsole();
  const fullSource = generateCompleteHtml();
  previewFrame.srcdoc = fullSource;
}

// Open preview in new window
btnOpenNewWindow?.addEventListener('click', () => {
  const fullSource = generateCompleteHtml();
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(fullSource);
    win.document.close();
  }
});

// ================= LIBRARIES MODAL =================
const libsModal = document.getElementById('libsModal');
const btnOpenLibs = document.getElementById('btnOpenLibs');
const btnCloseLibs = document.getElementById('btnCloseLibs');
const btnApplyLibs = document.getElementById('btnApplyLibs');
const customCdnUrl = document.getElementById('customCdnUrl');
const btnAddCustomCdn = document.getElementById('btnAddCustomCdn');
const customCdnList = document.getElementById('customCdnList');

btnOpenLibs?.addEventListener('click', () => libsModal.classList.add('show'));
btnCloseLibs?.addEventListener('click', () => libsModal.classList.remove('show'));
btnApplyLibs?.addEventListener('click', () => {
  libsModal.classList.remove('show');
  updateActiveLibsBadge();
  runCompiler();
});

btnAddCustomCdn?.addEventListener('click', () => {
  const url = customCdnUrl.value.trim();
  if (!url || !url.startsWith('http')) {
    alert('Please enter a valid HTTP/HTTPS URL');
    return;
  }
  if (!customCdns.includes(url)) {
    customCdns.push(url);
    renderCustomCdns();
    customCdnUrl.value = '';
  }
});

function renderCustomCdns() {
  customCdnList.innerHTML = '';
  customCdns.forEach((url, idx) => {
    const item = document.createElement('div');
    item.className = 'custom-cdn-item';
    item.innerHTML = `
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:380px;">${url}</span>
      <button onclick="removeCustomCdn(${idx})">✕</button>
    `;
    customCdnList.appendChild(item);
  });
  updateActiveLibsBadge();
}

window.removeCustomCdn = (idx) => {
  customCdns.splice(idx, 1);
  renderCustomCdns();
};

document.querySelectorAll('.lib-check-item input').forEach(cb => {
  cb.addEventListener('change', updateActiveLibsBadge);
});

// ================= CODE FORMATTER (BASIC PRETTIFY) =================
const btnFormat = document.getElementById('btnFormat');

btnFormat?.addEventListener('click', () => {
  try {
    // Basic indentation beautifier
    [
      { el: codeHtml, lines: linesHtml },
      { el: codeCss, lines: linesCss },
      { el: codeJs, lines: linesJs }
    ].forEach(({ el, lines }) => {
      const formatted = el.value
        .split('\n')
        .map(l => l.trimEnd())
        .join('\n');
      el.value = formatted;
      updateLineNumbers(el, lines);
    });
    alert('Code formatted successfully!');
  } catch (e) {
    alert('Formatting failed: ' + e.message);
  }
});

// Reset button
const btnReset = document.getElementById('btnReset');
btnReset?.addEventListener('click', () => {
  if (confirm('Reset workspace to an empty project?')) {
    codeHtml.value = '';
    codeCss.value = '';
    codeJs.value = '';
    updateLineNumbers(codeHtml, linesHtml);
    updateLineNumbers(codeCss, linesCss);
    updateLineNumbers(codeJs, linesJs);
    runCompiler();
  }
});

// ================= TEMPLATES =================
const TEMPLATES = {
  starter: {
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
<div class="hint">Click and drag or hover to interact</div>`,
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
  width: 200px;
  height: 200px;
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
  width: 200px;
  height: 200px;
  border: 2px solid rgba(59, 130, 246, 0.8);
  background: rgba(30, 58, 138, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #93c5fd;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
}

.front  { transform: rotateY(  0deg) translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY( 90deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX( 90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }

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
    js: `console.log('Tailwind UI template active!');`
  },

  calc: {
    html: `<div class="calc-box">
  <input type="text" id="display" class="calc-screen" readonly value="0">
  <div class="calc-grid">
    <button class="btn op" onclick="clearCalc()">C</button>
    <button class="btn op" onclick="backspace()">⌫</button>
    <button class="btn op" onclick="press('%')">%</button>
    <button class="btn op" onclick="press('/')">÷</button>

    <button class="btn num" onclick="press('7')">7</button>
    <button class="btn num" onclick="press('8')">8</button>
    <button class="btn num" onclick="press('9')">9</button>
    <button class="btn op" onclick="press('*')">×</button>

    <button class="btn num" onclick="press('4')">4</button>
    <button class="btn num" onclick="press('5')">5</button>
    <button class="btn num" onclick="press('6')">6</button>
    <button class="btn op" onclick="press('-')">-</button>

    <button class="btn num" onclick="press('1')">1</button>
    <button class="btn num" onclick="press('2')">2</button>
    <button class="btn num" onclick="press('3')">3</button>
    <button class="btn op" onclick="press('+')">+</button>

    <button class="btn num zero" onclick="press('0')">0</button>
    <button class="btn num" onclick="press('.')">.</button>
    <button class="btn equal" onclick="calcResult()">=</button>
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
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  width: 280px;
}

.calc-screen {
  width: 100%;
  height: 60px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #fff;
  font-size: 26px;
  text-align: right;
  padding: 0 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.btn {
  height: 50px;
  border-radius: 12px;
  border: none;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.15s;
}

.btn:active { transform: scale(0.95); }

.num { background: #334155; color: #fff; }
.op { background: #1e293b; color: #38bdf8; }
.equal { background: #3b82f6; color: #fff; grid-column: span 1; }
.zero { grid-column: span 2; }`,
    js: `const display = document.getElementById('display');
let cur = '';

function press(val) {
  if (display.value === '0' && val !== '.') cur = '';
  cur += val;
  display.value = cur;
}

function clearCalc() {
  cur = '';
  display.value = '0';
}

function backspace() {
  cur = cur.slice(0, -1);
  display.value = cur || '0';
}

function calcResult() {
  try {
    const res = eval(cur.replace(/÷/g, '/').replace(/×/g, '*'));
    display.value = res;
    cur = String(res);
  } catch(e) {
    display.value = 'Error';
    cur = '';
  }
}`
  },

  threejs: {
    html: `<div id="canvasContainer"></div>`,
    css: `body {
  margin: 0;
  overflow: hidden;
  background: #000;
}
#canvasContainer {
  width: 100vw;
  height: 100vh;
}`,
    js: `// Three.js animated wireframe sphere
if (typeof THREE === 'undefined') {
  console.warn('Three.js library not detected. Loading CDN automatically...');
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = initThree;
  document.head.appendChild(s);
} else {
  initThree();
}

function initThree() {
  const container = document.getElementById('canvasContainer');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(2, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.005;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  console.log('Three.js 3D Sphere running!');
}`
  }
};

document.querySelectorAll('#templatesMenu .menu-item').forEach((item) => {
  item.addEventListener('click', () => {
    const tplKey = item.dataset.tpl;
    const tpl = TEMPLATES[tplKey];
    if (!tpl) return;

    if (confirm(`Load "${item.textContent}" template? Current code will be replaced.`)) {
      codeHtml.value = tpl.html;
      codeCss.value = tpl.css;
      codeJs.value = tpl.js;

      if (tplKey === 'tailwind') {
        const twCheckbox = document.getElementById('libTailwind');
        if (twCheckbox) twCheckbox.checked = true;
        updateActiveLibsBadge();
      }

      updateLineNumbers(codeHtml, linesHtml);
      updateLineNumbers(codeCss, linesCss);
      updateLineNumbers(codeJs, linesJs);
      runCompiler();
    }
  });
});

// ================= EXPORT & SHARE =================
const btnExportHtml = document.getElementById('btnExportHtml');
const btnExportZip = document.getElementById('btnExportZip');
const btnCopyShareUrl = document.getElementById('btnCopyShareUrl');

btnExportHtml?.addEventListener('click', () => {
  const source = generateCompleteHtml();
  const blob = new Blob([source], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'project-bundle.html';
  a.click();
});

btnExportZip?.addEventListener('click', () => {
  // Simple multi-file download
  const files = [
    { name: 'index.html', content: codeHtml.value, type: 'text/html' },
    { name: 'style.css', content: codeCss.value, type: 'text/css' },
    { name: 'script.js', content: codeJs.value, type: 'application/javascript' }
  ];

  files.forEach(f => {
    const blob = new Blob([f.content], { type: f.type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = f.name;
    a.click();
  });
  alert('Downloaded individual project files (index.html, style.css, script.js)');
});

btnCopyShareUrl?.addEventListener('click', async () => {
  try {
    const payload = JSON.stringify({
      h: codeHtml.value,
      c: codeCss.value,
      j: codeJs.value
    });
    const hash = btoa(encodeURIComponent(payload));
    const url = `${window.location.origin}${window.location.pathname}#code=${hash}`;
    await navigator.clipboard.writeText(url);
    alert('Shareable code URL copied to clipboard!');
  } catch (err) {
    alert('Failed to generate share URL');
  }
});

// Load from URL Hash if present
function loadFromHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#code=')) {
    try {
      const b64 = hash.replace('#code=', '');
      const json = decodeURIComponent(atob(b64));
      const data = JSON.parse(json);
      if (data.h !== undefined) codeHtml.value = data.h;
      if (data.c !== undefined) codeCss.value = data.c;
      if (data.j !== undefined) codeJs.value = data.j;
      updateLineNumbers(codeHtml, linesHtml);
      updateLineNumbers(codeCss, linesCss);
      updateLineNumbers(codeJs, linesJs);
      runCompiler();
      return true;
    } catch (e) {
      console.error('Invalid URL code hash');
    }
  }
  return false;
}

// Initial Load
if (!loadFromHash()) {
  const savedHtml = localStorage.getItem('compiler_html');
  const savedCss = localStorage.getItem('compiler_css');
  const savedJs = localStorage.getItem('compiler_js');

  if (savedHtml || savedCss || savedJs) {
    codeHtml.value = savedHtml || '';
    codeCss.value = savedCss || '';
    codeJs.value = savedJs || '';
    updateLineNumbers(codeHtml, linesHtml);
    updateLineNumbers(codeCss, linesCss);
    updateLineNumbers(codeJs, linesJs);
  } else {
    // Load starter template
    const starter = TEMPLATES.starter;
    codeHtml.value = starter.html;
    codeCss.value = starter.css;
    codeJs.value = starter.js;
    updateLineNumbers(codeHtml, linesHtml);
    updateLineNumbers(codeCss, linesCss);
    updateLineNumbers(codeJs, linesJs);
  }
}

updateActiveLibsBadge();
runCompiler();
