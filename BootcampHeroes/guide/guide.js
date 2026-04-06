/**
 * Bootcamp Heroes — Guide
 * - Kroky seskupené podle sekcí stránky
 * - Příprava + Meet the Team = povinné (sekvenční)
 * - Po dokončení Meet the Team se odemknou všechny zbylé sekce
 * - V rámci sekce: kroky sekvenční
 */

const STORAGE_KEY = 'bootcampheroes-guide-progress';
const STEP_KEY = 'bootcampheroes-guide-current';

// Skupiny kroků — indices odkazují na pořadí .step elementů v DOM (0-based)
const GROUPS = [
  { name: 'Příprava projektu', steps: [0],              required: true },
  { name: 'Meet the Team',     steps: [1, 2, 3, 4, 5],  required: true },
  { name: 'Sprint Board',      steps: [6, 7, 8],         required: false },
  { name: 'Dictionary',        steps: [9, 10],            required: false },
  { name: 'Footer',            steps: [11],               required: false },
  { name: 'Hero',              steps: [12],               required: false },
  { name: 'Dokončení',         steps: [13],               required: false },
];

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

// === UNLOCKING LOGIC ===

function isGroupComplete(group) {
  const progress = loadProgress();
  return group.steps.every(i => !!progress[String(i)]);
}

function areRequiredGroupsDone() {
  return GROUPS.filter(g => g.required).every(g => isGroupComplete(g));
}

function getUnlockedSteps() {
  const progress = loadProgress();
  const unlocked = new Set();

  for (const group of GROUPS) {
    // Check if this group is accessible
    let groupAccessible = false;

    if (group.required) {
      // Required groups: accessible if all previous required groups are complete
      const prevRequired = GROUPS.filter(g => g.required && GROUPS.indexOf(g) < GROUPS.indexOf(group));
      groupAccessible = prevRequired.every(g => isGroupComplete(g));
    } else {
      // Optional groups: accessible only after all required groups are done
      groupAccessible = areRequiredGroupsDone();
    }

    if (!groupAccessible) continue;

    // Within accessible group: sequential unlocking
    for (const stepIdx of group.steps) {
      unlocked.add(stepIdx);
      if (!progress[String(stepIdx)]) break; // stop at first incomplete
    }
  }

  return unlocked;
}

function isStepUnlocked(index) {
  if (debugMode) return true;
  return getUnlockedSteps().has(index);
}

// === SIDEBAR ===

function updateSidebar() {
  const progress = loadProgress();
  const unlocked = debugMode ? null : getUnlockedSteps();

  // Update step items
  const items = document.querySelectorAll('#stepList li[data-step-index]');
  items.forEach(li => {
    const i = parseInt(li.dataset.stepIndex);
    const link = li.querySelector('a');
    const isDone = !!progress[String(i)];
    const isLocked = !debugMode && !unlocked.has(i);

    link.classList.toggle('active', i === currentStep);
    li.classList.toggle('done', isDone);
    li.classList.toggle('locked', isLocked);
  });

  // Update group titles
  document.querySelectorAll('#stepList .step-group-title').forEach(title => {
    const groupIdx = parseInt(title.dataset.groupIndex);
    const group = GROUPS[groupIdx];
    if (!group) return;

    let groupLocked = false;
    if (!debugMode) {
      groupLocked = !group.steps.some(i => unlocked.has(i));
    }
    title.classList.toggle('locked', groupLocked);
    title.classList.toggle('group-complete', isGroupComplete(group));
  });
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

function findGroupForStep(index) {
  return GROUPS.find(g => g.steps.includes(index));
}

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

  const group = findGroupForStep(index);
  const isLastInGroup = group && index === group.steps[group.steps.length - 1];

  if (isLastStep) {
    doneBtn.textContent = alreadyDone ? 'Vše dokončeno!' : 'Dokončit průvodce';
    doneBtn.disabled = alreadyDone;
    doneBtn.addEventListener('click', () => {
      markDone(index);
      steps[index].classList.add('completed');
      showStep(index);
    });
  } else if (isLastInGroup) {
    // Last step in group — mark done, go to first step of next group
    doneBtn.textContent = alreadyDone ? 'Sekce dokončena ✓' : 'Dokončit sekci';
    doneBtn.disabled = alreadyDone;
    doneBtn.addEventListener('click', () => {
      markDone(index);
      steps[index].classList.add('completed');
      const groupIdx = GROUPS.indexOf(group);
      const nextGroup = GROUPS[groupIdx + 1];
      if (nextGroup) {
        showStep(nextGroup.steps[0]);
      } else {
        showStep(index);
      }
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
  document.querySelectorAll('#stepList li[data-step-index] a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const li = link.closest('li');
      if (li.classList.contains('locked')) return;
      const idx = parseInt(li.dataset.stepIndex);
      showStep(idx);
    });
  });
}

// === KEYBOARD ===

function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentStep < steps.length - 1) {
        if (isStepUnlocked(currentStep + 1)) showStep(currentStep + 1);
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
