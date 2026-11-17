/* Shared header, mega menu, mobile drawer, footer, product cards, wishlist/cart counters, inquire + video pop-ups.
   Each page sets window.SITE (brand, menu, products) before this file. Prototype only: nothing is sent anywhere. */
(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ico = {
    drop: '<svg viewBox="0 0 40 40" aria-hidden="true"><path fill="#fff" d="M20 3c6 9 12 15.5 12 22.5A12 12 0 0 1 8 25.5C8 18.5 14 12 20 3z"/><path fill="#000" d="M15 27c0 3 2.4 5.4 5.4 5.4-4.6 1-8-2-8-5.4z" opacity=".55"/></svg>',
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
  };
  window.ICO = ico;
  const brands = [
    { id: 'bath', icon: 'drop', name: 'Bath', sub: 'Emporium', href: 'bathemp.html' },
    { id: 'kitchens', icon: 'castle', name: 'Castle', sub: 'Kitchens · CA', href: 'castle.html' },
    { id: 'appliances', icon: 'oven', name: 'Castle', sub: 'Appliances', href: 'castle.html#appliances' },
  ];

  /* ---- state (per site, kept in this browser) ---- */
  const key = k => `${S.id}_${k}`;
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(key(k))) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(key(k), JSON.stringify(v)); } catch {} };
  let wish = load('wish', []), cart = load('cart', 0), cur = load('cur', 'CAD');
  const RATE = { CAD: 1, USD: 0.75 }; // same fixed rate as Bliss

  /* ---- header ---- */
  const brandHtml = brands.map((b, i) => `${i ? '<span class="sep"></span>' : ''}<a class="brand${S.active.includes(b.id) ? ' on' : ''}" href="${b.href}">${ico[b.icon]}<b>${b.name}<small>${b.sub}</small></b></a>`).join('');
  const navHtml = S.menu.map((m, i) => m.mega
    ? `<li><button aria-expanded="false" aria-controls="mega${i}">${m.label}${ico.down}</button><div class="mega" id="mega${i}"><div class="wrap">${m.mega.map(c => `<div><h4>${c.h}</h4><ul>${c.links.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div>`).join('')}${m.feat ? `<a class="feat" href="${m.feat.u}"><img src="${m.feat.img}" alt="" loading="lazy"><span>${m.feat.t} →</span></a>` : '<div></div>'}</div></div></li>`
    : `<li><a href="${m.u}"${m.sale ? ' class="sale"' : ''}>${m.label}</a></li>`).join('');
  $('#hdr').outerHTML = `
  <div class="util"><div class="wrap"><span class="l">${S.util}</span><div class="r"><a href="tel:+19059440060">(905) 944-0060</a><a href="#visit">Visit the showroom</a><a href="#">Trade program</a>${S.usd ? `<div class="cur" role="group" aria-label="Currency"><button data-cur="CAD">CAD</button><button data-cur="USD">USD</button></div>` : ''}</div></div></div>
  <header class="hdr" id="top">
    <div class="wrap brands-row">
      <button class="tool burger" aria-label="Menu" data-open-drawer>${ico.menu}</button>
      <nav class="brands" aria-label="Our brands">${brandHtml}</nav>
      <div class="tools">
        <button class="tool" aria-label="Search">${ico.search}</button>
        <a class="tool hide-sm" href="#" aria-label="My account">${ico.user}</a>
        <a class="tool" href="#" aria-label="Wishlist">${ico.heart}<span class="n" data-wish-n></span></a>
        <a class="tool" href="#" aria-label="Cart">${ico.bag}<span class="n" data-cart-n></span></a>
      </div>
    </div>
    <nav class="nav" aria-label="Main"><div class="wrap"><ul>${navHtml}</ul></div></nav>
  </header>
  <div class="drawer" id="drawer"><div class="bg" data-close></div><div class="panel" role="dialog" aria-label="Menu">
    <button class="tool" data-close aria-label="Close" style="margin-left:auto">${ico.x.replace('<svg', '<svg stroke="#000" style="stroke:#000"')}</button>
    <div class="brandlinks">${brands.map(b => `<a href="${b.href}">${b.name} ${b.sub}</a>`).join('')}</div>
    ${S.menu.map(m => m.mega ? `<details><summary>${m.label}</summary>${m.mega.map(c => `<ul>${c.links.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul>`).join('')}</details>` : `<a class="lnk" href="${m.u}">${m.label}</a>`).join('')}
  </div></div>`;

  /* mega menu: hover on desktop, click/keyboard everywhere */
  $$('.nav>.wrap>ul>li').forEach(li => {
    const b = $('button', li); if (!b) return;
    const set = o => { $$('.nav li.open').forEach(x => { if (x !== li) { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); } }); li.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); };
    let t; li.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => set(true), 120); });
    li.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => set(false), 160); });
    b.addEventListener('click', () => set(!li.classList.contains('open')));
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { $$('.nav li.open').forEach(x => x.classList.remove('open')); closeAll(); } });
  const hdr = $('.hdr'); addEventListener('scroll', () => hdr.classList.toggle('stuck', scrollY > 40), { passive: true });

  /* drawer */
  const drawer = $('#drawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-drawer]')) drawer.classList.add('on');
    if (e.target.closest('#drawer [data-close]')) drawer.classList.remove('on');
  });

  /* ---- products ---- */
  const money = v => `$ ${(v * RATE[cur]).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>${cur}</small>`;
  const renderCards = () => $$('[data-products]').forEach(el => {
    el.innerHTML = S.products.map(p => `<article class="card">
      <a class="im" href="${p.u}">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<img src="img/p/${p.img}" alt="${p.n}" loading="lazy" width="640" height="640"></a>
      <button class="wish" data-wish="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Save ${p.n} to wishlist">${ico.heart}</button>
      <div class="br">${p.b}</div><h3><a href="${p.u}">${p.n}</a></h3>
      <div class="pr">${p.p ? money(p.p) : '<small>Price on request</small>'}</div>
      <div class="acts">${p.p ? `<button class="btn dark" data-add="${p.id}">Add to cart</button><button class="ilink" data-inq="${p.id}">Inquire now</button>` : `<button class="btn line" data-inq="${p.id}">Inquire now</button>`}</div>
    </article>`).join('');
  });
  const counts = () => { $$('[data-wish-n]').forEach(n => { n.textContent = wish.length || ''; }); $$('[data-cart-n]').forEach(n => { n.textContent = cart || ''; }); };
  const toast = msg => { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); };
  const setCur = c => { cur = c; save('cur', c); $$('[data-cur]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === c))); renderCards(); };
  if (S.usd) setCur(cur); else renderCards();
  counts();

  /* ---- pop-ups ---- */
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
  <div class="modal video" id="vid" role="dialog" aria-modal="true" aria-label="Showroom tour"><div class="box"><button class="x" data-close aria-label="Close">${ico.x}</button><video controls playsinline preload="none"></video></div></div>`);
  let lastFocus;
  const open = (m) => { lastFocus = document.activeElement; m.classList.add('on'); setTimeout(() => $('input,video,button.x', m)?.focus(), 30); };
  const closeAll = () => { $$('.modal.on').forEach(m => { m.classList.remove('on'); $('video', m)?.pause(); }); drawer.classList.remove('on'); lastFocus?.focus?.(); };
  $('#inq form').addEventListener('submit', e => { e.preventDefault(); closeAll(); toast('Thank you — the showroom will be in touch (prototype: nothing was sent)'); });

  document.addEventListener('click', e => {
    const c = e.target.closest('[data-cur]'); if (c) setCur(c.dataset.cur);
    const w = e.target.closest('[data-wish]');
    if (w) { const id = w.dataset.wish; wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id]; save('wish', wish); w.setAttribute('aria-pressed', String(wish.includes(id))); counts(); toast(wish.includes(id) ? 'Saved to your wishlist' : 'Removed from your wishlist'); }
    const a = e.target.closest('[data-add]');
    if (a) { cart++; save('cart', cart); counts(); toast('Added to cart'); }
    const q = e.target.closest('[data-inq]');
    if (q) { const p = S.products.find(x => x.id === q.dataset.inq), m = $('#inq'); $('.prod img', m).src = 'img/p/' + p.img; $('[data-n]', m).textContent = p.n; $('[data-b]', m).textContent = p.b; open(m); }
    const v = e.target.closest('[data-video]');
    if (v) { e.preventDefault(); const m = $('#vid'), vid = $('video', m); if (vid.src !== v.dataset.video) vid.src = v.dataset.video; open(m); vid.play().catch(() => {}); }
    if (e.target.matches('.modal') || e.target.closest('.modal [data-close]')) closeAll();
  });

  /* ---- hero slider ---- */
  const slides = $$('.hero .slide');
  if (slides.length > 1) {
    const dots = $('.hero .dots'), pp = $('.hero .pp');
    let i = 0, timer, playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    dots.innerHTML = slides.map((_, n) => `<button aria-label="Slide ${n + 1}"></button>`).join('');
    const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', String(k !== i)); }); $$('button', dots).forEach((d, k) => d.setAttribute('aria-current', String(k === i))); };
    const run = () => { clearInterval(timer); if (playing) timer = setInterval(() => go(i + 1), 6500); pp.innerHTML = playing ? '<svg viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>' : '<svg viewBox="0 0 14 14"><path d="M3 1l10 6-10 6z"/></svg>'; pp.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow'); };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { go($$('button', dots).indexOf(b)); run(); } });
    pp.addEventListener('click', () => { playing = !playing; run(); });
    go(0); run();
  }

  /* ---- footer ---- */
  $('#ftr').outerHTML = `<footer class="ftr"><div class="wrap">
    <div class="top">
      <div class="news"><h4>Stay inspired</h4><p>New collections, showroom events and offers from Bath Emporium, Castle Kitchens and Castle Appliances.</p><form onsubmit="event.preventDefault()"><label class="sr" for="nl">Email</label><input id="nl" type="email" placeholder="Your email address"><button>Sign up</button></form></div>
      ${S.footer.map(c => `<div><h4>${c.h}</h4><ul>${c.links.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div>`).join('')}
      <div><h4>Showroom</h4><ul><li>5 Shields Court, Unit 100<br>Markham, ON L3R 0G3</li><li><a href="tel:+19059440060">(905) 944-0060</a></li><li><a href="tel:+18668805446">1-866-880-5446</a></li><li>Mon–Fri 9–7 · Sat 9–5 · Sun 12–5</li></ul></div>
    </div>
    <div class="bot"><span>© 2026 ${S.legal}</span><span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Shipping</a> · <a href="#">Returns</a></span></div>
  </div></footer>`;
})();
