/* ==========================================================================
   AKWABA — interactions & animations
   Accueil → destination → calendrier → voyageurs → recherche (transition floue)
   → résultats (loader + carrousel) → fiche logement → réservation
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const IMG = (n) => `assets/img/${n}.jpg`;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const fcfa = (n) => Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ');

  /* ------------------------------------------------------------------ DATA */
  const DESTS = [
    { id: 'assinie', name: 'Assinie-Mafia', region: 'Sud-Comoé', img: 'dest-assinie', explore: "Explorer la lagune d'Assinie", tag: 'Plage & lagune', where: "la lagune d'Assinie" },
    { id: 'bassam', name: 'Grand-Bassam', region: 'Sud-Comoé', img: 'dest-bassam', explore: 'Explorer les plages de Grand-Bassam', tag: 'Patrimoine UNESCO', where: "l'océan à Grand-Bassam" },
    { id: 'plateau', name: 'Abidjan, Plateau', region: 'District d\'Abidjan', img: 'dest-plateau', explore: "Explorer les hauteurs d'Abidjan", tag: 'Centre des affaires', where: 'la baie du Plateau' },
    { id: 'cocody', name: 'Abidjan, Cocody', region: 'District d\'Abidjan', img: 'dest-cocody', explore: 'Explorer les villas de Cocody', tag: 'Quartier résidentiel', where: 'la lagune Ébrié' },
    { id: 'yakro', name: 'Yamoussoukro', region: 'Lacs', img: 'dest-yamoussoukro', explore: 'Explorer la capitale politique', tag: 'Basilique', where: 'les lacs de Yamoussoukro' },
    { id: 'man', name: 'Man', region: 'Tonkpi', img: 'dest-man', explore: 'Explorer les montagnes de Man', tag: 'Cascades & monts', where: 'les 18 montagnes de Man' },
    { id: 'sassandra', name: 'Sassandra', region: 'Gbôklé', img: 'dest-sassandra', explore: 'Explorer les baies de Sassandra', tag: 'Baies sauvages', where: 'la baie de Sassandra' },
    { id: 'sanpedro', name: 'San-Pédro', region: 'San-Pédro', img: 'dest-sanpedro', explore: 'Explorer la côte de San-Pédro', tag: 'Bord de mer', where: "l'océan à San-Pédro" },
  ];

  const HOSTS = [
    { n: 'Koffi Yao', img: 'host-1' },
    { n: 'Ibrahim Touré', img: 'host-2' },
    { n: 'Moussa Konaté', img: 'host-3' },
  ];
  const INTERIORS = ['in-bed-boho', 'in-armchair', 'in-living', 'in-bed-classic', 'in-suite', 'in-bed-hotel', 'in-bed-orange', 'in-plants'];

  const STAYS = [
    { t: "Lodge pieds dans l'eau", img: 'hero-lodge', badge: '−20 %', p: 55000, o: 69000, type: 'Lodge privé sur la plage', head: 'Vue imprenable sur {w}', r: 4.8, n: 256, g: 2, b: 1 },
    { t: 'Villa lagune & ponton', img: 'stay-deck', p: 85000, type: 'Villa entière avec ponton', head: 'Ponton privé face à {w}', r: 4.9, n: 182, g: 6, b: 3 },
    { t: 'Bungalow tropical', img: 'stay-resort', badge: 'DÈS 85 000 F', p: 85000, type: 'Bungalow dans un resort', head: 'Bungalow niché sous les cocotiers', r: 4.7, n: 341, g: 4, b: 2 },
    { t: 'Suite piscine & canopée', img: 'stay-infinity', badge: '−15 %', p: 120000, o: 140000, type: 'Suite avec piscine privée', head: 'Piscine à débordement sur {w}', r: 4.9, n: 97, g: 2, b: 1 },
    { t: 'Villa Blanche Océane', img: 'stay-villa-white', p: 150000, type: 'Villa d\'architecte', head: 'Villa d\'architecte & piscine', r: 4.8, n: 64, g: 8, b: 4 },
    { t: 'Résidence Azur', img: 'stay-villa-blue', badge: '−10 %', p: 135000, o: 150000, type: 'Appartement dans une résidence', head: 'Résidence Azur, calme et lumière', r: 4.6, n: 128, g: 4, b: 2 },
    { t: 'Villa contemporaine', img: 'stay-villa-modern', p: 180000, type: 'Villa entière', head: 'Grande villa contemporaine', r: 4.9, n: 51, g: 10, b: 5 },
    { t: 'Maison & jardin tropical', img: 'stay-house-pool', badge: 'NOUVEAU', p: 95000, type: 'Maison entière avec jardin', head: 'Maison familiale & jardin tropical', r: 5.0, n: 12, g: 6, b: 3 },
    { t: 'Cube design & palmiers', img: 'stay-cube', p: 110000, type: 'Loft design', head: 'Loft design entre palmiers', r: 4.7, n: 88, g: 3, b: 1 },
    { t: "Villa Bois d'Ébène", img: 'stay-wood', badge: '−20 %', p: 128000, o: 160000, type: 'Villa entière', head: "Villa Bois d'Ébène sous les étoiles", r: 4.8, n: 73, g: 8, b: 4 },
    { t: 'Rooftop coucher de soleil', img: 'stay-sunset', badge: '−25 %', p: 75000, o: 100000, type: 'Penthouse avec rooftop', head: 'Couchers de soleil sur {w}', r: 4.9, n: 210, g: 4, b: 2 },
    { t: 'Villa Front de Mer', img: 'stay-front', p: 200000, type: 'Villa de luxe', head: 'Villa de luxe en front de mer', r: 4.9, n: 39, g: 12, b: 6 },
    { t: 'Chambre bohème lumineuse', img: 'in-bed-boho', p: 35000, type: 'Chambre privée dans une villa', head: 'Chambre bohème au calme', r: 4.7, n: 156, g: 2, b: 1 },
    { t: 'Studio cosy & plantes', img: 'in-plants', badge: 'DÈS 28 000 F', p: 28000, type: 'Studio entier', head: 'Studio cosy idéal longs séjours', r: 4.6, n: 302, g: 2, b: 1 },
  ].map((s, i) => ({ ...s, id: i, host: HOSTS[i % HOSTS.length], gal: [0, 1, 2].map((k) => INTERIORS[(i * 2 + k) % INTERIORS.length]) }));

  /* ----------------------------------------------------------------- STATE */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const state = {
    dest: null,
    start: null,
    end: null,
    guests: { adults: 2, children: 0, babies: 0 },
    month: new Date(today.getFullYear(), today.getMonth(), 1),
    view: 'home',
    stay: null,
    car: 0,
  };

  const fmtLong = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDay = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
  const fmtMonth = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });
  const nights = () => Math.max(1, Math.round((state.end - state.start) / 864e5));
  const guestCount = () => state.guests.adults + state.guests.children;
  const guestLabel = () => `${guestCount()} voyageur${guestCount() > 1 ? 's' : ''}`;
  const rangeLabel = () => {
    if (!state.start || !state.end) return '';
    const a = state.start, b = state.end;
    if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${fmtDay.format(b)}`;
    return `${fmtDay.format(a)} – ${fmtDay.format(b)}`;
  };

  /* ---------------------------------------------------------------- CURSOR */
  const app = $('#app');
  const cursor = $('#cursor');
  const cur = { x: -100, y: -100, tx: -100, ty: -100, demo: false };
  const HOVERABLE = 'button, a, .field, .card, li, .cal__d, select, input, .chip';

  app.addEventListener('mousemove', (e) => {
    if (cur.demo) return;
    const r = app.getBoundingClientRect();
    cur.tx = e.clientX - r.left; cur.ty = e.clientY - r.top;
    cursor.classList.add('on');
    cursor.classList.toggle('hover', !!e.target.closest(HOVERABLE));
  });
  app.addEventListener('mouseleave', () => { if (!cur.demo) cursor.classList.remove('on'); });
  app.addEventListener('mousedown', () => pulseCursor());
  function pulseCursor() {
    cursor.classList.remove('down'); void cursor.offsetWidth; cursor.classList.add('down');
  }
  (function loop() {
    const k = cur.demo ? 0.09 : 0.28;
    cur.x += (cur.tx - cur.x) * k; cur.y += (cur.ty - cur.y) * k;
    cursor.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
    requestAnimationFrame(loop);
  })();

  /* ---------------------------------------------------------------- RIPPLE */
  document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.btn-primary, .search__go');
    if (!b) return;
    const r = b.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(sp);
    setTimeout(() => sp.remove(), 650);
  });

  /* ------------------------------------------------------------------ TABS */
  const ink = $('#tabInk');
  function moveInk(tab) { ink.style.width = tab.offsetWidth + 'px'; ink.style.transform = `translateX(${tab.offsetLeft}px)`; }
  $$('.tab').forEach((t) => t.addEventListener('click', () => {
    $$('.tab').forEach((x) => x.classList.toggle('is-active', x === t)); moveInk(t);
  }));
  requestAnimationFrame(() => moveInk($('.tab.is-active')));
  window.addEventListener('resize', () => moveInk($('.tab.is-active')));

  /* -------------------------------------------------------------- POPOVERS */
  const search = $('#search');
  const pops = { loc: $('#popLoc'), cal: $('#popCal'), guests: $('#popGuests') };
  const fields = { loc: $('[data-field="loc"]'), in: $('[data-field="in"]'), out: $('[data-field="out"]'), guests: $('[data-field="guests"]') };
  let openPop = null;

  function setActiveField(key) { Object.entries(fields).forEach(([k, f]) => f.classList.toggle('is-open', k === key)); }
  function open(name) {
    Object.entries(pops).forEach(([k, p]) => p.classList.toggle('is-open', k === name));
    openPop = name;
    if (name === 'loc') { renderLoc(locInput.value); setActiveField('loc'); }
    if (name === 'cal') { renderCal(); setActiveField(state.start && !state.end ? 'out' : 'in'); }
    if (name === 'guests') setActiveField('guests');
  }
  function closeAll() { Object.values(pops).forEach((p) => p.classList.remove('is-open')); setActiveField(null); openPop = null; }

  document.addEventListener('click', (e) => { if (openPop && !e.target.closest('#search')) closeAll(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  fields.loc.addEventListener('click', () => { locInput.focus(); if (openPop !== 'loc') open('loc'); });
  fields.in.addEventListener('click', () => open('cal'));
  fields.out.addEventListener('click', () => open('cal'));
  fields.guests.addEventListener('click', () => open('guests'));

  $('#startSearch').addEventListener('click', () => {
    search.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(.22,.8,.24,1)' });
    setTimeout(() => { locInput.focus(); open('loc'); }, 150);
  });

  /* ------------------------------------------------------------ LOCATION */
  const locInput = $('#locInput');
  const locList = $('#locList');
  let hl = 0, filtered = DESTS;
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function renderLoc(q = '') {
    const nq = norm(q.trim());
    filtered = DESTS.filter((d) => !nq || norm(d.name + ' ' + d.region).includes(nq));
    hl = 0;
    if (!filtered.length) { locList.innerHTML = '<li class="empty" style="opacity:1;transform:none">Aucune destination trouvée</li>'; return; }
    locList.innerHTML = filtered.map((d, i) => {
      let name = d.name;
      if (nq) {
        const idx = norm(name).indexOf(nq);
        if (idx > -1) name = name.slice(0, idx) + '<mark>' + name.slice(idx, idx + nq.length) + '</mark>' + name.slice(idx + nq.length);
      }
      return `<li style="--i:${i}" data-id="${d.id}" class="${i === 0 && nq ? 'is-hl' : ''}"><svg><use href="#i-pin"/></svg><span><b>${name}</b>, ${d.region}, CI</span><span class="li-tag">${d.tag}</span></li>`;
    }).join('');
  }
  locInput.addEventListener('focus', () => { if (openPop !== 'loc') open('loc'); });
  locInput.addEventListener('input', () => {
    $('#locSub').textContent = 'Choisissez la destination';
    if (openPop !== 'loc') open('loc'); else renderLoc(locInput.value);
    // les items ré-animent à chaque frappe, comme dans la vidéo
  });
  locInput.addEventListener('keydown', (e) => {
    const items = $$('li[data-id]', locList);
    if (!items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      hl = (hl + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((li, i) => li.classList.toggle('is-hl', i === hl));
    } else if (e.key === 'Enter') { e.preventDefault(); chooseDest(items[hl].dataset.id); }
  });
  locList.addEventListener('click', (e) => { const li = e.target.closest('li[data-id]'); if (li) chooseDest(li.dataset.id); });

  function chooseDest(id) {
    state.dest = DESTS.find((d) => d.id === id);
    locInput.value = state.dest.name;
    $('#locSub').innerHTML = '<span class="flag-ci"></span> Côte d\'Ivoire';
    fields.loc.classList.add('is-filled');
    locInput.blur();
    pops.loc.classList.remove('is-open');
    setTimeout(() => open('cal'), 280);
  }

  /* ------------------------------------------------------------- CALENDAR */
  const calEl = $('#cal');
  const DOW = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

  function monthHTML(base, idx) {
    const y = base.getFullYear(), m = base.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    let cells = DOW.map((d) => `<div class="cal__dow">${d}</div>`).join('');
    for (let i = 0; i < first; i++) cells += '<div class="cal__d is-empty"></div>';
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d);
      const cls = ['cal__d'];
      if (dt < today) cls.push('is-off');
      if (+dt === +today) cls.push('is-today');
      cells += `<div class="${cls.join(' ')}" data-t="${+dt}"><span>${d}</span></div>`;
    }
    const canPrev = idx === 0 && base > new Date(today.getFullYear(), today.getMonth(), 1);
    return `<div class="cal__m"><header>
      ${idx === 0 ? `<button class="cal__nav cal__nav--prev" data-nav="-1" ${canPrev ? '' : 'style="opacity:.3;pointer-events:none"'} aria-label="Mois précédent"><svg><use href="#i-chev-left"/></svg></button>` : ''}
      ${fmtMonth.format(base)}
      <button class="cal__nav cal__nav--next" data-nav="1" ${idx === 0 ? 'style="display:none"' : ''} aria-label="Mois suivant"><svg><use href="#i-chev-right"/></svg></button>
    </header><div class="cal__grid">${cells}</div></div>`;
  }
  function renderCal() {
    const a = state.month, b = new Date(a.getFullYear(), a.getMonth() + 1, 1);
    const info = state.start && state.end ? `${nights()} nuit${nights() > 1 ? 's' : ''} · ${rangeLabel()}` : state.start ? 'Choisissez la date de départ' : "Choisissez la date d'arrivée";
    calEl.innerHTML = monthHTML(a, 0) + monthHTML(b, 1) + `<div class="cal__foot"><span>${info}</span><button type="button" data-clear>Effacer les dates</button></div>`;
    paintRange();
  }
  function paintRange(hover) {
    const s = state.start && +state.start, e = state.end ? +state.end : (hover && state.start && hover > s ? hover : null);
    $$('.cal__d[data-t]', calEl).forEach((c) => {
      const t = +c.dataset.t;
      c.classList.toggle('r-start', t === s);
      c.classList.toggle('r-end', !!e && t === e);
      c.classList.toggle('in-range', !!e && t > s && t < e);
    });
  }
  calEl.addEventListener('mouseover', (e) => {
    const d = e.target.closest('.cal__d[data-t]');
    if (d && state.start && !state.end) paintRange(+d.dataset.t);
  });
  calEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const nav = e.target.closest('[data-nav]');
    if (nav) { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + +nav.dataset.nav, 1); renderCal(); return; }
    if (e.target.closest('[data-clear]')) { state.start = state.end = null; updateDateFields(); renderCal(); setActiveField('in'); return; }
    const d = e.target.closest('.cal__d[data-t]');
    if (!d || d.classList.contains('is-off')) return;
    const t = new Date(+d.dataset.t);
    if (!state.start || state.end || t <= state.start) { state.start = t; state.end = null; setActiveField('out'); }
    else { state.end = t; }
    updateDateFields();
    renderCal();
    if (state.end) setTimeout(() => open('guests'), 520);
  });
  function updateDateFields() {
    const set = (key, el, val, ph) => {
      el.textContent = val ? fmtLong.format(val) : ph;
      fields[key].classList.toggle('is-filled', !!val);
      if (val) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }
    };
    set('in', $('#inTxt'), state.start, 'Arrivée');
    set('out', $('#outTxt'), state.end, 'Départ');
  }

  /* --------------------------------------------------------------- GUESTS */
  $$('.stepper').forEach((st) => st.addEventListener('click', (e) => {
    e.stopPropagation();
    const b = e.target.closest('button[data-op]'); if (!b) return;
    const k = st.dataset.k, min = k === 'adults' ? 1 : 0;
    state.guests[k] = Math.max(min, Math.min(16, state.guests[k] + (b.dataset.op === '+' ? 1 : -1)));
    const span = $('span', st.querySelector('.stepper__ctl'));
    span.textContent = state.guests[k];
    span.animate([{ transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 300 });
    updateGuestField();
  }));
  function updateGuestField() {
    $('#guestTxt').textContent = guestLabel();
    $('#guestSub').textContent = state.guests.babies ? `+ ${state.guests.babies} bébé${state.guests.babies > 1 ? 's' : ''}` : 'Modifier';
    fields.guests.classList.add('is-filled');
  }
  $('#guestsOk').addEventListener('click', (e) => {
    e.stopPropagation(); updateGuestField(); closeAll();
    $('#searchGo').classList.add('pulse');
  });

  /* ------------------------------------------------------------ NAVIGATION */
  const views = { home: $('#view-home'), results: $('#view-results'), detail: $('#view-detail') };
  const veil = $('#veil');
  async function goTo(name) {
    if (name === state.view) return;
    closeAll();
    veil.classList.add('on');
    views[state.view].classList.remove('is-active');
    state.view = name;
    await wait(220);
    views[name].scrollTop = 0;
    views[name].classList.add('is-active');
    setTimeout(() => veil.classList.remove('on'), 450);
  }
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (!g) return;
    e.preventDefault();
    goTo(g.dataset.go);
  });

  /* ---------------------------------------------------------------- SEARCH */
  $('#searchGo').addEventListener('click', (e) => { e.stopPropagation(); runSearch(); });

  async function runSearch() {
    $('#searchGo').classList.remove('pulse');
    if (!state.dest) chooseDestSilent(DESTS[0]);
    if (!state.start || !state.end) {
      state.start = new Date(today.getTime() + 21 * 864e5);
      state.end = new Date(today.getTime() + 25 * 864e5);
      updateDateFields();
    }
    updateGuestField();
    closeAll();
    fillResultsHeader();

    const results = $('#results'), loader = $('#loader');
    results.classList.remove('show');
    loader.classList.add('on');
    await goTo('results');
    await wait(1400);
    renderListings();
    loader.classList.remove('on');
    results.classList.add('show');
    await wait(500);
    const v = views.results;
    const top = results.offsetTop - 10;
    v.scrollTo({ top, behavior: 'smooth' });
  }
  function chooseDestSilent(d) {
    state.dest = d; locInput.value = d.name;
    $('#locSub').innerHTML = '<span class="flag-ci"></span> Côte d\'Ivoire';
  }
  function fillResultsHeader() {
    const d = state.dest;
    $('#dheroImg').src = IMG(d.img);
    $('#dheroImg').alt = d.name;
    $('#dheroTitle').textContent = d.name.replace('Abidjan, ', '');
    $('#dheroSub').textContent = d.name.startsWith('Abidjan') ? "Abidjan, Côte d'Ivoire" : "Côte d'Ivoire";
    $('#pillLoc').textContent = d.name + ',';
    $('#pillDates').textContent = rangeLabel();
    $('#pillGuests').textContent = guestLabel();
    $('#crumbDest').textContent = d.name;
    $('#rMeta').textContent = `${rangeLabel()}, ${guestLabel()}`;
    $('#exploreTitle').textContent = d.explore;
  }

  /* -------------------------------------------------------------- LISTINGS */
  function cardHTML(s) {
    return `<article class="card" data-stay="${s.id}" tabindex="0">
      <div class="card__img">${s.badge ? `<span class="badge">${s.badge}</span>` : ''}
        <button class="card__like" aria-label="Ajouter aux favoris"><svg><use href="#i-heart"/></svg></button>
        <img src="${IMG(s.img)}" alt="${s.t}" loading="lazy"></div>
      <h4>${s.t}</h4>
      <p class="card__meta"><svg><use href="#i-home"/></svg> ${fcfa(s.p)} FCFA / nuit <span class="rt"><svg><use href="#i-star"/></svg>${s.r.toFixed(1)}</span></p>
    </article>`;
  }
  let gridObs;
  function renderListings() {
    // ordre légèrement différent selon la destination pour donner vie aux résultats
    const shift = DESTS.indexOf(state.dest) % 4;
    const first = STAYS.slice(0, 8);
    const car = first.slice(shift).concat(first.slice(0, shift));
    $('#track').innerHTML = car.map(cardHTML).join('');
    $('#grid').innerHTML = STAYS.slice(8).map(cardHTML).join('');
    state.car = 0; moveCarousel();

    gridObs && gridObs.disconnect();
    gridObs = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); gridObs.unobserve(en.target); }
    }), { root: views.results, threshold: 0.15 });
    $$('#grid .card').forEach((c, i) => { c.style.transitionDelay = (i % 3) * 90 + 'ms'; gridObs.observe(c); });
  }

  // carrousel
  function perView() { const c = $('#track .card'); if (!c) return 4; return Math.round($('#carousel').clientWidth / (c.offsetWidth + 25)); }
  function moveCarousel() {
    const cards = $$('#track .card'); if (!cards.length) return;
    const max = Math.max(0, cards.length - perView());
    state.car = Math.max(0, Math.min(state.car, max));
    const step = cards[0].offsetWidth + 25;
    $('#track').style.transform = `translateX(${-state.car * step}px)`;
    $('#carPrev').disabled = state.car === 0;
    $('#carNext').disabled = state.car >= max;
  }
  $('#carPrev').addEventListener('click', () => { state.car -= 1; moveCarousel(); });
  $('#carNext').addEventListener('click', () => { state.car += 1; moveCarousel(); });
  window.addEventListener('resize', moveCarousel);
  // swipe tactile
  let sx = null;
  $('#carousel').addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  $('#carousel').addEventListener('touchend', (e) => {
    if (sx === null) return; const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { state.car += dx < 0 ? 1 : -1; moveCarousel(); } sx = null;
  });

  // chips & likes & clic carte
  $('.chips__list').addEventListener('click', (e) => {
    const c = e.target.closest('.chip'); if (!c) return;
    $$('.chip').forEach((x) => x.classList.toggle('is-active', x === c));
  });
  views.results.addEventListener('click', (e) => {
    const like = e.target.closest('.card__like');
    if (like) { e.stopPropagation(); like.classList.toggle('liked'); like.classList.remove('burst'); void like.offsetWidth; like.classList.add('burst'); return; }
    const card = e.target.closest('.card');
    if (card) openDetail(STAYS[+card.dataset.stay]);
  });
  views.results.addEventListener('keydown', (e) => {
    const card = e.target.closest('.card'); if (card && e.key === 'Enter') openDetail(STAYS[+card.dataset.stay]);
  });

  /* ---------------------------------------------------------------- DETAIL */
  function openDetail(s) {
    state.stay = s;
    const d = state.dest || DESTS[0];
    $('#dTitle').textContent = s.head.replace('{w}', d.where);
    $('#dCrumb').textContent = d.name;
    $('#dPlace').textContent = `${d.name}, ${d.region}, Côte d'Ivoire`;
    $('#dRating').textContent = $('#bRating').textContent = s.r.toFixed(1);
    $('#dReviews').textContent = $('#bReviews').textContent = `(${s.n} avis)`;
    $('#gMain').src = IMG(s.img); $('#gMain').alt = s.t;
    ['g1', 'g2', 'g3'].forEach((id, i) => { $('#' + id).src = IMG(s.gal[i]); $('#' + id).alt = 'Intérieur'; });
    $('#dType').textContent = s.type;
    ['dHostMini', 'dHostImg', 'bHost'].forEach((id) => { $('#' + id).src = IMG(s.host.img); });
    $('#dHost').textContent = s.host.n;
    $('#fGuests').textContent = `${s.g} voyageurs`;
    $('#fBeds').textContent = `${s.b} chambre${s.b > 1 ? 's' : ''}`;
    $('#fBath').textContent = `${s.b > 2 ? s.b - 1 : 1} salle${s.b > 2 ? 's' : ''} de bain privée${s.b > 2 ? 's' : ''}`;
    $('#dDesc').innerHTML = [
      `Décrit par le magazine <i>Maisons d'Afrique</i> comme « l'une des plus belles adresses de la côte », ce logement vous offre un cadre paisible au cœur de ${d.name}, à quelques minutes des plages et des maquis locaux.`,
      `Profitez d'une vue dégagée sur ${d.where} depuis votre espace privé, entièrement climatisé, avec literie haut de gamme, salle d'eau moderne et grandes baies vitrées.`,
      `Le soir, votre terrasse privée capte la brise de l'Atlantique : idéal pour un poisson braisé, un jus de bissap frais et les étoiles au-dessus des cocotiers.`,
    ].map((p) => `<p>${p}</p>`).join('');

    // réservation
    $('#bOld').style.display = s.o ? '' : 'none';
    $('#bOld').textContent = s.o ? fcfa(s.o) : '';
    $('#bNew').textContent = `${fcfa(s.p)} FCFA`;
    $('#bIn').textContent = fmtLong.format(state.start);
    $('#bOut').textContent = fmtLong.format(state.end);
    $('#bGuests').textContent = guestLabel();
    const n = nights(), ref = s.o || s.p, base = ref * n, disc = (ref - s.p) * n, fee = Math.round(s.p * n * 0.05 / 500) * 500, total = base - disc + fee;
    $('#lBase').textContent = `${fcfa(ref)} × ${n} nuit${n > 1 ? 's' : ''}`;
    $('#lBaseV').textContent = fcfa(base);
    $('#lDisc').parentElement.style.display = disc ? '' : 'none';
    $('#lDisc').previousElementSibling.textContent = `Remise campagne ${Math.round((1 - s.p / ref) * 100)} %`;
    $('#lDisc').textContent = '−' + fcfa(disc);
    $('#lFee').textContent = fcfa(fee);
    $('#lTotal').textContent = `${fcfa(total)} FCFA`;

    const rb = $('#reserveBtn'); rb.classList.remove('done', 'loading'); $('span', rb).textContent = 'Réserver';
    $('#saveBtn').classList.remove('saved'); $('#saveBtn').firstChild.textContent = 'Enregistrer ';
    $('#likeBtn').classList.remove('liked');
    goTo('detail');
  }
  $('#likeBtn').addEventListener('click', (e) => {
    const b = e.currentTarget; b.classList.toggle('liked');
    b.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'cubic-bezier(.22,.8,.24,1)' });
  });
  $('#saveBtn').addEventListener('click', (e) => {
    const b = e.currentTarget; b.classList.toggle('saved');
    b.firstChild.textContent = b.classList.contains('saved') ? 'Enregistré ' : 'Enregistrer ';
  });
  $('#reserveBtn').addEventListener('click', async (e) => {
    const b = e.currentTarget; if (b.classList.contains('done') || b.classList.contains('loading')) return;
    b.classList.add('loading'); $('span', b).textContent = 'Réservation';
    await wait(1100);
    b.classList.remove('loading'); b.classList.add('done'); $('span', b).textContent = 'Réservé !';
    toast('Réservation confirmée', `${state.stay.t} · ${rangeLabel()} · Paiement Orange Money / Wave`);
  });

  let toastT;
  function toast(t, s) {
    $('#toastT').textContent = t; $('#toastS').textContent = s;
    const el = $('#toast'); el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3800);
  }

  /* ==========================================================================
     MODE DÉMO — rejoue le parcours de la vidéo automatiquement (index.html#demo)
     ========================================================================== */
  async function demo() {
    cur.demo = true; cursor.classList.add('on');
    const r0 = () => app.getBoundingClientRect();
    const moveTo = async (el, ms = 900) => {
      if (!el) return;
      const r = el.getBoundingClientRect(), a = r0();
      cur.tx = r.left - a.left + r.width / 2; cur.ty = r.top - a.top + r.height / 2;
      cursor.classList.add('hover'); await wait(ms); cursor.classList.remove('hover');
    };
    const click = async (el, ms = 900) => { await moveTo(el, ms); pulseCursor(); el.click(); await wait(250); };
    cur.x = cur.tx = app.clientWidth * 0.55; cur.y = cur.ty = app.clientHeight * 0.5;
    await wait(1600);

    await click(fields.loc, 1100);
    for (const ch of 'Ass') { locInput.value += ch; locInput.dispatchEvent(new Event('input')); await wait(260); }
    await wait(500);
    await click($('li[data-id]', locList), 900);
    await wait(700);
    const days = $$('.cal__d[data-t]:not(.is-off)', calEl);
    const second = $$('.cal__m', calEl)[1];
    const pick = (n) => $$('.cal__d[data-t]', second).find((c) => +$('span', c).textContent === n) || days[days.length - 1];
    await click(pick(24), 900);
    await moveTo(pick(26), 500);
    await click(pick(28), 600);
    await wait(700);
    await click($('[data-k="adults"] [data-op="+"]'), 700);
    await click($('[data-k="adults"] [data-op="-"]'), 500);
    await click($('#guestsOk'), 600);
    await click($('#searchGo'), 900);
    await wait(2700);
    await moveTo($('#carNext'), 900); pulseCursor(); $('#carNext').click(); await wait(900);
    await moveTo($('#carPrev'), 600); pulseCursor(); $('#carPrev').click(); await wait(700);
    await click($('#track .card'), 900);
    await wait(2000);
    views.detail.scrollTo({ top: 560, behavior: 'smooth' });
    await wait(2200);
    await moveTo($('#reserveBtn'), 900); pulseCursor(); $('#reserveBtn').click(); await wait(2200);
    views.detail.scrollTo({ top: 0, behavior: 'smooth' });
    await wait(1200);
    await click($('.view-detail .btn-back'), 900);
    await wait(1400);
    views.results.scrollTo({ top: 0, behavior: 'smooth' });
    await wait(900);
    await click($('#pill .search__go'), 900);
    cur.demo = false;
  }
  if (location.hash === '#demo') window.addEventListener('load', () => setTimeout(demo, 400));
  window.akwabaDemo = demo;
})();
