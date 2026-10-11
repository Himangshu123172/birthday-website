/* =====================================================
   ✏️  EDIT ONLY THIS SECTION TO PERSONALIZE THE WEBSITE
   ===================================================== */
const birthdayData = {
  name: "Soumalya",

  // Page 1 photos (round frames)
  heroPhoto1: "images/current1.jpeg",

  // Page 2 photos
  childhoodPhoto1: "images/childhood1.jpeg",
  childhoodPhoto2: "images/childhood2.jpeg",
  currentPhoto1: "images/current1.jpeg",
  currentPhoto2: "images/current2.jpeg",

  // Messages
  birthdayMessage: "Celebrating a wonderful journey of life, love and laughter 🎈",
  birthDate: "2004-10-11T00:00:00",   // birth date for the live age counter (empty "" hides it)
  aboutMessage: "You light up every room you walk into. Your kindness, your laugh and your big heart make you truly one of a kind. The world is brighter because you are in it.",
  bondMessage: "From silly jokes to late-night talks, every moment with you is a memory I treasure. Thank you for always being there. I'm so lucky to have you!",
  blessingMessage: "May your year be filled with joy, success, endless laughter and all the love you deserve. Keep shining! ✨",
  finalMessage: "Wishing you the happiest birthday ever. You deserve all the happiness in the world! 💖",

  // Audio (optional). If a file is missing, built-in sounds are used instead.
  musicFile: "audio/birthday.mpeg",
  clickSound: "audio/click.mp3",
  cutSound: "audio/cut.mp3"
};
/* ================== END OF SETTINGS ================== */

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const small = matchMedia('(pointer:coarse)').matches || innerWidth < 700;   // phone/tablet = lighter effects

/* ---------- Content ---------- */
$$('.nm').forEach(e => e.textContent = birthdayData.name);
$('#msgSpecial').textContent = birthdayData.aboutMessage;
$('#msgBond').textContent = birthdayData.bondMessage;
$('#msgBlessing').textContent = birthdayData.blessingMessage;
$('#msgFinal').textContent = birthdayData.finalMessage;

// Loads a photo; if the extension is wrong it also tries .png .jpg .jpeg .webp
function loadPhoto(frame, path) {
  const base = path.replace(/\.\w+$/, ''), tries = [path, ...['png', 'jpg', 'jpeg', 'webp'].map(x => base + '.' + x)];
  const next = () => {
    if (!tries.length) return;
    const img = new Image(); img.decoding = 'async'; img.alt = '';
    img.onload = () => { frame.style.fontSize = 0; frame.appendChild(img); };
    img.onerror = next; img.src = tries.shift();
  };
  next();
}
$$('[data-photo]').forEach(f => loadPhoto(f, birthdayData[f.dataset.photo]));

/* ---------- Sound (works on phones; falls back to built-in sounds) ---------- */
let ac, musicOn = false, musicEl, synthT; const bad = {};
const A = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; } catch (e) {} };
addEventListener('pointerdown', A, {once: true});           // phones need a tap before sound is allowed
function tone(f, d, type = 'sine', v = .15, delay = 0) {
  const a = A(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + delay;
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
}
function swish() {
  const a = A(); if (!a) return;
  const n = a.sampleRate * .25 | 0, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = a.createBufferSource(), g = a.createGain(); g.gain.value = .12; s.buffer = b; s.connect(g); g.connect(a.destination); s.start();
}
function sfx(src, fb) {
  if (bad[src]) return fb();
  let used = false; const f = () => { bad[src] = 1; if (!used) { used = true; fb(); } };
  const a = new Audio(src); a.onerror = f; a.play().catch(f);
}
const sfxClick = () => sfx(birthdayData.clickSound, () => tone(700, .1, 'triangle'));
const sfxCut = () => sfx(birthdayData.cutSound, () => { swish(); tone(900, .25, 'triangle', .08, .03); });
const sfxCheer = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .4, 'triangle', .15, i * .12));

const tune = [[392,.5],[392,.5],[440,1],[392,1],[523,1],[494,2],[392,.5],[392,.5],[440,1],[392,1],[587,1],[523,2],
              [392,.5],[392,.5],[784,1],[659,1],[523,1],[494,1],[440,2],[698,.5],[698,.5],[659,1],[523,1],[587,1],[523,2]];
