/* ============================================
   NITHA ELDHO — script.js
   ============================================ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    // trigger hero animations
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 200 + i * 120);
    });
  }, 1300);
});

/* ── CURSOR ── */
const ring = document.getElementById('cursorRing');
const dot  = document.getElementById('cursorDot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .proj-card, .skill-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});
document.addEventListener('mouseleave', () => { ring.style.opacity='0'; dot.style.opacity='0'; });
document.addEventListener('mouseenter', () => { ring.style.opacity='1'; dot.style.opacity='1'; });

/* ── HEADER SCROLL ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

/* ── BURGER ── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mn-link').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.fade-up:not(.in)')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('in'), idx * 90);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fade-up:not(.hero .fade-up)').forEach(el => revealObs.observe(el));

/* ── ACTIVE NAV ── */
const sections  = document.querySelectorAll('section[id]');
const navAs     = document.querySelectorAll('.nav-links a');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => activeObs.observe(s));

/* ── STAT COUNTERS ── */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function runCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const isFloat  = el.dataset.float === 'true';
  const duration = 1600;
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const val = easeOut(progress) * target;
    el.textContent = (isFloat ? val.toFixed(2) : Math.floor(val)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = (isFloat ? target.toFixed(2) : target) + suffix;
  }
  requestAnimationFrame(tick);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hstat-n').forEach(el => statObs.observe(el));

/* ── PROJECT CARD TILT ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2;
    const rx = ((e.clientY - r.top  - cy) / cy) * -4;
    const ry = ((e.clientX - r.left - cx) / cx) *  4;
    card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.transition = 'border-color 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'border-color 0.3s, transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ── TYPING SUBTITLE (hero role) ── */
const roleEl = document.querySelector('.hero-role');
if (roleEl) {
  const original = roleEl.textContent;
  const parts = ['Data Professional', 'AI & ML Engineer', 'ETL Pipeline Builder', 'PostgreSQL Expert'];
  let pi = 0, ci = 0, deleting = false;

  function typeRole() {
    const word = parts[pi % parts.length];
    if (!deleting) {
      ci++;
      roleEl.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(typeRole, 1800); return; }
    } else {
      ci--;
      roleEl.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; pi++; setTimeout(typeRole, 300); return; }
    }
    setTimeout(typeRole, deleting ? 55 : 90);
  }

  // Start after loader
  setTimeout(typeRole, 2000);
}

/* ── PARALLAX HERO GRID ── */
window.addEventListener('scroll', () => {
  const grid = document.querySelector('.hero-grid-bg');
  if (grid) grid.style.transform = `translateY(${window.scrollY * 0.15}px)`;
}, { passive: true });
