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
    loader.classList.add('done');
    const heroEls = ['.hero-eyebrow', '.hero-title', '.hero-tagline', '.hero-cta', '.scroll-cue'].map(s => $(s));
    if (reduce || typeof gsap === 'undefined') {
      heroEls.forEach(el => el && (el.style.opacity = 1, el.style.transform = 'none'));
      document.querySelectorAll('.reveal,.card').forEach(el => el.classList.add('is-in'));
      return;
    }
    gsap.set(heroEls, { y: 24 });
    gsap.timeline({ delay: .15 })
      .to(heroEls, { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out' });

    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, opacity: 1, y: 0, duration: .9, ease: 'power3.out' });
    });
    ScrollTrigger.batch('.card', {
      start: 'top 92%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .7, stagger: .07, ease: 'power3.out' }),
    });
  }

  let started = false;
  const go = () => { if (started) return; started = true; startHero(); };
  window.addEventListener('load', () => setTimeout(go, reduce ? 0 : 900));
  setTimeout(go, 2600); // safety
})();
