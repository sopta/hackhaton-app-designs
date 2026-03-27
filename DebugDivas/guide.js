/**
 * Debug Divas — Guide
 * - Zobrazuje jen aktuální krok
 * - Tlačítko "Hotovo" = označí krok jako dokončený a posune dál
 * - Sidebar navigace s progress
 * - Copy-to-clipboard
 */

const STORAGE_KEY = 'debugdivas-guide-progress';
const STEP_KEY = 'debugdivas-guide-current';

let currentStep = 0;
let steps = [];
let debugMode = false;

// === STORAGE ===

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function loadCurrentStep() {
  const s = parseInt(localStorage.getItem(STEP_KEY));
  return isNaN(s) ? 0 : Math.min(s, steps.length - 1);
}

function saveCurrentStep(s) { localStorage.setItem(STEP_KEY, String(s)); }

// === MARK STEP DONE ===

function markDone(index) {
  const p = loadProgress();
  p[String(index)] = true;
  saveProgress(p);
  updateProgressBar();
  updateSidebar();
}

// === PROGRESS BAR ===

function updateProgressBar() {
  const progress = loadProgress();
  const done = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((done / steps.length) * 100);
  const bar = document.getElementById('progressBar');
  const label = document.getElementById('progressLabel');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = done + ' / ' + steps.length + ' kroků hotovo';
}

// === SIDEBAR ===

function updateSidebar() {
  const progress = loadProgress();
  const items = document.querySelectorAll('#stepList li');
  const maxUnlocked = getMaxUnlocked();

  items.forEach((li, i) => {
    const link = li.querySelector('a');
    const isDone = !!progress[String(i)];
    link.classList.toggle('active', i === currentStep);
    li.classList.toggle('done', isDone);
    li.classList.toggle('locked', i > maxUnlocked && !debugMode);
  });
}

function getMaxUnlocked() {
  const progress = loadProgress();
  let max = 0;
  for (let i = 0; i < steps.length; i++) {
    if (progress[String(i)]) {
      max = Math.max(max, i + 1);
    }
  }
  return Math.max(max, currentStep);
}

// === SHOW STEP ===

function showStep(index) {
  currentStep = index;
  saveCurrentStep(index);

  steps.forEach((s, i) => {
    s.classList.toggle('visible', i === index);
  });

  updateSidebar();
  addNavButtons(index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === NAV BUTTONS ===

function addNavButtons(index) {
  steps.forEach(s => {
    const old = s.querySelector('.step-nav');
    if (old) old.remove();
  });

  const nav = document.createElement('div');
  nav.className = 'step-nav';

  // Zpět
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn nav-btn-prev';
  prevBtn.textContent = 'Zpět';
  prevBtn.disabled = index === 0;
  prevBtn.addEventListener('click', () => showStep(index - 1));

  // Hotovo / Dokončeno
  const doneBtn = document.createElement('button');
  doneBtn.className = 'nav-btn nav-btn-next';

  const isLastStep = index === steps.length - 1;
  const progress = loadProgress();
  const alreadyDone = !!progress[String(index)];

  if (isLastStep) {
    doneBtn.textContent = alreadyDone ? 'Vše dokončeno!' : 'Dokončit průvodce';
    doneBtn.disabled = alreadyDone;
    doneBtn.addEventListener('click', () => {
      markDone(index);
      steps[index].classList.add('completed');
      showStep(index); // refresh buttons
    });
  } else {
    doneBtn.textContent = 'Hotovo, další krok';
    doneBtn.addEventListener('click', () => {
      markDone(index);
      steps[index].classList.add('completed');
      showStep(index + 1);
    });
  }

  nav.appendChild(prevBtn);
  nav.appendChild(doneBtn);
  steps[index].appendChild(nav);
}

// === COPY CLASS NAMES ===

function initCopyButtons() {
  document.querySelectorAll('.copy-class').forEach(el => {
    el.title = 'Klikni pro zkopírování';
    el.addEventListener('click', () => {
      const text = el.dataset.class || el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        el.classList.add('copied');
        setTimeout(() => el.classList.remove('copied'), 1400);
      });
    });
  });
}

// === SIDEBAR CLICK ===

function initSidebar() {
  document.querySelectorAll('#stepList a').forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const li = link.closest('li');
      if (li.classList.contains('locked')) return;
      showStep(i);
    });
  });
}

// === KEYBOARD ===

function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentStep < steps.length - 1) {
        const maxUnlocked = getMaxUnlocked();
        if (debugMode || currentStep + 1 <= maxUnlocked) showStep(currentStep + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentStep > 0) showStep(currentStep - 1);
    }
  });
}

// === DEBUG & RESET (console only) ===

window.toggleDebug = function () {
  debugMode = !debugMode;
  console.log('%cDEBUG MODE: ' + (debugMode ? 'ON' : 'OFF'),
    'color:' + (debugMode ? '#6B8F71' : '#8A7D72') + ';font-weight:bold');
  updateSidebar();
};

window.resetGuide = function () {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STEP_KEY);
  steps.forEach(s => s.classList.remove('completed'));
  updateProgressBar();
  showStep(0);
  console.log('%cGuide reset!', 'color:#A67C52;font-weight:bold');
};

// === INIT ===

document.addEventListener('DOMContentLoaded', () => {
  steps = Array.from(document.querySelectorAll('.step'));
  currentStep = loadCurrentStep();

  // Restore completed visuals
  const progress = loadProgress();
  steps.forEach((s, i) => {
    if (progress[String(i)]) s.classList.add('completed');
  });

  initCopyButtons();
  initSidebar();
  initKeyboard();
  updateProgressBar();
  showStep(currentStep);
});
