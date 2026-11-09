// Cute Lamp — pull the hanging cord to toggle the lamp.
const $ = (selector) => document.querySelector(selector);
const lamp = $('.lamp');
const cord = $('.cord');
const cordString = $('.cord-string');
const cordHandle = $('.cord-handle');
const hint = $('.hint');

const DETENT = 34; // pixels of downward travel needed to trigger the switch
let pointerStartY = 0;
let currentPull = 0;
let isDragging = false;
let hasTriggered = false;

function setPull(distance) {
  currentPull = Math.max(0, Math.min(distance, 55));
  cordString.style.height = `${83 + currentPull}px`;
  cordHandle.style.top = `${78 + currentPull}px`;
}

function toggleLamp() {
  lamp.classList.toggle('on');
  hint.textContent = lamp.classList.contains('on')
    ? 'PULL THE CORD AGAIN TO TURN OFF'
    : 'PULL THE CORD TO TURN ON THE LIGHT';
}

function drag(event) {
  if (event.button !== undefined && event.button !== 0) return;
  event.preventDefault();
  isDragging = true;
  hasTriggered = false;
  pointerStartY = event.clientY;
  cord.classList.add('dragging');
  cord.setPointerCapture?.(event.pointerId);
}

function move(event) {
  if (!isDragging) return;
  const pull = Math.max(0, event.clientY - pointerStartY);
  setPull(pull);
  if (pull > DETENT && !hasTriggered) {
    hasTriggered = true;
    toggleLamp();
  }
}

function release() {
  if (!isDragging) return;
  isDragging = false;
  cord.classList.remove('dragging');
  setPull(0);
}

cord.addEventListener('pointerdown', drag);
cord.addEventListener('pointermove', move);
cord.addEventListener('pointerup', release);
cord.addEventListener('pointercancel', release);
cord.addEventListener('lostpointercapture', release);

// Keyboard accessibility: Enter or Space toggles the lamp.
cord.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleLamp();
  }
});

// Clicking/tapping the cord is a convenient fallback on touch screens.
cord.addEventListener('click', event => {
  if (event.detail === 0) return; // keyboard activation is handled above
  if (!hasTriggered && !isDragging) toggleLamp();
});
