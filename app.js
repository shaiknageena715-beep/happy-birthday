/* ============================================================
   BIRTHDAY SURPRISE – app.js  (full rewrite)
   ============================================================ */
'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   AMBIENT PARTICLES
   ============================================================ */
(function () {
  const wrap = $('#ambient-particles');
  if (!wrap) return;
  const glyphs = ['💗','💕','✨','⭐','💫','🌸'];
  for (let i = 0; i < 55; i++) {
    const el = document.createElement('div');
    const isGlyph = Math.random() > 0.4;
    el.classList.add('particle', isGlyph ? 'heart' : 'sparkle');
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top  = Math.random() * 100 + 'vh';
    el.style.setProperty('--dur',   (5 + Math.random() * 10) + 's');
    el.style.setProperty('--delay', (Math.random() * 9) + 's');
    if (isGlyph) {
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      el.style.fontSize = (8 + Math.random() * 10) + 'px';
    } else {
      const s = 1 + Math.random() * 3;
      el.style.width = s + 'px';
      el.style.height = s + 'px';
      el.style.background = Math.random() > 0.5 ? '#f5c842' : '#c9b8f0';
    }
    wrap.appendChild(el);
  }
})();

/* ============================================================
   PAGE TRANSITIONS
   Pages: page-cake → page-cards → page-gallery → page-letter → page-promise
   ============================================================ */
const PAGE_ORDER = ['page-cake', 'page-cards', 'page-gallery', 'page-letter', 'page-promise'];
let currentPage     = 'page-cake';
let isTransitioning = false;

function goToPage(id) {
  if (isTransitioning || id === currentPage) return;
  isTransitioning = true;

  const from = $(`#${currentPage}`);
  const to   = $(`#${id}`);
  if (!from || !to) { isTransitioning = false; return; }

  from.classList.add('exit');
  from.classList.remove('active');

  setTimeout(() => {
    from.classList.remove('exit');
    to.classList.add('active');

    // scroll inner content to top on page enter
    const sw = to.querySelector('.scroll-wrap');
    if (sw) sw.scrollTop = 0;

    currentPage = id;
    isTransitioning = false;
    updateNavDots();
    onPageEnter(id);
  }, 680);
}

function updateNavDots() {
  $$('.nav-dot').forEach(d => d.classList.toggle('active', d.dataset.page === currentPage));
}

function onPageEnter(id) {
  if (id === 'page-cards')   initCards();
  if (id === 'page-gallery') initGallery();
  if (id === 'page-letter')  initLetter();
  if (id === 'page-promise') initPromise();
}

// Nav dot clicks
$$('.nav-dot').forEach(d => d.addEventListener('click', () => goToPage(d.dataset.page)));

// Keyboard navigation
document.addEventListener('keydown', e => {
  const idx = PAGE_ORDER.indexOf(currentPage);
  if (e.key === 'ArrowRight' && idx < PAGE_ORDER.length - 1) goToPage(PAGE_ORDER[idx + 1]);
  if (e.key === 'ArrowLeft'  && idx > 0)                     goToPage(PAGE_ORDER[idx - 1]);
});

/* ============================================================
   MUSIC
   File: sub_clair_happy_birthday.mp3  (place in e:/hbd/)
   ============================================================ */
const audio        = $('#birthdayAudio');
const musicBar     = $('#musicBar');
const playPauseBtn = $('#playPauseBtn');
const playIcon     = $('#playIcon');
const pauseIcon    = $('#pauseIcon');
const muteBtn      = $('#muteBtn');
const volIcon      = $('#volIcon');
const muteIcon     = $('#muteIcon');

function startMusic() {
  if (!audio) return;
  audio.volume = 0.65;
  audio.loop   = true;
  audio.play().catch(() => {/* blocked – user can hit play in bar */});
  setPlaying(true);
  if (musicBar) musicBar.style.display = 'flex';
}

function stopMusic() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  setPlaying(false);
  if (musicBar) musicBar.style.display = 'none';
}

function setPlaying(on) {
  if (!playIcon || !pauseIcon) return;
  playIcon.style.display  = on ? 'none'  : 'inline';
  pauseIcon.style.display = on ? 'inline': 'none';
}

playPauseBtn?.addEventListener('click', () => {
  if (!audio) return;
  if (audio.paused) { audio.play(); setPlaying(true); }
  else              { audio.pause(); setPlaying(false); }
});

muteBtn?.addEventListener('click', () => {
  if (!audio) return;
  audio.muted = !audio.muted;
  if (volIcon && muteIcon) {
    volIcon.style.display  = audio.muted ? 'none'  : 'inline';
    muteIcon.style.display = audio.muted ? 'inline': 'none';
  }
});

/* ============================================================
   PAGE 1 – BIRTHDAY CAKE
   ============================================================ */
let blownCount = 0;

