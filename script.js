/* =====================================================
   MARIANA VIANA — Portfolio Script
   ===================================================== */

/* ===== TYPED ANIMATION ===== */
const words = ['Platform & DevEx Engineer', 'transformo a nuvem em plataformas', 'cloud, produto e engenharia', 'pós-graduada em Cloud Computing'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const el = document.getElementById('typed');
  if (!el) return;

  const word = words[wordIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  el.textContent = word.slice(0, charIndex);

  let delay = isDeleting ? 70 : 110;

  if (!isDeleting && charIndex === word.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 450;
  }

  setTimeout(type, delay);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 600);
});

/* ===== NAV: scroll class ===== */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ===== NAV: mobile menu ===== */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fecha o menu ao clicar em um link
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ===== NAV: active link no scroll ===== */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => navObserver.observe(s));

/* ===== FADE IN AO SCROLLAR ===== */
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay baseado na posição na grid
      const siblings = [...entry.target.parentElement.children];
      const index = siblings.indexOf(entry.target);
      const delay = index * 80;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

/* ===== SKILL BARS: animar ao entrar ===== */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(bar => skillObserver.observe(bar));

/* ===== CARDS DE PROJETO CLICÁVEIS ===== */
document.querySelectorAll('.project-card[data-url]').forEach(card => {
  card.addEventListener('click', (e) => {
    // Ignora se o clique foi em um link interno
    if (e.target.closest('a')) return;
    window.open(card.dataset.url, '_blank', 'noopener');
  });
});

/* ===== CONTADOR ANIMADO (Sobre — stats) ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});
