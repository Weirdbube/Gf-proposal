/* =========================================================
   Customize here
   ========================================================= */
const CONFIG = {
  girlfriendName: "Tumi",
  siteTitle: "A tiny love story",
  kicker: "Heyy pooks… I made something for you babyyy",
  questionTitle: "Can i be your girlfriend?",
  questionHint: "There is only one correct answer (but I’ll let you try).",
  yesMessage: "YES?! Okay. I’m smiling like an idiot. 💖",
  yesFollowup:
    "I love you babyyyy💖. (Also: you’re officially my favorite person.)",
  footerText: "Made with so much loveee.",

  // Replace these with your real photos in assets/photos/
  photos: [
    { src: "assets/photos/her1.jpg", caption: "Her Eyes" },
    { src: "assets/photos/her7.jpg", caption: "My Shaylaaaaaa" },
    { src: "assets/photos/her5.jpg", caption: "Ashy KB!!!" },
    { src: "assets/photos/her4.jpg", caption: "I mean, This FACECARD!!!" },
    { src: "assets/photos/pic5.jpeg", caption: "you so pretty mama" },
    { src: "assets/photos/pic2.jpeg", caption: "Ignore maro at the back" },
    { src: "assets/photos/pic3.jpeg", caption: "Hi, can i kidnap you?" },
    { src: "assets/photos/charm.jpg", caption: "We can do this the easy way or the hard way" },
    { src: "assets/photos/ily.gif", caption: "Us being cute" },
  ],

  // Autoplay (ms). Set to 0 to disable.
  autoplayMs: 4200,
};

/* =========================================================
   Helpers
   ========================================================= */
function $(id) {
  return document.getElementById(id);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* =========================================================
   Init content
   ========================================================= */
const el = {
  siteTitle: $("siteTitle"),
  name: $("name"),
  kicker: $("kicker"),
  subtitle: $("subtitle"),
  questionTitle: $("questionTitle"),
  questionHint: $("questionHint"),
  footerText: $("footerText"),

  slideImg: $("slideImg"),
  caption: $("caption"),
  counter: $("counter"),
  dots: $("dots"),
  prev: $("prevBtn"),
  next: $("nextBtn"),

  yes: $("yesBtn"),
  no: $("noBtn"),
  btnRow: $("btnRow"),
  result: $("result"),

  popupOverlay: $("popupOverlay"),
  popupClose: $("popupClose"),
  popupLine1: $("popupLine1"),
  popupLine2: $("popupLine2"),

  bgm: $("bgm"),
  confetti: $("confetti"),
};

function mountText() {
  el.siteTitle && (el.siteTitle.textContent = CONFIG.siteTitle);
  el.name && (el.name.textContent = CONFIG.girlfriendName);
  el.kicker && (el.kicker.textContent = CONFIG.kicker);
  // subtitle is optional (safe to remove from HTML)
  el.subtitle && (el.subtitle.textContent = CONFIG.subtitle);
  el.questionTitle && (el.questionTitle.textContent = CONFIG.questionTitle);
  el.questionHint && (el.questionHint.textContent = CONFIG.questionHint);
  el.footerText && (el.footerText.textContent = CONFIG.footerText);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showPopup(line1, line2) {
  el.popupLine1.textContent = line1 || "";
  el.popupLine2.textContent = line2 || "";
  el.popupOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  el.popupClose?.focus?.();
}

function hidePopup() {
  el.popupOverlay.hidden = true;
  document.body.style.overflow = "";
}

/* =========================================================
   Slider
   ========================================================= */
let index = 0;
let autoplayTimer = null;

function renderDots() {
  el.dots.innerHTML = "";
  if (!CONFIG.photos.length) return;
  CONFIG.photos.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", `go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    el.dots.appendChild(b);
  });
}

function setActiveDot() {
  if (!CONFIG.photos.length) return;
  const nodes = el.dots.querySelectorAll(".dot");
  nodes.forEach((n, i) => n.setAttribute("aria-current", String(i === index)));
}

function goTo(i) {
  if (!CONFIG.photos.length) {
    el.slideImg.src = "";
    el.slideImg.alt = "No photos yet";
    el.caption.textContent = "Add photos in assets/photos/ and update CONFIG.photos in script.js";
    el.counter.textContent = "0 / 0";
    el.next.disabled = true;
    el.prev.disabled = true;
    stopAutoplay();
    return;
  }
  index = (i + CONFIG.photos.length) % CONFIG.photos.length;
  const item = CONFIG.photos[index];

  // Fade swap
  el.slideImg.style.opacity = "0";
  window.setTimeout(() => {
    el.slideImg.src = item.src;
    el.slideImg.alt = item.caption || `Slide ${index + 1}`;
    el.caption.textContent = item.caption || "";
    el.counter.textContent = `${index + 1} / ${CONFIG.photos.length}`;
    setActiveDot();
    el.slideImg.style.opacity = "1";
    el.slideImg.style.transform = "scale(1.01)";
    window.setTimeout(() => (el.slideImg.style.transform = "scale(1.00)"), 220);
  }, 120);

  restartAutoplay();
}

function next() {
  goTo(index + 1);
}

function prev() {
  goTo(index - 1);
}

