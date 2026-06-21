(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const featured = SONGS.find(s => s.featured) || SONGS[0];

  // 画像フェードイン/スケルトンを有効化（このクラスが無い＝JS不発時は素のまま表示＝画像が消えない）
  document.documentElement.classList.add('js');
  const wireImg = (scope) => (scope || document)
    .querySelectorAll('.card-art img,.feat-art img,.rail-card img').forEach(img => {
      const done = () => { img.classList.add('loaded'); const p = img.closest('.card-art,.feat-art'); if (p) p.classList.add('ready'); };
      if (img.complete && img.naturalWidth > 0) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });

  // 公開アルバム順の保存先（Supabase）。anon/publishable キーは公開して安全（読み取り専用＋書込は合言葉必須）。
  const SB_URL = 'https://lvminivpfztbvaepjqlz.supabase.co';
  const SB_KEY = 'sb_publishable_9DdJC8RwquEvqlgsQuriug_0ypS2exk';

  const PLATS = [
    { k: 'spotify', label: 'Spotify' },
    { k: 'apple',   label: 'Apple Music' },
    { k: 'youtube', label: 'YouTube Music' },
    { k: 'amazon',  label: 'Amazon Music' },
  ];

  /* ---------- music: featured (pinned big) + reorderable grid ---------- */
  const grid = $('#grid');
  const featuredEl = $('#featured');
  const ORDER_KEY = 'toyo_grid_order';
  const platBtns = s => PLATS.map(p =>
    `<a class="pbtn ${p.k}" href="${s.links[p.k]}" target="_blank" rel="noopener"><span class="dot ${p.k}"></span>${p.label}</a>`).join('');
  const hasLyrics = s => typeof LYRICS !== 'undefined' && LYRICS[s.key];
  const lyricBtn = (s, cls = '') => hasLyrics(s) ? `<button class="lyric-btn ${cls}" data-lyric="${s.key}">♪ 歌詞を見る</button>` : '';

  // featured big card at the top (pinned)
  if (featuredEl && featured) {
    featuredEl.innerHTML = `<div class="feat-card" data-key="${featured.key}">
      <div class="feat-art"><img src="covers/${featured.key}-1280.webp" alt="${featured.title} — Toyo"
        onerror="this.onerror=null;this.src='covers/${featured.key}-640.jpg'"></div>
      <div class="feat-info">
        <span class="feat-badge">FEATURED</span>
        <div class="feat-title">${featured.title}</div>
        <div class="feat-mood">${featured.mood || ''}</div>
        <div class="feat-plays">${platBtns(featured)}</div>
        ${lyricBtn(featured, 'feat-lyric')}
      </div></div>`;
  }

  // grid = all songs except the featured one, in the saved custom order if present
  let gridSongs = SONGS.filter(s => s !== featured);
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
    if (Array.isArray(saved) && saved.length)
      gridSongs.sort((a, b) => (saved.indexOf(a.key) + 1 || 999) - (saved.indexOf(b.key) + 1 || 999));
  } catch (e) {}

  const cardHTML = s => `<article class="card" data-key="${s.key}">
      <div class="card-art">
        <img src="covers/${s.key}-640.webp" alt="${s.title} — Toyo" loading="lazy" onerror="this.onerror=null;this.src='covers/${s.key}-640.jpg'">
        <div class="plays"><span class="plays-label">Listen on</span>${platBtns(s)}</div>
      </div>
      <div class="card-meta"><div class="card-title">${s.title}</div><div class="card-mood">${s.mood || ''}</div>${lyricBtn(s)}</div>
    </article>`;
  grid.innerHTML = gridSongs.map(cardHTML).join('');
  wireImg(); // 画像ロード→フェードイン配線（featured + grid）

  // tap-to-open platform buttons (touch)
  grid.addEventListener('click', e => {
    if (document.body.classList.contains('editing')) return;
    const card = e.target.closest('.card');
    if (!card || e.target.closest('a') || e.target.closest('.lyric-btn')) return;
    if (window.matchMedia('(hover:none)').matches) {
      document.querySelectorAll('.card.open').forEach(c => c !== card && c.classList.remove('open'));
      card.classList.toggle('open'); e.preventDefault();
    }
  });

  // lyrics modal
  const lmModal = $('#lyricModal'), lmTitle = $('#lmTitle'), lmBody = $('#lmBody');
  const closeLyric = () => { if (lmModal) { lmModal.hidden = true; document.body.style.overflow = ''; } };
  const openLyric = k => {
    if (typeof LYRICS === 'undefined' || !LYRICS[k] || !lmModal) return;
    const s = SONGS.find(x => x.key === k);
    lmTitle.textContent = s ? s.title : '';
    lmBody.textContent = LYRICS[k];
    lmModal.hidden = false; document.body.style.overflow = 'hidden';
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lyric]');
    if (b) { if (document.body.classList.contains('editing')) return; e.preventDefault(); openLyric(b.getAttribute('data-lyric')); return; }
    if (e.target.closest('[data-close]')) closeLyric();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLyric(); });

  // reorder editor — only opens with the secret URL ?edit=toyomaru-king (others can't access it)
  if (new URLSearchParams(location.search).get('edit') === 'toyomaru-king' && typeof Sortable !== 'undefined') {
    document.body.classList.add('editing');
    const bar = $('#editBar'); if (bar) bar.hidden = false;
    Sortable.create(grid, {
      animation: 180, ghostClass: 'sortable-ghost', dragClass: 'sortable-drag',
      onEnd: () => localStorage.setItem(ORDER_KEY, JSON.stringify([...grid.querySelectorAll('.card')].map(c => c.dataset.key))),
    });
    const copyBtn = $('#ebCopy'), resetBtn = $('#ebReset');
    copyBtn && copyBtn.addEventListener('click', async () => {
      const text = JSON.stringify([...grid.querySelectorAll('.card')].map(c => c.dataset.key));
      try { await navigator.clipboard.writeText(text); copyBtn.textContent = 'コピーしました ✓'; }
      catch (e) { window.prompt('この順番をコピーして送ってください:', text); }
      setTimeout(() => (copyBtn.textContent = '順番をコピー'), 1800);
    });
    resetBtn && resetBtn.addEventListener('click', () => { localStorage.removeItem(ORDER_KEY); location.reload(); });

    // 全公開: 合言葉を入力 → Supabase の publish_order を呼ぶ（合言葉はサーバー側で検証）
    const publishBtn = $('#ebPublish');
    publishBtn && publishBtn.addEventListener('click', async () => {
      if (!SB_URL || !SB_KEY) { publishBtn.textContent = '保存先 未設定'; return; }
      const order = [...grid.querySelectorAll('.card')].map(c => c.dataset.key);
      const pass = window.prompt('全公開用の合言葉を入力（この順番が全員の画面に反映されます）:');
      if (!pass) return;
      publishBtn.disabled = true; publishBtn.textContent = '公開中…';
      try {
        const res = await fetch(`${SB_URL}/rest/v1/rpc/publish_order`, {
          method: 'POST',
          headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_order: order, p_pass: pass }),
        });
        if (res.ok) { publishBtn.textContent = '全公開しました ✓'; localStorage.removeItem(ORDER_KEY); }
        else {
          let msg = ''; try { msg = (await res.json()).message || ''; } catch (e) {}
          publishBtn.textContent = /unauthorized/i.test(msg) ? '合言葉が違います' : '公開に失敗';
        }
      } catch (e) { publishBtn.textContent = 'ネットワークエラー'; }
      finally { setTimeout(() => { publishBtn.disabled = false; publishBtn.textContent = '全公開する'; }, 2200); }
    });
  }

  /* ---------- featured rail: auto-scrolls left, also manually scrollable/draggable ---------- */
  const rail = $('#rail'), railTrack = $('#railTrack');
  let rebuildRail = null; // exposed so the published-order fetch can re-render the rail in the new order
  if (rail && railTrack) {
    const railCard = s => `<a class="rail-card" data-key="${s.key}" href="${s.links.spotify}" target="_blank" rel="noopener" aria-label="${s.title} を聴く">
        <img src="covers/${s.key}-640.webp" alt="${s.title} — Toyo" loading="lazy" onerror="this.onerror=null;this.src='covers/${s.key}-640.jpg'">
        <div class="rc-meta"><div class="rc-title">${s.title}</div><div class="rc-mood">${s.mood || ''}</div></div>
      </a>`;
    let half = 0, paused = false, pos = rail.scrollLeft; // pos = float accumulator (iOS scrollLeft is integer-quantized)
    const measure = () => { half = railTrack.scrollWidth / 2; };
    const buildTrack = songs => { railTrack.innerHTML = songs.map(railCard).join('').repeat(2); measure(); wireImg(rail); }; // two copies → seamless loop
    buildTrack([featured, ...gridSongs]); // same display order as the collection (incl. saved reorder)
    rebuildRail = songs => buildTrack(songs);
    window.addEventListener('load', measure); window.addEventListener('resize', measure); setTimeout(measure, 500);

    // pause while the user is engaging
    rail.addEventListener('mouseenter', () => paused = true);
    rail.addEventListener('mouseleave', () => { paused = false; down = false; rail.classList.remove('dragging'); });
    let resume;
    const tempPause = () => { paused = true; clearTimeout(resume); resume = setTimeout(() => paused = false, 1500); };
    rail.addEventListener('touchstart', tempPause, { passive: true });
    rail.addEventListener('wheel', tempPause, { passive: true });
    // user (touch/drag/wheel) moved the rail → re-sync the float accumulator so auto-drift continues from there
    rail.addEventListener('scroll', () => { if (paused) pos = rail.scrollLeft; }, { passive: true });

    // mouse drag to scroll (touch uses native scrolling)
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('dragging'); });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; rail.classList.remove('dragging'); });
    railTrack.addEventListener('click', e => { if (moved) e.preventDefault(); }, true); // ignore click after a drag

    // continuous slow leftward flow + seamless wrap
    // NOTE: advance a float accumulator and write an integer scrollLeft. iOS/WebKit
    // quantizes scrollLeft to whole pixels, so a raw `+= 0.5` rounds back to the same
    // value every frame and never moves on mobile. Rounding a monotonically-growing
    // float fixes that while staying smooth on desktop.
    const railTick = () => {
      if (half) {
        if (!paused) {
          pos += 0.5;                 // flows on all devices (intentional showcase motion)
          if (pos >= half) pos -= half;
          rail.scrollLeft = Math.round(pos);
        }
      }
      requestAnimationFrame(railTick);
    };
    requestAnimationFrame(railTick);
  }

  /* ---------- published global order (Supabase) ----------
     公開順を読み取り、既に描画済みの grid / rail をその順に並べ替える。
     失敗時は songs.js のデフォルト順のまま（初期描画は即座＝待たない）。 */
  async function applyPublishedOrder() {
    if (!SB_URL || !SB_KEY) return;
    let order;
    try {
      const res = await fetch(`${SB_URL}/rest/v1/grid_order?id=eq.1&select=order_keys`,
        { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
      if (!res.ok) return;
      const rows = await res.json();
      order = rows && rows[0] && rows[0].order_keys;
    } catch (e) { return; }
    if (!Array.isArray(order) || !order.length) return;
    const rank = k => { const i = order.indexOf(k); return i === -1 ? 9999 : i; };
    gridSongs.sort((a, b) => rank(a.key) - rank(b.key));
    if (grid) [...grid.querySelectorAll('.card')]
      .sort((a, b) => rank(a.dataset.key) - rank(b.dataset.key))
      .forEach(c => grid.appendChild(c));
    if (rebuildRail) rebuildRail([featured, ...gridSongs]);
  }
  applyPublishedOrder();

  /* ---------- wire CTAs ---------- */
  $('#heroListen').href = featured.links.spotify;
  [['#heroFollow'], ['#navFollow']].forEach(([sel]) => { $(sel).href = ARTIST_LINKS.spotify; });

  const followBtns = PLATS.map(p =>
    `<a class="fbtn ${p.k}" href="${ARTIST_LINKS[p.k]}" target="_blank" rel="noopener">
       <span class="dot ${p.k}"></span>${p.k === 'spotify' || p.k === 'apple' ? 'Follow on ' : ''}${p.label}</a>`).join('');
  const igFollow = ARTIST_LINKS.instagram
    ? `<a class="fbtn instagram" href="${ARTIST_LINKS.instagram}" target="_blank" rel="noopener"><span class="dot" style="background:#e1306c"></span>Instagram</a>`
    : '';
  $('#followBtns').innerHTML = followBtns + igFollow;

  const social = [];
  if (ARTIST_LINKS.instagram) social.push(`<a href="${ARTIST_LINKS.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  social.push(`<a href="${ARTIST_LINKS.spotify}" target="_blank" rel="noopener">Spotify</a>`);
  social.push(`<a href="${ARTIST_LINKS.apple}" target="_blank" rel="noopener">Apple Music</a>`);
  $('#footerSocial').innerHTML = social.join('');

  /* ---------- analytics: GTM dataLayer events（曲×プラットフォームの表示/クリック）---------- */
  (function analytics(){
    const dl = o => (window.dataLayer = window.dataLayer || []).push(o);
    const titleOf = key => { const s = SONGS.find(x => x.key === key); return s ? s.title : ''; };
    const platOf = el => ['spotify','apple','youtube','amazon','instagram'].find(p => el.classList.contains(p)) || '';

    // クリック: プラットフォームボタン(一覧/注目)・PICK UPカード・フォロー帯・歌詞・ヒーローCTA
    document.addEventListener('click', e => {
      const pbtn = e.target.closest('.pbtn');
      const rail = e.target.closest('.rail-card');
      const fbtn = e.target.closest('.fbtn');
      const lyr  = e.target.closest('.lyric-btn');
      const keyEl = e.target.closest('[data-key]');
      const key = keyEl ? keyEl.dataset.key : '';
      if (pbtn) {
        dl({ event:'platform_click', song_title: titleOf(key), song_key: key, platform: platOf(pbtn),
             location: e.target.closest('.feat-card') ? 'featured' : 'grid' });
      } else if (rail) {
        dl({ event:'platform_click', song_title: titleOf(key), song_key: key, platform:'spotify', location:'pickup' });
      } else if (fbtn) {
        dl({ event:'follow_click', platform: platOf(fbtn), location:'follow' });
      } else if (lyr) {
        dl({ event:'lyric_view', song_title: titleOf(key), song_key: key });
      }
    });
    const hero = (sel, cta) => { const el = $(sel); el && el.addEventListener('click', () => dl({ event:'hero_cta', cta })); };
    hero('#heroListen','listen'); hero('#heroFollow','follow'); hero('#navFollow','nav_follow');

    // 表示(インプレッション): コレクションの各カードが画面に入ったら1回だけ計測
    if ('IntersectionObserver' in window) {
      const seen = new Set();
      const io = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return;
        const k = en.target.dataset.key; if (!k || seen.has(k)) return;
        seen.add(k);
        dl({ event:'song_view', song_title: titleOf(k), song_key: k,
             location: en.target.classList.contains('feat-card') ? 'featured' : 'grid' });
      }), { threshold: 0.5 });
      document.querySelectorAll('#grid .card[data-key], #featured .feat-card[data-key]').forEach(el => io.observe(el));
    }
  })();

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
