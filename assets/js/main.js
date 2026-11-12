/* Portfolio Jean Bedel N'Guessan — interactions & motion */
(function () {
  'use strict';

  var ACCENT = '#FF8A1F';
  var IMG = {
    event: 'assets/img/event.jpg',
    team: 'assets/img/team.jpg',
    mve: 'assets/img/mve.jpg',
    senegal: 'assets/img/senegal.jpg',
    conf: 'assets/img/conf.jpg'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ================= VIDÉOS ================= */
  var VIDEOS = [
    { title: 'Les coulisses d’une campagne 360° : de la Big Idea au terrain', tag: 'Stratégie', duration: '[12:00]', poster: IMG.event, url: '#videos', desc: '[Description de la vidéo — à remplacer par votre vidéo YouTube]' },
    { title: 'Comment atteindre 1 million de vues par mois sur Meta', tag: 'Digital & growth', duration: '[08:30]', poster: IMG.mve, url: '#videos', desc: '[Description de la vidéo]' },
    { title: 'Rebranding : les 5 étapes pour refondre une marque', tag: 'Branding', duration: '[10:15]', poster: IMG.team, url: '#videos', desc: '[Description de la vidéo]' },
    { title: 'Piloter une campagne dans 6 pays africains', tag: 'Communication 360°', duration: '[15:40]', poster: IMG.senegal, url: '#videos', desc: '[Description de la vidéo]' }
  ];
  var currentVideo = 0;

  function renderVideos(animate) {
    var v = VIDEOS[currentVideo];
    var poster = $('[data-feat-src]');
    var apply = function () {
      if (poster) poster.src = v.poster;
      $$('[data-feat]').forEach(function (el) { el.textContent = v[el.getAttribute('data-feat')]; });
      var link = $('[data-feat-href]');
      if (link) link.href = v.url;
    };
    if (animate && window.gsap && !reduced) {
      var box = poster ? poster.parentNode : null;
      gsap.to([box, '[data-feat="title"]', '[data-feat="desc"]'], { opacity: 0, y: 10, duration: 0.2, onComplete: function () {
        apply();
        gsap.to([box, '[data-feat="title"]', '[data-feat="desc"]'], { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 });
      } });
    } else { apply(); }

    var list = $('#video-list');
    if (!list) return;
    list.innerHTML = VIDEOS.map(function (item, i) {
      var on = i === currentVideo;
      return '<button type="button" class="vthumb" data-video="' + i + '" style="display: flex; gap: 14px; align-items: center; width: 100%; padding: 10px; border-radius: 16px; min-height: 44px; background: ' + (on ? 'rgba(255,255,255,0.08)' : 'transparent') + '; border: 1px solid ' + (on ? ACCENT : 'rgba(255,255,255,0.08)') + '; color: #F4F1EA">' +
        '<span style="position: relative; flex: 0 0 132px; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; background: #0A1628">' +
        '<img src="' + item.poster + '" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.7">' +
        '<span style="position: absolute; right: 6px; bottom: 6px; padding: 1px 6px; border-radius: 6px; background: rgba(10,22,40,0.85); font-size: 11px; font-weight: 600; color: #F4F1EA">' + item.duration + '</span></span>' +
        '<span style="display: flex; flex-direction: column; gap: 4px; min-width: 0">' +
        '<span style="font-size: 12px; color: #A9B6C8">' + item.tag + '</span>' +
        '<span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 600; font-size: 16px; line-height: 1.25; color: #F4F1EA">' + item.title + '</span></span></button>';
    }).join('');
  }

  /* ================= CRÉATIONS ================= */
  var CATS = [
    { id: 'all', label: 'Tout' },
    { id: 'reel', label: 'Reels 9/16' },
    { id: 'kv', label: 'Key visuals' },
    { id: 'carrousel', label: 'Carrousels' },
    { id: 'id', label: 'Identité visuelle' },
    { id: 'event', label: 'Événementiel' }
  ];
  var TONES = {
    orange: 'background: ' + ACCENT + '; color: #0A1628;',
    navy: 'background: #1B3A5C; color: #F4F1EA;',
    ice: 'background: #E9EEF3; color: #0A1628;',
    sky: 'background: #4FB3D9; color: #0A1628;',
    ink: 'background: #10213A; color: #F4F1EA; border: 1px solid rgba(255,255,255,0.1);'
  };
  var ITEMS = [
    { cat: 'kv', label: 'Key visual', title: 'Campagne 360° — Strauss Construction', mono: 'Strauss\nConstruction', tone: 'orange' },
    { cat: 'id', label: 'Identité visuelle', title: 'Territoire de marque — CINergie CI', mono: 'CINergie', tone: 'navy' },
    { cat: 'reel', label: 'Reel 9/16', title: 'Format éditorial — Messages de Vie', mono: 'Reel\nMessages de Vie', tone: 'ice' },
    { cat: 'reel', label: 'Reel 9/16', title: 'Aftermovie — Conférence de Pentecôte', mono: 'Reel\nPentecôte 2026', tone: 'ink' },
    { cat: 'carrousel', label: 'Carrousel', title: 'Carrousel conseils — Cure’s Nappy', mono: 'Carrousel\n1/6', tone: 'sky' },
    { cat: 'carrousel', label: 'Carrousel', title: 'Carrousel institutionnel — FDGF', mono: 'Carrousel\n1/5', tone: 'navy' },
    { cat: 'event', label: 'Événementiel', title: 'Conférence de Pentecôte 2026', img: IMG.event },
    { cat: 'id', label: 'Rebranding', title: 'Supports de marque — FDGF', mono: 'FDGF', tone: 'sky' },
    { cat: 'reel', label: 'Reel 9/16', title: 'Personal branding — Deri Jess', mono: 'Reel\nDeri Jess', tone: 'orange' },
    { cat: 'kv', label: 'Key visual', title: 'Lancement de l’app My CINergie', mono: 'My\nCINergie', tone: 'ice' },
    { cat: 'event', label: 'Campagne internationale', title: 'Dispositif terrain — Sénégal', img: IMG.senegal },
    { cat: 'kv', label: 'Social ads', title: 'Campagnes Meta Ads — Vons Cosmetic', mono: 'Vons\nCosmetic', tone: 'navy' }
  ];
  var currentFilter = 'all';

  function chipStyle(on) {
    return 'min-height: 44px; padding: 0 18px; border-radius: 999px; font-size: 14px; font-weight: 600; border: 1px solid ' + (on ? ACCENT : 'rgba(255,255,255,0.2)') + '; background: ' + (on ? ACCENT : 'transparent') + '; color: ' + (on ? '#0A1628' : '#F4F1EA');
  }

  function renderFilters() {
    var box = $('#filters');
    if (!box) return;
    box.innerHTML = CATS.map(function (c) {
      var on = c.id === currentFilter;
      return '<button type="button" class="chip" data-filter="' + c.id + '" aria-pressed="' + on + '" style="' + chipStyle(on) + '">' + c.label + '</button>';
    }).join('');
  }

  function renderGallery(animate) {
    var box = $('#gallery');
    if (!box) return;
    var shown = ITEMS.filter(function (it) { return currentFilter === 'all' || it.cat === currentFilter; });
    box.innerHTML = shown.map(function (it) {
      var ratio = it.cat === 'reel' ? '9 / 16' : it.cat === 'carrousel' ? '1 / 1' : '4 / 5';
      var tile = 'aspect-ratio: ' + ratio + '; border-radius: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; white-space: pre-line; ' + (it.img ? 'background: #10213A;' : TONES[it.tone]);
      var inner = it.img
        ? '<img src="' + it.img + '" alt="' + it.title + '" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block">'
        : '<span style="display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center; padding: 24px">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="2"></circle><path d="M21 15l-5-5L5 21"></path></svg>' +
          '<span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 22px; line-height: 1.05; letter-spacing: -0.02em">' + it.mono + '</span>' +
          '<span style="font-size: 12px; opacity: 0.8">[Ajouter votre visuel]</span></span>';
      return '<figure class="lift tile" style="margin: 0; display: flex; flex-direction: column; gap: 12px">' +
        '<div style="' + tile + '">' + inner + '</div>' +
        '<figcaption style="display: flex; flex-direction: column; gap: 2px">' +
        '<span style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent)">' + it.label + '</span>' +
        '<span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 600; font-size: 17px">' + it.title + '</span></figcaption></figure>';
    }).join('');
    if (animate && window.gsap && !reduced) {
      gsap.from('#gallery .tile', { opacity: 0, y: 40, scale: 0.94, duration: 0.6, ease: 'power3.out', stagger: 0.06, clearProps: 'transform' });
    }
    bindTilt($$('#gallery .lift'));
  }

  /* ================= FORMULAIRE ================= */
  var OFFERS = ['Séance découverte offerte (30 min)', 'Séance stratégique 1:1', 'Audit de marque & communication', 'Pack Lancement / Rebranding', 'Direction marketing externalisée', 'Formation / atelier d’équipe', 'Autre projet'];
  var BUDGETS = ['Moins de 250 000 F', '250 000 – 1 M F', '1 M – 3 M F', 'Plus de 3 M F'];
  var currentBudget = '';

  function renderBudgets() {
    var box = $('#budgets');
    if (!box) return;
    box.innerHTML = BUDGETS.map(function (b) {
      var on = b === currentBudget;
      return '<button type="button" class="chip" data-budget="' + b + '" aria-pressed="' + on + '" style="' + chipStyle(on).replace('padding: 0 18px', 'padding: 0 16px') + '">' + b + '</button>';
    }).join('');
  }

  function updateLinks() {
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var offer = val('f-offer') || OFFERS[0];
    var lines = [
      'Bonjour Jean Bedel,',
      'Je souhaite : ' + offer,
      val('f-name') && 'Nom : ' + val('f-name'),
      val('f-company') && 'Structure : ' + val('f-company'),
      val('f-email') && 'Email : ' + val('f-email'),
      val('f-phone') && 'WhatsApp : ' + val('f-phone'),
      currentBudget && 'Budget : ' + currentBudget,
      val('f-msg') && 'Projet : ' + val('f-msg')
    ].filter(Boolean).join('\n');
    var wa = $('#wa-link'), mail = $('#mail-link');
    if (wa) wa.href = 'https://wa.me/2250788570881?text=' + encodeURIComponent(lines);
    if (mail) mail.href = 'mailto:jnguessan22@yahoo.com?subject=' + encodeURIComponent('Demande : ' + offer) + '&body=' + encodeURIComponent(lines);
  }

  /* ================= ÉVÉNEMENTS ================= */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-video]');
    if (t) { currentVideo = +t.getAttribute('data-video'); renderVideos(true); return; }
    t = e.target.closest('[data-filter]');
    if (t) { currentFilter = t.getAttribute('data-filter'); renderFilters(); renderGallery(true); if (window.ScrollTrigger) ScrollTrigger.refresh(); return; }
    t = e.target.closest('[data-budget]');
    if (t) { var b = t.getAttribute('data-budget'); currentBudget = currentBudget === b ? '' : b; renderBudgets(); updateLinks(); return; }
    t = e.target.closest('[data-offer]');
    if (t) { var sel = $('#f-offer'); if (sel) sel.value = OFFERS[+t.getAttribute('data-offer')]; updateLinks(); }
  });
  ['input', 'change'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.closest('#contact form')) updateLinks(); });
  });
  $$('#contact form, form[aria-label="Recevoir le modèle gratuit"]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  renderVideos(false);
  renderFilters();
  renderGallery(false);
  renderBudgets();
  updateLinks();

  /* ================= MOTION ================= */
  var loader = $('.loader');
  if (!window.gsap || reduced) {
    if (loader) loader.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // --- Découpe des titres en mots
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
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

  // --- Hero
  var hero = $('#top');
  var h1 = $('h1', hero);
  $$(':scope > span', h1).forEach(function (s) {
    var line = document.createElement('span'); line.className = 'hero-line';
    s.parentNode.insertBefore(line, s); line.appendChild(s);
  });
  var heroImgBox = $('img[alt^="Portrait"]', hero).parentNode;
  var heroImg = $('img', heroImgBox);
  var heroCard = heroImgBox.nextElementSibling;
  var heroBits = Array.prototype.slice.call(h1.parentNode.children).filter(function (c) { return c !== h1; });

  gsap.set('.hero-line > span', { yPercent: 115 });
  gsap.set(heroBits, { opacity: 0, y: 30 });
  gsap.set(heroImgBox, { clipPath: 'inset(100% 0% 0% 0% round 28px)' });
  gsap.set(heroImg, { scale: 1.3 });
  gsap.set(heroCard, { opacity: 0, scale: 0.6, rotate: -8 });
  gsap.set('header', { yPercent: -100 });

  var intro = gsap.timeline({ paused: true });
  intro
    .to('header', { yPercent: 0, duration: 0.8 }, 0)
    .to('.hero-line > span', { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' }, 0.05)
    .to(heroImgBox, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.3, ease: 'expo.inOut' }, 0)
    .to(heroImg, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.2)
    .to(heroBits, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.45)
    .to(heroCard, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.8)', onComplete: function () { heroCard.classList.add('float'); gsap.set(heroCard, { clearProps: 'transform' }); } }, 0.9);

  // --- Loader
  gsap.timeline()
    .to('.loader-bar span', { width: '100%', duration: 0.8, ease: 'power2.inOut' })
    .to('.loader-mark', { scale: 0.8, opacity: 0, duration: 0.35, ease: 'power2.in' }, '-=0.05')
    .to('.loader-bar', { opacity: 0, duration: 0.2 }, '<')
    .to(loader, { yPercent: -100, duration: 0.8, ease: 'expo.inOut', onComplete: function () { loader.remove(); } })
    .add(function () { intro.play(); }, '-=0.45');
  // Sécurité : si l'onglet est en arrière-plan, on ne bloque jamais l'affichage
  setTimeout(function () {
    if (document.body.contains(loader)) { loader.remove(); intro.progress(1); }
  }, 4000);

  // --- Barre de progression
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  // --- Menu qui se cache en descendant
  var header = $('header');
  ScrollTrigger.create({
    start: 120, end: 'max',
    onUpdate: function (self) { header.classList.toggle('nav-hidden', self.direction === 1 && self.scroll() > 400); }
  });

  // --- Compteurs des chiffres clés
  $$('#top + section span[style*="font-size: 48px"]').forEach(function (el) {
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var target = parseInt(node.textContent.replace(/\s/g, ''), 10);
    if (isNaN(target)) return;
    var obj = { v: 0 };
    node.textContent = '0';
    gsap.to(obj, {
      v: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { node.textContent = Math.round(obj.v).toLocaleString('fr-FR').replace(/ | /g, ' '); }
    });
  });
  gsap.from('#top + section > div > div', { opacity: 0, y: 40, duration: 0.9, stagger: 0.1, scrollTrigger: { trigger: '#top + section', start: 'top 92%' } });

  // --- Bandes défilantes : réagissent à la vitesse de scroll
  var bands = $$('.marquee').map(function (m) { return m.parentNode; });
  var skewTo = bands.map(function (b) { return gsap.quickTo(b, 'skewX', { duration: 0.5, ease: 'power3' }); });
  ScrollTrigger.create({
    onUpdate: function (self) {
      var s = gsap.utils.clamp(-8, 8, self.getVelocity() / -250);
      skewTo.forEach(function (fn, i) { fn(i % 2 ? -s : s); });
    }
  });
  bands.forEach(function (b, i) {
    gsap.from(b, { xPercent: i % 2 ? 20 : -20, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 95%' } });
  });

  // --- Titres de sections : mots qui montent
  $$('h2').forEach(function (h) {
    var words = splitWords(h);
    gsap.from(words, { yPercent: 110, rotate: 4, duration: 1, ease: 'expo.out', stagger: 0.045, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  // --- Petits sur-titres (eyebrows)
  $$('span[style*="letter-spacing: 0.14em"]').forEach(function (el) {
    if (el.closest('#top')) return;
    gsap.from(el, { opacity: 0, x: -24, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  // --- Paragraphes d'intro de section
  $$('section h2 + p, section div > p[style*="max-width: 380px"], section div > p[style*="max-width: 400px"]').forEach(function (p) {
    if (p.closest('#top')) return;
    gsap.from(p, { opacity: 0, y: 24, duration: 0.9, delay: 0.15, scrollTrigger: { trigger: p, start: 'top 92%' } });
  });

  // --- Cartes, listes, figures : apparition en cascade
  var cards = $$('main article, article, figure, ol > li, details, #contact form, #apropos > div, [aria-label="Mes métiers"] + section span')
    .filter(function (el) { return !el.closest('#top') && !el.closest('#gallery'); })
    .filter(function (el, i, arr) { return !arr.some(function (o) { return o !== el && o.contains(el); }); });
  gsap.set(cards, { opacity: 0, y: 60 });
  ScrollTrigger.batch(cards, {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', clearProps: 'transform' });
    }
  });
  gsap.from('#gallery .tile', { opacity: 0, y: 50, duration: 0.8, stagger: 0.06, clearProps: 'transform', scrollTrigger: { trigger: '#gallery', start: 'top 90%' } });
  gsap.from('#filters .chip, #budgets .chip', { opacity: 0, y: 16, duration: 0.5, stagger: 0.05, scrollTrigger: { trigger: '#filters', start: 'top 92%' } });

  // --- Parallaxe des photos
  $$('img').forEach(function (img) {
    if (img.closest('#top') || img.closest('#gallery') || img.closest('#video-list') || img.closest('header')) return;
    var box = img.parentNode;
    if (getComputedStyle(box).overflow !== 'hidden') return;
    gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
      yPercent: 7, scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  gsap.to(heroImg, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  // --- Grand bandeau final
  var finalCta = $('#joindre > div');
  if (finalCta) {
    gsap.fromTo(finalCta, { scale: 0.88, borderRadius: '64px' }, { scale: 1, borderRadius: '32px', ease: 'none', scrollTrigger: { trigger: finalCta, start: 'top bottom', end: 'top 45%', scrub: true } });
  }

  // --- Offre vedette : légère respiration
  var featured = $('#offres > article');
  if (featured) gsap.fromTo(featured, { clipPath: 'inset(0% 12% 0% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: featured, start: 'top bottom', end: 'top 55%', scrub: true } });

  // --- WhatsApp flottant
  var wa = $('a[aria-label="Écrire sur WhatsApp"]');
  if (wa) {
    wa.classList.add('wa-pulse');
    gsap.from(wa, { y: 120, opacity: 0, duration: 1, ease: 'back.out(1.6)', delay: 2.4 });
  }

  /* ---------- Interactions souris ---------- */
  function bindTilt(els) {
    if (!finePointer) return;
    els.forEach(function (el) {
      if (el._tilt) return; el._tilt = true;
      el.classList.add('tilt');
      var rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
      var ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      el.addEventListener('mouseleave', function () { rx(0); ry(0); });
    });
  }
  bindTilt($$('.lift'));

  if (finePointer) {
    // Boutons magnétiques
    $$('a[style*="border-radius: 999px"], button.chip').forEach(function (btn) {
      if (btn.closest('.navlinks')) return;
      var mx = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
      var my = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.25);
        my((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('mouseleave', function () { mx(0); my(0); });
    });

    // Curseur personnalisé
    var cursor = $('.cursor');
    var cx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
    var cy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
    window.addEventListener('mousemove', function (e) { cursor.style.opacity = 1; cx(e.clientX); cy(e.clientY); });
    document.addEventListener('mouseleave', function () { cursor.style.opacity = 0; });
    document.addEventListener('mouseover', function (e) {
      cursor.classList.toggle('big', !!e.target.closest('a, button, summary, input, select, textarea, .lift'));
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
