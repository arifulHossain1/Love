const slides = [...document.querySelectorAll('.slide')];
const dots = document.getElementById('dots');
const counter = document.getElementById('counter');
const backBtn = document.getElementById('backBtn');
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
let current = 0;
let transitioning = false;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Go to page ${i + 1}`);
  dot.addEventListener('click', () => go(i));
  dots.appendChild(dot);
});
const dotEls = [...dots.children];

function updateUi() {
  dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
  counter.textContent = `${current + 1} / ${slides.length}`;
  backBtn.disabled = current === 0;
}

function go(index) {
  if (transitioning || index < 0 || index >= slides.length || index === current) return;
  transitioning = true;
  const old = slides[current];
  const direction = index > current ? 1 : -1;
  old.classList.remove('active');
  old.classList.add(direction > 0 ? 'exit-left' : 'exit-right');
  current = index;
  const next = slides[current];
  next.style.transform = `translate3d(${direction > 0 ? '8%' : '-8%'},0,0) scale(.985)`;
  next.style.opacity = '0';
  next.scrollTop = 0;
  requestAnimationFrame(() => {
    next.classList.add('active');
    next.style.transform = '';
    next.style.opacity = '';
  });
  setTimeout(() => {
    old.classList.remove('exit-left', 'exit-right');
    transitioning = false;
  }, 570);
  updateUi();
  menu.classList.remove('open');
}

document.querySelectorAll('.next').forEach(btn => btn.addEventListener('click', () => go(current + 1)));
backBtn.addEventListener('click', () => go(current - 1));
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  menu.classList.toggle('open');
});
menu.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => go(Number(btn.dataset.go))));
document.addEventListener('click', e => {
  if (!menu.contains(e.target) && e.target !== menuBtn) menu.classList.remove('open');
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') go(current + 1);
  if (e.key === 'ArrowLeft') go(current - 1);
  if (e.key === 'Escape') menu.classList.remove('open');
});

// Horizontal swipes switch chapters, while vertical gestures keep normal page scrolling.
let sx = 0, sy = 0;
document.addEventListener('touchstart', e => {
  if (!e.changedTouches[0]) return;
  sx = e.changedTouches[0].screenX;
  sy = e.changedTouches[0].screenY;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!e.changedTouches[0]) return;
  const dx = e.changedTouches[0].screenX - sx;
  const dy = e.changedTouches[0].screenY - sy;
  if (Math.abs(dx) > 68 && Math.abs(dx) > Math.abs(dy) * 1.45) {
    dx < 0 ? go(current + 1) : go(current - 1);
  }
}, { passive: true });

// Falling petals — light enough not to distract or hurt performance.
const petalField = document.getElementById('petalField');
for (let i = 0; i < 13; i++) {
  const p = document.createElement('i');
  p.className = 'petal';
  p.style.left = `${Math.random() * 100}vw`;
  p.style.animationDuration = `${10 + Math.random() * 8}s`;
  p.style.animationDelay = `${-Math.random() * 16}s`;
  p.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
  p.style.opacity = `${.22 + Math.random() * .34}`;
  p.style.transform = `scale(${.55 + Math.random() * .9})`;
  petalField.appendChild(p);
}

// Photo flip notes.
document.querySelectorAll('.flip-photo').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// Relationship report secret.
const reportReveal = document.getElementById('reportReveal');
const reportSecret = document.getElementById('reportSecret');
reportReveal.addEventListener('click', () => {
  reportSecret.classList.toggle('show');
  reportReveal.textContent = reportSecret.classList.contains('show') ? 'okay, hide my softness 😭' : 'tap for the actual result';
});

// Envelope opens the user's own original-style letter.
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
envelope.addEventListener('click', () => {
  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');
  letter.setAttribute('aria-hidden', 'false');
  setTimeout(() => letter.classList.add('show'), 300);
});

// Playful no button. It dodges a few times as a joke, then becomes a real "not now" choice.
const noBtn = document.getElementById('noBtn');
const noHint = document.getElementById('noHint');
const answerZone = document.getElementById('answerZone');
let dodges = 0;
function dodgeNo(event) {
  if (dodges >= 5) return;
  event.preventDefault();
  dodges += 1;
  const zone = answerZone.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const maxX = Math.max(6, zone.width - btn.width - 6);
  const maxY = Math.max(6, zone.height - btn.height - 6);
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${Math.random() * maxX}px`;
  noBtn.style.top = `${Math.random() * maxY}px`;
  const messages = [
    'Excuse me?? 😭',
    'Wrong button, baby 😂',
    'Why are you chasing it? 😭',
    'Sweetieeee… behave.',
    'Okay okay, I’ll stop being dramatic 😭'
  ];
  noHint.textContent = messages[dodges - 1];
  if (dodges === 5) {
    setTimeout(() => {
      noBtn.style.position = 'relative';
      noBtn.style.left = '';
      noBtn.style.top = '';
      noBtn.textContent = 'Not now ♡';
      noHint.textContent = 'Joke over — your answer is always yours. ❤️';
    }, 650);
  }
}
noBtn.addEventListener('pointerenter', dodgeNo);
noBtn.addEventListener('click', e => {
  if (dodges < 5) {
    dodgeNo(e);
    return;
  }
  noHint.textContent = 'Okay. No pressure. I still hope the little website made you smile. ♡';
});

// Yes celebration.
const yesBtn = document.getElementById('yesBtn');
const celebration = document.getElementById('celebration');
const closeCelebrate = document.getElementById('closeCelebrate');
yesBtn.addEventListener('click', () => {
  celebration.classList.add('show');
  celebration.setAttribute('aria-hidden', 'false');
  burstHearts();
});
function closeCelebration() {
  celebration.classList.remove('show');
  celebration.setAttribute('aria-hidden', 'true');
}
closeCelebrate.addEventListener('click', closeCelebration);
celebration.addEventListener('click', e => { if (e.target === celebration) closeCelebration(); });
function burstHearts() {
  const pieces = ['♡', '♥', '💗', '✨', '🌸'];
  for (let i = 0; i < 72; i++) {
    const h = document.createElement('span');
    h.className = 'confetti-heart';
    h.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    h.style.left = `${Math.random() * 100}vw`;
    h.style.fontSize = `${14 + Math.random() * 19}px`;
    h.style.animationDelay = `${Math.random() * .8}s`;
    h.style.animationDuration = `${2.5 + Math.random() * 2.2}s`;
    h.style.setProperty('--x', `${-120 + Math.random() * 240}px`);
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5600);
  }
}

// Tiny in-browser melody: no audio file, no autoplay problems, no external dependency.
const musicBtn = document.getElementById('musicBtn');
let audioCtx = null, musicTimer = null, musicOn = false, noteIndex = 0;
const notes = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66, 349.23, 440, 523.25, 440, 349.23, 293.66];
function playTone(freq, duration = .58) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.028, audioCtx.currentTime + .035);
  gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + .03);
}
function melodyTick() {
  if (!musicOn) return;
  playTone(notes[noteIndex % notes.length]);
  noteIndex += 1;
  musicTimer = setTimeout(melodyTick, 760);
}
musicBtn.addEventListener('click', async () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? '♫' : '♪';
  musicBtn.style.background = musicOn ? '#f4c7d2' : '';
  clearTimeout(musicTimer);
  if (musicOn) melodyTick();
});

updateUi();