function restartAutoplay() {
  if (prefersReducedMotion()) return;
  if (!CONFIG.autoplayMs || CONFIG.autoplayMs < 800) return;
  stopAutoplay();
  autoplayTimer = window.setInterval(next, CONFIG.autoplayMs);
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

/* =========================================================
   The question (fun "No" button)
   ========================================================= */
let noCount = 0;
let yesLocked = false;

function moveNoButton() {
  const row = el.btnRow.getBoundingClientRect();
  const btn = el.no.getBoundingClientRect();
  const pad = 8;

  const maxX = Math.max(0, row.width - btn.width - pad * 2);
  const maxY = Math.max(0, 42); // just a gentle hop

  const x = clamp(Math.random() * maxX, 0, maxX);
  const y = clamp(Math.random() * maxY, 0, maxY);

  el.no.style.position = "relative";
  el.no.style.left = `${Math.round(x)}px`;
  el.no.style.top = `${Math.round(y)}px`;
}

function onNo() {
  if (yesLocked) return;
  noCount += 1;

  const lines = [
    "No? Are you sure? 😳",
    "Okay but… what if I ask nicely? 🥺",
    "I’m gonna pretend I didn’t see that 🙈",
    "Your finger slipped. Try again. 😌",
    "Alright, you’re too powerful. I surrender. (But… yes?) 💘",
  ];
  el.result.textContent = lines[Math.min(noCount - 1, lines.length - 1)];

  // Start dodging after a couple tries
  if (noCount >= 2) moveNoButton();
}

function onYes() {
  if (yesLocked) return;
  yesLocked = true;
  el.result.textContent = "";
  el.no.disabled = true;
  el.no.style.opacity = "0.5";
  el.yes.style.transform = "scale(1.04)";

  // Confetti "surprise" after choosing Yes
  window.setTimeout(popConfetti, 450);
  window.setTimeout(() => showPopup(CONFIG.yesMessage, CONFIG.yesFollowup), 650);
}

/* =========================================================
   Autoplay music
   ========================================================= */
async function tryStartMusic({ quiet = false } = {}) {
  if (!el.bgm) return false;
  el.bgm.volume = 0.75;

  try {
    await el.bgm.play();
    return true;
  } catch {
    if (!quiet) {
      el.result.textContent = "Tap anywhere once to enable the music 🎵";
    }
    return false;
  }
}

/* =========================================================
   Confetti (tiny canvas particle burst)
   ========================================================= */
function resizeConfettiCanvas() {
  const dpr = window.devicePixelRatio || 1;
  el.confetti.width = Math.floor(window.innerWidth * dpr);
  el.confetti.height = Math.floor(window.innerHeight * dpr);
  const ctx = el.confetti.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function popConfetti() {
  if (prefersReducedMotion()) return;
  const ctx = el.confetti.getContext("2d");
  const W = window.innerWidth;
  const H = window.innerHeight;
  const colors = ["#ff4d7d", "#ffbf5b", "#7cf0ff", "#a370ff", "#ffffff"];

  const count = 140;
  const parts = new Array(count).fill(0).map(() => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    return {
      x: W / 2,
      y: H / 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 3 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 60 + Math.floor(Math.random() * 30),
    };
  });

  let frame = 0;
  function tick() {
    frame += 1;
    ctx.clearRect(0, 0, W, H);

    for (const p of parts) {
      if (p.life <= 0) continue;
      p.life -= 1;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.vx *= 0.995;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / 90);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      ctx.restore();
    }

    if (frame < 100) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  }

  tick();
}

/* =========================================================
   Wiring
   ========================================================= */
function addSwipeHandlers() {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  el.slideImg.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      dragging = true;
    },
    { passive: true },
  );

  el.slideImg.addEventListener(
    "touchend",
    (e) => {
      if (!dragging) return;
      dragging = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 42 && Math.abs(dy) < 60) {
        if (dx < 0) next();
        else prev();
      }
    },
    { passive: true },
  );
}

function init() {
  mountText();
  renderDots();
  goTo(0);

  el.next.addEventListener("click", next);
  el.prev.addEventListener("click", prev);
  el.yes.addEventListener("click", onYes);
  el.no.addEventListener("click", onNo);

  el.popupClose?.addEventListener?.("click", hidePopup);
  el.popupOverlay?.addEventListener?.("click", (e) => {
    if (e.target === el.popupOverlay) hidePopup();
  });

  addSwipeHandlers();

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "Escape") hidePopup();
  });

  window.addEventListener("resize", resizeConfettiCanvas);
  resizeConfettiCanvas();

  // If autoplay is blocked, the first tap/click will start the music.
  // Autoplay is often blocked by browsers; we fall back to "tap anywhere once".
  tryStartMusic({ quiet: true }).then((started) => {
    if (started) return;
    const once = () => {
      tryStartMusic();
      window.removeEventListener("pointerdown", once);
      window.removeEventListener("keydown", once);
      window.removeEventListener("touchstart", once);
    };
    window.addEventListener("pointerdown", once, { once: true });
    window.addEventListener("keydown", once, { once: true });
    window.addEventListener("touchstart", once, { once: true, passive: true });
  });
  restartAutoplay();
}

init();







