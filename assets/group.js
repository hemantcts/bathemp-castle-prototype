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
      [/^\/showroom\/$/, 'be-showroom.html', 'Showroom (new)'],
      [/^\/cart\/$/, 'be-cart.html', 'Cart (new)'],
      [/^\/checkout\/$/, 'be-checkout.html', 'Checkout (new)'],
      [/^\/checkout\/order-received\//, 'be-order.html', 'Order confirmed (new)'],
      [/^\/my-account\//, 'be-account.html', 'My account (new)'],
      [/^\/wishlist\/$/, 'be-wishlist.html', 'Wishlist'],
      [/^\/(shipping|returns|privacy-policy|payment-methods)\/$/, 'be-policy.html', 'Policy page'],
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
      [/^\/brand\/[a-z0-9-]+\/$/, 'ck-brand.html', 'Brand'],
      [/^\/(outdoor-kitchens-toronto|backyard-kitchens|outdoor-kitchens-promotions|lynx-grills-toronto-canada|kamado-joe-canada-grills|best-outdoor-pizza-ovens|urban-bonfire-outdoor-kitchen-cabinets)\/$/, 'ck-outdoor.html', 'Outdoor kitchens landing'],
      [/^\/(special-offers-promotions|[a-z-]*promotions?|[a-z-]*-promo|[a-z-]*-deals|miele-appliances)\/$/, 'ck-promotion.html', 'Brand promotion'],
      [/^\/(door-styles|maple|birch|oak|walnut|mdf|melemine|high-gloss|thermo|etc|kitchen-countertops|quartz|granite|marble|edge-profiles|kitchen-accessories-and-organizers|spice-racks|drawer-organizers|corner-solutions|kitchen-island)\/$/, 'ck-materials.html', 'Door styles / countertops / accessories'],
      [/^\/(kitchen-remodeling-toronto|kitchen-renovation-in-toronto|white-kitchen-cabinets|modern-kitchen-cabinets-toronto|storage-solutions)\/$/, 'ck-service.html', 'Kitchen service page'],
      [/^\/(modern-kitchens|transitional-kitchens|traditional-kitchens|kitchen-islands|bathroom-vanities|closets-home-office-home-library|bars-media-centers-fire-places)\/$/, 'ck-gallery.html', 'Portfolio gallery'],
      [/^\/(projects|kitchen-bathroom-project-videos)\/$/, 'ck-projects.html', 'Projects'],
      [/^\/projects\/[a-z0-9-]+\/$/, 'ck-project.html', 'Single project (new)'],
      [/^\/(project-mcvean|lakeside-kitchen-project|granite-ridge-kitchen-bathroom-project|golden-tulip-project|angus-glen-project|smoothwater-project|sideline-project-pickering|cheiftain-project|white-kitchen-2)\/$/, 'ck-project.html', 'Project'],
      [/^\/(our-factory|our-process|our-standards|what-makes-us-different|custom-kitchens-for-architects-and-designers|multi-housing-projects|new-dealer)\/$/, 'ck-about.html', 'Company / trade page'],
      [/^\/testimonials\/$/, 'ck-testimonials.html', 'Testimonials'],
      [/^\/blog\/$/, 'ck-blog.html', 'Blog'],
      [/^\/contact\/$/, 'ck-contact.html', 'Contact'],
      [/^\/experience-centre\/$/, 'ck-experience.html', 'Experience Centre (new)'],
      [/^\/(kitchen-showroom-toronto|showroom)\/$/, 'ck-showroom.html', 'Showroom'],
      [/^\/cart\/$/, 'ck-cart.html', 'Cart (new)'],
      [/^\/checkout\/$/, 'ck-checkout.html', 'Checkout (new)'],
      [/^\/checkout\/order-received\//, 'ck-order.html', 'Order confirmed (new)'],
      [/^\/my-account\//, 'ck-account.html', 'My account'],
      [/^\/wishlist\/$/, 'ck-wishlist.html', 'Wishlist (new)'],
      [/^\/(shipping-info|returns|privacy-policy|payment-methods)\/$/, 'ck-policy.html', 'Policy page (new)'],
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
    drop: '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M20 4.5c6 8.4 11 14.6 11 21A11 11 0 0 1 9 25.5c0-6.4 5-12.6 11-21z"/><path d="M14.5 27a5.5 5.5 0 0 0 5.5 5.5"/></svg>',
    castle: '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M8.5 35V15.5H6V5.5h5v4h4.5v-4h9v4H29v-4h5v10h-2.5V35H24v-7a4 4 0 0 0-8 0v7z"/></svg>',
    oven: '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><rect x="6.5" y="5" width="27" height="30" rx="1"/><path d="M6.5 12h27M11 8.5h2M16.5 8.5h2M22 8.5h2"/><rect x="11" y="16.5" width="18" height="13.5"/></svg>',
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
    { id: 'kitchens', icon: 'castle', name: 'Castle', sub: 'Kitchens', href: 'castle.html' },
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

  /* finish name -> swatch colour (Kohler-style finish chips) */
  const FIN = [[/matte black|black/i, '#1d1d1d'], [/brushed gold|gold|brass|champagne/i, '#c9a25e'], [/rose/i, '#c99a86'], [/polished nickel/i, '#d9d3c7'], [/brushed nickel|satin nickel|nickel/i, '#b8b2a7'],
    [/stainless|steel/i, '#c3c6c9'], [/bronze|oil rubbed/i, '#5e4632'], [/copper/i, '#b87348'], [/white/i, '#f7f7f5'], [/grey|gray|graphite|anthracite/i, '#6f7173'], [/chrome|polished/i, '#e4e7ea']];
  const swatch = f => (FIN.find(([re]) => re.test(f)) || [, '#ddd'])[1];
  const finishes = p => Object.entries(p.atts || {}).find(([k]) => /finish|colou?r/i.test(k))?.[1] || [];
  const model = n => (String(n || '').match(/\b(?=[A-Z0-9-]*\d)[A-Z0-9][A-Z0-9-]{3,}\b/) || [''])[0];
  const card = p => {
    const fs = finishes(p), m = model(p.n);
    return `<article class="card">
      <a class="im" href="${url(p.live)}">${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}<img src="${p.img}" alt="${esc(p.n)}" loading="lazy" width="640" height="640"></a>
      <button class="wish" data-wish="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Save ${esc(p.n)} to wishlist">${ico.heart}</button>
      ${fs.length ? `<div class="dots" aria-label="${fs.length} finishes">${fs.slice(0, 5).map(f => `<i style="background:${swatch(f)}" title="${esc(f)}"></i>`).join('')}${fs.length > 5 ? `<small>+${fs.length - 5}</small>` : ''}</div>` : '<div class="dots"></div>'}
      <div class="br">${esc(p.b)}</div><h3><a href="${url(p.live)}">${esc(p.n)}</a></h3>${m ? `<div class="mdl">${esc(m)}</div>` : ''}
      <div class="pr">${p.p ? money(p.p) : '<small>Price on request</small>'}</div>
      <div class="acts">${p.p ? `<button class="btn dark" data-add="${p.id}">Add to cart</button><button class="ilink" data-inq="${p.id}">Inquire now</button>` : `<button class="btn line" data-inq="${p.id}">Inquire now</button>`}</div>
    </article>`;
  };

  /* ---------- header ---------- */
  const tpl = route(live)[2];
  const navHtml = S.menu.map((m, i) => m.mega
    ? `<li><button aria-expanded="false" aria-controls="mega${i}">${m.label}${ico.down}</button><div class="mega" id="mega${i}"><div class="wrap mgrid" style="--cols:${m.mega.length}"><div class="mcols">${m.mega.map(c => `<div><h4>${c.h}</h4><ul>${c.links.map(([t, u]) => `<li><a href="${url(u)}">${t}</a></li>`).join('')}</ul></div>`).join('')}</div>${m.feat ? `<a class="feat" href="${url(m.feat.u)}"><img src="${m.feat.img}" alt="" loading="lazy"><span><small>Explore</small>${m.feat.t} →</span></a>` : ''}</div>
      <div class="mbar"><div class="wrap">${m.feat ? `<a href="${url(m.feat.u)}">View all ${esc(m.label.toLowerCase())} →</a>` : ''}<span>Need help choosing? <a href="${url('/experience-centre/')}">Book a showroom visit</a> · (905) 944-0060</span></div></div></div></li>`
    : `<li><a href="${url(m.u)}"${m.sale ? ' class="sale"' : ''}>${m.label}${m.badge ? `<em class="nbadge" aria-label="up to ${esc(m.badge)}"><small>up to</small> ${esc(m.badge)}</em>` : ''}</a></li>`).join('');
  $('#hdr').outerHTML = `
  <div class="util"><div class="wrap"><nav class="sisters" aria-label="Our brands">${brands.map(b => `<a href="${b.href}"${S.active.includes(b.id) ? ' aria-current="true"' : ''}>${b.name} ${b.sub}</a>`).join('')}</nav><div class="r"><a href="#" onclick="return false">(905) 944-0060</a><a href="${url(S.showroomLive)}">Visit the showroom</a><a class="uic" href="${url('/my-account/')}" aria-label="My account">${ico.user}</a><a class="uic" href="${url('/wishlist/')}" aria-label="Wishlist">${ico.heart}<span class="n" data-wish-n></span></a>${S.usd ? `<div class="cur" role="group" aria-label="Currency"><button data-cur="CAD">CAD</button><button data-cur="USD">USD</button></div>` : ''}</div></div></div>
  <header class="hdr" id="top">
    <div class="wrap bar">
      <button class="tool burger" aria-label="Menu" data-open-drawer>${ico.menu}</button>
      <div class="logos-own">${[(() => { const app = S.active.includes('appliances') && /^\/(appliances\/|product-category\/(appliances|coffee-machines|display-clearance)|product\/|brand\/|our-brands\/|special-offers-promotions\/|[a-z-]*(promotion|promo|deals)[a-z-]*\/|miele-appliances\/)/.test(live); return brands.find(x => x.id === (app ? 'appliances' : S.active[0])); })()].map(m => `<a class="logo" href="${m.href}" aria-label="${m.name} ${m.sub}">${ico[m.icon]}<b>${m.name}<small>${m.sub}</small></b></a>`).join('<span class="sep"></span>')}</div>
      <nav class="trio" aria-label="Our brands">${brands.map(b => `<a class="logo${S.active.includes(b.id) ? ' on' : ''}" href="${b.href}">${ico[b.icon]}<b>${b.name}<small>${b.sub}</small></b></a>`).join('<span class="sep"></span>')}</nav>
      <nav class="nav" aria-label="Main"><div class="wrap"><ul>${navHtml}</ul></div></nav>
      <div class="tools">
        <button class="tool" aria-label="Search" data-open-search>${ico.search}</button>
        <a class="tool" href="${url('/cart/')}" aria-label="Cart" data-open-cart>${ico.bag}<span class="n" data-cart-n></span></a>
      </div>
    </div>
    <form class="searchbar" role="search" hidden action="${S.pre}-search.html"><div class="wrap"><label class="sr" for="q">Search</label><input id="q" name="q" placeholder="Search products, brands or model #" autocomplete="off"><input type="hidden" name="live" value="/?s="><button class="btn light">Search</button></div></form>
  </header>
  <div class="drawer" id="drawer"><div class="bg" data-close></div><div class="panel" role="dialog" aria-label="Menu">
    <button class="tool" data-close aria-label="Close" style="margin-left:auto">${ico.x.replace('<svg', '<svg style="stroke:#000"')}</button>
    <div class="brandlinks">${brands.map(b => `<a href="${b.href}">${b.name} ${b.sub}</a>`).join('')}</div>
    ${S.menu.map(m => m.mega ? `<details><summary>${m.label}</summary>${m.mega.map(c => `<ul>${c.links.map(([t, u]) => `<li><a href="${url(u)}">${t}</a></li>`).join('')}</ul>`).join('')}</details>` : `<a class="lnk" href="${url(m.u)}">${m.label}${m.badge ? `<em class="nbadge"><small>up to</small> ${esc(m.badge)}</em>` : ''}</a>`).join('')}
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
      <div><h4>Showroom</h4><ul><li>5 Shields Court, Unit 100<br>Markham, ON L3R 0G3</li><li>(905) 944-0060</li><li>Mon–Fri 9–7<br>Sat 9–5<br>Sun 12–5</li><li><a href="${url(S.showroomLive)}">Directions &amp; hours</a></li></ul></div>
    </div>
    <div class="bot"><span>© 2026 ${S.legal}</span><span><a href="${url('/privacy-policy/')}">Privacy</a> · <a href="${url(S.shipLive)}">Shipping</a> · <a href="${url('/returns/')}">Returns</a> · <a href="${url('/payment-methods/')}">Payment</a></span></div>
    <p class="credit">Designed and Developed by <a href="https://cresttechnosoft.com/" target="_blank" rel="noopener">Cresttechnosoft</a></p>
  </div></footer>`;

  /* ---------- pop-ups ---------- */
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="inq" role="dialog" aria-modal="true" aria-labelledby="inqH"><div class="box">
    <button class="x" data-close aria-label="Close">${ico.x}</button>
    <h3 id="inqH">Inquire now</h3><p style="margin:0;color:#6b6b6b">A specialist from our Markham showroom will get back to you by email or phone.</p>
    <div class="prod"><img alt=""><div><b data-n></b><div style="font-size:13px;color:#6b6b6b" data-b></div></div></div>
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
    if (a) { Cart.add(a.dataset.add, +(a.dataset.qty || $('#qty')?.value || 1)); openCart(a.dataset.add); }
    if (e.target.closest('[data-open-cart]') && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openCart(); }
    if (e.target.closest('#cartDrawer [data-close]') || e.target.matches('#cartDrawer')) closeCart();
    const cs = e.target.closest('#cartDrawer [data-set]'); if (cs) { Cart.set(cs.dataset.set, +cs.dataset.v); openCart(); }
    if (e.target.closest('[data-express]')) { e.preventDefault(); toast('Express checkout opens Apple Pay / Google Pay / PayPal here (prototype)'); }
    const vt = e.target.closest('[data-video-toggle]'); if (vt) { const v = $('[data-hero-video]'); if (v) { v.paused ? v.play() : v.pause(); } }
    const q = e.target.closest('[data-inq]');
    if (q) { const p = product(q.dataset.inq) || {}, m = $('#inq'); $('.prod', m).hidden = !p.n; $('.prod img', m).src = p.img || p.imgs?.[0] || ''; $('[data-n]', m).textContent = p.n || ''; $('[data-b]', m).textContent = p.b || ''; open(m); }
    const yt = e.target.closest('[data-yt]');
    if (yt) { yt.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0" title="Project video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; return; }
    const v = e.target.closest('[data-video]');
    if (v) { e.preventDefault(); const m = $('#vid'), vid = $('video', m); if (vid.src !== v.dataset.video) vid.src = v.dataset.video; open(m); vid.play().catch(() => {}); }
    const l = e.target.closest('[data-lb]');
    if (l) { e.preventDefault(); $('#lb img').src = l.dataset.lb; open($('#lb')); }
    if (e.target.matches('.modal') || e.target.closest('.modal [data-close]')) closeAll();
  });

  /* ---------- hero slider ---------- */
  const initHero = () => {
    const hero = $('.hero'); if (!hero) return;
    const slides = $$('.slide', hero); if (slides.length < 2) return;
    const dots = $('.dots', hero), pp = $('.pp', hero);
    let i = 0, timer, playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    dots.innerHTML = slides.map((_, n) => `<button aria-label="Slide ${n + 1}"></button>`).join('');
    const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', String(k !== i)); }); $$('button', dots).forEach((d, k) => d.setAttribute('aria-current', String(k === i))); };
    const run = () => { clearInterval(timer); if (playing) timer = setInterval(() => go(i + 1), 6500); pp.innerHTML = playing ? '<svg viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>' : '<svg viewBox="0 0 14 14"><path d="M3 1l10 6-10 6z"/></svg>'; pp.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow'); };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { go($$('button', dots).indexOf(b)); run(); } });
    pp.addEventListener('click', () => { playing = !playing; run(); });
    go(0); run();
  };

  /* ---------- header option for the client: A = showroom video, B = shop-first slideshow (?hero=a|b) ---------- */
  // header layout option for the client: a = logos left (default), b = logos centred. ?header=a|b, remembered.
  const hdrOpt = (() => { const q = qs('header'); if (q === 'a' || q === 'b') { try { localStorage.setItem('hdr_opt', q); } catch {} return q; } try { return localStorage.getItem('hdr_opt') || 'a'; } catch { return 'a'; } })();
  document.body.classList.toggle('hdr-center', hdrOpt === 'b');

  /* ---------- hero video (Kohler style): plays muted, starts after the storefront shot, poster for reduced motion ---------- */
  const initVideo = () => {
    const v = $('[data-hero-video]'); if (!v) return;
    const start = +v.dataset.start || 0, btn = $('[data-video-toggle]');
    const icon = () => { if (!btn) return; btn.innerHTML = v.paused ? '<svg viewBox="0 0 14 14"><path d="M3 1l10 6-10 6z"/></svg>' : '<svg viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>'; btn.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video'); };
    v.addEventListener('loadedmetadata', () => { if (start) v.currentTime = start; });
    v.addEventListener('ended', () => { v.currentTime = start; v.play(); });
    v.addEventListener('play', icon); v.addEventListener('pause', icon);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { v.preload = 'auto'; v.play().catch(icon); } else icon();
    icon();
  };

  /* ---------- brand logo strip ---------- */
  const initLogos = () => $$('[data-logos]').forEach(el => { el.innerHTML = (S.logos || []).map(([n, src, u]) => `<a href="${url(u)}" aria-label="${esc(n)}"><img src="${src}" alt="${esc(n)}" loading="lazy" height="40"></a>`).join(''); });

  /* ---------- Instagram row (@bathempcastlekitchens) ---------- */
  const initIg = () => $$('[data-ig]').forEach(el => {
    el.innerHTML = (C.ig || []).slice().sort((a, b) => (Math.abs(a[1] / a[2] - 1) > .05) - (Math.abs(b[1] / b[2] - 1) > .05)).slice(0, 8).map(([src, w, h]) => `<a href="#" onclick="G.toast('Opens the post on Instagram (prototype)');return false" aria-label="Instagram post"><img src="${src}" alt="" loading="lazy" width="${w}" height="${h}"${Math.abs(w / h - 1) > .05 ? ' style="object-fit:contain"' : ''}></a>`).join('');
  });

  /* ---------- cart drawer: opens on Add to cart and from the header bag ---------- */
  document.body.insertAdjacentHTML('beforeend', '<div class="cdrawer" id="cartDrawer" aria-hidden="true"><aside class="cpanel" role="dialog" aria-label="Your cart" tabindex="-1"></aside></div>');
  const openCart = addedId => {
    const d = $('#cartDrawer'), items = Cart.items(), added = addedId && product(addedId), sub = Cart.subtotal();
    const ups = (S.products || []).filter(p => p.p && !items.some(i => i.id === p.id)).slice(0, 2);
    $('.cpanel', d).innerHTML = `<div class="ch"><h2>${added ? 'Added to your cart' : 'Your cart'} <small>(${Cart.count()})</small></h2><button class="x" data-close aria-label="Close cart">${ico.x}</button></div>
      ${items.length ? `<div class="cb">${be() ? '<div class="perk">✓ Free shipping on items under 70 lb · free showroom pickup</div>' : '<div class="perk">✓ Ontario delivery · free showroom pickup in Markham</div>'}
        <ul class="clist">${items.map(i => `<li${i.id === addedId ? ' class="new"' : ''}><a href="${url(i.p.live)}"><img src="${i.p.img}" alt=""></a><div><a href="${url(i.p.live)}">${esc(i.p.n)}</a><small>${esc(i.p.b)}</small><div class="qty"><button data-set="${i.id}" data-v="${i.qty - 1}" aria-label="Fewer">−</button><input value="${i.qty}" readonly aria-label="Quantity"><button data-set="${i.id}" data-v="${i.qty + 1}" aria-label="More">+</button></div></div><b>${money(i.p.p * i.qty)}</b></li>`).join('')}</ul>
        ${ups.length ? `<div class="cup"><h3>Complete the look</h3>${ups.map(p => `<div class="up"><img src="${p.img}" alt=""><div><small>${esc(p.b)}</small>${esc(p.n)}<b>${money(p.p)}</b></div><button class="btn line sm" data-add="${p.id}">Add</button></div>`).join('')}</div>` : ''}</div>
        <div class="cf"><div class="tot"><span>Subtotal</span><b>${money(sub)}</b></div><p class="note">Taxes and freight (if any) are calculated at checkout.</p>
          <a class="btn dark full" href="${url('/checkout/')}">Checkout securely ${ico.arrow}</a>
          <div class="express"><button data-express>Apple Pay</button><button data-express>G Pay</button><button data-express class="pp2">PayPal</button></div>
          <a class="more" href="${url('/cart/')}">View cart</a></div>`
      : `<div class="cb empty"><p class="lead">Your cart is empty.</p><a class="btn dark" href="${S.home}">Start shopping</a></div>`}`;
    d.classList.add('on'); d.setAttribute('aria-hidden', 'false'); document.body.classList.add('noscroll'); $('.cpanel', d).focus();
  };
  const closeCart = () => { const d = $('#cartDrawer'); d.classList.remove('on'); d.setAttribute('aria-hidden', 'true'); document.body.classList.remove('noscroll'); };
  const be = () => S.pre === 'be';
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  /* ---------- "Prototype pages" switcher (bottom-left): jump to any template of either site ---------- */
  const T = window.TEMPLATES || {};
  if (T.be) {
    const here = location.pathname.split('/').pop() || S.home;
    const opt = (pre, label) => `<optgroup label="${label}">${T[pre].map(([f, n, l]) => `<option value="${f}${l && l !== '/' ? `?live=${encodeURIComponent(l)}` : ''}"${f === here ? ' selected' : ''}>${esc(n)}</option>`).join('')}</optgroup>`;
    document.body.insertAdjacentHTML('beforeend', `<div class="tswitch" id="tswitch"><button class="tsbtn" aria-expanded="false" aria-controls="tspanel"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><span>Prototype pages</span></button>
      <div class="tspanel" id="tspanel" hidden><p class="tsnow"><b>${esc(tpl)}</b> template<br>Live address kept: <code>${esc(live)}</code></p><div class="hopt"><span>Header option</span><a href="?header=a" ${hdrOpt === 'a' ? 'aria-current="true"' : ''}>A · Logos left</a><a href="?header=b" ${hdrOpt === 'b' ? 'aria-current="true"' : ''}>B · Logos centred</a></div><label for="tsel">Jump to a template</label><select id="tsel">${opt(S.pre, S.name)}</select>
        <div class="tsrow"><button data-ts="-1">← Previous</button><button data-ts="1">Next →</button></div></div></div>`);
    const sel = $('#tsel'), btn = $('.tsbtn'), panel = $('#tspanel');
    btn.addEventListener('click', () => { panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', String(!panel.hidden)); if (!panel.hidden) sel.focus(); });
    sel.addEventListener('change', () => { location.href = sel.value; });
    panel.addEventListener('click', e => { const b = e.target.closest('[data-ts]'); if (!b) return; const i = Math.min(sel.options.length - 1, Math.max(0, sel.selectedIndex + +b.dataset.ts)); location.href = sel.options[i].value; });
  }

  /* ---------- chat assistant (placeholder): quick answers + hand-off to the showroom; nothing is sent ---------- */
  const CHAT = {
    hi: `Hi! I'm the ${S.name} assistant. I can help you find a product, check delivery, or book a showroom visit.`,
    replies: {
      'Find a product': `Tell me what you're looking for (e.g. "${S.pre === 'be' ? 'black freestanding tub' : '36 inch dual fuel range'}") or browse <a href="${url(S.pre === 'be' ? '/bathroom-products-categories/' : '/appliances/')}">${S.pre === 'be' ? 'bathroom products' : 'all appliances'}</a>.`,
      'Delivery & shipping': S.pre === 'be' ? 'Items under 70 lb ship free across Canada and the USA. Heavier items go by freight, and we confirm the cost before processing. Free pickup in Markham.' : 'We deliver within Ontario. Items under 70 lb ship free; appliances and heavier items go by freight, cost confirmed before processing. Free pickup in Markham.',
      'Book a showroom visit': `Our Markham showroom is open Mon–Fri 9–7, Sat 9–5, Sun 12–5. <a href="${url('/experience-centre/')}">Book a visit</a> and a designer will be ready for you.`,
      'Order status': `Sign in to <a href="${url('/my-account/')}">My account</a> to see your orders, or tell me your order number and email and a specialist will check.`,
      'Talk to a person': 'Call (905) 944-0060, or leave your name and email here and a specialist will get back to you during business hours.',
    },
  };
  document.body.insertAdjacentHTML('beforeend', `<div class="chat" id="chat"><button class="chatbtn" aria-expanded="false" aria-controls="chatpanel" aria-label="Chat with us"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg><span>Chat</span></button>
    <section class="chatpanel" id="chatpanel" hidden aria-label="Chat"><header><div><b>${esc(S.name)}</b><small><i></i> Usually replies in a few minutes</small></div><button class="x" data-chat-close aria-label="Close chat">${ico.x}</button></header>
      <div class="chatlog" aria-live="polite"></div>
      <div class="chips chatq">${Object.keys(CHAT.replies).map(q => `<button data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
      <form class="chatin"><label class="sr" for="chatmsg">Message</label><input id="chatmsg" placeholder="Type a message…" autocomplete="off"><button aria-label="Send">${ico.arrow}</button></form>
      <p class="chatnote">Prototype: answers are samples, nothing is sent. The live chat can use the same assistant as Bliss.</p></section></div>`);
  const chat = $('#chat'), log = $('.chatlog', chat), cpanel = $('#chatpanel');
  const say = (who, html) => { log.insertAdjacentHTML('beforeend', `<div class="msg ${who}">${html}</div>`); log.scrollTop = log.scrollHeight; };
  const answer = q => setTimeout(() => say('bot', CHAT.replies[q] || `Thanks! A specialist from our Markham showroom will reply about “${esc(q)}”. Can I have your email?`), 450);
  $('.chatbtn', chat).addEventListener('click', () => { cpanel.hidden = !cpanel.hidden; $('.chatbtn', chat).setAttribute('aria-expanded', String(!cpanel.hidden)); if (!cpanel.hidden && !log.children.length) say('bot', CHAT.hi); if (!cpanel.hidden) $('#chatmsg').focus(); });
  chat.addEventListener('click', e => { const q = e.target.closest('[data-q]'); if (q) { say('me', esc(q.dataset.q)); answer(q.dataset.q); } if (e.target.closest('[data-chat-close]')) { cpanel.hidden = true; $('.chatbtn', chat).setAttribute('aria-expanded', 'false'); } });
  $('.chatin', chat).addEventListener('submit', e => { e.preventDefault(); const v = $('#chatmsg').value.trim(); if (!v) return; say('me', esc(v)); $('#chatmsg').value = ''; answer(v); });

  /* links written in page HTML as data-live="/live/address/" */
  const hydrate = (root = document) => $$('a[data-live]', root).forEach(a => { a.href = url(a.dataset.live); });

  window.G = { $, $$, esc, url, qs, live, route, ico, money, card, swatch, finishes, model, product, all, Cart, toast, open, closeAll, hydrate, renderCards, openCart,
    wish: () => wish, cur: () => cur, S, C };
  document.title = document.title || S.name;
  window.addEventListener('DOMContentLoaded', () => {
    if (window.PAGE) window.PAGE();
    initLogos(); hydrate(); initHero(); initVideo(); initIg();
    if (S.usd) setCur(cur); else renderCards();
    counts();
  });
})();