function initCakePage() {
  blownCount = 0;
  $$('.candle').forEach(c => {
    c.classList.remove('blown');
    // Clone to remove old listeners
    const fresh = c.cloneNode(true);
    c.parentNode.replaceChild(fresh, c);
    fresh.addEventListener('click',    () => blowCandle(fresh));
    fresh.addEventListener('touchend', e => { e.preventDefault(); blowCandle(fresh); }, { passive: false });
  });
}

function blowCandle(candle) {
  if (candle.classList.contains('blown')) return;
  candle.classList.add('blown');

  // Smoke puff
  const fw = candle.querySelector('.flame-wrap');
  if (fw) {
    const puff = document.createElement('div');
    puff.className = 'smoke-puff';
    fw.appendChild(puff);
    setTimeout(() => puff.remove(), 1100);
  }

  blownCount++;
  if (blownCount === $$('.candle').length) {
    setTimeout(showCelebration, 500);
  }
}

function showCelebration() {
  const overlay = $('#celebrationOverlay');
  if (!overlay) return;

  startMusic();             // 🎵 play sub_clair_happy_birthday
  startConfetti('confettiCanvas');

  for (let i = 0; i < 22; i++) {
    setTimeout(spawnFloatingHeart, i * 160);
  }

  overlay.classList.add('visible');
}

$('#goToCards')?.addEventListener('click', () => {
  stopConfetti('confettiCanvas');
  stopMusic();              // stop song before showing cards
  goToPage('page-cards');
});

initCakePage();

/* ============================================================
   PAGE 2 – MEMORY CARDS  (init called on page enter)
   ============================================================ */
let cardsInited = false;

function initCards() {
  $$('.memory-card').forEach((card, idx) => {
    // stagger entrance
    card.style.opacity   = '0';
    card.style.transform = 'translateY(32px) scale(0.9)';
    card.style.transition = 'none';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0) scale(1)';
    }, idx * 90 + 60);
  });

  if (!cardsInited) {
    $$('.memory-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
    cardsInited = true;
  }
}

$('#goToGallery')?.addEventListener('click', () => goToPage('page-gallery'));

/* ============================================================
   PAGE 3 – GALLERY  (init called on page enter)
   ============================================================ */
const galleryCaptions = [
  'The beginning of our beautiful story ❤️',
  'From strangers to best friends 🥹',
  'Those unforgettable Inter days',
  'Our endless conversations and memories',
  'Four years of friendship and counting... ♾️',
  'More memories to make together! ♾️',
];

let galleryInited = false;

function initGallery() {
  $$('.gallery-item').forEach((item, idx) => {
    item.style.opacity   = '0';
    item.style.transform = 'scale(0.85)';
    item.style.transition = 'none';
    setTimeout(() => {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.opacity    = '1';
      item.style.transform  = 'scale(1)';
    }, idx * 90 + 60);
  });

  if (!galleryInited) {
    $$('.gallery-item').forEach((item, idx) => {
      item.querySelector('.photo-frame')?.addEventListener('click', () => openLightbox(idx));
    });
    galleryInited = true;
  }
}

// Lightbox
const lightbox  = $('#lightbox');
const lbClose   = $('#lightboxClose');
const lbImg     = $('#lightboxImg');
const lbPh      = $('#lightboxPh');
const lbPhCap   = $('#lightboxPhCaption');
const lbCap     = $('#lightboxCap');

function openLightbox(idx) {
  const caption = galleryCaptions[idx] || '';
  const items   = $$('.gallery-item');
  const img     = items[idx]?.querySelector('img');

  if (img && img.src && !img.src.endsWith('/')) {
    if (lbImg) { lbImg.src = img.src; lbImg.alt = caption; lbImg.style.display = 'block'; }
    if (lbPh)  lbPh.style.display = 'none';
  } else {
    if (lbImg) lbImg.style.display = 'none';
    if (lbPh)  { lbPh.style.display = 'flex'; if (lbPhCap) lbPhCap.textContent = caption; }
  }
  if (lbCap) lbCap.textContent = caption;
  lightbox?.classList.add('open');
}

function closeLightbox() { lightbox?.classList.remove('open'); }

lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

$('#goToLetter')?.addEventListener('click', () => goToPage('page-letter'));

/* ============================================================
   PAGE 4 – LETTER  (init called on page enter)
   ============================================================ */
let letterStage = 'envelope';

function initLetter() {
  letterStage = 'envelope';
  const stageEnv  = $('#stageEnvelope');
  const stagePre  = $('#stagePreLetter');
  const stageFull = $('#stageFullLetter');
  const nextBtn   = $('#goToPromise');
  if (stageEnv)  stageEnv.style.display  = 'flex';
  if (stagePre)  stagePre.style.display  = 'none';
  if (stageFull) stageFull.style.display = 'none';
  if (nextBtn)   nextBtn.style.display   = 'none';
  // reset envelope flap
  $('#bigEnvelope')?.classList.remove('opened');
}

