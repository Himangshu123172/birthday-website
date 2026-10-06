/* =====================================================
   ✏️  EDIT ONLY THIS SECTION TO PERSONALIZE THE WEBSITE
   ===================================================== */
const birthdayData = {
  name: "Himangshu",

  // Page 1 photos (round frames)
  heroPhoto1: "images/current1.png",
  heroPhoto2: "images/current2.png",

  // Page 2 photos
  childhoodPhoto1: "images/childhood1.png",
  childhoodPhoto2: "images/childhood2.png",
  currentPhoto1: "images/current1.png",
  currentPhoto2: "images/current2.png",

  // Messages
  birthdayMessage: "Today is all about you! 🎈",
  aboutMessage: "You light up every room you walk into. Your kindness, your laugh and your big heart make you truly one of a kind. The world is brighter because you are in it.",
  bondMessage: "From silly jokes to late-night talks, every moment with you is a memory I treasure. Thank you for always being there. I'm so lucky to have you!",
  blessingMessage: "May your year be filled with joy, success, endless laughter and all the love you deserve. Keep shining! ✨",
  finalMessage: "Wishing you the happiest birthday ever. You deserve all the happiness in the world! 💖",

  // Music: put a file at audio/birthday.mp3. If missing, a built-in tune plays instead.
  musicFile: "audio/birthday.mp3",
  clickSound: "audio/click.mp3",   // optional
  cutSound: "audio/cut.mp3"        // optional
};
/* ================== END OF SETTINGS ================== */

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* ---------- Fill in the content ---------- */
$$('.nm').forEach(e => e.textContent = birthdayData.name);
$('#msgSpecial').textContent = birthdayData.aboutMessage;
$('#msgBond').textContent = birthdayData.bondMessage;
$('#msgBlessing').textContent = birthdayData.blessingMessage;
$('#msgFinal').textContent = birthdayData.finalMessage;
const photoMap = {hero1:'heroPhoto1',hero2:'heroPhoto2',c1:'childhoodPhoto1',c2:'childhoodPhoto2',n1:'currentPhoto1',n2:'currentPhoto2'};
$$('[data-photo]').forEach(f => {
  const img = new Image();
  img.src = birthdayData[photoMap[f.dataset.photo]];
  img.alt = '';
  img.onload = () => { f.style.fontSize = 0; f.appendChild(img); }; // shows 📷 if photo is missing
});

/* ---------- Sound (works even without audio files) ---------- */
let ac, musicOn = false, musicEl, synthTimer;
const ctx = () => ac || (ac = new (window.AudioContext || window.webkitAudioContext)());
function tone(f, d, type = 'sine', v = .15, delay = 0) {
  try {
    const a = ctx(), o = a.createOscillator(), g = a.createGain(), t = a.currentTime + delay;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
  } catch (e) {}
}
function playFile(src, fallback) {
  const a = new Audio(src);
  a.onerror = fallback;
  a.play().catch(fallback);
}
const sfxClick = () => playFile(birthdayData.clickSound, () => tone(700, .1, 'triangle'));
const sfxCut = () => playFile(birthdayData.cutSound, () => { tone(300, .25, 'sawtooth', .08); tone(900, .3, 'triangle', .1, .05); });
const sfxCheer = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .4, 'triangle', .15, i * .12));

// "Happy Birthday" tune used if audio/birthday.mp3 is not found
const tune = [[392,.5],[392,.5],[440,1],[392,1],[523,1],[494,2],[392,.5],[392,.5],[440,1],[392,1],[587,1],[523,2],
              [392,.5],[392,.5],[784,1],[659,1],[523,1],[494,1],[440,2],[698,.5],[698,.5],[659,1],[523,1],[587,1],[523,2]];
