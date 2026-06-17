/* =====================================================
   MARIANA VIANA — Efeitos de impacto
   Partículas, brilho do cursor, spotlight, tilt 3D e
   contador dos números. Tudo opcional e leve.
   ===================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

/* ===== 1) PARTÍCULAS / CONSTELAÇÃO NO HERO ===== */
(function heroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let w, h, particles, raf;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((w * h) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // leve atração ao mouse
      const dxm = mouse.x - p.x;
      const dym = mouse.y - p.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 140) {
        p.x += dxm * 0.0016;
        p.y += dym * 0.0016;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.85)';
      ctx.fill();

      // conexões
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.16 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  window.addEventListener('resize', resize);
  resize();
  draw();

  // pausa quando o hero sai da tela (economia)
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { if (!raf) draw(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  io.observe(hero);
})();

/* ===== 2) BRILHO QUE SEGUE O CURSOR ===== */
(function cursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || isTouch || reduceMotion) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, visible = false;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!visible) { glow.style.opacity = '1'; visible = true; }
  });
  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) { glow.style.opacity = '0'; visible = false; }
  });

  (function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();
})();

/* ===== 3) SPOTLIGHT NOS CARDS ===== */
(function cardSpotlight() {
  if (isTouch) return;
  document.querySelectorAll('.skill-card, .project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
})();

/* ===== 4) TILT 3D NO CARD DE CÓDIGO ===== */
(function codeTilt() {
  const card = document.querySelector('.code-card');
  if (!card || isTouch || reduceMotion) return;

  const wrap = card.parentElement;
  const MAX = 9; // graus

  wrap.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform =
      `rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateZ(8px)`;
    card.style.boxShadow = `${-px * 30}px ${py * 30}px 50px rgba(0,0,0,0.45)`;
  });
  wrap.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
})();

/* ===== 5) CONTADOR DOS NÚMEROS DE IMPACTO ===== */
(function impactCounters() {
  const nums = document.querySelectorAll('.metric-num[data-target]');
  if (!nums.length) return;

  function run(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach((el) => obs.observe(el));
})();