$('#openLetterBtn')?.addEventListener('click', () => {
  if (letterStage !== 'envelope') return;
  letterStage = 'pretext';
  $('#bigEnvelope')?.classList.add('opened');
  setTimeout(() => {
    $('#stageEnvelope').style.display = 'none';
    const pre = $('#stagePreLetter');
    if (pre) { pre.style.display = 'flex'; pre.style.flexDirection = 'column'; }
  }, 900);
});

$('#readLetterBtn')?.addEventListener('click', () => {
  if (letterStage !== 'pretext') return;
  letterStage = 'letter';
  $('#stagePreLetter').style.display = 'none';
  const full = $('#stageFullLetter');
  if (full) { full.style.display = 'flex'; full.style.flexDirection = 'column'; }
  const nextBtn = $('#goToPromise');
  if (nextBtn) {
    setTimeout(() => { nextBtn.style.display = 'inline-flex'; }, 500);
  }
});

$('#goToPromise')?.addEventListener('click', () => goToPage('page-promise'));

/* ============================================================
   PAGE 5 – PROMISE  (init called on page enter)
   ============================================================ */
let promiseDone = false;

function initPromise() {
  if (promiseDone) {
    // already animated; just ensure visible
    $$('.promise-line').forEach(l => l.classList.add('revealed'));
    $('#finalDeclaration')?.classList.add('revealed');
    $('#finalSign')?.classList.add('revealed');
    $('#bdayWishes')?.classList.add('revealed');
    return;
  }
  promiseDone = true;

  $$('.promise-line').forEach(line => {
    const delay = parseInt(line.dataset.delay, 10) || 0;
    setTimeout(() => line.classList.add('revealed'), delay + 400);
  });
  setTimeout(() => $('#finalDeclaration')?.classList.add('revealed'), 3400);
  setTimeout(() => $('#finalSign')?.classList.add('revealed'), 4400);
  setTimeout(() => $('#bdayWishes')?.classList.add('revealed'), 5400);

  setTimeout(() => {
    startConfetti('finalConfetti');
    for (let i = 0; i < 28; i++) setTimeout(spawnFloatingHeart, i * 130);
    setTimeout(() => stopConfetti('finalConfetti'), 7000);
  }, 4200);
}

$('#replayBtn')?.addEventListener('click', resetAll);

function resetAll() {
  // State resets
  blownCount  = 0;
  letterStage = 'envelope';
  promiseDone = false;
  cardsInited = false;
  galleryInited = false;

  // Reset candles
  $$('.candle').forEach(c => c.classList.remove('blown'));
  initCakePage();

  // Hide celebration overlay
  $('#celebrationOverlay')?.classList.remove('visible');

  // Stop audio + music bar
  stopMusic();

  // Reset promise animations
  $$('.promise-line').forEach(l => l.classList.remove('revealed'));
  $('#finalDeclaration')?.classList.remove('revealed');
  $('#finalSign')?.classList.remove('revealed');
  $('#bdayWishes')?.classList.remove('revealed');

  stopConfetti('confettiCanvas');
  stopConfetti('finalConfetti');

  goToPage('page-cake');
}

/* ============================================================
   CONFETTI ENGINE
   ============================================================ */
const confettiRunning = {};

function startConfetti(canvasId) {
  const canvas = $(`#${canvasId}`);
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const colors = ['#f9b8c8','#c9b8f0','#ffd4b8','#f5c842','#e8688a','#ffffff','#b8f0e0'];
  const pieces = Array.from({ length: 170 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: 6 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 6,
    vx: (Math.random() - 0.5) * 2.5,
    vy: 1.6 + Math.random() * 2.5,
    op: 0.7 + Math.random() * 0.3,
    circle: Math.random() > 0.45,
  }));

  confettiRunning[canvasId] = true;

  (function draw() {
    if (!confettiRunning[canvasId]) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = p.op;
      ctx.fillStyle = p.color;
      if (p.circle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
}

function stopConfetti(canvasId) {
  confettiRunning[canvasId] = false;
}

window.addEventListener('resize', () => {
  ['confettiCanvas','finalConfetti'].forEach(id => {
    const c = $(`#${id}`);
    if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
  });
});

/* ============================================================
   FLOATING HEARTS
   ============================================================ */
function spawnFloatingHeart() {
  const el = document.createElement('div');
  el.className = 'float-heart';
  el.textContent = ['❤️','💗','💕','💖','✨','🌸'][Math.floor(Math.random() * 6)];
  el.style.left     = (10 + Math.random() * 80) + 'vw';
  el.style.bottom   = (5  + Math.random() * 20) + 'vh';
  el.style.fontSize = (1  + Math.random() * 1.4) + 'rem';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}