function synthLoop() {
  let t = 0; tune.forEach(([f, b]) => { tone(f, b * .45, 'triangle', .1, t); t += b * .5; });
  synthT = setTimeout(synthLoop, (t + 1.5) * 1000);
}
$('#music').onclick = () => {
  musicOn = !musicOn; $('#music').textContent = musicOn ? '🎵 Music ON' : '🎵 Music OFF';
  if (musicOn) {
    musicEl = new Audio(birthdayData.musicFile); musicEl.loop = true; musicEl.volume = .5;
    const fb = () => { if (musicOn && !synthT) synthLoop(); };
    musicEl.onerror = fb; musicEl.play().catch(fb);
  } else { musicEl && musicEl.pause(); clearTimeout(synthT); synthT = null; }
};

/* ---------- Background hearts/stars + confetti (frame-rate independent) ---------- */
const cv = $('#fx'), c = cv.getContext('2d'), D = Math.min(devicePixelRatio || 1, 2);
let W, H, floaters = [], bits = [];
const icons = ['❤', '✦', '♥', '✧', '🌸'];
function size() {
  W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; c.setTransform(D, 0, 0, D, 0, 0);
  setK();
}
for (let i = 0; i < (small ? 8 : 14); i++) floaters.push({x: Math.random() * innerWidth, y: Math.random() * innerHeight, s: 12 + Math.random() * 14, v: .3 + Math.random() * .5, i: icons[i % 5], p: Math.random() * 6});
function confetti(n = 90, x = W / 2, y = H / 2, big = 1, cols) {
  if (bits.length > 320) return;
  cols = cols || ['#ff7eb6', '#9b6bff', '#6ec6ff', '#fff', '#ffe066'];
  for (let i = 0; i < n; i++) bits.push({x, y, vx: (Math.random() - .5) * 14 * big, vy: -Math.random() * 13 * big - 3, r: Math.random() * 6, w: 6 + Math.random() * 6, col: cols[i % 5], life: 140});
}
const petals = Array.from({length: small ? 14 : 26}, () => ({x: Math.random() * innerWidth, y: Math.random() * innerHeight, w: 6 + Math.random() * 7, h: 4 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .04, vy: .5 + Math.random() * .7, p: Math.random() * 6, col: ['#ff9ec8', '#ffb3d1', '#ff7eb6', '#ffc8dd'][Math.random() * 4 | 0]}));
let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 16.67, 3), slow = small ? .6 : 1; last = now;
  c.clearRect(0, 0, W, H); c.globalAlpha = .8;
  petals.forEach(p => {                         // falling pink petals
    p.y += p.vy * dt * slow; p.p += .015 * dt * slow; p.x += Math.sin(p.p) * .7 * dt * slow; p.r += p.vr * dt;
    if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    c.fillStyle = p.col; c.beginPath(); c.ellipse(p.x, p.y, p.w, p.h, p.r, 0, 6.283); c.fill();
  });
  c.globalAlpha = .45;
  floaters.forEach(f => {
    f.y -= f.v * dt * slow; f.p += .02 * dt * slow; f.x += Math.sin(f.p) * .5 * dt * slow;
    if (f.y < -30) { f.y = H + 30; f.x = Math.random() * W; }
    c.font = f.s + 'px serif'; c.fillStyle = '#fff'; c.fillText(f.i, f.x, f.y);
  });
  c.globalAlpha = 1; bits = bits.filter(b => b.life > 0);
  bits.forEach(b => {
    b.life -= dt; b.vy += .35 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= Math.pow(.99, dt); b.r += .2 * dt;
    c.save(); c.translate(b.x, b.y); c.rotate(b.r); c.fillStyle = b.col; c.globalAlpha = clamp(b.life / 40, 0, 1);
    c.fillRect(-b.w / 2, -2, b.w, 5); c.restore();
  });
  requestAnimationFrame(loop);
}

