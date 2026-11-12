/* JBN Studio — interactions & motion */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ================= DONNÉES ================= */
  var IMG = { event: 'assets/img/event.jpg', team: 'assets/img/team.jpg', mve: 'assets/img/mve.jpg', senegal: 'assets/img/senegal.jpg' };
  var VIDEOS = [
    { title: 'Les coulisses d’une campagne 360° : de la Big Idea au terrain', tag: 'Stratégie', duration: '[12:00]', poster: IMG.event, url: '#videos', desc: '[Description de la vidéo — à remplacer par votre vidéo YouTube]' },
    { title: 'Comment atteindre 1 million de vues par mois sur Meta', tag: 'Digital & growth', duration: '[08:30]', poster: IMG.mve, url: '#videos', desc: '[Description de la vidéo]' },
    { title: 'Rebranding : les 5 étapes pour refondre une marque', tag: 'Branding', duration: '[10:15]', poster: IMG.team, url: '#videos', desc: '[Description de la vidéo]' },
    { title: 'Piloter une campagne dans 6 pays africains', tag: 'Communication 360°', duration: '[15:40]', poster: IMG.senegal, url: '#videos', desc: '[Description de la vidéo]' }
  ];
  var CATS = [
    { id: 'all', label: 'Tout' }, { id: 'reel', label: 'Reels 9/16' }, { id: 'kv', label: 'Key visuals' },
    { id: 'carrousel', label: 'Carrousels' }, { id: 'id', label: 'Identité' }, { id: 'event', label: 'Événementiel' }
  ];
  var TONES = {
    orange: 'background:#FF7A1A;color:#07080B',
    ink: 'background:#14171E;color:#F5F5F2;border:1px solid rgba(255,255,255,.1)',
    paper: 'background:#F2F1EC;color:#07080B',
    line: 'background:transparent;color:#FF7A1A;border:1px solid rgba(255,122,26,.5)',
    sky: 'background:#4FB3D9;color:#07080B'
  };
  var ITEMS = [
    { cat: 'kv', label: 'Key visual', title: 'Campagne 360° — Strauss Construction', mono: 'Strauss\nConstruction', tone: 'orange' },
    { cat: 'id', label: 'Identité visuelle', title: 'Territoire de marque — CINergie CI', mono: 'CINergie', tone: 'ink' },
    { cat: 'reel', label: 'Reel 9/16', title: 'Format éditorial — Messages de Vie', mono: 'Reel\nMessages de Vie', tone: 'paper' },
    { cat: 'reel', label: 'Reel 9/16', title: 'Aftermovie — Conférence de Pentecôte', mono: 'Reel\nPentecôte 2026', tone: 'line' },
    { cat: 'carrousel', label: 'Carrousel', title: 'Carrousel conseils — Cure’s Nappy', mono: 'Carrousel\n1/6', tone: 'sky' },
    { cat: 'carrousel', label: 'Carrousel', title: 'Carrousel institutionnel — FDGF', mono: 'Carrousel\n1/5', tone: 'ink' },
    { cat: 'event', label: 'Événementiel', title: 'Conférence de Pentecôte 2026', img: IMG.event },
    { cat: 'id', label: 'Rebranding', title: 'Supports de marque — FDGF', mono: 'FDGF', tone: 'line' },
    { cat: 'reel', label: 'Reel 9/16', title: 'Personal branding — Deri Jess', mono: 'Reel\nDeri Jess', tone: 'orange' },
    { cat: 'kv', label: 'Key visual', title: 'Lancement de l’app My CINergie', mono: 'My\nCINergie', tone: 'paper' },
    { cat: 'event', label: 'Campagne internationale', title: 'Dispositif terrain — Sénégal', img: IMG.senegal },
    { cat: 'kv', label: 'Social ads', title: 'Campagnes Meta Ads — Vons Cosmetic', mono: 'Vons\nCosmetic', tone: 'ink' }
  ];
  var OFFERS = ['Séance découverte offerte (30 min)', 'Séance stratégique 1:1', 'Audit de marque & communication', 'Pack Lancement / Rebranding', 'Direction marketing externalisée', 'Formation / atelier d’équipe', 'Autre projet'];
  var BUDGETS = ['Moins de 250 000 F', '250 000 – 1 M F', '1 M – 3 M F', 'Plus de 3 M F'];
  var st = { video: 0, filter: 'all', budget: '' };

  /* ================= RENDU ================= */
  function renderVideos(animate) {
    var v = VIDEOS[st.video];
    var apply = function () {
      var img = $('[data-feat-src]'); if (img) img.src = v.poster;
      $$('[data-feat]').forEach(function (el) { el.textContent = v[el.getAttribute('data-feat')]; });
      var a = $('[data-feat-href]'); if (a) a.href = v.url;
    };
    if (animate && hasGsap && !reduced) {
      var els = ['.video-frame', '[data-feat="title"]', '[data-feat="desc"]'];
      gsap.to(els, { opacity: 0, y: 12, duration: 0.2, onComplete: function () {
        apply(); gsap.to(els, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
      } });
    } else apply();
    $('#video-list').innerHTML = VIDEOS.map(function (it, i) {
      return '<button type="button" class="vthumb" data-video="' + i + '" aria-pressed="' + (i === st.video) + '">' +
        '<span class="th"><img src="' + it.poster + '" alt=""><span class="vbadge" style="right:6px;bottom:6px;padding:1px 6px;font-size:10px">' + it.duration + '</span></span>' +
        '<span style="display:flex;flex-direction:column;gap:4px;min-width:0"><span class="mono" style="font-size:11px">' + it.tag + '</span>' +
        '<span style="font-weight:600;font-size:15px;line-height:1.3">' + it.title + '</span></span></button>';
    }).join('');
  }

  function renderFilters() {
    $('#filters').innerHTML = CATS.map(function (c) {
      return '<button type="button" class="chip" data-filter="' + c.id + '" aria-pressed="' + (c.id === st.filter) + '">' + c.label + '</button>';
    }).join('');
  }

  function renderGallery(animate) {
    var shown = ITEMS.filter(function (it) { return st.filter === 'all' || it.cat === st.filter; });
    $('#gallery').innerHTML = shown.map(function (it) {
      var ratio = it.cat === 'reel' ? '9/16' : it.cat === 'carrousel' ? '1/1' : '4/5';
      var inner = it.img
        ? '<img src="' + it.img + '" alt="' + it.title + '" loading="lazy">'
        : '<span class="tile-ph"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg><b>' + it.mono + '</b><small>[Ajouter votre visuel]</small></span>';
      return '<figure class="tile tilt"><div class="tile-box" style="aspect-ratio:' + ratio + ';' + (it.img ? 'background:#14171E' : TONES[it.tone]) + '">' + inner + '</div>' +
        '<figcaption><span>' + it.label + '</span><b>' + it.title + '</b></figcaption></figure>';
    }).join('');
    if (animate && hasGsap && !reduced) {
      gsap.from('#gallery .tile', { opacity: 0, y: 50, rotateX: -12, scale: 0.94, duration: 0.7, ease: 'expo.out', stagger: 0.05, clearProps: 'transform' });
    }
    bindTilt($$('#gallery .tilt'));
  }

  function renderBudgets() {
    $('#budgets').innerHTML = BUDGETS.map(function (b) {
      return '<button type="button" class="chip" data-budget="' + b + '" aria-pressed="' + (b === st.budget) + '">' + b + '</button>';
    }).join('');
  }

  function updateLinks() {
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var offer = v('f-offer') || OFFERS[0];
    var lines = ['Bonjour JBN Studio,', 'Je souhaite : ' + offer,
      v('f-name') && 'Nom : ' + v('f-name'), v('f-company') && 'Structure : ' + v('f-company'),
      v('f-email') && 'Email : ' + v('f-email'), v('f-phone') && 'WhatsApp : ' + v('f-phone'),
      st.budget && 'Budget : ' + st.budget, v('f-msg') && 'Projet : ' + v('f-msg')].filter(Boolean).join('\n');
    $('#wa-link').href = 'https://wa.me/2250788570881?text=' + encodeURIComponent(lines);
    $('#mail-link').href = 'mailto:jnguessan22@yahoo.com?subject=' + encodeURIComponent('Demande : ' + offer) + '&body=' + encodeURIComponent(lines);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-video]');
    if (t) { st.video = +t.dataset.video; renderVideos(true); return; }
    t = e.target.closest('[data-filter]');
    if (t) { st.filter = t.dataset.filter; renderFilters(); renderGallery(true); if (hasGsap) ScrollTrigger.refresh(); return; }
    t = e.target.closest('[data-budget]');
    if (t) { st.budget = st.budget === t.dataset.budget ? '' : t.dataset.budget; renderBudgets(); updateLinks(); return; }
    t = e.target.closest('[data-offer]');
    if (t) { $('#f-offer').value = OFFERS[+t.dataset.offer]; updateLinks(); }
  });
  ['input', 'change'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.closest('.form')) updateLinks(); });
  });
  $$('form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); }); });

  // Horloge d'Abidjan (GMT)
  var clockEl = $('.clock');
  function tick() {
    var d = new Date();
    if (clockEl) clockEl.textContent = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
  }
  tick(); setInterval(tick, 20000);

  // Halo des cartes qui suit la souris
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  renderVideos(false); renderFilters(); renderGallery(false); renderBudgets(); updateLinks();

  /* ================= MOTION ================= */
  var loader = $('.loader');
  if (!hasGsap || reduced) {
    if (loader) loader.remove();
    if (window.JBNMask) window.JBNMask.form();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // --- Effet « décodage » des lettres
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+';
  function scramble(el, duration) {
    var finalText = el.textContent, len = finalText.length, obj = { p: 0 };
    return gsap.to(obj, {
      p: 1, duration: duration || 1, ease: 'none',
      onUpdate: function () {
        var shown = Math.floor(obj.p * len), out = '';
        for (var i = 0; i < len; i++) {
          var ch = finalText[i];
          out += (i < shown || ch === ' ') ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
      },
      onComplete: function () { el.textContent = finalText; }
    });
  }

  // --- Découpe des titres en mots
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!node.textContent.trim()) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span'); w.className = 'w';
        var wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
        w.appendChild(wi); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return $$('.wi', el);
  }

  /* ---------- Chargement ---------- */
  var heroLines = $$('.hero .h1 .ln > span');
  var heroBits = $$('.hero .tag, .hero .lead, .hero .btn, .hero .checks, .hero .scroll-ind, .hud');
  gsap.set(heroLines, { yPercent: 120, rotate: 3 });
  gsap.set(heroBits, { opacity: 0, y: 24 });
  gsap.set('.nav', { yPercent: -100 });
  gsap.set('.hero-grid', { opacity: 0, scale: 1.15 });
  gsap.set('.hero-glow', { opacity: 0, scale: 0.6 });

  var intro = gsap.timeline({ paused: true });
  intro
    .add(function () { if (window.JBNMask) window.JBNMask.form(); }, 0)
    .to('.hero-grid', { opacity: 0.55, scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
    .to('.hero-glow', { opacity: 1, scale: 1, duration: 2.2, ease: 'expo.out' }, 0.1)
    .to('.nav', { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.2)
    .to(heroLines, { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' }, 0.25)
    .to(heroBits, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.6)
    .add(function () { $$('.hud span').forEach(function (s, i) { if (!s.querySelector('*')) gsap.delayedCall(i * 0.1, function () { scramble(s, 0.8); }); }); }, 0.7);

  var num = { v: 0 }, lnum = $('.lnum');
  var load = gsap.timeline();
  load
    .to(num, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: function () { lnum.textContent = Math.round(num.v); } })
    .to('.loader-bar i', { width: '100%', duration: 1.6, ease: 'power2.inOut' }, 0)
    .to('.loader-num, .loader-top, .loader-bot, .loader-bar', { y: -40, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.in' })
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut', onComplete: function () { loader.remove(); } }, '-=0.15')
    .add(function () { intro.play(); }, '-=0.6');
  setTimeout(function () { if (document.body.contains(loader)) { load.progress(1); intro.progress(1); } }, 5000);

  /* ---------- Barre de progression & menu ---------- */
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
  var nav = $('.nav');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      var y = self.scroll();
      nav.classList.toggle('scrolled', y > 40);
      nav.classList.toggle('hide', self.direction === 1 && y > 500);
    }
  });

  /* ---------- Hero : sortie au scroll ---------- */
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: function (self) { if (window.JBNMask) window.JBNMask.setScroll(self.progress); }
  });
  gsap.to('.hero-body', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-grid', { backgroundPosition: '0 220px', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------- Bandes : inclinaison selon la vitesse ---------- */
  var bands = $$('.band');
  var skews = bands.map(function (b) { return gsap.quickTo(b, 'skewX', { duration: 0.5, ease: 'power3' }); });
  ScrollTrigger.create({ onUpdate: function (s) {
    var v = gsap.utils.clamp(-10, 10, s.getVelocity() / -220);
    skews.forEach(function (fn, i) { fn(i % 2 ? -v : v); });
  } });
  bands.forEach(function (b, i) {
    gsap.from(b, { xPercent: i ? 25 : -25, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 98%' } });
  });

  /* ---------- Compteurs ---------- */
  $$('.count').forEach(function (el) {
    var to = +el.dataset.to, o = { v: 0 };
    el.textContent = '0';
    gsap.to(o, { v: to, duration: 2.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString('fr-FR').replace(/[  ]/g, ' '); } });
  });
  gsap.from('.stat', { opacity: 0, y: 40, duration: 1, stagger: 0.1, scrollTrigger: { trigger: '.stats', start: 'top 92%' } });
  gsap.from('.clients b', { opacity: 0, y: 20, filter: 'blur(6px)', duration: 0.7, stagger: 0.05, scrollTrigger: { trigger: '.clients', start: 'top 92%' } });

  /* ---------- Titres, tags, intros ---------- */
  $$('.h2').forEach(function (h) {
    if (h.closest('.hero')) return;
    var words = splitWords(h);
    gsap.from(words, { yPercent: 115, rotate: 5, duration: 1.1, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  $$('.tag').forEach(function (t) {
    if (t.closest('.hero')) return;
    ScrollTrigger.create({ trigger: t, start: 'top 92%', once: true, onEnter: function () { scramble(t, 0.7); } });
    gsap.from(t, { opacity: 0, x: -20, duration: 0.7, scrollTrigger: { trigger: t, start: 'top 92%' } });
  });
  $$('.sec-head p, .sec-head > .btn').forEach(function (p) {
    gsap.from(p, { opacity: 0, y: 24, duration: 0.9, delay: 0.15, scrollTrigger: { trigger: p, start: 'top 92%' } });
  });

  /* ---------- Apparitions en cascade ---------- */
  var items = $$('.card, .ccard, .doc, .why > div, .timeline li, .steps3 li, .faq details, .trust, .form, .lm, .cta-band, .tools span, .photos > div, .video-main, .vthumb, .feat')
    .filter(function (el) { return !el.closest('.hero') && !el.closest('#gallery') && !el.closest('.method'); });
  gsap.set(items, { opacity: 0, y: 70 });
  ScrollTrigger.batch(items, {
    start: 'top 92%', once: true,
    onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform' }); }
  });
  gsap.from('#gallery .tile', { opacity: 0, y: 60, duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: '#gallery', start: 'top 90%' } });
  gsap.from('#filters .chip', { opacity: 0, y: 14, duration: 0.5, stagger: 0.05, scrollTrigger: { trigger: '#filters', start: 'top 92%' } });

  /* ---------- Offre vedette & grande étude de cas ---------- */
  gsap.fromTo('.feat', { clipPath: 'inset(0% 14% 0% 14% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: '.feat', start: 'top bottom', end: 'top 50%', scrub: true } });
  gsap.fromTo('.case.grow', { scale: 0.86, borderRadius: '60px' }, { scale: 1, borderRadius: '28px', ease: 'none', scrollTrigger: { trigger: '.case.grow', start: 'top bottom', end: 'top 35%', scrub: true } });
  gsap.from('.kpis > div', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: '.kpis', start: 'top 92%' } });

  /* ---------- « Pourquoi » : chiffres qui s'allument ---------- */
  $$('.why b').forEach(function (b) {
    gsap.to(b, { color: '#FF7A1A', duration: 0.6, scrollTrigger: { trigger: b, start: 'top 75%', toggleActions: 'play none none reverse' } });
  });

  /* ---------- Méthode : défilement horizontal épinglé ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', function () {
    var track = $('.method-track');
    var dist = function () { return track.scrollWidth - window.innerWidth + 40; };
    var tween = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '.method', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$('.step').forEach(function (s) {
      gsap.from(s.querySelector('.step-n'), { yPercent: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 85%' } });
      gsap.from(s, { rotate: 4, y: 60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 100%', end: 'left 60%', scrub: true } });
    });
    return function () { gsap.set(track, { x: 0 }); };
  });
  mm.add('(max-width: 899px)', function () {
    gsap.from('.step', { opacity: 0, y: 60, duration: 1, stagger: 0.1, scrollTrigger: { trigger: '.method', start: 'top 85%' } });
  });

  /* ---------- Parallaxe des photos ---------- */
  $$('img.par').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: 'none',
      scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.about-photo', { clipPath: 'inset(100% 0 0 0 round 28px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.about-photo', start: 'top 80%' } });
  gsap.from('.about-sign', { x: -60, opacity: 0, duration: 1, delay: 0.6, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.about-photo', start: 'top 80%' } });

  /* ---------- Section claire : entrée en volet ---------- */
  gsap.fromTo('.light', { clipPath: 'inset(6% 4% 0% 4% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.light', start: 'top bottom', end: 'top 30%', scrub: true } });
  gsap.from('.lm-cover', { rotate: -25, y: 60, opacity: 0, duration: 1.2, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.lm', start: 'top 85%' } });

  /* ---------- CTA final ---------- */
  gsap.fromTo('.final', { scale: 0.85, borderRadius: '90px' }, { scale: 1, borderRadius: '36px', ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'top 40%', scrub: true } });
  gsap.from('.final-links a', { x: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.final', start: 'top 70%' } });

  /* ---------- WhatsApp ---------- */
  gsap.from('.wa', { y: 140, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', delay: 3.2 });

  /* ---------- Souris : inclinaison, aimant, curseur ---------- */
  function bindTilt(els) {
    if (!finePointer || !hasGsap || reduced) return;
    els.forEach(function (el) {
      if (el._tilt) return; el._tilt = true;
      gsap.set(el, { transformPerspective: 900 });
      var rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      var ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 9);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
      });
      el.addEventListener('mouseleave', function () { rx(0); ry(0); });
    });
  }
  bindTilt($$('.tilt'));

  if (finePointer) {
    $$('.magnet, .btn-sm, .chip').forEach(function (btn) {
      var mx = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3' });
      var my = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener('mouseleave', function () { mx(0); my(0); });
    });
    var cur = $('.cursor'), ring = $('.cursor-ring');
    var cx = gsap.quickTo(cur, 'x', { duration: 0.15, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.15, ease: 'power3' });
    var rx2 = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), ry2 = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    window.addEventListener('mousemove', function (e) {
      cur.style.opacity = 1; ring.style.opacity = 1;
      cx(e.clientX); cy(e.clientY); rx2(e.clientX); ry2(e.clientY);
    });
    document.addEventListener('mouseleave', function () { cur.style.opacity = 0; ring.style.opacity = 0; });
    document.addEventListener('mouseover', function (e) {
      cur.classList.toggle('big', !!e.target.closest('a, button, summary, input, select, textarea, .tilt'));
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
