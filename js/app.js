/* Toyo — Official サイトの動き（2026-09-26 刷新）
 * ページ: body[data-page] = home | song | doc。曲ページは body[data-key] と data-root="../../"
 * データ: js/songs.js（SONGS・ARTIST_LINKS・SCENES・MOTION）。歌詞 js/lyrics.js は必要になった時だけ読む
 * 計測: GTM dataLayer（platform_click / song_view / lyric_view / follow_click / hero_cta ＋ preview_play / scene_select）
 * 曲へのリンクは本物の <a href="song/<key>/">（検索エンジン・長押し・新しいタブで開ける）。普通のクリックだけ詳細シートを開く
 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const body = document.body;
  const PAGE = body.dataset.page || 'home';
  const ROOT = body.dataset.root || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const EDIT = new URLSearchParams(location.search).get('edit') === 'toyomaru-king';
  let motionOff = false;
  try { motionOff = localStorage.getItem('toyo_motion_off') === '1'; } catch (e) {}
  const dl = o => (window.dataLayer = window.dataLayer || []).push(o);
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { localStorage.removeItem(k); } catch (e) {} },
  };
  if (typeof SONGS === 'undefined') return;   // 曲データが読めない時は何もしない（静的な表示のまま・画像も隠さない）
  html.classList.add('js');

  const MOMENT = html.dataset.moment || 'night';
  const MOMENT_JA = { morning: '朝', day: '昼', evening: '夕方', night: '夜' };
  const SCN = typeof SCENES !== 'undefined' ? SCENES : {};
  const MEDIA = typeof MOTION !== 'undefined' ? MOTION : { hero: {}, covers: {} };
  const PLATS = [
    { k: 'spotify', label: 'Spotify' },
    { k: 'apple', label: 'Apple Music' },
    { k: 'youtube', label: 'YouTube Music' },
    { k: 'amazon', label: 'Amazon Music' },
  ];
  const byKey = new Map(SONGS.map(s => [s.key, s]));
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const art = (s, size = 640) => `${ROOT}covers/${s.key}-${size}.webp`;
  const artJpg = s => `${ROOT}covers/${s.key}-640.jpg`;
  const songHref = s => `${ROOT}song/${s.key}/`;
  const direct = s => !!(s.spotifyId || s.appleUrl);
  const waiting = s => !!s.isNew && !direct(s);          // 新曲でストア未反映＝配信準備中
  const canPreview = s => !!s.preview;
  const moodOf = s => s.moodJa || s.mood || '';
  const sceneNames = s => (s.scene || []).map(k => SCN[k] && SCN[k].ja).filter(Boolean);
  const srcset = s => `${art(s, 240)} 240w, ${art(s, 640)} 640w, ${art(s, 1280)} 1280w`;
  const imgTag = (s, size, extra = '', sizes = '') =>
    `<img src="${art(s, size)}"${sizes ? ` srcset="${srcset(s)}" sizes="${sizes}"` : ''} alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${artJpg(s)}'" ${extra}>`;
  const GRID_SIZES = '(max-width:599px) 46vw, (max-width:979px) 31vw, 290px';
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M8 5v14l11-7z"/><path class="i-pause" d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>';

  // 画像のフェードイン。JS が画像を見張っている時だけ隠す（html.imgfade）。3秒たっても読み終わらない画像は出す
  const wireImgs = scope => {
    html.classList.add('imgfade');
    $$('img', scope || document).forEach(img => {
      if (img.dataset.wired) return; img.dataset.wired = '1';
      const done = () => img.classList.add('loaded');
      if (img.complete && img.naturalWidth > 0) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); if (!img.dataset.src) setTimeout(done, 3000); }
    });
  };

  // 近づいた画像だけ読む（ブラウザ標準の lazy は先読みが遠く、見ていない一覧の画像まで読むため・300px 手前で読む）
  const lio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; const im = en.target; lio.unobserve(im);
    if (im.dataset.srcset) im.srcset = im.dataset.srcset; if (im.dataset.src) im.src = im.dataset.src;
  }), { rootMargin: '300px 0px' }) : null;
  const deferImgs = scope => $$('img[data-src]', scope).forEach(im => {
    if (lio) lio.observe(im); else { if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.src = im.dataset.src; }
  });
  const lazyImg = (s, sizes) =>
    `<img data-src="${art(s, 640)}" data-srcset="${srcset(s)}" sizes="${sizes}" alt="" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${artJpg(s)}'">`;

  // 画面外の動画は止める（電池と発熱を抑える）。ヒーロー・動くジャケ共通
  const vio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    const v = en.target; if (v.dataset.userPaused) return;
    en.isIntersecting ? v.play().catch(() => {}) : v.pause();
  })) : null;
  const watchVideo = v => { if (v && vio) vio.observe(v); };

  /* ---------- 好きなサービスを覚える（1タップで聴けるように） ---------- */
  const PREF = 'toyo_pref_service';
  const prefSvc = () => { const p = store.get(PREF); return PLATS.some(x => x.k === p) ? p : 'spotify'; };
  const svcLabel = k => (PLATS.find(p => p.k === k) || {}).label || k;
  const SHORT = { spotify: 'Spotify', apple: 'Apple', youtube: 'YouTube', amazon: 'Amazon' };
  const svcMain = (s, loc) => {
    if (waiting(s)) return `<span class="svc-wait">配信準備中（各サービスに順次反映）</span>`;
    const k = prefSvc();
    return `<a class="svc svc-main" data-svc="${k}" data-key="${s.key}" data-loc="${loc}" href="${esc(s.links[k])}" target="_blank" rel="noopener"><span class="dot ${k}"></span>${svcLabel(k)}で聴く</a>`;
  };
  const svcOthers = (s, loc) => waiting(s) ? '' : PLATS.filter(p => p.k !== prefSvc()).map(p =>
    `<a class="svc" data-svc="${p.k}" data-key="${s.key}" data-loc="${loc}" href="${esc(s.links[p.k])}" target="_blank" rel="noopener"><span class="dot ${p.k}"></span>${p.label}</a>`).join('');
  const refreshSvc = () => {
    const k = prefSvc();
    $$('.svc-main[data-key]').forEach(a => {
      const s = byKey.get(a.dataset.key); if (!s || waiting(s)) return;
      a.dataset.svc = k; a.href = s.links[k]; a.innerHTML = `<span class="dot ${k}"></span>${svcLabel(k)}で聴く`;
    });
    $$('[data-others]').forEach(box => { const s = byKey.get(box.dataset.others); if (s) box.innerHTML = svcOthers(s, box.dataset.loc || ''); });
    if (cur) renderPlayerSvc(byKey.get(cur));
  };
  const playBtn = (s, loc) => canPreview(s)
    ? `<button class="play" type="button" data-play="${s.key}" data-loc="${loc}" aria-label="${esc(s.title)} を試聴">${ICON_PLAY}</button>` : '';

  /* ---------- 試聴プレイヤー（30秒・必ず自分で押して開始） ---------- */
  const audio = $('#audio');
  const player = $('#player');
  let queue = [], qi = -1, cur = null, lastAuto = false, fails = 0;
  const lists = {};                         // 場所ごとの曲順（「続けて試聴」の順番）
  const listFor = loc => (lists[loc] || lists.all || SONGS).filter(canPreview);
  const setSub = t => { const el = $('#playerSub'); if (el) el.textContent = t; };
  const announce = t => { const el = $('#status'); if (el) { el.textContent = ''; setTimeout(() => (el.textContent = t), 30); } };

  function renderPlayerSvc(s) {
    const a = $('#playerSvc'); if (!a || !s) return;
    if (waiting(s)) {
      a.href = ARTIST_LINKS.spotify; a.dataset.follow = 'spotify'; a.dataset.loc = 'player'; delete a.dataset.svc;
      a.innerHTML = '<span class="dot spotify"></span><span class="svc-label">フォロー</span>';
    } else {
      const k = prefSvc();
      a.href = s.links[k]; a.dataset.svc = k; a.dataset.key = s.key; a.dataset.loc = 'player'; delete a.dataset.follow;
      a.innerHTML = `<span class="dot ${k}"></span><span class="svc-label">${SHORT[k] || svcLabel(k)}</span>`;
      a.setAttribute('aria-label', `${s.title} を ${svcLabel(k)} で聴く`);
    }
  }
  function renderPlayer(s) {
    if (!player) return;
    player.hidden = false;
    $('#playerArt').src = art(s, 240);
    $('#playerTitle').textContent = s.title;
    setSub(`試聴 30秒 · ${moodOf(s)}`);
    renderPlayerSvc(s);
    html.style.setProperty('--player-h', player.offsetHeight + 'px');
    const ps = $('#playerSong'); if (ps) ps.setAttribute('aria-label', `${s.title} の${PAGE === 'home' ? '詳細' : 'ページ'}を開く`);
  }
  function mediaSession(s) {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: s.title, artist: 'Toyo', album: '試聴',
        artwork: [{ src: new URL(art(s, 640), location.href).href, sizes: '640x640', type: 'image/webp' }],
      });
    } catch (e) {}
  }
  function load(s) {
    cur = s.key;
    audio.src = `${ROOT}audio/${s.key}.m4a`;
    renderPlayer(s); mediaSession(s); syncPlay();
  }
  function startQueue(list, key, loc) {
    const s = byKey.get(key); if (!s || !canPreview(s) || !audio) return;
    if (cur === key) { audio.paused ? audio.play().catch(() => {}) : audio.pause(); return; }
    queue = list.filter(canPreview).map(x => x.key);
    qi = queue.indexOf(key); if (qi < 0) { queue.unshift(key); qi = 0; }
    lastAuto = false; fails = 0;
    load(s); audio.play().catch(() => {});
    dl({ event: 'preview_play', song_title: s.title, song_key: s.key, location: loc || '' });
  }
  function next(auto) {
    if (!queue.length) return;
    if (auto && qi >= queue.length - 1) {            // 最後の曲の後は止める（放置で回り続けない）
      setSub('最後まで試聴しました · 続きは配信サービスで');
      syncPlay(); return;
    }
    qi = (qi + 1) % queue.length;
    const s = byKey.get(queue[qi]); if (!s) return;
    lastAuto = !!auto;
    load(s); audio.play().catch(() => {});
    dl({ event: 'preview_play', song_title: s.title, song_key: s.key, location: auto ? 'auto_next' : 'next' });
  }
  function syncPlay() {
    const playing = !!(audio && !audio.paused);
    $$('[data-play]').forEach(b => {
      const on = b.dataset.play === cur && playing;
      b.classList.toggle('is-playing', on);
      const s = byKey.get(b.dataset.play);
      if (s) b.setAttribute('aria-label', `${s.title} を${on ? '一時停止' : '試聴'}`);
    });
    const t = $('#playerToggle');
    if (t) { t.classList.toggle('is-paused', !playing); t.setAttribute('aria-label', playing ? '一時停止' : '再生'); }
  }
  if (audio) {
    audio.addEventListener('play', syncPlay);
    audio.addEventListener('pause', syncPlay);
    audio.addEventListener('playing', () => { fails = 0; });
    audio.addEventListener('ended', () => next(true));
    audio.addEventListener('error', () => {           // 試聴ファイルが読めない時は案内し、続けて試聴の途中なら次へ
      if (!cur) return;
      setSub('この曲の試聴を読み込めませんでした');
      syncPlay();
      fails++;
      if (lastAuto && fails < queue.length) setTimeout(() => next(true), 900);
    });
    audio.addEventListener('timeupdate', () => {
      const bar = $('#playerBar'); if (bar && audio.duration) bar.style.width = (audio.currentTime / audio.duration * 100) + '%';
    });
    const toggle = $('#playerToggle');
    toggle && toggle.addEventListener('click', () => { if (!cur) return; audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
    const nx = $('#playerNext'); nx && nx.addEventListener('click', () => next(false));
    const ps = $('#playerSong');
    ps && ps.addEventListener('click', () => { if (!cur) return; PAGE === 'home' ? openSheet(cur) : (location.href = songHref(byKey.get(cur))); });
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => audio.play());
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('nexttrack', () => next(false));
      } catch (e) {}
    }
    addEventListener('resize', () => { if (player && !player.hidden) html.style.setProperty('--player-h', player.offsetHeight + 'px'); });
  }

  /* ---------- 歌詞（必要になった時だけ読み込む・失敗したら次に開いた時にもう一度） ---------- */
  let lyricsLoading = null;
  const ensureLyrics = () => {
    if (typeof LYRICS !== 'undefined') return Promise.resolve(true);
    if (!lyricsLoading) lyricsLoading = new Promise(res => {
      const sc = document.createElement('script');
      sc.src = `${ROOT}js/lyrics.js?v=14`;
      sc.onload = () => res(true);
      sc.onerror = () => { lyricsLoading = null; sc.remove(); res(false); };
      document.head.appendChild(sc);
    });
    return lyricsLoading;
  };

  /* ---------- 共有 ---------- */
  async function share(key, btn) {
    const s = byKey.get(key); if (!s) return;
    const url = new URL(songHref(s), location.href).href;
    try {
      if (navigator.share) { await navigator.share({ title: `${s.title} — Toyo`, url }); return; }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        if (btn) { const t = btn.textContent; btn.textContent = 'リンクをコピーしました'; setTimeout(() => (btn.textContent = t), 1800); }
        announce('リンクをコピーしました');
        return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    prompt('この曲のリンク:', url);
  }

  /* ---------- 曲の詳細シート（トップページ） ---------- */
  const sheet = $('#sheet'), sheetInner = $('#sheetInner');
  let popGuard = false, lastFocus = null;
  function motionCover(s, preload = 'metadata') {
    return MEDIA.covers && MEDIA.covers[s.key] && !reduce && !saveData && !motionOff
      ? `<video src="${ROOT}media/cover-${s.key}.mp4" muted playsinline loop autoplay preload="${preload}" poster="${ROOT}media/cover-${s.key}.webp" aria-hidden="true" tabindex="-1"></video>` : '';
  }
  function openSheet(key, fromHash) {
    const s = byKey.get(key); if (!s) return;
    if (!sheet || typeof sheet.showModal !== 'function') { location.href = songHref(s); return; }
    const scenes = sceneNames(s);
    sheetInner.innerHTML = `
      <button class="sheet-close" type="button" data-close aria-label="閉じる">×</button>
      <div class="sheet-body">
        <div class="sheet-art">${imgTag(s, 1280, `alt="${esc(s.title)} のジャケット"`).replace('alt="" ', '')}${motionCover(s, 'auto')}</div>
        <div>
          ${s.isNew ? '<p class="kicker">NEW</p>' : ''}
          <h2 class="sheet-title" id="sheetTitle">${esc(s.title)}</h2>
          <p class="sheet-meta">${esc(moodOf(s))}${scenes.length ? ' · ' + esc(scenes.join(' / ')) : ''}</p>
          ${s.line ? `<p class="sheet-line">${esc(s.line)}</p>` : ''}
          <div class="sheet-row">${playBtn(s, 'sheet')}${svcMain(s, 'sheet')}</div>
          <div class="sheet-others" data-others="${s.key}" data-loc="sheet">${svcOthers(s, 'sheet')}</div>
          ${waiting(s) ? `<div class="sheet-row"><a class="svc" data-follow="spotify" data-loc="sheet" href="${ARTIST_LINKS.spotify}" target="_blank" rel="noopener"><span class="dot spotify"></span>Spotify でフォローして待つ</a></div>` : ''}
          <details class="lyrics" data-lyrics="${s.key}"><summary>歌詞</summary><pre>読み込み中…</pre></details>
          <div class="sheet-links"><a class="text-link" href="${songHref(s)}">この曲のページ</a><button class="text-link" type="button" data-share="${s.key}">共有する</button></div>
        </div>
      </div>`;
    sheet.setAttribute('aria-labelledby', 'sheetTitle');
    wireImgs(sheetInner);
    syncPlay();
    if (!sheet.open) {
      lastFocus = document.activeElement;
      sheet.showModal();
      if (fromHash) history.replaceState({ sheet: key }, '', '#song=' + key);
      else history.pushState({ sheet: key }, '', '#song=' + key);   // アドレスバーの URL でもこの曲を共有できる
    } else history.replaceState({ sheet: key }, '', '#song=' + key);
    sheetInner.scrollTop = 0; sheet.scrollTop = 0;
    dl({ event: 'song_view', song_title: s.title, song_key: s.key, location: 'sheet' });
  }
  if (sheet) {
    sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener('close', () => {
      $$('video', sheet).forEach(v => v.pause());
      if (history.state && history.state.sheet) { popGuard = true; history.back(); }
      else if (location.hash.startsWith('#song=')) history.replaceState(null, '', location.pathname + location.search);
      const back = lastFocus; lastFocus = null;   // 「戻る」の処理が済んでから、開く前の場所へフォーカスを戻す
      if (back && document.contains(back)) setTimeout(() => back.focus({ preventScroll: true }), 60);
    });
    addEventListener('popstate', () => { if (popGuard) { popGuard = false; return; } if (sheet.open) sheet.close(); });
    sheet.addEventListener('toggle', e => {
      const d = e.target.closest && e.target.closest('details.lyrics');
      if (!d || !d.open) return;
      const k = d.dataset.lyrics, s = byKey.get(k), pre = $('pre', d);
      ensureLyrics().then(ok => {
        if (ok && typeof LYRICS !== 'undefined' && LYRICS[k]) pre.textContent = LYRICS[k];
        else if (ok) pre.textContent = '歌詞は準備中です。';
        else pre.innerHTML = `歌詞を読み込めませんでした。通信を確かめて、もう一度開いてください。<br><a class="text-link" href="${songHref(s)}">この曲のページで読む</a>`;
      });
      dl({ event: 'lyric_view', song_title: s ? s.title : '', song_key: k });
    }, true);
  }

  /* ---------- クリックの受け口（まとめて1か所） ---------- */
  let railMoved = false;
  const modified = e => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0;
  document.addEventListener('click', e => {
    const t = e.target;
    const pb = t.closest('[data-play]');
    if (pb) {
      e.preventDefault();
      const loc = pb.dataset.loc || '';
      startQueue(listFor(loc), pb.dataset.play, loc);
      if (loc === 'hero') dl({ event: 'hero_cta', cta: 'now_play' });
      return;
    }
    const sv = t.closest('[data-svc]');
    if (sv) {
      const k = sv.dataset.svc, s = byKey.get(sv.dataset.key || '');
      store.set(PREF, k);
      dl({ event: 'platform_click', song_title: s ? s.title : '', song_key: s ? s.key : '', platform: k, location: sv.dataset.loc || '' });
      setTimeout(refreshSvc, 0);
      return;
    }
    const fb = t.closest('[data-follow]');
    if (fb) { dl({ event: 'follow_click', platform: fb.dataset.follow, location: fb.dataset.loc || 'follow' }); return; }
    if (t.closest('[data-close]')) { sheet && sheet.close(); return; }
    const sh = t.closest('[data-share]');
    if (sh) { share(sh.dataset.share, sh); return; }
    if (PAGE !== 'home') return;
    const op = t.closest('[data-open]');
    if (!op) return;
    if (body.classList.contains('editing')) { e.preventDefault(); return; }   // 並べ替え中は開かない
    if (modified(e)) return;                                                     // ⌘/Ctrl クリックは曲ページを新しいタブで
    e.preventDefault();
    if (op.closest('.rail') && railMoved) return;                                // 帯をドラッグした直後の誤クリック
    openSheet(op.dataset.open);
  });

  /* ---------- ナビ（ヒーローを過ぎたら背景を付ける） ---------- */
  const bar = $('#bar'), hero = $('#top');
  if (bar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => bar.classList.toggle('is-solid', !en.isIntersecting), { rootMargin: '-64px 0px 0px 0px' }).observe(hero);
  } else if (bar) bar.classList.add('is-solid');

  // ページ内リンクはなめらかに（ネイティブのスクロール）
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const el = document.querySelector(id); if (!el) return;
    e.preventDefault(); el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!el.matches('a,button,input,[tabindex]')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }));
  const barFollow = $('#barFollow'); if (barFollow) { barFollow.dataset.follow = 'spotify'; barFollow.dataset.loc = 'nav'; }

  /* ================= 曲ページ ================= */
  if (PAGE === 'song') {
    const s = byKey.get(body.dataset.key);
    if (s) {
      lists.song = [s, ...$$('[data-related]').map(el => byKey.get(el.dataset.related)).filter(Boolean)];
      lists.all = lists.song;
      refreshSvc();
      const sa = $('.song-art');
      if (sa && !$('video', sa)) { sa.insertAdjacentHTML('beforeend', motionCover(s, 'auto')); watchVideo($('video', sa)); }
      dl({ event: 'song_view', song_title: s.title, song_key: s.key, location: 'song_page' });
    }
    wireImgs();
    syncPlay();
    return;
  }
  if (PAGE !== 'home') { wireImgs(); return; }

  /* ================= トップページ ================= */
  const featured = SONGS.find(s => s.featured) || SONGS[0];

  // 並び: songs.js の順（色合いバランスで計算済み・注目曲は一覧の最後）。
  // Supabase の公開順（最後に取れた分を端末に覚えておく）が songs.js の並びより新しければ最初からそれで描く。
  // 編集モードの一時保存は ?edit の時だけ使う（編集した端末だけ並びが違って見える事故を防ぐ）
  const ORDER_KEY = 'toyo_grid_order_v2', PUB_KEY = 'toyo_pub_order';
  let order = SONGS.filter(s => s !== featured);
  const sortBy = keys => { const rank = k => { const i = keys.indexOf(k); return i === -1 ? 9999 : i; }; order.sort((a, b) => rank(a.key) - rank(b.key)); };
  const newerThanSongs = at => !(typeof ORDER_SET_AT !== 'undefined' && at && new Date(at) < new Date(ORDER_SET_AT));
  let pubCached = null;
  try { pubCached = JSON.parse(store.get(PUB_KEY) || 'null'); } catch (e) {}
  if (pubCached && Array.isArray(pubCached.keys) && newerThanSongs(pubCached.at)) sortBy(pubCached.keys);
  if (EDIT) {
    try { const saved = JSON.parse(store.get(ORDER_KEY) || 'null'); if (Array.isArray(saved) && saved.length) sortBy(saved); } catch (e) {}
  }
  const allSongs = () => [...order, featured];

  /* ---- ヒーロー: 時刻・映像・いまの1曲 ---- */
  const clock = $('#heroClock');
  const tick = () => {
    if (!clock) return;
    const d = new Date();
    clock.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}  ${MOMENT.toUpperCase()}`;
  };
  tick(); setInterval(tick, 20000);

  const heroMedia = $('#heroMedia'), heroVideo = $('#heroVideo'), heroMotion = $('#heroMotion');
  const hv = MEDIA.hero && MEDIA.hero[MOMENT];
  const anyMotion = !reduce && !saveData && (hv || Object.keys(MEDIA.covers || {}).length);
  const setMotion = off => {                                  // 「映像の動きを止める」= ヒーローも動くジャケも全部（端末に覚える）
    motionOff = off;
    try { off ? localStorage.setItem('toyo_motion_off', '1') : localStorage.removeItem('toyo_motion_off'); } catch (e) {}
    if (heroMotion) heroMotion.setAttribute('aria-pressed', off ? 'true' : 'false');
    $$('video').forEach(v => {
      if (off) { v.dataset.userPaused = '1'; v.pause(); }
      else { delete v.dataset.userPaused; v.play().catch(() => {}); }
    });
    if (!off && heroVideo && hv && !heroVideo.src) startHero();
  };
  const startHero = () => {
    const portrait = matchMedia('(max-aspect-ratio: 4/5)').matches;
    heroVideo.src = `${ROOT}media/hero-${MOMENT}-${portrait && hv.port !== false ? 'port' : 'land'}.mp4`;
    heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-on'), { once: true });
    heroVideo.play().catch(() => {});
    watchVideo(heroVideo);
  };
  if (heroMedia) {
    if (!hv) heroMedia.style.backgroundImage = `url(${art(featured, 1280)})`;   // 映像が無い時間帯は注目曲のジャケ（静止画は CSS が先に出す）
    if (hv && heroVideo && !reduce && !saveData && !motionOff) startHero();
    if (heroMotion && anyMotion) {
      heroMotion.hidden = false;
      heroMotion.setAttribute('aria-pressed', motionOff ? 'true' : 'false');
      heroMotion.addEventListener('click', () => setMotion(heroMotion.getAttribute('aria-pressed') !== 'true'));
    }
  }

  const nowPool = () => {
    const live = allSongs().filter(s => canPreview(s) && !waiting(s));
    const fit = live.filter(s => (s.time || []).includes(MOMENT));
    return fit.length ? fit : live.length ? live : allSongs().filter(canPreview);
  };
  const dayIndex = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  let nowSkip = 0;
  function renderNow() {
    const el = $('#now'); if (!el) return;
    const pool = nowPool(); if (!pool.length) { el.hidden = true; return; }
    const s = pool[(dayIndex + nowSkip) % pool.length];
    lists.hero = [s, ...pool.filter(x => x !== s)];
    el.innerHTML = `
      <img class="now-art" src="${art(s, 240)}" alt="" width="64" height="64">
      <div class="now-text">
        <div class="now-label">いまの時間（${MOMENT_JA[MOMENT]}）に合う1曲</div>
        <a class="now-title" href="${songHref(s)}" data-open="${s.key}">${esc(s.title)}</a>
        ${pool.length > 1 ? '<button class="now-shuffle" type="button" data-now-next>ほかの曲</button>' : ''}
      </div>
      <div class="now-actions">${playBtn(s, 'hero')}</div>`;
    syncPlay();
  }
  renderNow();
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-now-next]')) return;
    nowSkip++; renderNow();
    const b = $('[data-now-next]'); b && b.focus({ preventScroll: true });
  });

  /* ---- まずはこの3曲 ---- */
  const picksEl = $('#picks');
  function renderPicks() {
    if (!picksEl) return;
    let picks = SONGS.filter(s => s.pick).sort((a, b) => a.pick - b.pick).slice(0, 3);
    if (!picks.length) picks = [featured, ...order].slice(0, 3);
    lists.pick = picks;
    picksEl.innerHTML = picks.map((s, i) => `
      <article class="pick reveal" data-key="${s.key}">
        <a class="pick-open" href="${songHref(s)}" data-open="${s.key}" aria-label="${esc(s.title)} の詳細">
          <span class="pick-art">${imgTag(s, 640, '', '(max-width:760px) 78vw, 400px')}${motionCover(s)}</span>
        </a>
        <div class="pick-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
        <h3 class="pick-title"><a href="${songHref(s)}" data-open="${s.key}">${esc(s.title)}</a></h3>
        <p class="pick-meta">${esc(moodOf(s))}</p>
        ${s.line ? `<p class="pick-line">${esc(s.line)}</p>` : ''}
        <div class="pick-actions">${playBtn(s, 'pick')}${svcMain(s, 'pick')}</div>
      </article>`).join('');
    wireImgs(picksEl);
    $$('.pick-art video', picksEl).forEach(watchVideo);
  }
  renderPicks();

  /* ---- 全曲（グリッド/リスト・シーンで絞り込み） ---- */
  const catalog = $('#catalog'), chips = $('#chips');
  const state = { scene: 'all', view: store.get('toyo_view') === 'list' ? 'list' : 'grid' };
  const cardHTML = (s, loc) => `
    <article class="card" data-key="${s.key}">
      <div class="card-art-wrap">
        <a class="card-open" href="${songHref(s)}" data-open="${s.key}" aria-label="${esc(s.title)} の詳細">
          <span class="card-art">${lazyImg(s, state.view === 'list' ? '56px' : GRID_SIZES)}${s.isNew ? '<span class="badge">NEW</span>' : ''}</span>
        </a>
        ${playBtn(s, loc)}
      </div>
      <a class="card-text" href="${songHref(s)}" data-open="${s.key}" tabindex="-1"><span class="card-title">${esc(s.title)}</span><span class="card-mood">${esc(moodOf(s))}</span></a>
    </article>`;
  const seen = new Set();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const k = en.target.dataset.key; if (!k || seen.has(k)) return;
    seen.add(k); io.unobserve(en.target);
    const s = byKey.get(k); dl({ event: 'song_view', song_title: s ? s.title : '', song_key: k, location: 'grid' });
  }), { threshold: 0.5 }) : null;

  function renderChips() {
    if (!chips) return;
    const keys = Object.keys(SCN);
    chips.innerHTML = [`<button class="chip" type="button" data-chip="all" aria-pressed="${state.scene === 'all'}">すべて</button>`]
      .concat(keys.map(k => `<button class="chip" type="button" data-chip="${k}" aria-pressed="${state.scene === k}">${esc(SCN[k].ja)}</button>`)).join('');
    const act = chips.querySelector('[aria-pressed="true"]');
    if (act && state.scene !== 'all') chips.scrollLeft = Math.max(0, act.offsetLeft - chips.offsetLeft - 16);   // 縦には動かさない
  }
  function renderCatalog() {
    if (!catalog) return;
    const list = allSongs().filter(s => state.scene === 'all' || (s.scene || []).includes(state.scene));
    lists.grid = list; lists.all = list;
    catalog.dataset.view = state.view;
    catalog.innerHTML = list.map(s => cardHTML(s, 'grid')).join('');
    const c = $('#allCount'); if (c) c.textContent = list.length;
    $$('.view-switch [data-view]').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === state.view));
    deferImgs(catalog);
    wireImgs(catalog);
    if (io) $$('.card', catalog).forEach(el => io.observe(el));
    syncPlay();
  }
  function setScene(k, fromTile) {
    state.scene = SCN[k] ? k : 'all';
    const hadFocus = chips && chips.contains(document.activeElement);
    renderChips(); renderCatalog();
    const chosen = chips && chips.querySelector(`[data-chip="${state.scene}"]`);
    if (chosen && (hadFocus || fromTile)) chosen.focus({ preventScroll: true });   // 作り直しでフォーカスが消えないように
    $$('[data-scene]').forEach(b => b.setAttribute('aria-pressed', b.dataset.scene === state.scene));
    if (state.scene !== 'all') dl({ event: 'scene_select', scene: state.scene, location: fromTile ? 'tiles' : 'chips' });
  }
  renderChips(); renderCatalog();
  document.addEventListener('click', e => {
    const ch = e.target.closest('[data-chip]');
    if (ch) { setScene(ch.dataset.chip, false); return; }
    const vw = e.target.closest('.view-switch [data-view]');
    if (vw) { state.view = vw.dataset.view; store.set('toyo_view', state.view); renderCatalog(); return; }
    const pa = e.target.closest('[data-playall]');
    if (pa) { const l = (lists.grid || []).filter(canPreview); if (l.length) startQueue(l, l[0].key, 'playall'); return; }
    const sc = e.target.closest('[data-scene]');
    if (sc) {
      setScene(sc.dataset.scene, true);
      const m = $('#music'); m && m.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  });

  /* ---- シーンで選ぶ ---- */
  const sceneGrid = $('#sceneGrid');
  if (sceneGrid) {
    const keys = Object.keys(SCN);
    if (!keys.length) { const sec = $('#scenes'); sec && (sec.hidden = true); }
    sceneGrid.innerHTML = keys.map(k => {
      const list = allSongs().filter(s => (s.scene || []).includes(k));
      const covers = list.filter(s => !s.isNew).slice(0, 3).concat(list.filter(s => s.isNew)).slice(0, 3);
      return `<button class="scene reveal" type="button" data-scene="${k}" aria-pressed="false">
          <span class="scene-covers" aria-hidden="true">${covers.map(s => imgTag(s, 240)).join('')}</span>
          <span class="scene-name">${esc(SCN[k].ja)}</span>
          <span class="scene-meta"><span class="en">${esc(SCN[k].en || k.toUpperCase())}</span><span>${list.length}曲</span></span>
        </button>`;
    }).join('');
    wireImgs(sceneGrid);
  }

  /* ---- 新曲（ゆっくり流れる帯・止められる・画面外では止まる） ---- */
  const newSec = $('#new'), rail = $('#rail'), railTrack = $('#railTrack'), railToggle = $('#railToggle');
  const newSongs = () => order.filter(s => s.isNew);
  let rebuildRail = null;
  if (rail && railTrack) {
    if (!newSongs().length) newSec && (newSec.hidden = true);
    const railCard = (s, dup) => `<a class="rail-card" href="${songHref(s)}" data-open="${s.key}"${dup ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="${esc(s.title)} の詳細"`}>
        <span class="art"><img data-src="${art(s, 640)}" data-srcset="${srcset(s)}" sizes="(max-width:760px) 150px, 210px" alt="" decoding="async" onerror="this.onerror=null;this.removeAttribute('srcset');this.src='${artJpg(s)}'"><span class="badge">NEW</span></span>
        <span class="t">${esc(s.title)}</span><span class="m">${esc(moodOf(s))}</span></a>`;
    let half = 0, paused = reduce, hold = false, pos = 0, visible = false, rafOn = false, railActive = false, written = -1, touching = false, resume;
    const measure = () => { half = railTrack.scrollWidth / 2; kick(); };
    const lazyRail = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; const im = en.target; lazyRail.unobserve(im);
      if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.src = im.dataset.src; im.removeAttribute('data-src'); wireImgs(im.parentNode);
    }), { root: rail, rootMargin: '0px 400px' }) : null;
    const activate = () => {
      railActive = true;
      $$('img[data-src]', railTrack).forEach(im => { if (lazyRail) lazyRail.observe(im); else { if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.src = im.dataset.src; } });
    };
    const build = songs => {
      lists.rail = songs;
      const n = $('#newCount'); if (n) n.textContent = songs.length;
      railTrack.innerHTML = songs.map(s => railCard(s, false)).join('') + songs.map(s => railCard(s, true)).join('');
      measure(); if (railActive) activate();
    };
    // iOS は scrollLeft を整数に丸めるので、小数の位置を別に持って整数で書く（2026-06-17 の修正を継承）
    // 見えていて・止めていない時だけ毎フレーム動かす（それ以外はフレームの予約自体をしない）
    const railTick = () => {
      if (!(half && visible && !paused)) { rafOn = false; return; }
      if (!hold && !down) { pos += 0.45; if (pos >= half) pos -= half; written = Math.round(pos); rail.scrollLeft = written; }
      requestAnimationFrame(railTick);
    };
    const kick = () => { if (!rafOn && half && visible && !paused) { rafOn = true; requestAnimationFrame(railTick); } };
    const setPaused = p => {
      paused = p;
      if (railToggle) railToggle.setAttribute('aria-pressed', p ? 'true' : 'false');
      if (!p) { pos = rail.scrollLeft; kick(); }
    };
    let down = false, sx = 0, sl = 0;
    build(newSongs());
    rebuildRail = () => build(newSongs());
    addEventListener('load', measure); addEventListener('resize', measure);
    setPaused(paused);
    railToggle && railToggle.addEventListener('click', () => setPaused(!paused));
    rail.addEventListener('mouseenter', () => (hold = true));
    rail.addEventListener('mouseleave', () => { hold = false; down = false; rail.classList.remove('dragging'); });
    rail.addEventListener('focusin', () => (hold = true));
    rail.addEventListener('focusout', () => (hold = false));
    const release = () => { clearTimeout(resume); resume = setTimeout(() => { if (!touching) hold = false; }, 1800); };
    rail.addEventListener('touchstart', () => { touching = true; hold = true; clearTimeout(resume); }, { passive: true });
    rail.addEventListener('touchend', () => { touching = false; release(); }, { passive: true });
    rail.addEventListener('touchcancel', () => { touching = false; release(); }, { passive: true });
    rail.addEventListener('wheel', () => { hold = true; release(); }, { passive: true });
    rail.addEventListener('scroll', () => { if (rail.scrollLeft !== written) { pos = rail.scrollLeft; hold = true; release(); } }, { passive: true });
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; railMoved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('dragging'); });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) railMoved = true; rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('dragging'); setTimeout(() => (railMoved = false), 0); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => {
      visible = en.isIntersecting; if (visible && !railActive) activate(); if (visible) { pos = rail.scrollLeft; kick(); }
    }, { rootMargin: '600px 0px' }).observe(rail);
    else { visible = true; activate(); kick(); }
  }

  ['picks', 'chips', 'rail'].forEach(id => { const box = $('#' + id); box && box.addEventListener('focusin', e => { if (e.target !== box) e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }); });

  /* ---- URL が #song=<key> ならその曲のシートを開く（共有されたリンクから来た人） ---- */
  const hashKey = (location.hash.match(/^#song=([a-z0-9]+)$/) || [])[1];
  if (hashKey && byKey.has(hashKey)) openSheet(hashKey, true);

  /* ---- 公開並び順（Supabase・編集モードの「全公開する」）。songs.js の並び（ORDER_SET_AT）より新しい時だけ使う ---- */
  const SB_URL = 'https://lvminivpfztbvaepjqlz.supabase.co';
  const SB_KEY = 'sb_publishable_9DdJC8RwquEvqlgsQuriug_0ypS2exk';   // 公開して安全な読み取り用キー（書き込みは合言葉が必要）
  (async function applyPublishedOrder() {
    let rows;
    try {
      const res = await fetch(`${SB_URL}/rest/v1/grid_order?id=eq.1&select=order_keys,updated_at`, { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
      if (!res.ok) return; rows = await res.json();
    } catch (e) { return; }
    const row = rows && rows[0]; const keys = row && row.order_keys;
    if (!Array.isArray(keys) || !keys.length || !newerThanSongs(row.updated_at)) { store.del(PUB_KEY); return; }
    const same = pubCached && JSON.stringify(pubCached.keys) === JSON.stringify(keys);
    store.set(PUB_KEY, JSON.stringify({ keys, at: row.updated_at }));
    if (same || EDIT) return;                     // 最初から同じ並びで描いている＝描き直さない（並びの入れ替わり・画像の点滅を防ぐ）
    sortBy(keys);
    renderCatalog(); rebuildRail && rebuildRail();
  })();

  /* ---- 並び替え編集（秘密URL ?edit=toyomaru-king のときだけ） ---- */
  if (EDIT) {
    body.classList.add('editing');
    state.scene = 'all'; state.view = 'grid'; renderChips(); renderCatalog();
    const bar2 = $('#editBar'); if (bar2) bar2.hidden = false;
    const sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js';
    sc.onload = () => Sortable.create(catalog, {
      animation: 180, ghostClass: 'sortable-ghost', filter: '.card:last-child',
      onEnd: () => store.set(ORDER_KEY, JSON.stringify($$('.card', catalog).map(c => c.dataset.key).filter(k => k !== featured.key))),
    });
    document.head.appendChild(sc);
    const keysNow = () => $$('.card', catalog).map(c => c.dataset.key).filter(k => k !== featured.key);
    const copyBtn = $('#ebCopy'), resetBtn = $('#ebReset'), publishBtn = $('#ebPublish');
    copyBtn && copyBtn.addEventListener('click', async () => {
      const text = JSON.stringify(keysNow());
      try { await navigator.clipboard.writeText(text); copyBtn.textContent = 'コピーしました ✓'; }
      catch (e) { prompt('この順番をコピーして送ってください:', text); }
      setTimeout(() => (copyBtn.textContent = '順番をコピー'), 1800);
    });
    resetBtn && resetBtn.addEventListener('click', () => { store.del(ORDER_KEY); location.reload(); });
    publishBtn && publishBtn.addEventListener('click', async () => {
      const pass = prompt('全公開用の合言葉を入力（この順番が全員の画面に反映されます）:');
      if (!pass) return;
      publishBtn.disabled = true; publishBtn.textContent = '公開中…';
      try {
        const res = await fetch(`${SB_URL}/rest/v1/rpc/publish_order`, {
          method: 'POST',
          headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_order: keysNow(), p_pass: pass }),
        });
        if (res.ok) { publishBtn.textContent = '全公開しました ✓'; store.del(ORDER_KEY); }
        else {
          let msg = ''; try { msg = (await res.json()).message || ''; } catch (e) {}
          publishBtn.textContent = /unauthorized/i.test(msg) ? '合言葉が違います' : '公開に失敗';
        }
      } catch (e) { publishBtn.textContent = 'ネットワークエラー'; }
      finally { setTimeout(() => { publishBtn.disabled = false; publishBtn.textContent = '全公開する'; }, 2200); }
    });
  }

  wireImgs();
})();