function synthLoop() {
  let t = 0;
  tune.forEach(([f, b]) => { tone(f, b * .45, 'triangle', .1, t); t += b * .5; });
  synthTimer = setTimeout(synthLoop, (t + 1.5) * 1000);
}
function toggleMusic() {
  musicOn = !musicOn;
  $('#music').textContent = musicOn ? '🎵 Music ON' : '🎵 Music OFF';
  if (musicOn) {
    musicEl = new Audio(birthdayData.musicFile); musicEl.loop = true; musicEl.volume = .5;
    const fallback = () => { if (musicOn && !synthTimer) synthLoop(); };
    musicEl.onerror = fallback; musicEl.play().catch(fallback);
  } else {
    musicEl && musicEl.pause(); clearTimeout(synthTimer); synthTimer = null;
  }
}
$('#music').onclick = toggleMusic;

/* ---------- Background: floating hearts/stars + confetti ---------- */
const cv = $('#fx'), c = cv.getContext('2d');
let W, H, floaters = [], bits = [];
const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
addEventListener('resize', resize); resize();
const icons = ['❤','✦','♥','✧','🌸'];
for (let i = 0; i < 28; i++) floaters.push({x:Math.random()*W,y:Math.random()*H,s:10+Math.random()*16,v:.3+Math.random()*.6,i:icons[i%5],p:Math.random()*6});
function confetti(n = 90, x = W / 2, y = H / 2, big = 1) {
  const cols = ['#ff7eb6','#9b6bff','#6ec6ff','#fff','#ffe066'];
  for (let i = 0; i < n; i++) bits.push({x,y,vx:(Math.random()-.5)*14*big,vy:-Math.random()*13*big-3,r:Math.random()*6,w:6+Math.random()*6,col:cols[i%5],life:140});
}

  let last = performance.now();
const slow = innerWidth < 600 ? 0.6 : 1; // calmer speed on phones
function loop(now) {
  const dt = Math.min((now - last) / 16.67, 3); // 1 = one frame at 60fps
  last = now;
  c.clearRect(0, 0, W, H);
  c.globalAlpha = .45;
  floaters.forEach(f => {
    f.y -= f.v * dt * slow; f.p += .02 * dt * slow; f.x += Math.sin(f.p) * .5 * dt * slow;
    if (f.y < -30) { f.y = H + 30; f.x = Math.random() * W; }
    c.font = f.s + 'px serif'; c.fillStyle = '#fff'; c.fillText(f.i, f.x, f.y);
  });
  c.globalAlpha = 1;
  bits = bits.filter(b => b.life > 0);
  bits.forEach(b => {
    b.life -= dt;
    b.vy += .35 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    b.vx *= Math.pow(.99, dt); b.r += .2 * dt;
    c.save(); c.translate(b.x, b.y); c.rotate(b.r); c.fillStyle = b.col; c.globalAlpha = Math.max(0, Math.min(1, b.life / 40));
    c.fillRect(-b.w / 2, -2, b.w, 5); c.restore();
  });
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- Balloons ---------- */
function balloons(n = 10) {
  const cols = ['#ff7eb6','#9b6bff','#6ec6ff','#ffb3d1'];
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div'); b.className = 'balloon';
    b.style.cssText = `left:${Math.random()*95}%;background:${cols[i%4]};animation-duration:${8+Math.random()*8}s;animation-delay:${Math.random()*3}s`;
    $('#balloons').appendChild(b); setTimeout(() => b.remove(), 20000);
  }
}
balloons(6);