/* ---------- Balloons, glow, typewriter ---------- */
function balloons(n = 8) {
  const box = $('#balloons'), cols = ['#ff7eb6', '#9b6bff', '#6ec6ff', '#ffb3d1'];
  n = Math.min(small ? Math.ceil(n / 2) : n, 24 - box.children.length);
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div'); b.className = 'balloon';
    b.style.cssText = `left:${Math.random() * 92}%;background:${cols[i % 4]};animation-duration:${9 + Math.random() * 7}s;animation-delay:${Math.random() * 2}s`;
    box.appendChild(b); setTimeout(() => b.remove(), 18000);
  }
}
if (matchMedia('(hover:hover)').matches) addEventListener('pointermove', e => { const g = $('#glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
(function ageCounter() {                       // live age: 20y 1m 22d / 9h 54m 37s
  const b = new Date(birthdayData.birthDate); if (!birthdayData.birthDate || isNaN(b)) { $('#age').style.display = 'none'; return; }
  const n = new Date(); let y = n.getFullYear() - b.getFullYear(), m = n.getMonth() - b.getMonth(), d = n.getDate() - b.getDate(), h = n.getHours() - b.getHours(), mi = n.getMinutes() - b.getMinutes(), s = n.getSeconds() - b.getSeconds();
  if (s < 0) { s += 60; mi--; } if (mi < 0) { mi += 60; h--; } if (h < 0) { h += 24; d--; }
  if (d < 0) { d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); m--; } if (m < 0) { m += 12; y--; }
  $('#ageA').textContent = `${y}y ${m}m ${d}d`; $('#ageB').textContent = `${h}h ${mi}m ${s}s`;
  setTimeout(ageCounter, 1000);
})();
(function typeIt(t = birthdayData.birthdayMessage, i = 0) { $('#typed').textContent = t.slice(0, i); if (i < t.length) setTimeout(() => typeIt(t, i + 1), 60); })();

/* ---------- Page navigation ---------- */
function go(n) {
  sfxClick();
  $$('.page').forEach((p, i) => { p.classList.toggle('on', i === n - 1); if (i === n - 1) p.scrollTop = 0; });
  $$('.dot').forEach((d, i) => d.classList.toggle('on', i === n - 1));
  confetti(small ? 50 : 80, W / 2, H * .7); balloons(3);
}
$$('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));

/* ---------- Realistic chocolate cake (SVG) + knife game ---------- */
const NS = 'http://www.w3.org/2000/svg';
const svg = $('#cakeSvg'), stage = $('#stage'), world = $('#world'), knife = $('#knife');
const CXc = 180, CYt = 270, RX = 150, RY = 48, HH = 110;            // cake: top-ellipse centre/radii and side height
const Pt = (t, dy = 0) => [CXc + RX * Math.cos(t), CYt + RY * Math.sin(t) + dy];   // rim point at angle t
const s2 = a => a.map(n => n.toFixed(1)).join(',');
const FL = '<path d="M2 3l9-2 3 7-8 3zM18 12l10-3 2 8-9 4zM6 18l8-1 1 6-8 2zM24 1l7 2-1 6-6-1z" fill="#2b150d"/><path d="M12 14l6-2 1 5-5 2zM28 19l5 1-1 5-5-1z" fill="#4d2a18"/>';
const SIDE = 'M30,270 L30,380 A150,48 0 0 0 330,380 L330,270 A150,48 0 0 1 30,270Z';
const BAND = 'M30,346 L30,380 A150,48 0 0 0 330,380 L330,346 A150,48 0 0 1 30,346Z';
const nfs = clamp(Math.floor(210 / Math.max(birthdayData.name.length, 1)), 12, 24);
const candle = x => `<rect x="${x-5}" y="216" width="10" height="46" rx="3" fill="url(#cstripe)"/><ellipse cx="${x}" cy="262" rx="7" ry="2.5" fill="#e8d9c6"/>
  <circle class="gl" cx="${x}" cy="203" r="17" fill="url(#glowG)"/><path class="fl" d="M${x} 187C${x+8} 198 ${x+7} 212 ${x} 215C${x-7} 212 ${x-8} 198 ${x} 187Z" fill="url(#flameG)"/>`;
const curls = [-66,-48,-32,-16,0,16,32,48,66].map(a => `<path d="M0 0C-9-24 -4-50 0-62C4-50 9-24 0 0Z" fill="url(#curlG)" transform="translate(180,252) rotate(${a}) scale(1,${(1 - Math.abs(a) / 150).toFixed(2)})"/>`).join('');
const body = () => `
  <path d="${SIDE}" fill="url(#creamG)"/><path d="${SIDE}" fill="url(#shav)"/><path d="${SIDE}" fill="url(#shav2)"/>
  <path d="${BAND}" fill="#24130d"/><path d="${BAND}" fill="url(#stripe)"/>
  <ellipse cx="180" cy="270" rx="150" ry="48" fill="url(#topG)"/>
  <ellipse cx="180" cy="270" rx="145" ry="45" fill="none" stroke="#2b150d" stroke-width="10" stroke-dasharray="3 5 8 4"/>
  <ellipse cx="180" cy="271" rx="126" ry="38" fill="none" stroke="#8b5a3c" stroke-width="7" stroke-dasharray="9 3" stroke-linecap="round"/>
  <ellipse cx="180" cy="271" rx="113" ry="33" fill="none" stroke="#c9a37d" stroke-width="1.5"/>
  ${curls}
  <g transform="rotate(8 190 268)"><rect x="132" y="262" width="104" height="11" rx="5.5" fill="url(#wafer)"/><ellipse cx="236" cy="267.5" rx="3" ry="5.5" fill="#e9d2a8"/></g>
  <text transform="translate(180,301) scale(1,.5)" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="${nfs}" fill="#6b3a22" letter-spacing="1">${birthdayData.name}</text>
  ${candle(92)}${candle(268)}`;
svg.innerHTML = `<defs>
  <linearGradient id="creamG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf2"/><stop offset="1" stop-color="#e6d8c4"/></linearGradient>
  <radialGradient id="topG" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f1e6d6"/></radialGradient>
  <linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a00"/><stop offset=".6" stop-color="#ffd54a"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <radialGradient id="glowG"><stop offset="0" stop-color="#ffd25a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd25a" stop-opacity="0"/></radialGradient>
  <linearGradient id="curlG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1f0f08"/><stop offset="1" stop-color="#6a3a22"/></linearGradient>
  <linearGradient id="standG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9c8ac"/><stop offset=".4" stop-color="#fff8ea"/><stop offset="1" stop-color="#d2bf9f"/></linearGradient>
  <pattern id="cstripe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#fff"/><rect width="5" height="10" fill="#ff7eb6"/></pattern>
  <pattern id="stripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-55)"><rect width="5" height="16" fill="#fff" opacity=".9"/></pattern>
  <pattern id="wafer" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="12" height="12" fill="#f0dcb6"/><rect width="5" height="12" fill="#4a2616"/></pattern>
  <pattern id="shav" width="34" height="26" patternUnits="userSpaceOnUse">${FL}</pattern>
  <pattern id="shav2" width="34" height="26" patternUnits="userSpaceOnUse" patternTransform="translate(13 9) rotate(28)">${FL}</pattern>
</defs>
<ellipse cx="180" cy="506" rx="118" ry="22" fill="#000" opacity=".25"/>
<path d="M152,420 C158,462 160,478 130,492 L230,492 C200,478 202,462 208,420Z" fill="url(#standG)"/>
<path d="M80,494 A100,20 0 0 0 280,494 L280,503 A100,20 0 0 1 80,503Z" fill="#d2bf9f"/><ellipse cx="180" cy="494" rx="100" ry="20" fill="#f3e6cf"/>
<path d="M12,384 A168,54 0 0 0 348,384 L348,395 A168,54 0 0 1 12,395Z" fill="#d2bf9f"/><ellipse cx="180" cy="384" rx="168" ry="54" fill="#f6ecd9"/>
<g id="walls"></g><g id="rest">${body()}</g><g id="slicePlate"></g><g id="slice"></g><g id="cracks"></g>`;

let K = 1, drag = false, done = false, busy = false, cuts = [], live = null, lockX = null, lastY = 0;
function setK() {
  K = clamp(Math.min((innerWidth - 16) / 360, (innerHeight - 150) / 600), .55, 1.25);
  document.documentElement.style.setProperty('--k', K);
}
addEventListener('resize', size); addEventListener('orientationchange', () => setTimeout(size, 250));
if (window.visualViewport) visualViewport.addEventListener('resize', size);
const toWorld = e => { const r = world.getBoundingClientRect(), k = r.width / 360; return {x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k}; };
const toScreen = (x, y) => { const r = world.getBoundingClientRect(), k = r.width / 360; return {x: r.left + x * k, y: r.top + y * k}; };
const putKnife = (x, y) => knife.style.transform = `translate(${x - 17}px,${y - 170}px)`;   // x,y = knife TIP
putKnife(310, 168);
const ease = p => 1 - Math.pow(1 - p, 3);
function tween(ms, fn, end) { const t0 = performance.now(); (function f(n) { const p = clamp((n - t0) / ms, 0, 1); fn(p); p < 1 ? requestAnimationFrame(f) : end && end(); })(t0); }

/* A cut = a crack on the top and down the side, like a real knife cut */
function mkCrack(t) {
  const g = document.createElementNS(NS, 'g'); g.setAttribute('fill', 'none'); g.setAttribute('stroke-linecap', 'round');
  const ps = [['#fff4e8', 8], ['#fff4e8', 8], ['#2a120a', 3.4], ['#2a120a', 3.4]].map(([c, w]) => {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', w); g.appendChild(p); return p; });
  svg.querySelector('#cracks').appendChild(g); return {t, g, ps};
}
function drawCrack(c, y) {                       // y = knife tip height: the crack follows the knife
  const A = Pt(c.t), B = Pt(c.t, HH), p = clamp((y - 222) / (A[1] - 222), 0, 1);
  const top = p > 0 ? `M180,270L${180 + (A[0] - 180) * p},${270 + (A[1] - 270) * p}` : '';
  const side = y > A[1] ? `M${A[0]},${A[1]}L${A[0]},${clamp(y, A[1], B[1])}` : '';
  c.ps[0].setAttribute('d', top); c.ps[2].setAttribute('d', top); c.ps[1].setAttribute('d', side); c.ps[3].setAttribute('d', side);
}
const dropLive = () => { if (live) { live.g.remove(); live = null; } lockX = null; };

function check(x, y) {                           // x,y = knife tip in world coordinates
  if (!live && lastY < 212 && y >= 212 && x > 46 && x < 314) {   // tip crossed the top of the cake going down
    live = mkCrack(clamp(Math.acos(clamp((x - CXc) / RX, -.99, .99)), .9, 2.25)); lockX = Pt(live.t)[0]; swish();
  }
  if (live) {
    drawCrack(live, y);
    if (y >= Pt(live.t, HH)[1] + 2) finishCut();
    else if (y < 186) dropLive();                // pulled back out: cancel
  }
  lastY = y;
}
function finishCut() {
  const c = live; drawCrack(c, 999); cuts.push(c); live = null; lockX = null;
  const s = toScreen(Pt(c.t)[0], Pt(c.t, HH)[1]); sfxCut(); confetti(12, s.x, s.y, .3, ['#3a1d10', '#5a301c', '#fff4e8']);
  svg.animate && svg.animate([{transform: 'translateY(0)'}, {transform: 'translateY(3px)'}, {transform: 'translateY(0)'}], {duration: 180});
  if (cuts.length === 1) { $('#hint').textContent = 'Nice cut! 🔪 Now make a 2nd cut beside it to free a slice'; return; }
  const a = cuts[0].t; let d = cuts[1].t - a, sg = d >= 0 ? 1 : -1;   // keep the slice a nice size
  d = sg * clamp(Math.abs(d), .42, .85); if (a + d < .5 || a + d > 2.64) d = -d;
  cuts[1].t = a + d; drawCrack(cuts[1], 999);
  busy = true; $('#hint').textContent = 'Perfect! 🍰'; setTimeout(serve, 500);
}
const release = () => { drag = false; knife.classList.remove('drag'); dropLive(); };
function move(e, init) {                         // knife tip follows the finger (36px above it so the blade stays visible)
  const p = toWorld(e); let tx = clamp(p.x, 0, 360); const ty = clamp(p.y - 36, 0, 600);
  if (lockX !== null) tx = lockX;                // go straight down while cutting
  putKnife(tx, ty); if (init) lastY = ty; else check(tx, ty);
}
stage.addEventListener('pointerdown', e => {
  if (done || busy) return;
  drag = true; knife.classList.add('drag'); try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  move(e, true);
});
stage.addEventListener('pointermove', e => { if (drag && !done && !busy) move(e); });
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => stage.addEventListener(t, release));

/* Free the slice: cut-out wedge, show the layers inside, lift the slice onto its own plate */
function serve() {
  done = true; busy = true; release(); knife.classList.add('off'); stage.classList.add('done'); $('#autoCut').style.display = 'none';
  svg.querySelector('#cracks').style.display = 'none';
  const [tL, tR] = cuts.map(c => c.t).sort((x, y) => y - x);           // larger angle = left side
  const C = [CXc, CYt], A = Pt(tL), Ab = Pt(tL, HH), B = Pt(tR), Bb = Pt(tR, HH);
  const d = `M${s2(C)} L${s2(A)} L${s2(Ab)} A${RX},${RY} 0 0 0 ${s2(Bb)} L${s2(B)}Z`;
  svg.querySelector('defs').insertAdjacentHTML('beforeend', `<clipPath id="restC"><path clip-rule="evenodd" d="M0,0H360V600H0Z ${d}"/></clipPath><clipPath id="sliceC"><path d="${d}"/></clipPath>`);
  const bands = [[0, .07, '#fbf6ee'], [.07, .34, '#4a2616'], [.34, .4, '#f4ecdf'], [.4, .46, '#b3122f'], [.46, .52, '#f4ecdf'], [.52, .92, '#3b1d10'], [.92, 1, '#24130d']];
  const wall = (T, shade) => { const E = Pt(T), q = (f) => `${CXc},${CYt + HH * f} ${E[0].toFixed(1)},${(E[1] + HH * f).toFixed(1)}`;
    return bands.map(([f0, f1, col]) => `<polygon points="${CXc},${CYt + HH * f0} ${E[0].toFixed(1)},${(E[1] + HH * f0).toFixed(1)} ${E[0].toFixed(1)},${(E[1] + HH * f1).toFixed(1)} ${CXc},${CYt + HH * f1}" fill="${col}"/>`).join('')
      + `<polygon points="${CXc},${CYt} ${s2(E)} ${E[0].toFixed(1)},${(E[1] + HH).toFixed(1)} ${CXc},${CYt + HH}" fill="#000" opacity="${shade}"/>`; };
  svg.querySelector('#walls').innerHTML = `<polygon points="${CXc},${CYt + HH} ${s2(Ab)} ${s2(Bb)}" fill="#000" opacity=".16"/>` + (tL > 1.5708 ? wall(tL, .28) : '') + (tR < 1.5708 ? wall(tR, .12) : '');
  svg.querySelector('#rest').setAttribute('clip-path', 'url(#restC)');
  const sl = svg.querySelector('#slice'); sl.innerHTML = `<g clip-path="url(#sliceC)">${body()}</g>`;
  const xm = (A[0] + B[0]) / 2, ox = xm, oy = 405, pl = svg.querySelector('#slicePlate');
  pl.innerHTML = `<g opacity="0"><path d="M${xm - 92},556 A92,26 0 0 0 ${xm + 92},556 L${xm + 92},565 A92,26 0 0 1 ${xm - 92},565Z" fill="#d2bf9f"/><ellipse cx="${xm}" cy="556" rx="92" ry="26" fill="#f6ecd9"/></g>`;
  const T = (tx, ty, r, s) => sl.setAttribute('transform', `translate(${tx} ${ty}) translate(${ox} ${oy}) rotate(${r}) scale(${s}) translate(${-ox} ${-oy})`);
  swish(); tween(380, p => T(0, -26 * ease(p), 0, 1 + .03 * p), () =>
    tween(950, p => { const e = ease(p); T(0, -26 + 156 * e, -3 * e, 1.03 + .07 * e); pl.firstChild.setAttribute('opacity', e); }, () => {
      sfxCheer(); confetti(small ? 110 : 160, W / 2, H / 2, 1.2); balloons(12);
      $('#hint').textContent = 'Beautiful slice! 🍰';
      setTimeout(() => { $('#yay').className = 'card show'; $('#yay').scrollIntoView({behavior: 'smooth', block: 'center'}); }, 900);
    }));
}

/* Backup button: the knife cuts by itself (for any device where swiping is hard) */
function autoCut(t, next) {
  const x = Pt(t)[0], yE = Pt(t, HH)[1] + 2; live = mkCrack(t); lockX = x; swish();
  tween(800, p => { const y = 190 + (yE - 190) * ease(p); putKnife(x, y); drawCrack(live, y); }, () => { finishCut(); next && setTimeout(next, 450); });
}
$('#autoCut').onclick = () => {
  if (done || busy) return;
  busy = true; release(); $('#autoCut').style.display = 'none'; knife.classList.add('drag');
  if (cuts.length) { const a = cuts[0].t; autoCut(a - .5 > .6 ? a - .5 : a + .5); } else autoCut(1.8, () => autoCut(1.35));
};

/* ---------- Make a wish ---------- */
$('#wishBtn').onclick = () => {
  svg.classList.add('out'); sfxCheer();
  [0, 400, 800].forEach(t => setTimeout(() => confetti(small ? 90 : 140, Math.random() * W, H * .3, 1.4), t));
  for (let i = 0; i < (small ? 12 : 22); i++) floaters.push({x: Math.random() * W, y: H + Math.random() * H * .5, s: 18 + Math.random() * 18, v: 1 + Math.random(), i: '⭐', p: Math.random() * 6});
  balloons(14); $('#wishBtn').style.display = 'none';
  $('#final').className = 'card show'; $('#final').scrollIntoView({behavior: 'smooth', block: 'center'});
};

size(); requestAnimationFrame(loop);
