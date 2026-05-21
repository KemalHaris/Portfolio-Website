/* ═══════════════════════════════════════════
   PORTFOLIO v2 — scripts.js
═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. LOADER ────────────────────────── */
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader.classList.add('out');
    // trigger hero reveals
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('in'));
  }

  const ldTimeout = setTimeout(hideLoader, 2600);
  window.addEventListener('load', () => {
    clearTimeout(ldTimeout);
    setTimeout(hideLoader, 2000);
  });


  /* ── 2. CUSTOM CURSOR ─────────────────── */
  const cur  = document.getElementById('cur');
  const cur2 = document.getElementById('cur2');
  const isFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (isFine && cur && cur2) {
    let mx = -200, my = -200, tx = -200, ty = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    (function trail() {
      tx += (mx - tx) * 0.13;
      ty += (my - ty) * 0.13;
      cur2.style.left = tx + 'px';
      cur2.style.top  = ty + 'px';
      requestAnimationFrame(trail);
    })();

    const hoverSel = 'a, button, .card, .totop, .foot-email, #zoomClose';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSel)) {
        cur.classList.add('big'); cur2.classList.add('big');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSel)) {
        cur.classList.remove('big'); cur2.classList.remove('big');
      }
    });
  }


  /* ── 3. NAVBAR ────────────────────────── */
  const nav       = document.getElementById('nav');
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  const allLinks = document.querySelectorAll('.nav-links a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        allLinks.forEach(l => l.classList.remove('active'));
        const lnk = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (lnk) lnk.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => secObs.observe(s));


  /* ── 4. SMOOTH ANCHOR SCROLL ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 5. SCROLL REVEAL ─────────────────── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // stagger cards within a grid
      const grid = entry.target.closest('.grid-2, .grid-3');
      let delay = 0;
      if (grid) {
        const cards = Array.from(grid.querySelectorAll('.reveal'));
        const idx = cards.indexOf(entry.target);
        delay = idx * 90;
      }
      setTimeout(() => entry.target.classList.add('in'), delay);
      revObs.unobserve(entry.target);
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.reveal:not(#hero .reveal)').forEach(el => revObs.observe(el));


  /* ── 6. CARD TILT (desktop) ───────────── */
  if (isFine) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ── 7. ZOOM LIGHTBOX (infographics, magazines, posters) ── */
  const zoomBox   = document.getElementById('zoomBox');
  const zoomClose = document.getElementById('zoomClose');
  const zoomImg   = document.getElementById('zoomImg');
  const zoomPh    = document.getElementById('zoomPh');
  const zoomType  = document.getElementById('zoomType');
  const zoomTitle = document.getElementById('zoomTitle');
  const zoomDesc  = document.getElementById('zoomDesc');
  const zoomTags  = document.getElementById('zoomTags');
  const zoomLink  = document.getElementById('zoomLink');

  function openZoom(card) {
    const imgSrc = card.dataset.img || '';
    const href   = card.dataset.href || '#';

    zoomType.textContent  = card.dataset.type  || '';
    zoomTitle.textContent = card.dataset.title || '';
    zoomDesc.textContent  = card.dataset.desc  || '';

    const tags = (card.dataset.tags || '').split(',').filter(Boolean);
    zoomTags.innerHTML = tags.map(t =>
      `<span class="ztag">${t.trim()}</span>`).join('');

    // image
    if (imgSrc && !imgSrc.startsWith('YOUR_')) {
      zoomImg.src = imgSrc;
      zoomImg.style.display = '';
    } else {
      zoomImg.src = '';
      zoomImg.style.display = 'none';
    }

    // link
    const isPlaceholder = !href || href.startsWith('YOUR_') || href === '#';
    if (isPlaceholder) {
      zoomLink.style.display = 'none';
    } else {
      zoomLink.href = href;
      zoomLink.style.display = '';
    }

    zoomBox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeZoom() {
    zoomBox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.zoomable').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      openZoom(card);
    });
  });

  zoomClose.addEventListener('click', closeZoom);
  zoomBox.addEventListener('click', e => {
    if (e.target === zoomBox) closeZoom();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && zoomBox.classList.contains('open')) closeZoom();
  });


  /* ── 8. SECTION NUMBER FADE-SLIDE ─────── */
  document.querySelectorAll('.sec-num').forEach(el => {
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    const o = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        el.style.opacity   = entry.isIntersecting ? '1' : '0.3';
        el.style.transform = entry.isIntersecting ? 'translateX(0)' : 'translateX(-10px)';
      });
    }, { threshold: 0.5 });
    o.observe(el);
  });


  /* ── 9. FOOTER EMAIL SCRAMBLE ─────────── */
  const emailEl = document.getElementById('footEmail');
  if (emailEl) {
    const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@._-';
    const origTxt = emailEl.textContent;
    let frame = null;

    emailEl.addEventListener('mouseenter', () => {
      let iter = 0;
      clearInterval(frame);
      frame = setInterval(() => {
        emailEl.textContent = origTxt.split('').map((ch, i) => {
          if (i < iter) return origTxt[i];
          if (ch === ' ') return ' ';
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        if (iter >= origTxt.length) {
          clearInterval(frame);
          emailEl.textContent = origTxt;
        }
        iter += 0.45;
      }, 26);
    });

    emailEl.addEventListener('mouseleave', () => {
      clearInterval(frame);
      emailEl.textContent = origTxt;
    });
  }

})();