/* ---------- Mouse glow + 3D tilt on cards ---------- */
addEventListener('pointermove', e => { const g = $('#glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
$$('.tilt').forEach(el => {
  el.onpointermove = e => { const r = el.getBoundingClientRect(); el.style.transform = `perspective(700px) rotateY(${((e.clientX-r.left)/r.width-.5)*8}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*8}deg)`; };
  el.onpointerleave = () => el.style.transform = '';
});

/* ---------- Typewriter on page 1 ---------- */
function typeIt(text) {
  const el = $('#typed'); el.textContent = ''; let i = 0;
  const t = setInterval(() => { el.textContent += text[i++]; if (i >= text.length) clearInterval(t); }, 60);
}
typeIt(birthdayData.birthdayMessage);

/* ---------- Page navigation ---------- */
function go(n) {
  sfxClick();
  $$('.page').forEach((p, i) => p.classList.toggle('on', i === n - 1));
  $$('.dot').forEach((d, i) => d.classList.toggle('on', i < n && i === n - 1));
  scrollTo({top: 0, behavior: 'smooth'});
  confetti(70, W / 2, H * .7); balloons(5);
}
$$('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));

/* ---------- Build the cake (two copies = two halves for splitting) ---------- */
const cakeHTML = `<div class="cake">
  <div class="candles">${'<i class="candle"><b class="flame"></b></i>'.repeat(3)}</div>
  <div class="tier t3"><span>${birthdayData.name}</span></div><div class="tier t2"></div><div class="tier t1"></div>
  <div class="sprinkles"></div><div class="plate"></div></div>`;
$('#cakewrap').innerHTML = `<div class="half l">${cakeHTML}</div><div class="half r">${cakeHTML}</div>`;

/* ---------- Knife drag game ---------- */
const knife = $('#knife'), stage = $('#stage');
let dragging = false, cut = false, off = {x: 0, y: 0};
knife.addEventListener('pointerdown', e => {
  if (cut) return;
  dragging = true; knife.setPointerCapture(e.pointerId); knife.classList.add('drag');
  const r = knife.getBoundingClientRect(); off = {x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2};
});
knife.addEventListener('pointermove', e => {
  if (!dragging || cut) return;
  const s = stage.getBoundingClientRect();
  const x = Math.min(Math.max(e.clientX - off.x - s.left, 0), s.width), y = Math.min(Math.max(e.clientY - off.y - s.top, 0), s.height);
  knife.style.left = x - 32 + 'px'; knife.style.top = y - 32 + 'px';
  // Hit detection: is the knife inside the middle of the cake?
  const cr = $('#cakewrap').getBoundingClientRect(), k = knife.getBoundingClientRect();
  const kx = k.left + k.width / 2, ky = k.top + k.height / 2;
  if (Math.abs(kx - (cr.left + cr.width / 2)) < cr.width * .22 && ky > cr.top + cr.height * .25 && ky < cr.bottom - 20) doCut();
});
knife.addEventListener('pointerup', () => { dragging = false; knife.classList.remove('drag'); });

function doCut() {
  cut = true; dragging = false;
  knife.classList.remove('drag'); knife.classList.add('cut');
  const cr = $('#cakewrap').getBoundingClientRect(), s = stage.getBoundingClientRect();
  knife.style.left = cr.left - s.left + cr.width / 2 - 32 + 'px'; knife.style.top = '10px';
  $('#cutline').classList.add('go'); sfxCut();
  setTimeout(() => {
    $('#cakewrap').classList.add('split');
    confetti(160, W / 2, H / 2, 1.2); balloons(12); sfxCheer();
    $('#hint').textContent = 'Beautiful cut! 🍰';
    setTimeout(() => { knife.style.opacity = 0; $('#yay').className = 'card show'; $('#yay').scrollIntoView({behavior: 'smooth', block: 'center'}); }, 700);
  }, 500);
}

/* ---------- Make a wish ---------- */
$('#wishBtn').onclick = () => {
  $('#cakewrap').classList.add('out'); sfxCheer();
  [0, 400, 800].forEach(t => setTimeout(() => confetti(140, Math.random() * W, H * .3, 1.4), t));
  for (let i = 0; i < 25; i++) floaters.push({x:Math.random()*W,y:H+Math.random()*H*.5,s:18+Math.random()*20,v:1+Math.random(),i:'⭐',p:Math.random()*6});
  balloons(14);
  $('#wishBtn').style.display = 'none';
  $('#final').className = 'card show';
  $('#final').scrollIntoView({behavior: 'smooth', block: 'center'});
};
