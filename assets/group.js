/* Shared shell for every prototype page: header, mega menu, phone menu, footer, prototype ribbon, address map,
   product cards, cart / wishlist (kept in this browser), Inquire-now and video pop-ups, hero slider.
   Pages load: assets/site-<site>.js (SITE), assets/content-<site>.js (CONTENT), this file, assets/pages.js.
   Prototype only: no link goes to the live sites and nothing is sent anywhere. */
(() => {
  const S = window.SITE, C = window.CONTENT || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- address map: live address (kept for SEO) -> prototype template ---------- */
  const ROUTES = {
    be: [
      [/^\/$/, 'bathemp.html', 'Home'],
      [/^\/(shop|bathroom-products-categories|kitchen-products-categories)\/$/, 'be-shop.html', 'Shop / department'],
      [/^\/product-category\//, 'be-category.html', 'Product category'],
      [/^\/product\//, 'be-product.html', 'Product'],
      [/^\/brands\//, 'be-brand.html', 'Brand'],
      [/^\/our-brands\/$/, 'be-brands.html', 'All brands'],
      [/^\/blog\/$/, 'be-blog.html', 'Blog'],
      [/^\/aboutus\/$/, 'be-about.html', 'About'],
      [/^\/contact\/$/, 'be-contact.html', 'Contact'],
      [/^\/getaquote\/$/, 'be-quote.html', 'Get a quote'],
      [/^\/(design-services|bathroom-design-services|kitchen-design-services|installation-services|kitchen-cabinets)\/$/, 'be-service.html', 'Service page'],
      [/^\/(portfolio|bathrooms|kitchens-portfolio|closets-portfolio|office-library-portfolio|bar-portfolio|recent-project-videos|laundry)\/$/, 'be-projects.html', 'Portfolio'],
      [/^\/experience-centre\/$/, 'be-experience.html', 'Experience Centre (new)'],
      [/^\/cart\/$/, 'be-cart.html', 'Cart (new)'],
      [/^\/checkout\/$/, 'be-checkout.html', 'Checkout (new)'],
      [/^\/checkout\/order-received\//, 'be-order.html', 'Order confirmed (new)'],
      [/^\/my-account\//, 'be-account.html', 'My account (new)'],
      [/^\/wishlist\/$/, 'be-wishlist.html', 'Wishlist'],
      [/^\/(shipping-policy|returns|privacy-policy|terms)\/$/, 'be-policy.html', 'Policy page (new)'],
      [/^\/\?s=/, 'be-search.html', 'Search results'],
      [/^\/404\/$/, 'be-404.html', 'Page not found'],
      [/^\/[a-z0-9-]+-(for|in)-[a-z-]+\/$/, 'be-city.html', 'Local SEO article (city page)'],
      [/^\/[a-z0-9-]+\/$/, 'be-post.html', 'Article'],
    ],
    ck: [
      [/^\/$/, 'castle.html', 'Home'],
      [/^\/appliances\/$/, 'ck-appliances.html', 'Appliances landing'],
      [/^\/product-category\//, 'ck-category.html', 'Product category'],
      [/^\/product\//, 'ck-product.html', 'Product'],
      [/^\/our-brands\/$/, 'ck-brands.html', 'All brands'],
      [/^\/(outdoor-kitchens-toronto|backyard-kitchens|outdoor-kitchens-promotions|lynx-grills-toronto-canada|kamado-joe-canada-grills|best-outdoor-pizza-ovens|urban-bonfire-outdoor-kitchen-cabinets|brand\/station-grill)\/$/, 'ck-outdoor.html', 'Outdoor kitchens landing'],
      [/^\/(special-offers-promotions|[a-z-]*promotions?|[a-z-]*-promo|[a-z-]*-deals|miele-appliances)\/$/, 'ck-promotion.html', 'Brand promotion'],
      [/^\/(kitchen-remodeling-toronto|kitchen-renovation-in-toronto|white-kitchen-cabinets|modern-kitchen-cabinets-toronto|kitchen-countertops|storage-solutions)\/$/, 'ck-service.html', 'Kitchen service page'],
      [/^\/(modern-kitchens|transitional-kitchens|traditional-kitchens|kitchen-islands|bathroom-vanities|closets-home-office-home-library|bars-media-centers-fire-places)\/$/, 'ck-gallery.html', 'Portfolio gallery'],
      [/^\/(projects|kitchen-bathroom-project-videos)\/$/, 'ck-projects.html', 'Projects'],
      [/^\/projects\/[a-z0-9-]+\/$/, 'ck-project.html', 'Single project (new)'],
      [/^\/(our-factory|our-process|our-standards|what-makes-us-different|custom-kitchens-for-architects-and-designers|multi-housing-projects|new-dealer)\/$/, 'ck-about.html', 'Company / trade page'],
      [/^\/testimonials\/$/, 'ck-testimonials.html', 'Testimonials'],
      [/^\/blog\/$/, 'ck-blog.html', 'Blog'],
      [/^\/contact\/$/, 'ck-contact.html', 'Contact'],
      [/^\/experience-centre\/$/, 'ck-experience.html', 'Experience Centre (new)'],
      [/^\/cart\/$/, 'ck-cart.html', 'Cart (new)'],
      [/^\/checkout\/$/, 'ck-checkout.html', 'Checkout (new)'],
      [/^\/checkout\/order-received\//, 'ck-order.html', 'Order confirmed (new)'],
      [/^\/my-account\//, 'ck-account.html', 'My account'],
      [/^\/wishlist\/$/, 'ck-wishlist.html', 'Wishlist (new)'],
      [/^\/(shipping-policy|returns|privacy-policy|terms)\/$/, 'ck-policy.html', 'Policy page (new)'],
      [/^\/\?s=/, 'ck-search.html', 'Search results'],
      [/^\/404\/$/, 'ck-404.html', 'Page not found'],
      [/^\/[a-z0-9-]+\/$/, 'ck-post.html', 'Article'],
    ],
  };
  const route = (live, pre = S.pre) => ROUTES[pre].find(([re]) => re.test(live)) || ROUTES[pre][ROUTES[pre].length - 1];
  /** Prototype href for a live address. 'ck:/x/' or 'be:/x/' = the other site. */
  const url = live => {
    let pre = S.pre, l = String(live || '/');
    const m = l.match(/^(be|ck):(.*)$/); if (m) { pre = m[1]; l = m[2]; }
    const [, file] = route(l, pre);
    return /^\/$/.test(l) ? file : `${file}?live=${encodeURIComponent(l)}`;
  };
  const qs = k => new URLSearchParams(location.search).get(k);
  const live = qs('live') || document.body.dataset.live || '/';

  /* ---------- icons ---------- */
  const ico = {
    drop: '<svg viewBox="0 0 40 40" aria-hidden="true"><path fill="#fff" d="M20 3c6 9 12 15.5 12 22.5A12 12 0 0 1 8 25.5C8 18.5 14 12 20 3z"/></svg>',
    castle: '<svg viewBox="0 0 40 40" aria-hidden="true"><path fill="#fff" d="M6 4h6v5h4V4h8v5h4V4h6v13h-3v19H24V27a4 4 0 0 0-8 0v9H9V17H6z"/></svg>',
    oven: '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2.6"><rect x="5" y="4" width="30" height="32" rx="1.5"/><path d="M5 12h30M10 8h2M16 8h2M22 8h2M28 8h2"/><rect x="10" y="17" width="20" height="14"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9-9.6C2 7.5 4.2 4.5 7.5 4.5c2 0 3.6 1.1 4.5 2.7.9-1.6 2.5-2.7 4.5-2.7 3.3 0 5.5 3 4.5 6.4-1.5 5-9 9.6-9 9.6z"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    down: '<svg viewBox="0 0 10 10"><path d="m1 3 4 4 4-4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M4 12h15m-5-5 5 5-5 5"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M5 3l16 9-16 9z"/></svg>',
  };
  const brands = [
    { id: 'bath', icon: 'drop', name: 'Bath', sub: 'Emporium', href: 'bathemp.html' },
    { id: 'kitchens', icon: 'castle', name: 'Castle', sub: 'Kitchens · CA', href: 'castle.html' },
    { id: 'appliances', icon: 'oven', name: 'Castle', sub: 'Appliances', href: 'ck-appliances.html?live=%2Fappliances%2F' },
  ];

  /* ---------- products, cart, wishlist (per site, in this browser) ---------- */
  const key = k => `${S.id}_${k}`;
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(key(k))) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(key(k), JSON.stringify(v)); } catch {} };
  const all = () => [...(S.products || []), ...(C.priced || []), ...(C.products || []), ...(C.detail || []).map(d => ({ ...d, img: d.imgs?.[0] }))];
  const product = id => all().find(p => String(p.id) === String(id));
  let wish = load('wish', []), cart = load('cart2', []), cur = load('cur', 'CAD');
  if (!Array.isArray(cart)) cart = [];
  const RATE = { CAD: 1, USD: 0.75 }; // same fixed rate as Bliss
  const money = (v, c = cur) => `$ ${(v * RATE[c]).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>${c}</small>`;
  const Cart = {
    items: () => cart.map(i => ({ ...i, p: product(i.id) })).filter(i => i.p),
    count: () => cart.reduce((n, i) => n + i.qty, 0),
    add(id, qty = 1) { const i = cart.find(x => x.id === id); i ? i.qty += qty : cart.push({ id, qty }); this.save(); },
    set(id, qty) { cart = qty > 0 ? cart.map(i => i.id === id ? { ...i, qty } : i) : cart.filter(i => i.id !== id); this.save(); },
    clear() { cart = []; this.save(); },
    save() { save('cart2', cart); counts(); document.dispatchEvent(new Event('cart:change')); },
    subtotal() { return this.items().reduce((s, i) => s + (i.p.p || 0) * i.qty, 0); },
  };

  const card = p => `<article class="card">
      <a class="im" href="${url(p.live)}">${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}<img src="${p.img}" alt="${esc(p.n)}" loading="lazy" width="640" height="640"></a>
      <button class="wish" data-wish="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Save ${esc(p.n)} to wishlist">${ico.heart}</button>
      <div class="br">${esc(p.b)}</div><h3><a href="${url(p.live)}">${esc(p.n)}</a></h3>
      <div class="pr">${p.p ? money(p.p) : '<small>Price on request</small>'}</div>
      <div class="acts">${p.p ? `<button class="btn dark" data-add="${p.id}">Add to cart</button><button class="ilink" data-inq="${p.id}">Inquire now</button>` : `<button class="btn line" data-inq="${p.id}">Inquire now</button>`}</div>
    </article>`;

  /* ---------- header ---------- */
  const tpl = route(live)[2];
  const brandHtml = brands.map((b, i) => `${i ? '<span class="sep"></span>' : ''}<a class="brand${S.active.includes(b.id) ? ' on' : ''}" href="${b.href}">${ico[b.icon]}<b>${b.name}<small>${b.sub}</small></b></a>`).join('');
  const navHtml = S.menu.map((m, i) => m.mega
    ? `<li><button aria-expanded="false" aria-controls="mega${i}">${m.label}${ico.down}</button><div class="mega" id="mega${i}"><div class="wrap">${m.mega.map(c => `<div><h4>${c.h}</h4><ul>${c.links.map(([t, u]) => `<li><a href="${url(u)}">${t}</a></li>`).join('')}</ul></div>`).join('')}${m.feat ? `<a class="feat" href="${url(m.feat.u)}"><img src="${m.feat.img}" alt="" loading="lazy"><span>${m.feat.t} →</span></a>` : '<div></div>'}</div></div></li>`
    : `<li><a href="${url(m.u)}"${m.sale ? ' class="sale"' : ''}>${m.label}</a></li>`).join('');
  $('#hdr').outerHTML = `
  <div class="proto"><b>Prototype</b> · ${esc(tpl)} template · live address kept: <code>${esc(live.split('?')[0] === '/' ? '/' : live)}</code> · <a href="index.html">All templates</a> · <a href="${S.other}">See ${S.id === 'bathemp' ? 'Castle Kitchens' : 'Bath Emporium'}</a></div>
  <div class="util"><div class="wrap"><span class="l">${S.util}</span><div class="r"><a href="#" onclick="return false">(905) 944-0060</a><a href="${url('/experience-centre/')}">Visit the showroom</a><a href="${url('/my-account/')}">Trade program</a>${S.usd ? `<div class="cur" role="group" aria-label="Currency"><button data-cur="CAD">CAD</button><button data-cur="USD">USD</button></div>` : ''}</div></div></div>
  <header class="hdr" id="top">
    <div class="wrap brands-row">
      <button class="tool burger" aria-label="Menu" data-open-drawer>${ico.menu}</button>
      <nav class="brands" aria-label="Our brands">${brandHtml}</nav>
      <div class="tools">
        <button class="tool" aria-label="Search" data-open-search>${ico.search}</button>
        <a class="tool hide-sm" href="${url('/my-account/')}" aria-label="My account">${ico.user}</a>
        <a class="tool" href="${url('/wishlist/')}" aria-label="Wishlist">${ico.heart}<span class="n" data-wish-n></span></a>
        <a class="tool" href="${url('/cart/')}" aria-label="Cart">${ico.bag}<span class="n" data-cart-n></span></a>
      </div>
    </div>
    <nav class="nav" aria-label="Main"><div class="wrap"><ul>${navHtml}</ul></div></nav>
    <form class="searchbar" role="search" hidden action="${S.pre}-search.html"><div class="wrap"><label class="sr" for="q">Search</label><input id="q" name="q" placeholder="Search products, brands or model #" autocomplete="off"><input type="hidden" name="live" value="/?s="><button class="btn light">Search</button></div></form>
  </header>
  <div class="drawer" id="drawer"><div class="bg" data-close></div><div class="panel" role="dialog" aria-label="Menu">
    <button class="tool" data-close aria-label="Close" style="margin-left:auto">${ico.x.replace('<svg', '<svg style="stroke:#000"')}</button>
    <div class="brandlinks">${brands.map(b => `<a href="${b.href}">${b.name} ${b.sub}</a>`).join('')}</div>
    ${S.menu.map(m => m.mega ? `<details><summary>${m.label}</summary>${m.mega.map(c => `<ul>${c.links.map(([t, u]) => `<li><a href="${url(u)}">${t}</a></li>`).join('')}</ul>`).join('')}</details>` : `<a class="lnk" href="${url(m.u)}">${m.label}</a>`).join('')}
  </div></div>`;

  $$('.nav>.wrap>ul>li').forEach(li => {
    const b = $('button', li); if (!b) return;
    const set = o => { $$('.nav li.open').forEach(x => { if (x !== li) { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); } }); li.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); };
    let t; li.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => set(true), 120); });
    li.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => set(false), 160); });
    b.addEventListener('click', () => set(!li.classList.contains('open')));
  });
  const hdr = $('.hdr'); addEventListener('scroll', () => hdr.classList.toggle('stuck', scrollY > 40), { passive: true });
  const drawer = $('#drawer');

  /* ---------- footer ---------- */
  $('#ftr').outerHTML = `<footer class="ftr"><div class="wrap">
    <div class="top">
      <div class="news"><h4>Stay inspired</h4><p>New collections, showroom events and offers from Bath Emporium, Castle Kitchens and Castle Appliances.</p><form onsubmit="event.preventDefault();G.toast('Thanks for signing up (prototype: nothing was sent)')"><label class="sr" for="nl">Email</label><input id="nl" type="email" placeholder="Your email address"><button>Sign up</button></form></div>
      ${S.footer.map(c => `<div><h4>${c.h}</h4><ul>${c.links.map(([t, u]) => `<li><a href="${url(u)}">${t}</a></li>`).join('')}</ul></div>`).join('')}
      <div><h4>Showroom</h4><ul><li>5 Shields Court, Unit 100<br>Markham, ON L3R 0G3</li><li>(905) 944-0060</li><li>1-866-880-5446</li><li>Mon–Fri 9–7 · Sat 9–5 · Sun 12–5</li><li><a href="${url('/experience-centre/')}">Plan your visit</a></li></ul></div>
    </div>
    <div class="bot"><span>© 2026 ${S.legal}</span><span><a href="${url('/privacy-policy/')}">Privacy</a> · <a href="${url('/terms/')}">Terms</a> · <a href="${url('/shipping-policy/')}">Shipping</a> · <a href="${url('/returns/')}">Returns</a></span></div>
  </div></footer>`;

  /* ---------- pop-ups ---------- */
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="inq" role="dialog" aria-modal="true" aria-labelledby="inqH"><div class="box">
    <button class="x" data-close aria-label="Close">${ico.x}</button>
    <h3 id="inqH">Inquire now</h3><p style="margin:0;color:#6e6a66">A specialist from our Markham showroom will get back to you by email or phone.</p>
    <div class="prod"><img alt=""><div><b data-n></b><div style="font-size:13px;color:#6e6a66" data-b></div></div></div>
    <form><div class="row"><div><label for="f1">Name</label><input id="f1" required autocomplete="name"></div><div><label for="f2">Phone</label><input id="f2" type="tel" autocomplete="tel"></div></div>
    <label for="f3">Email</label><input id="f3" type="email" required autocomplete="email">
    <label for="f4">Message</label><textarea id="f4" rows="3">I'd like pricing and availability for this product.</textarea>
    <button class="btn dark">Send inquiry ${ico.arrow}</button></form>
  </div></div>
  <div class="modal video" id="vid" role="dialog" aria-modal="true" aria-label="Showroom tour"><div class="box"><button class="x" data-close aria-label="Close">${ico.x}</button><video controls playsinline preload="none"></video></div></div>
  <div class="modal lb" id="lb" role="dialog" aria-modal="true" aria-label="Photo"><div class="box"><button class="x" data-close aria-label="Close">${ico.x}</button><img alt=""></div></div>`);
  let lastFocus;
  const open = m => { lastFocus = document.activeElement; m.classList.add('on'); setTimeout(() => $('input,video,button.x', m)?.focus(), 30); };
  const closeAll = () => { $$('.modal.on').forEach(m => { m.classList.remove('on'); $('video', m)?.pause(); }); drawer.classList.remove('on'); lastFocus?.focus?.(); };
  const toast = msg => { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600); };
  $('#inq form').addEventListener('submit', e => { e.preventDefault(); closeAll(); toast('Thank you — the showroom will be in touch (prototype: nothing was sent)'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { $$('.nav li.open').forEach(x => x.classList.remove('open')); closeAll(); } });

  const counts = () => { $$('[data-wish-n]').forEach(n => { n.textContent = wish.length || ''; }); $$('[data-cart-n]').forEach(n => { n.textContent = Cart.count() || ''; }); };
  const renderCards = () => $$('[data-products]').forEach(el => { const list = el._list || S.products; el.innerHTML = list.map(card).join(''); });
  const setCur = c => { cur = c; save('cur', c); $$('[data-cur]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === c))); renderCards(); document.dispatchEvent(new Event('cur:change')); };

  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-drawer]')) drawer.classList.add('on');
    if (e.target.closest('#drawer [data-close]')) drawer.classList.remove('on');
    if (e.target.closest('[data-open-search]')) { const f = $('.searchbar'); f.hidden = !f.hidden; if (!f.hidden) $('#q').focus(); }
    const c = e.target.closest('[data-cur]'); if (c) setCur(c.dataset.cur);
    const w = e.target.closest('[data-wish]');
    if (w) { const id = w.dataset.wish; wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id]; save('wish', wish); $$(`[data-wish="${id}"]`).forEach(b => b.setAttribute('aria-pressed', String(wish.includes(id)))); counts(); toast(wish.includes(id) ? 'Saved to your wishlist' : 'Removed from your wishlist'); document.dispatchEvent(new Event('wish:change')); }
    const a = e.target.closest('[data-add]');
    if (a) { Cart.add(a.dataset.add, +(a.dataset.qty || $('#qty')?.value || 1)); toast('Added to cart'); }
    const q = e.target.closest('[data-inq]');
    if (q) { const p = product(q.dataset.inq) || {}, m = $('#inq'); $('.prod', m).hidden = !p.n; $('.prod img', m).src = p.img || p.imgs?.[0] || ''; $('[data-n]', m).textContent = p.n || ''; $('[data-b]', m).textContent = p.b || ''; open(m); }
    const v = e.target.closest('[data-video]');
    if (v) { e.preventDefault(); const m = $('#vid'), vid = $('video', m); if (vid.src !== v.dataset.video) vid.src = v.dataset.video; open(m); vid.play().catch(() => {}); }
    const l = e.target.closest('[data-lb]');
    if (l) { e.preventDefault(); $('#lb img').src = l.dataset.lb; open($('#lb')); }
    if (e.target.matches('.modal') || e.target.closest('.modal [data-close]')) closeAll();
  });

  /* ---------- hero slider ---------- */
  const initHero = () => {
    const slides = $$('.hero .slide'); if (slides.length < 2) return;
    const dots = $('.hero .dots'), pp = $('.hero .pp');
    let i = 0, timer, playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    dots.innerHTML = slides.map((_, n) => `<button aria-label="Slide ${n + 1}"></button>`).join('');
    const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', String(k !== i)); }); $$('button', dots).forEach((d, k) => d.setAttribute('aria-current', String(k === i))); };
    const run = () => { clearInterval(timer); if (playing) timer = setInterval(() => go(i + 1), 6500); pp.innerHTML = playing ? '<svg viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>' : '<svg viewBox="0 0 14 14"><path d="M3 1l10 6-10 6z"/></svg>'; pp.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow'); };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { go($$('button', dots).indexOf(b)); run(); } });
    pp.addEventListener('click', () => { playing = !playing; run(); });
    go(0); run();
  };

  /* links written in page HTML as data-live="/live/address/" */
  const hydrate = (root = document) => $$('a[data-live]', root).forEach(a => { a.href = url(a.dataset.live); });

  window.G = { $, $$, esc, url, qs, live, route, ico, money, card, product, all, Cart, toast, open, closeAll, hydrate, renderCards,
    wish: () => wish, cur: () => cur, S, C };
  document.title = document.title || S.name;
  window.addEventListener('DOMContentLoaded', () => {
    if (window.PAGE) window.PAGE();
    hydrate(); initHero();
    if (S.usd) setCur(cur); else renderCards();
    counts();
  });
})();
