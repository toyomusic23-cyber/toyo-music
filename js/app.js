(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const featured = SONGS.find(s => s.featured) || SONGS[0];

  const PLATS = [
    { k: 'spotify', label: 'Spotify' },
    { k: 'apple',   label: 'Apple Music' },
    { k: 'youtube', label: 'YouTube Music' },
    { k: 'amazon',  label: 'Amazon Music' },
  ];

  /* ---------- render music grid ---------- */
  const grid = $('#grid');
  grid.innerHTML = SONGS.map(s => {
    const plays = PLATS.map(p =>
      `<a class="pbtn ${p.k}" href="${s.links[p.k]}" target="_blank" rel="noopener">
         <span class="dot ${p.k}"></span>${p.label}</a>`).join('');
    return `<article class="card${s.featured ? ' featured' : ''}" data-key="${s.key}">
      <div class="card-art">
        ${s.featured ? '<span class="badge">FEATURED</span>' : ''}
        <img src="covers/${s.key}-640.webp" alt="${s.title} — Toyo" loading="lazy"
             onerror="this.onerror=null;this.src='covers/${s.key}-640.jpg'">
        <div class="plays">
          <span class="plays-label">Listen on</span>${plays}
        </div>
      </div>
      <div class="card-meta">
        <div class="card-title">${s.title}</div>
        <div class="card-mood">${s.mood || ''}</div>
      </div>
    </article>`;
  }).join('');

  /* tap-to-open on touch devices */
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    if (e.target.closest('a')) return;            // let links work
    if (window.matchMedia('(hover:none)').matches) {
      document.querySelectorAll('.card.open').forEach(c => c !== card && c.classList.remove('open'));
      card.classList.toggle('open');
      e.preventDefault();
    }
  });

  /* ---------- wire CTAs ---------- */
  $('#heroListen').href = featured.links.spotify;
  [['#heroFollow'], ['#navFollow']].forEach(([sel]) => { $(sel).href = ARTIST_LINKS.spotify; });

  const followBtns = PLATS.map(p =>
    `<a class="fbtn ${p.k}" href="${ARTIST_LINKS[p.k]}" target="_blank" rel="noopener">
       <span class="dot ${p.k}"></span>${p.k === 'spotify' || p.k === 'apple' ? 'Follow on ' : ''}${p.label}</a>`).join('');
  $('#followBtns').innerHTML = followBtns;

  const social = [];
  if (ARTIST_LINKS.instagram) social.push(`<a href="${ARTIST_LINKS.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  social.push(`<a href="${ARTIST_LINKS.spotify}" target="_blank" rel="noopener">Spotify</a>`);
  social.push(`<a href="${ARTIST_LINKS.apple}" target="_blank" rel="noopener">Apple Music</a>`);
  $('#footerSocial').innerHTML = social.join('');

  /* ---------- loader + hero entrance ---------- */
  const loader = $('#loader');
  function startHero() {
    const eyebrow = $('.hero-eyebrow'), title = $('.hero-title'), tagline = $('.hero-tagline'),
          cta = $('.hero-cta'), cue = $('.scroll-cue'), img = $('.hero-img');

    // resting (final) state — used as fallback so content is NEVER stuck hidden
    const showAll = () => {
      [eyebrow, tagline, cue].forEach(el => el && (el.style.opacity = 1, el.style.transform = 'none', el.style.letterSpacing = ''));
      if (title) { title.style.opacity = 1; title.style.transform = 'none'; }
      if (cta) { cta.style.opacity = 1; cta.style.transform = 'none'; }
      if (img) { img.style.opacity = 1; img.style.transform = 'none'; }
      document.querySelectorAll('.reveal,.card').forEach(el => el.classList.add('is-in'));
    };

    loader.classList.add('done'); // CSS lifts the curtain upward

    if (reduce || typeof gsap === 'undefined') { showAll(); return; }

    // cinematic intro
    gsap.set(img,     { opacity: 0, scale: 1.08, transformOrigin: '50% 45%' });
    gsap.set(eyebrow, { opacity: 0, y: 16, letterSpacing: '0.7em' });
    gsap.set(title,   { opacity: 1, yPercent: 120 });          // sits below the mask, revealed by rise
    gsap.set(tagline, { opacity: 0, y: 18 });
    gsap.set(cta,     { opacity: 0, y: 20, scale: .96 });
    gsap.set(cue,     { opacity: 0 });

    gsap.timeline({ delay: .5 })  // begins as the curtain is lifting
      .to(img,     { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
      .to(eyebrow, { opacity: 1, y: 0, letterSpacing: '0.34em', duration: 1.0, ease: 'power3.out' }, .3)
      .to(title,   { yPercent: 0, duration: 1.15, ease: 'power4.out' }, .45)
      .to(tagline, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, '-=.65')
      .to(cta,     { opacity: 1, y: 0, scale: 1, duration: .8, ease: 'back.out(1.5)' }, '-=.5')
      .to(cue,     { opacity: 1, duration: .6 }, '-=.25');

    // safety: if frames are throttled/interrupted, force the resting state
    setTimeout(showAll, 3200);

    gsap.registerPlugin(ScrollTrigger);

    // native scroll = immediate + smooth on modern devices (no smooth-scroll library lag).
    // in-page anchors scroll smoothly.
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const sel = a.getAttribute('href'); if (sel.length < 2) return;
        const t = document.querySelector(sel); if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // subtle hero parallax — bound directly to scroll position (responsive, no lag)
    gsap.to('.hero-inner', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      yPercent: -8, opacity: .5, ease: 'none',
    });

    // section headings — refined rise
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 86%' }, opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' });
    });
    // cards — smooth staggered rise + settle
    ScrollTrigger.batch('.card', {
      start: 'top 90%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, scale: 1, duration: .95, stagger: .09, ease: 'power3.out' }),
    });
    // safety: never leave content hidden if ScrollTrigger never fires
    setTimeout(() => document.querySelectorAll('.reveal,.card').forEach(el => {
      if (getComputedStyle(el).opacity === '0') { el.style.opacity = 1; el.style.transform = 'none'; }
    }), 4500);
  }

  let started = false;
  const go = () => { if (started) return; started = true; startHero(); };
  window.addEventListener('load', () => setTimeout(go, reduce ? 0 : 900));
  setTimeout(go, 2600); // safety
})();
