(() => {
  'use strict';

  const P = window.PORTFOLIO || {};
  const DIR = 'thumbnails/';
  // category accepts an array ["Horror", "Gaming"] or a comma-separated string "Horror, Gaming"
  const toList = v => (Array.isArray(v) ? v : String(v || '').split(','))
    .map(s => String(s).trim()).filter(Boolean);
  const items = (window.THUMBNAILS || [])
    .filter(t => t && t.file)
    .map((t, i) => {
      const cats = [...new Set(toList(t.categories || t.category))];
      return {
        i,
        src: DIR + encodeURIComponent(t.file),
        title: t.title || t.file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
        cats: cats.length ? cats : ['Inne'],
        channelName: String(t.channel || '').trim(),
        channelUrl: t.channelUrl || '',
        channel: String(t.channel || '').trim() || P.name || 'Nazwa kanału',
        featured: !!t.featured,
        client: !!t.client,
      };
    });
  // works are concepts (made for fun / practice) unless marked client: true
  const channelHtml = t => {
    const badge = t.client ? '' : '<span class="tag mono tag--concept">Koncept</span>';
    if (!t.channelName) return badge;
    const name = t.channelUrl
      ? `<a class="ch-link" href="${esc(t.channelUrl)}" target="_blank" rel="noopener">${esc(t.channelName)}</a>`
      : `<span class="ch-link">${esc(t.channelName)}</span>`;
    return badge + name;
  };

  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const EASE_IN = 'cubic-bezier(.5,0,.75,0)';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arrow = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';

  /* ---------- Config ---------- */
  $$('[data-p]').forEach(n => { if (P[n.dataset.p]) n.textContent = P[n.dataset.p]; });
  if (P.name) document.title = `${P.name} — Miniatury YouTube`;
  if (P.available === false) $$('[data-available]').forEach(n => n.remove());
  $$('[data-works]').forEach(n => (n.textContent = pad(items.length)));
  $$('[data-year]').forEach(n => (n.textContent = new Date().getFullYear()));
  $$('[data-tools]').forEach(n => (n.textContent = (P.tools || []).join(' · ')));
  $$('[data-socials]').forEach(ul => {
    ul.innerHTML = (P.socials || []).map(s =>
      `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}${arrow}</a></li>`).join('');
  });
  $$('[data-mail-plain]').forEach(a => {
    if (!P.email) return;
    a.href = 'mailto:' + P.email;
    a.textContent = P.email;
  });
  $$('[data-mail]').forEach(a => {
    const mail = P.email || a.textContent.trim();
    a.href = 'mailto:' + mail;
    a.setAttribute('aria-label', mail);
    a.innerHTML = `<span class="roll" aria-hidden="true">${[...mail].map((c, i) =>
      `<span class="ch" style="--i:${i}" data-c="${esc(c)}">${esc(c)}</span>`).join('')}</span>`;
  });

  /* ---------- Grid ---------- */
  const grid = $('.grid');
  grid.innerHTML = items.map((t, n) => `
    <article class="card${t.featured ? ' is-featured' : ''}" data-i="${t.i}">
      <button class="card__media" data-open="${t.i}" data-cursor="Zobacz" aria-label="Otwórz: ${esc(t.title)}">
        <img src="${esc(t.src)}" alt="${esc(t.title)}" loading="${n < 3 ? 'eager' : 'lazy'}" decoding="async">
      </button>
      <div class="card__info">
        <span class="mono card__no">${pad(n + 1)}</span>
        <div class="card__body">
          <h3 class="card__title">${esc(t.title)}</h3>
          <p class="card__meta">${channelHtml(t)}<span class="card__tags">${t.cats.map(c => `<span class="tag mono">${esc(c)}</span>`).join('')}</span></p>
        </div>
      </div>
    </article>`).join('');

  // stagger cards that enter the viewport together
  const io = new IntersectionObserver(entries => {
    let k = 0;
    entries.filter(e => e.isIntersecting).forEach(e => {
      e.target.style.setProperty('--d', (k++ * 0.12) + 's');
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.card, [data-reveal]').forEach(n => io.observe(n));

  /* ---------- Filters ---------- */
  const filters = $('.filters');
  const pill = $('.filters__pill');
  // one filter per category, most used first
  const catCount = new Map();
  items.forEach(t => t.cats.forEach(c => catCount.set(c, (catCount.get(c) || 0) + 1)));
  const cats = [...catCount.keys()].sort((a, b) => catCount.get(b) - catCount.get(a));
  const mkFilter = (cat, label, count) =>
    `<button class="filter" data-filter="${esc(cat)}" aria-pressed="false">${esc(label)}<sup>${pad(count)}</sup></button>`;
  filters.insertAdjacentHTML('beforeend',
    mkFilter('*', 'Wszystkie', items.length) +
    cats.map(c => mkFilter(c, c, catCount.get(c))).join(''));
  if (cats.length < 2) $('.filters-wrap').classList.add('is-single');

  let activeFilter = '*';
  let filterToken = 0;
  const movePill = () => {
    const b = $(`.filter.is-active`, filters);
    if (!b) return;
    pill.style.width = b.offsetWidth + 'px';
    pill.style.height = b.offsetHeight + 'px';
    pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
  };
  const markActive = cat => $$('.filter', filters).forEach(b => {
    const on = b.dataset.filter === cat;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', on);
  });
  markActive('*');
  pill.style.transition = 'none';
  movePill();
  requestAnimationFrame(() => (pill.style.transition = ''));

  /* ---------- Pagination ("Pokaż więcej") ---------- */
  const PAGE = 9;
  let limit = PAGE;
  const moreWrap = $('.more');
  const moreBtn = $('.more__btn');
  const matches = c => activeFilter === '*' || items[+c.dataset.i].cats.includes(activeFilter);
  const targetSet = () => new Set($$('.card', grid).filter(matches).slice(0, limit));
  const syncMore = () => {
    const total = $$('.card', grid).filter(matches).length;
    const left = total - Math.min(limit, total);
    moreWrap.hidden = left <= 0;
    $('.more__count', moreWrap).textContent = `${Math.min(limit, total)} / ${total}`;
    moreBtn.querySelector('span').textContent = `Pokaż więcej (${Math.min(left, PAGE)})`;
  };
  // initial state: only the first page is rendered visible
  { const s = targetSet(); $$('.card', grid).forEach(c => (c.hidden = !s.has(c))); syncMore(); }

  const update = async () => {
    const token = ++filterToken;
    const cards = $$('.card', grid);
    const want = targetSet();

    const leaving = cards.filter(c => !c.hidden && !want.has(c));
    if (!reduce && leaving.length) {
      // timeout guard: background tabs may never finish the animation
      await Promise.race([
        Promise.all(leaving.map(c => c.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-12px) scale(.97)' }],
          { duration: 320, easing: EASE_IN, fill: 'forwards' }).finished.catch(() => {}))),
        new Promise(r => setTimeout(r, 420)),
      ]);
      if (token !== filterToken) return;
    }

    const first = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
    const wasShown = new Map(cards.map(c => [c, !c.hidden]));
    cards.forEach(c => { c.getAnimations().forEach(a => a.cancel()); c.hidden = !want.has(c); });
    syncMore();

    let k = 0;
    cards.forEach(c => {
      if (c.hidden) return;
      c.style.setProperty('--d', '0s');
      c.classList.add('is-in');
      if (reduce) return;
      if (!wasShown.get(c)) {
        c.animate([{ opacity: 0, transform: 'translateY(48px)' }, { opacity: 1, transform: 'none' }],
          { duration: 1000, easing: EASE, delay: 60 * k++, fill: 'backwards' });
        return;
      }
      const f = first.get(c), l = c.getBoundingClientRect();
      const dx = f.left - l.left, dy = f.top - l.top, sx = f.width / l.width;
      if (dx || dy || Math.abs(sx - 1) > .01) {
        c.style.transformOrigin = '0 0';
        c.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx})` }, { transform: 'none' }],
          { duration: 1000, easing: EASE });
      }
    });
  };

  filters.addEventListener('click', e => {
    const b = e.target.closest('.filter');
    if (!b || b.dataset.filter === activeFilter) return;
    activeFilter = b.dataset.filter;
    limit = PAGE;
    markActive(activeFilter);
    movePill();
    b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    update();
  });
  moreBtn.addEventListener('click', () => { limit += PAGE; update(); });

  /* ---------- Hero showcase (latest works, auto-rotating) ---------- */
  (() => {
    const show = $('.show');
    const latest = items.slice(0, 5);
    if (!show || !latest.length) { if (show) show.remove(); return; }
    const stack = $('.show__stack', show);
    const titleEl = $('.show__title', show);
    const noEl = $('.show__no', show);
    const bar = $('.show__bar i', show);
    const DUR = 3600;
    stack.innerHTML = latest.map((t, k) =>
      `<button class="show__card" data-open="${t.i}" data-all data-cursor="Zobacz" aria-label="Otwórz: ${esc(t.title)}"${k ? ' tabindex="-1"' : ''}><img src="${esc(t.src)}" alt="" decoding="async"></button>`).join('');
    const cards = $$('.show__card', stack);
    let order = cards.map((_, k) => k);
    const paint = () => cards.forEach((c, k) => {
      const pos = order.indexOf(k);
      c.classList.remove('p0', 'p1', 'p2', 'wait');
      if (!c.classList.contains('out')) c.classList.add(pos < 3 ? 'p' + pos : 'wait');
      c.tabIndex = pos === 0 ? 0 : -1;
    });
    const caption = () => {
      const t = latest[order[0]];
      noEl.textContent = pad(order[0] + 1);
      titleEl.textContent = t.title;
    };
    paint(); caption();
    if (latest.length < 2) { $('.show__bar', show).remove(); return; }

    let anim = null;
    const next = () => {
      const leaving = cards[order[0]];
      order.push(order.shift());
      leaving.classList.add('out');
      leaving.classList.remove('p0');
      paint();
      titleEl.classList.add('is-swap');
      setTimeout(() => { caption(); titleEl.classList.remove('is-swap'); }, 350);
      setTimeout(() => { leaving.classList.remove('out'); paint(); }, 900);
      run();
    };
    const run = () => {
      if (reduce) return;
      anim = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: DUR, easing: 'linear' });
      anim.onfinish = next;
    };
    show.addEventListener('pointerenter', () => anim && anim.pause());
    show.addEventListener('pointerleave', () => anim && anim.play());
    document.addEventListener('visibilitychange', () => anim && (document.hidden ? anim.pause() : anim.play()));
    // start once the intro is done
    setTimeout(run, 1200);
  })();

  /* ---------- Stats (auto from data + real numbers from config) ---------- */
  (() => {
    const box = $('[data-stats]');
    if (!box) return;
    const allCats = new Set(items.flatMap(t => t.cats).filter(c => c !== 'Inne'));
    // only count channels from real orders (client: true)
    const clients = new Set(items.filter(t => t.client).map(t => t.channelName.toLowerCase()).filter(Boolean));
    const stats = [
      { value: String(items.length), label: 'miniatur w portfolio' },
      clients.size ? { value: String(clients.size), label: clients.size === 1 ? 'kanał-klient' : 'kanałów-klientów' } : null,
      allCats.size ? { value: String(allCats.size), label: 'nisz i kategorii' } : null,
      ...(P.stats || []).filter(s => s && String(s.value || '').trim()),
    ].filter(Boolean);
    if (!stats.length) return box.remove();
    // split "12 mln+" into a countable number and its suffix
    box.innerHTML = stats.map(s => {
      const m = String(s.value).trim().match(/^(\d+(?:[.,]\d+)?)(.*)$/);
      const num = m ? m[1] : '';
      const rest = m ? m[2] : String(s.value);
      return `<div class="stat" data-reveal><span class="stat__value"><span data-count="${esc(num)}">${esc(num)}</span>${rest ? `<b>${esc(rest)}</b>` : ''}</span><span class="stat__label mono">${esc(s.label)}</span></div>`;
    }).join('');
    $$('.stat', box).forEach((n, k) => { n.style.setProperty('--d', k * 0.08 + 's'); io.observe(n); });
    if (reduce) return;
    const counter = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      counter.unobserve(e.target);
      const el = e.target, raw = el.dataset.count, dec = raw.includes(',') ? ',' : '.';
      const target = parseFloat(raw.replace(',', '.'));
      const digits = (raw.split(/[.,]/)[1] || '').length;
      if (!isFinite(target)) return;
      const t0 = performance.now(), D = 1400;
      const tick = t => {
        const p = Math.min((t - t0) / D, 1), v = target * (1 - Math.pow(1 - p, 3));
        el.textContent = v.toFixed(digits).replace('.', dec);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
      };
      el.textContent = (0).toFixed(digits).replace('.', dec);
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    $$('[data-count]', box).forEach(n => n.dataset.count && counter.observe(n));
  })();

  // niche tags in the "Różne nisze" card
  $$('[data-niches]').forEach(n => {
    const counts = new Map();
    items.forEach(t => t.cats.forEach(c => counts.set(c, (counts.get(c) || 0) + 1)));
    n.innerHTML = [...counts].sort((a, b) => b[1] - a[1])
      .map(([c, k]) => `<span class="tag mono">${esc(c)} · ${k}</span>`).join('');
  });

  /* ---------- Strip (marquee) ---------- */
  const strip = $('.strip');
  const rows = $$('.strip__row').map((row, r) => {
    if (!items.length) return null;
    const list = r ? [...items].reverse() : items;
    const reps = Math.max(1, Math.ceil(12 / list.length));
    const group = document.createElement('div');
    group.className = 'strip__group';
    for (let k = 0; k < reps; k++) {
      list.forEach(t => group.insertAdjacentHTML('beforeend',
        `<button class="strip__item" data-open="${t.i}" data-all data-cursor="Zobacz" tabindex="-1" aria-hidden="true"><img src="${esc(t.src)}" alt="" loading="lazy" decoding="async"></button>`));
    }
    const clone = group.cloneNode(true);
    row.append(group, clone);
    return { row, group, x: 0, dir: r ? 1 : -1, w: 0 };
  }).filter(Boolean);

  const measureStrip = () => rows.forEach(s => {
    s.w = s.group.offsetWidth;
    if (s.dir > 0 && s.x === 0) s.x = -s.w;
  });
  measureStrip();

  let stripVisible = true, stripHover = false, speedMul = 1, scrollBoost = 0, lastY = scrollY, lastT = 0;
  new IntersectionObserver(([e]) => (stripVisible = e.isIntersecting)).observe(strip);
  strip.addEventListener('pointerenter', () => (stripHover = true));
  strip.addEventListener('pointerleave', () => (stripHover = false));
  addEventListener('scroll', () => {
    const y = scrollY;
    scrollBoost = Math.min(scrollBoost + Math.abs(y - lastY) * 0.02, 6);
    lastY = y;
  }, { passive: true });

  const tick = t => {
    const dt = Math.min(t - (lastT || t), 50);
    lastT = t;
    if (stripVisible && !reduce) {
      speedMul += ((stripHover ? 0.15 : 1) - speedMul) * 0.06;
      scrollBoost *= 0.92;
      const v = 0.035 * speedMul * (1 + scrollBoost) * dt;
      rows.forEach(s => {
        if (!s.w) return;
        s.x += s.dir * v;
        if (s.x <= -s.w) s.x += s.w;
        if (s.x > 0) s.x -= s.w;
        s.row.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* ---------- Cursor bubble ---------- */
  const cursor = $('.cursor');
  if (finePointer) {
    const label = $('.cursor__label');
    let x = -100, y = -100, tx = -100, ty = -100, primed = false;
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!primed || reduce) { x = tx; y = ty; primed = true; }
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      cursor.classList.toggle('is-on', !!t && !html.classList.contains('lb-open'));
      if (t) label.textContent = t.dataset.cursor;
    });
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Nav ---------- */
  const nav = $('.nav');
  let navY = scrollY;
  const onNav = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    nav.classList.toggle('is-hidden', y > navY && y > 240);
    navY = y;
  };
  addEventListener('scroll', onNav, { passive: true });
  onNav();

  /* ---------- Lightbox ---------- */
  const lb = $('.lb');
  const lbBg = $('.lb__bg', lb);
  const lbFull = $('.lb__full', lb);
  const lbImg = $('.lb__img', lb);
  const lbFeed = $('.lb__feed', lb);
  const lbStage = $('.lb__stage', lb);
  const chrome = $$('.lb__chrome', lb);
  const closeBtn = $('.lb__close', lb);
  let list = [], pos = 0, mode = 'full', opener = null, busy = false, isOpen = false;

  const meta = t => {
    const h = (t.i * 7919 + t.title.length * 31) >>> 0;
    const views = h % 3 ? `${(h % 880) + 42} tys. wyświetleń` : `${(h % 3) + 1},${h % 10} mln wyświetleń`;
    const ago = ['2 dni temu', '5 dni temu', '1 tydzień temu', '3 tygodnie temu', '1 miesiąc temu'][h % 5];
    return { time: `${10 + (h % 24)}:${pad(h % 60)}`, views, ago };
  };
  const avatar = t => esc((t.channel || '?').trim()[0].toUpperCase());

  const renderFeed = () => {
    const n = list.length;
    const cur = items[list[pos]];
    const m = meta(cur);
    const near = (n >= 3 ? [-1, 0, 1] : [0]).map(o => items[list[(pos + o + n) % n]]);
    lbFeed.innerHTML = `
      <div class="mock mock--home">
        <span class="mock__label">Strona główna · 360px</span>
        <div class="yt">
          <div class="yt__thumb"><img src="${esc(cur.src)}" alt=""><span class="yt__time">${m.time}</span></div>
          <div class="yt__meta"><span class="yt__avatar">${avatar(cur)}</span>
            <div><p class="yt__title">${esc(cur.title)}</p><p class="yt__sub">${esc(cur.channel)}</p><p class="yt__sub">${m.views} • ${m.ago}</p></div></div>
        </div>
      </div>
      <div class="mock mock--side">
        <span class="mock__label">Proponowane · 168px</span>
        ${near.map(t => { const mm = meta(t); return `
          <div class="yt-row${t === cur ? ' is-current' : ''}">
            <div class="yt__thumb"><img src="${esc(t.src)}" alt=""><span class="yt__time">${mm.time}</span></div>
            <div><p class="yt__title">${esc(t.title)}</p><p class="yt__sub">${esc(t.channel)}</p><p class="yt__sub">${mm.views}</p></div>
          </div>`; }).join('')}
      </div>
      <div class="mock mock--mobile">
        <span class="mock__label">Telefon</span>
        <div class="phone"><div class="phone__screen">
          <div class="yt__thumb"><img src="${esc(cur.src)}" alt=""><span class="yt__time">${m.time}</span></div>
          <div class="yt__meta"><span class="yt__avatar">${avatar(cur)}</span>
            <div><p class="yt__title">${esc(cur.title)}</p><p class="yt__sub">${esc(cur.channel)} · ${m.views} · ${m.ago}</p></div></div>
        </div></div>
      </div>`;
  };

  const fill = () => {
    const t = items[list[pos]];
    lbImg.src = t.src;
    lbImg.alt = t.title;
    $('.lb__title', lb).textContent = t.title;
    $('.lb__cat', lb).innerHTML = [channelHtml(t), esc(t.cats.join(' · '))].filter(Boolean).join('<i>·</i>');
    $('.lb__count', lb).textContent = `${pad(pos + 1)} / ${pad(list.length)}`;
    $$('.lb__arrow', lb).forEach(b => (b.style.visibility = list.length > 1 ? '' : 'hidden'));
    if (mode === 'feed') renderFeed();
    [-1, 1].forEach(o => { const nx = items[list[(pos + o + list.length) % list.length]]; if (nx) new Image().src = nx.src; });
  };

  const setMode = m => {
    mode = m;
    lb.classList.toggle('is-feed', m === 'feed');
    $$('.lb__modes button', lb).forEach(b => {
      const on = b.dataset.mode === m;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    if (m === 'feed') renderFeed();
    if (!reduce) (m === 'feed' ? lbFeed : lbFull).animate(
      [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: EASE });
  };

  const rectTransform = (from, to) =>
    `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;

  const open = (idx, fromEl, all) => {
    if (isOpen) return;
    list = all ? items.map(t => t.i) : $$('.card', grid).filter(matches).map(c => +c.dataset.i);
    pos = Math.max(0, list.indexOf(idx));
    opener = fromEl;
    isOpen = true;
    fill();
    lb.hidden = false;
    html.classList.add('lb-open');
    cursor.classList.remove('is-on');
    closeBtn.focus({ preventScroll: true });
    if (reduce) return;

    lbBg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EASE });
    chrome.forEach((c, k) => c.animate(
      [{ opacity: 0, transform: `translateY(${k ? 12 : -12}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 800, delay: 180, easing: EASE, fill: 'backwards' }));

    if (mode === 'full' && fromEl) {
      const from = fromEl.getBoundingClientRect();
      const to = lbFull.getBoundingClientRect();
      lbFull.animate([{ transform: rectTransform(from, to) }, { transform: 'none' }], { duration: 900, easing: EASE });
    } else {
      (mode === 'full' ? lbFull : lbFeed).animate(
        [{ opacity: 0, transform: 'translateY(24px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 800, easing: EASE });
    }
  };

  const close = () => {
    if (!isOpen || busy) return;
    busy = true;
    const done = () => {
      lb.hidden = true;
      html.classList.remove('lb-open');
      isOpen = false; busy = false;
      const back = grid.querySelector(`.card[data-i="${list[pos]}"]:not([hidden]) .card__media`) || opener;
      if (back && back.getAttribute('tabindex') !== '-1') back.focus({ preventScroll: true });
    };
    if (reduce) return done();

    const anims = [
      lbBg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: EASE, fill: 'forwards' }),
      ...chrome.map(c => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' })),
    ];
    const card = grid.querySelector(`.card[data-i="${list[pos]}"]:not([hidden]) .card__media`);
    const r = card && card.getBoundingClientRect();
    if (mode === 'full' && r && r.bottom > 0 && r.top < innerHeight) {
      anims.push(lbFull.animate([{ transform: 'none' }, { transform: rectTransform(r, lbFull.getBoundingClientRect()) }],
        { duration: 750, easing: EASE, fill: 'forwards' }));
    } else {
      anims.push((mode === 'full' ? lbFull : lbFeed).animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.96)' }],
        { duration: 400, easing: EASE_IN, fill: 'forwards' }));
    }
    Promise.all(anims.map(a => a.finished)).then(() => { done(); anims.forEach(a => a.cancel()); });
  };

  const step = async d => {
    if (list.length < 2 || busy) return;
    pos = (pos + d + list.length) % list.length;
    if (reduce) return fill();
    busy = true;
    const target = mode === 'full' ? lbFull : lbFeed;
    await target.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-d * 48}px)` }],
      { duration: 240, easing: EASE_IN, fill: 'forwards' }).finished;
    fill();
    try { await lbImg.decode(); } catch (_) { /* ignore */ }
    target.getAnimations().forEach(a => a.cancel());
    target.animate([{ opacity: 0, transform: `translateX(${d * 48}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 700, easing: EASE });
    busy = false;
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b) open(+b.dataset.open, b, b.hasAttribute('data-all'));
  });
  closeBtn.addEventListener('click', close);
  lbBg.addEventListener('click', close);
  lbStage.addEventListener('click', e => { if (e.target === lbStage) close(); });
  $$('.lb__arrow', lb).forEach(b => b.addEventListener('click', () => step(+b.dataset.step)));
  $$('.lb__modes button', lb).forEach(b => b.addEventListener('click', () => { if (b.dataset.mode !== mode) setMode(b.dataset.mode); }));

  document.addEventListener('keydown', e => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const f = $$('button, a[href]', lb).filter(n => n.offsetParent !== null && n.style.visibility !== 'hidden');
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  let swipeX = null;
  lbStage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') swipeX = e.clientX; });
  lbStage.addEventListener('pointerup', e => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  /* ---------- Before / after slider ---------- */
  $$('.ba').forEach(ba => {
    const range = $('.ba__range', ba);
    const tagL = $('.ba__tag--l', ba), tagR = $('.ba__tag--r', ba);
    let touched = false;
    const set = v => {
      ba.style.setProperty('--p', v + '%');
      tagL.style.opacity = v > 18 ? 1 : 0;
      tagR.style.opacity = v < 82 ? 1 : 0;
    };
    range.addEventListener('input', () => { touched = true; set(+range.value); });
    range.addEventListener('pointerdown', () => { touched = true; ba.classList.add('is-drag'); });
    addEventListener('pointerup', () => ba.classList.remove('is-drag'));
    set(+range.value);

    // one-time hint sweep when it scrolls into view
    if (reduce) return;
    const sweep = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      sweep.disconnect();
      const keys = [[0, 50], [900, 78], [1900, 24], [2700, 50]];
      const ease = t => 1 - Math.pow(1 - t, 3);
      let t0;
      const run = t => {
        if (touched) return;
        t0 = t0 || t;
        const dt = t - t0 - 500;
        if (dt < 0) return requestAnimationFrame(run);
        const k = keys.findIndex(([at]) => at > dt);
        if (k === -1) { range.value = 50; return set(50); }
        const [a0, v0] = keys[k - 1], [a1, v1] = keys[k];
        const v = v0 + (v1 - v0) * ease((dt - a0) / (a1 - a0));
        range.value = v;
        set(v);
        requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, { threshold: 0.6 });
    sweep.observe(ba);
  });

  /* ---------- Load ---------- */
  const ready = () => {
    if (html.classList.contains('is-loaded')) return;
    html.classList.add('is-loaded');
    movePill();
    measureStrip();
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(ready));
  setTimeout(ready, 1500);

  let rz;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { movePill(); measureStrip(); }, 120);
  });
})();
