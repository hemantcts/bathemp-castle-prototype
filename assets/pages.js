/* Page templates for both sites. <body data-page="…"> picks the renderer; content comes from CONTENT (real, exported
   from the live sites) and SITE. Every link goes through G.url(live address) so it stays inside the prototype. */
(() => {
  const { $, $$, esc, url, qs, live, money, card, swatch, finishes, model, product, all, Cart, toast, ico, S, C } = window.G;
  const main = () => $('#main');
  const be = S.pre === 'be';
  const arrow = ico.arrow;
  const ta = document.createElement('textarea');
  const strip = h => { ta.innerHTML = String(h || '').replace(/<[^>]+>/g, ' '); return ta.value.replace(/\s+/g, ' ').trim(); };
  const sentences = (t, n) => (strip(t).match(/[^.!?]+[.!?]+/g) || [strip(t)]).slice(0, n).join(' ');
  /* Live HTML from the old sites: keep text structure, drop their inline styles, scripts, iframes and links out. */
  const clean = h => String(h || '').replace(/<(script|style|iframe|form)[\s\S]*?<\/\1>/gi, '').replace(/\s(style|class|id|width|height|srcset|sizes)="[^"]*"/gi, '')
    .replace(/<a [^>]*href="https?:\/\/(?:www\.)?(bathemp|castlekitchens)\.ca([^"]*)"[^>]*>/gi, (_, s, p) => `<a href="${url((s === 'bathemp' ? 'be:' : 'ck:') + (p || '/'))}">`)
    .replace(/<a [^>]*href="https?:[^"]*"[^>]*>/gi, '<a>').replace(/<img[^>]*>/gi, '').replace(/\[[^\]]+\]/g, '');
  const crumbs = list => `<nav class="crumbs" aria-label="Breadcrumb"><a href="${S.home}">Home</a>${list.map(([t, u]) => ` <span>/</span> ${u ? `<a href="${url(u)}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}`).join('')}</nav>`;
  const pagehead = (title, intro = '', list = [[title]], eyebrow = '') => `<section class="phead"><div class="wrap">${crumbs(list)}${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h1>${esc(title)}</h1>${intro ? `<p>${intro}</p>` : ''}</div></section>`;
  const banner = (img, title, intro, eyebrow = '', cta = '') => `<section class="pbanner"><img src="${img}" alt=""><div class="wrap"><div>${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h1>${esc(title)}</h1>${intro ? `<p>${intro}</p>` : ''}${cta}</div></div></section>`;
  const rail = (title, list, more = '') => `<section class="sec stone"><div class="wrap"><div class="sh"><h2>${title}</h2>${more}</div><div class="rail">${list.map(card).join('')}</div></div></section>`;
  const faq = items => items.length ? `<section class="sec"><div class="wrap narrow"><div class="sh"><h2>Frequently asked questions</h2></div><div class="faq">${items.map(f => `<details><summary>${esc(f.q)}</summary><div class="prose">${clean(f.a)}</div></details>`).join('')}</div></div></section>` : '';
  const cta = (t = 'Visit our Markham showroom', p = 'See it in person, compare finishes and plan your project with our designers.') => `<section class="ctaband"><div class="wrap"><div><h2>${t}</h2><p>${p}</p></div><a class="btn light" href="${url('/experience-centre/')}">Plan your visit ${arrow}</a></div></section>`;
  const form = (fields, button, note = '') => `<form class="pform" data-demo-form>${fields}<button class="btn dark">${button} ${arrow}</button>${note ? `<p class="note">${note}</p>` : ''}</form>`;
  const field = (id, label, type = 'text', extra = '') => type === 'textarea' ? `<div><label for="${id}">${label}</label><textarea id="${id}" rows="4" ${extra}></textarea></div>` : type === 'select' ? `<div><label for="${id}">${label}</label><select id="${id}">${extra}</select></div>` : `<div><label for="${id}">${label}</label><input id="${id}" type="${type}" ${extra}></div>`;
  document.addEventListener('submit', e => { if (e.target.matches('[data-demo-form]')) { e.preventDefault(); toast('Thank you — we will be in touch (prototype: nothing was sent)'); e.target.reset(); } });
  const catOf = l => (C.cats || []).find(c => c.live === l);
  const products = () => (C.products || []);
  const findDetail = l => (C.detail || []).find(d => d.live === l);

  /* ================= catalogue ================= */
  const R = {};

  R.shop = () => {
    const kitchen = /kitchen/.test(live), dept = be ? (kitchen ? 'Kitchen products' : /bathroom/.test(live) ? 'Bathroom products' : 'Shop all') : 'Appliances';
    const words = kitchen ? /kitchen|faucet|sink|pot/i : /bath|vanit|toilet|shower|sink|mirror|tub|faucet/i;
    const tiles = (C.cats || []).filter(c => c.img && c.count > 3 && (live === '/shop/' || words.test(c.n))).slice(0, 16);
    main().innerHTML = pagehead(dept, `Shop ${esc(dept.toLowerCase())} from the brands in our Markham showroom, online with delivery across Canada and the USA.`) +
      `<section class="sec tight"><div class="wrap"><div class="cattiles">${tiles.map(c => `<a href="${url(c.live)}"><img src="${c.img}" alt="" loading="lazy"><b>${esc(c.n)}</b><span>${c.count} products</span></a>`).join('')}</div></div></section>` +
      rail('Bestsellers', S.products.slice(0, 4)) + cta();
  };

  R.category = () => {
    const c = catOf(live) || { n: C.cat.n, live: C.cat.live, id: 0 };
    const parent = (C.cats || []).find(x => x.id === c.parent);
    const kids = (C.cats || []).filter(x => x.parent === c.id && x.count);
    const sibs = !kids.length && parent ? (C.cats || []).filter(x => x.parent === parent.id && x.count && x.id !== c.id) : [];
    const tiles = (kids.length ? kids : sibs).filter(x => x.img).slice(0, 5);
    const sample = c.live !== C.cat.live;
    const list = products().slice();
    const facets = {};
    if (be) facets['Price range'] = { 'Under $500': 0, '$500 – $1,000': 0, '$1,000 – $2,500': 0, '$2,500 and up': 0 };
    list.forEach(p => { (facets.Brand = facets.Brand || {})[p.b] = (facets.Brand[p.b] || 0) + 1; Object.entries(p.atts || {}).forEach(([k, v]) => { if (/brand/i.test(k)) return; const key = /finish|colou?r/i.test(k) ? 'Finish' : k; (facets[key] = facets[key] || {}); v.forEach(x => facets[key][x] = (facets[key][x] || 0) + 1); }); });
    if (!be) facets.Availability = { 'Buy online now': 0, 'Display clearance': 0 };
    const desc = C.cat.desc || '';
    main().innerHTML = `<section class="plphead"><div class="wrap">${crumbs([...(parent ? [[parent.n, parent.live]] : []), [c.n]])}
        <h1>${esc(c.n)}</h1><div class="intro"><p>${esc(sentences(desc, 2)) || `Shop ${esc(c.n.toLowerCase())} online.`}</p>${desc ? '<a class="btn line sm" href="#guide">Buying guide</a>' : ''}</div>
        ${tiles.length ? `<div class="subtiles">${tiles.map(k => `<a href="${url(k.live)}"><span><img src="${k.img}" alt="" loading="lazy"></span>${esc(k.n)}</a>`).join('')}</div>` : (kids.length ? `<div class="chips">${kids.map(k => `<a href="${url(k.live)}">${esc(k.n)}</a>`).join('')}</div>` : '')}
      </div></section>
      <section class="sec tight listing"><div class="wrap">
        <div class="toolbar"><b data-count></b><div><button class="tbtn" data-toggle-filters aria-expanded="true">${ico.menu.replace('<svg', '<svg class="fi"')}<span>Hide filters</span></button><label class="sortby">Sort by: <select data-sort><option value="">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name A–Z</option></select></label></div></div>
        ${sample ? '<p class="note">Prototype: products shown are a sample (Freestanding Bathtubs / Refrigerators); the live category keeps its own products and address.</p>' : ''}
        <div class="lgrid">
          <aside class="filters" aria-label="Filters"><div class="fh"><b>Filters</b><button class="ilink" data-clear>Clear all</button><button class="x mobonly" data-filters-close aria-label="Close filters">${ico.x}</button></div>
            ${Object.entries(facets).slice(0, 8).map(([k, v], i) => `<details${i < 2 ? ' open' : ''}><summary>${esc(k)}</summary><div class="opts">${Object.entries(v).sort((x, y) => y[1] - x[1]).slice(0, 10).map(([o, n]) => k === 'Finish' ? `<label class="fin"><input type="checkbox" data-f="Finish" value="${esc(o)}"><i style="background:${swatch(o)}"></i>${esc(o)} <small>${n}</small></label>` : `<label><input type="checkbox" data-f="${esc(k)}" value="${esc(o)}"> ${esc(o)}${n ? ` <small>${n}</small>` : ''}</label>`).join('')}</div></details>`).join('')}
            <button class="btn dark full mobonly" data-filters-close>Show results</button>
          </aside>
          <div><div class="active" data-active></div><div class="rail three" data-grid></div>
            <nav class="pager" aria-label="Pages"><span aria-current="page">1</span><a href="#" onclick="return false">2</a><a href="#" onclick="return false">3</a><a href="#" onclick="return false">Next →</a></nav></div>
        </div>
      </div></section>
      <section class="sec guide" id="guide"><div class="wrap narrow"><span class="eyebrow">Buying guide</span><div class="prose">${clean(desc)}</div></div></section>` + faq(C.cat.faq || []) + cta();
    const grid = $('[data-grid]'), cnt = $('[data-count]'), ranges = { 'Under $500': [0, 500], '$500 – $1,000': [500, 1000], '$1,000 – $2,500': [1000, 2500], '$2,500 and up': [2500, 1e9] };
    const apply = () => {
      const f = $$('[data-f]:checked').reduce((a, i) => ((a[i.dataset.f] = a[i.dataset.f] || []).push(i.value), a), {});
      let out = list.filter(p => Object.entries(f).every(([k, v]) => k === 'Brand' ? v.includes(p.b) : k === 'Price range' ? (p.p && v.some(r => p.p >= ranges[r][0] && p.p < ranges[r][1])) : k === 'Availability' ? v.every(x => x === 'Buy online now' ? p.p : /clearance/i.test(p.n + (p.badge || ''))) : k === 'Finish' ? v.some(x => finishes(p).includes(x)) : v.some(x => (p.atts?.[k] || []).includes(x))));
      const s = $('[data-sort]').value;
      if (s) out.sort((a, b) => s === 'az' ? a.n.localeCompare(b.n) : ((a.p || 1e9) - (b.p || 1e9)) * (s === 'lo' ? 1 : -1));
      grid._list = out; grid.innerHTML = out.map(card).join('') || '<p class="note">No products match these filters.</p>'; cnt.textContent = `${out.length} Results`;
      $('[data-active]').innerHTML = Object.entries(f).flatMap(([k, v]) => v.map(x => `<button data-unf="${esc(k)}|${esc(x)}">${esc(x)} ×</button>`)).join('');
    };
    main().addEventListener('change', e => { if (e.target.closest('.filters,[data-sort]')) apply(); });
    main().addEventListener('click', e => {
      const u = e.target.closest('[data-unf]'); if (u) { const [k, v] = u.dataset.unf.split('|'); $$('[data-f]').forEach(i => { if (i.dataset.f === k && i.value === v) i.checked = false; }); apply(); }
      const t = e.target.closest('[data-toggle-filters]'); if (t) { const wide = innerWidth > 1100; if (wide) { const off = $('.lgrid').classList.toggle('nofilters'); t.querySelector('span').textContent = off ? 'Show filters' : 'Hide filters'; t.setAttribute('aria-expanded', String(!off)); } else $('.filters').classList.add('open'); }
      if (e.target.closest('[data-filters-close]')) $('.filters').classList.remove('open');
    });
    $('[data-clear]').onclick = () => { $$('.filters input').forEach(i => i.checked = false); apply(); };
    document.addEventListener('cur:change', apply);
    apply();
  };

  R.product = () => {
    const d = findDetail(live) || (C.detail || [])[0], p = product(d.id) || d;
    const price = p.p || d.p;
    const fins = Object.entries(d.atts || {}).find(([k]) => /finish|colou?r/i.test(k))?.[1] || [];
    const specs = Object.entries(d.atts || {}).filter(([k]) => !/finish/i.test(k));
    const sku = model(d.n);
    const cat = (C.cats || []).find(c => d.cats?.includes(c.n));
    const related = products().filter(x => x.id !== d.id).slice(0, 4);
    const imgs = d.imgs.filter(Boolean);
    const short = strip(d.short || d.desc);
    const acc = (t, body, open = false) => `<details class="pacc"${open ? ' open' : ''}><summary>${t}</summary><div class="accb">${body}</div></details>`;
    main().innerHTML = `<div class="wrap">${crumbs([...(cat ? [[cat.n, cat.live]] : []), [d.n]])}</div>
    <section class="pdp wrap">
      <div class="gal"><div class="thumbs">${imgs.map((im, i) => `<button aria-label="Photo ${i + 1}" ${i ? '' : 'aria-current="true"'} data-thumb="${im}"><img src="${im}" alt=""></button>`).join('')}</div>
        <div class="main"><img src="${imgs[0]}" alt="${esc(d.n)}" data-main><button class="zoom" data-lb="${imgs[0]}" aria-label="Enlarge photo"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6"/></svg></button></div></div>
      <div class="info">
        <h1>${esc(d.n.replace(new RegExp('^' + d.b + '\\s*-?\\s*', 'i'), ''))}</h1>
        <p class="sub">${esc(d.b)}${cat ? ' · ' + esc(cat.n.toLowerCase().replace(/^\w/, x => x.toUpperCase())) : ''}</p>
        ${sku ? `<p class="sku">${esc(sku)}</p>` : ''}
        <div class="price">${price ? money(price) : '<span class="por">Price on request</span>'}</div>
        ${be && price ? '<p class="note">Same price as at Bliss Bath and Kitchen.</p>' : ''}
        ${fins.length ? `<div class="opt"><b>Color/Finish <span data-fin>${esc(fins[0])}</span></b><div class="sw">${fins.map((f, i) => `<button aria-pressed="${!i}" data-finish="${esc(f)}" title="${esc(f)}" aria-label="${esc(f)}"><i style="background:${swatch(f)}"></i></button>`).join('')}</div></div>` : ''}
        <div class="buy">${price ? `<div class="qty"><button aria-label="Fewer" data-q="-1">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button aria-label="More" data-q="1">+</button></div><button class="btn dark grow" data-add="${d.id}">Add to cart</button>` : `<button class="btn dark grow" data-inq="${d.id}">Inquire now</button>`}</div>
        <div class="minor">${price ? `<button class="ilink" data-inq="${d.id}">Inquire now</button>` : ''}<button class="ilink" data-wish="${d.id}" aria-pressed="${G.wish().includes(d.id)}">${ico.heart} Save to wishlist</button><a class="ilink" href="${url('/experience-centre/')}">See it in the showroom</a></div>
        ${be ? '' : `<div class="pkg"><b>Building a full kitchen?</b><p>One quote for a complete appliance package — range, refrigeration, dishwasher and ventilation — with package savings and one delivery.</p><button class="btn line sm" data-inq="${d.id}">Request a package quote</button></div>`}
        <ul class="perks"><li><b>Delivery</b> ${esc(S.shipping)}</li><li><b>Authorized dealer</b> Full manufacturer warranty.</li></ul>
        ${short ? `<p class="lede">${esc(short.slice(0, 260))}${short.length > 260 ? '… <a href="#details" class="ilink" data-open-acc>Read more</a>' : ''}</p>` : ''}
        <div class="accs" id="details">
          ${acc('Features', `<div class="prose small">${clean(d.desc) || '<p>Product description.</p>'}</div>`)}
          ${acc('Specifications', `<table class="specs">${specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v.join(', '))}</td></tr>`).join('')}${fins.length ? `<tr><th>Finishes</th><td>${esc(fins.join(', '))}</td></tr>` : ''}${d.weight ? `<tr><th>Shipping weight</th><td>${esc(d.weight)} lb</td></tr>` : ''}${sku ? `<tr><th>Model</th><td>${esc(sku)}</td></tr>` : ''}</table>`)}
          ${acc('Documents', '<ul class="docs"><li><a href="#" onclick="return false">Specification sheet (PDF)</a></li><li><a href="#" onclick="return false">Installation guide (PDF)</a></li><li><a href="#" onclick="return false">Warranty (PDF)</a></li></ul>')}
          ${acc('Delivery &amp; returns', `<p>${esc(S.shipping)}</p><p>Returns within 14 days of delivery on unused, uninstalled items in the original packaging, with approval first. See the <a href="${url('/returns/')}">return policy</a>.</p>`)}
        </div>
      </div>
    </section>
    <section class="sec love"><div class="wrap"><div class="sh"><div><h2 class="h-thin">Things you'll love</h2><p>Pairs well with your ${esc((cat?.n || 'selection').toLowerCase())}.</p></div></div><div class="rail">${related.map(card).join('')}</div></div></section>` + cta();
    main().addEventListener('click', e => {
      const t = e.target.closest('[data-thumb]'); if (t) { $('[data-main]').src = t.dataset.thumb; $('.zoom').dataset.lb = t.dataset.thumb; $$('[data-thumb]').forEach(b => b.removeAttribute('aria-current')); t.setAttribute('aria-current', 'true'); }
      const f = e.target.closest('[data-finish]'); if (f) { $$('[data-finish]').forEach(b => b.setAttribute('aria-pressed', String(b === f))); $('[data-fin]').textContent = f.dataset.finish; const sf = $('.stickybar [data-sfin]'); if (sf) sf.textContent = f.dataset.finish; }
      const q = e.target.closest('[data-q]'); if (q) { const i = $('#qty'); i.value = Math.max(1, (+i.value || 1) + +q.dataset.q); }
      if (e.target.closest('[data-open-acc]')) $('.pacc').open = true;
    });
    document.addEventListener('cur:change', () => { const pr = $('.pdp .price'); if (price) pr.innerHTML = money(price); });
    // Kohler-style sticky bar at the top once the buy button scrolls away (bottom on phones)
    document.body.insertAdjacentHTML('beforeend', `<div class="stickybar" aria-hidden="true"><div class="wrap"><img src="${imgs[0]}" alt=""><div><b>${esc(d.n)}</b><span>${esc(d.b)}${fins.length ? ' · <span data-sfin>' + esc(fins[0]) + '</span>' : ''}</span></div><strong>${price ? money(price) : 'Price on request'}</strong>${price ? `<button class="btn dark" data-add="${d.id}" data-qty="1">Add to cart</button>` : `<button class="btn dark" data-inq="${d.id}">Inquire now</button>`}</div></div>`);
    const bar = $('.stickybar'); new IntersectionObserver(([en]) => { const show = !en.isIntersecting && en.boundingClientRect.top < 0; bar.classList.toggle('on', show); document.body.classList.toggle('barup', show); bar.setAttribute('aria-hidden', String(!show)); }).observe($('.pdp .buy'));
  };

  R.brands = () => {
    const list = (C.brands || []).slice().sort((a, b) => a.n.localeCompare(b.n));
    const groups = list.reduce((g, b) => ((g[b.n[0].toUpperCase()] = g[b.n[0].toUpperCase()] || []).push(b), g), {});
    main().innerHTML = pagehead('Our brands', `${list.length} brands, all from authorized Canadian distributors with full manufacturer warranty.`) +
      `<section class="sec tight"><div class="wrap"><div class="logos big" data-logos></div>
      <div class="az">${Object.entries(groups).map(([l, bs]) => `<div><h3>${l}</h3><ul>${bs.map(b => `<li><a href="${url(b.live || (be ? `/brands/${b.n.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/` : '/our-brands/'))}">${esc(b.n)}</a> <small>${b.count}</small></li>`).join('')}</ul></div>`).join('')}</div></div></section>` + cta();
  };

  R.brand = () => {
    const slug = (live.match(/brands\/([^/]+)/) || [])[1] || 'riobel';
    const b = (C.brands || []).find(x => x.live === live) || { n: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), count: '' };
    const mine = all().filter(p => p.b && p.b.toLowerCase() === b.n.toLowerCase()).filter((p, i, a) => a.findIndex(x => x.id === p.id) === i);
    main().innerHTML = banner('img/bath-hero-1800.webp', b.n, `Authorized ${esc(b.n)} dealer. ${b.count ? `${b.count} products, ` : ''}shop online or see them in our Markham showroom.`, 'Brand') +
      `<div class="wrap">${crumbs([['Our brands', '/our-brands/'], [b.n]])}</div>` + rail(`Shop ${esc(b.n)}`, (mine.length ? mine : products()).slice(0, 8)) + cta();
  };

  R.search = () => {
    const q = (qs('q') || (be ? 'riobel' : 'thermador')).trim(), w = q.toLowerCase().split(/\s+/);
    const res = all().filter((p, i, a) => a.findIndex(x => x.id === p.id) === i && p.n && w.every(t => `${p.n} ${p.b}`.toLowerCase().includes(t)));
    const cats = (C.cats || []).filter(c => w.some(t => c.n.toLowerCase().includes(t))).slice(0, 6);
    main().innerHTML = pagehead(`Search: “${q}”`, `${res.length} products${cats.length ? ` · ${cats.length} categories` : ''}`, [['Search']]) +
      `<section class="sec tight"><div class="wrap">${cats.length ? `<div class="chips">${cats.map(c => `<a href="${url(c.live)}">${esc(c.n)}</a>`).join('')}</div>` : ''}<div class="rail">${res.map(card).join('') || `<p class="note">No products found for “${esc(q)}”. Try a brand or model number, or <a data-inq="">ask a specialist</a>.</p>`}</div></div></section>`;
  };

  /* ================= store (new WooCommerce pages) ================= */
  const TAX = { ON: 0.13, NB: 0.15, NL: 0.15, NS: 0.15, PE: 0.15 }; // other provinces 5% GST, USA none (as on Bliss)
  const shipCost = items => be ? 0 : 149; // shortcut: Bath Emporium = Bliss rule (light items free, freight quoted); Castle = flat Ontario freight, real rates when the client confirms them
  R.cart = () => {
    const draw = () => {
      const items = Cart.items(), sub = Cart.subtotal();
      main().innerHTML = pagehead('Your cart', '', [['Cart']]) + (items.length ? `<section class="sec tight"><div class="wrap cartgrid">
        <div><table class="cart"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead><tbody>${items.map(i => `<tr><td><a href="${url(i.p.live)}"><img src="${i.p.img}" alt=""></a><div><a href="${url(i.p.live)}">${esc(i.p.n)}</a><small>${esc(i.p.b)}</small></div></td><td>${money(i.p.p)}</td><td><div class="qty"><button data-set="${i.id}" data-v="${i.qty - 1}" aria-label="Fewer">−</button><input value="${i.qty}" aria-label="Quantity" readonly><button data-set="${i.id}" data-v="${i.qty + 1}" aria-label="More">+</button></div></td><td>${money(i.p.p * i.qty)}</td><td><button class="ilink" data-set="${i.id}" data-v="0">Remove</button></td></tr>`).join('')}</tbody></table>
          <a class="more" href="${S.home}">← Continue shopping</a></div>
        <aside class="summary"><h2>Order summary</h2><dl><dt>Subtotal</dt><dd>${money(sub)}</dd><dt>Shipping</dt><dd>${be ? 'Free on items under 70 lb · freight quoted' : 'Calculated at checkout'}</dd><dt>Tax</dt><dd>At checkout, by province</dd></dl>
          <div class="tot"><span>Estimated total</span><b>${money(sub)}</b></div><a class="btn dark full" href="${url('/checkout/')}">Checkout ${arrow}</a>
          <p class="note">${esc(S.shipping)}</p><div class="pay">Visa · Mastercard · Amex · Apple Pay · Google Pay · PayPal</div></aside></div></section>`
        : `<section class="sec"><div class="wrap narrow center"><p class="lead">Your cart is empty.</p><a class="btn dark" href="${S.home}">Start shopping ${arrow}</a></div></section>` + rail('Popular right now', S.products.filter(p => p.p).slice(0, 4)));
    };
    main().addEventListener('click', e => { const b = e.target.closest('[data-set]'); if (b) Cart.set(b.dataset.set, +b.dataset.v); });
    document.addEventListener('cart:change', draw); document.addEventListener('cur:change', draw); draw();
  };

  R.checkout = () => {
    const items = Cart.items();
    if (!items.length) { main().innerHTML = pagehead('Checkout', 'Your cart is empty.', [['Checkout']]) + `<div class="wrap center sec"><a class="btn dark" href="${S.home}">Start shopping</a></div>`; return; }
    const provs = [['ON', 'Ontario'], ['QC', 'Quebec'], ['BC', 'British Columbia'], ['AB', 'Alberta'], ['MB', 'Manitoba'], ['SK', 'Saskatchewan'], ['NS', 'Nova Scotia'], ['NB', 'New Brunswick'], ['NL', 'Newfoundland and Labrador'], ['PE', 'Prince Edward Island']];
    main().innerHTML = pagehead('Checkout', '', [['Cart', '/cart/'], ['Checkout']]) + `<div class="wrap"><ol class="costeps"><li class="done">Cart</li><li class="on">Details &amp; delivery</li><li>Payment</li><li>Confirmation</li></ol></div><section class="sec tight"><div class="wrap cartgrid"><form class="pform co" id="co"><div class="expressbox"><span>Express checkout</span><div class="express"><button type="button" data-express>Apple Pay</button><button type="button" data-express>G Pay</button><button type="button" data-express class="pp2">PayPal</button></div><span class="or">or continue below</span></div>
      <h2>Contact</h2><div class="row2">${field('em', 'Email', 'email', 'required autocomplete="email"')}${field('ph', 'Phone', 'tel', 'autocomplete="tel"')}</div>
      <h2>Delivery address</h2><div class="row2">${field('fn', 'First name', 'text', 'required')}${field('ln', 'Last name', 'text', 'required')}</div>${field('ad', 'Address', 'text', 'required autocomplete="address-line1"')}
      <div class="row3">${field('ci', 'City', 'text', 'required')}${field('pv', be ? 'Province / State' : 'Province', 'select', provs.map(([v, t]) => `<option value="${v}">${t}</option>`).join('') + (be ? '<option value="US">United States (state)</option>' : ''))}${field('pc', 'Postal / ZIP code', 'text', 'required')}</div>
      ${be ? field('co2', 'Country', 'select', '<option value="CA">Canada</option><option value="US">United States</option>') : '<p class="note">Castle Appliances delivers within Ontario. For other provinces please <a data-inq="">contact the showroom</a>.</p>'}
      <h2>Delivery</h2><div class="radios"><label><input type="radio" name="sh" checked> ${be ? 'Standard shipping — free on items under 70 lb' : 'Ontario delivery (freight)'}</label><label><input type="radio" name="sh"> Pick up at our Markham showroom — free</label></div>
      <h2>Payment</h2><div class="radios pay"><label><input type="radio" name="pm" checked> Credit / debit card <small>Visa, Mastercard, Amex, Apple Pay, Google Pay</small></label><div class="cardbox">Card fields appear here (Stripe) — prototype, no payment is taken.</div><label><input type="radio" name="pm"> PayPal</label></div>
      <label class="chk"><input type="checkbox" required><span>I agree to the <a href="${url('/returns/')}">return policy</a> and <a href="${url(S.shipLive)}">shipping policy</a>.</span></label>
      <button class="btn dark full">Place order ${arrow}</button></form>
      <aside class="summary"><h2>Your order</h2><ul class="mini">${items.map(i => `<li><img src="${i.p.img}" alt=""><span>${esc(i.p.n)} <small>× ${i.qty}</small></span><b>${money(i.p.p * i.qty)}</b></li>`).join('')}</ul><dl data-tot></dl><p class="note" data-curnote></p><ul class="assure"><li>Secure checkout, encrypted card payments</li><li>Authorized dealer · full manufacturer warranty</li><li>Questions? (905) 944-0060 or Inquire now</li></ul></aside></div></section>`;
    const tot = () => {
      const pv = $('#pv').value, us = be && ($('#co2')?.value === 'US' || pv === 'US'), sub = Cart.subtotal(), pick = $$('[name=sh]')[1].checked;
      const ship = pick ? 0 : shipCost(items), rate = us ? 0 : (TAX[pv] ?? 0.05), tax = (sub + ship) * rate, c = us ? 'USD' : 'CAD';
      $('[data-tot]').innerHTML = `<dt>Subtotal</dt><dd>${money(sub, c)}</dd><dt>Delivery</dt><dd>${ship ? money(ship, c) : 'Free'}</dd><dt>${us ? 'Tax' : rate === 0.13 || rate === 0.15 ? 'HST' : 'GST'}</dt><dd>${money(tax, c)}</dd><dt class="big">Total</dt><dd class="big">${money(sub + ship + tax, c)}</dd>`;
      $('[data-curnote]').textContent = be ? (us ? 'US orders are charged in USD.' : 'Canadian orders are charged in CAD.') : '';
      return { sub, ship, tax, total: sub + ship + tax, c };
    };
    $('#co').addEventListener('change', tot); tot();
    $('#co').addEventListener('submit', e => { e.preventDefault(); const t = tot(); const no = 100000 + Math.floor(Math.random() * 900); try { localStorage.setItem(`${S.id}_last`, JSON.stringify({ no, items: Cart.items().map(i => ({ n: i.p.n, img: i.p.img, qty: i.qty, p: i.p.p })), ...t, name: $('#fn').value, email: $('#em').value })); } catch {} Cart.clear(); location.href = url(`/checkout/order-received/${no}/`); });
  };

  R.order = () => {
    let o; try { o = JSON.parse(localStorage.getItem(`${S.id}_last`)); } catch {}
    o = o || { no: 175450, items: S.products.filter(p => p.p).slice(0, 1).map(p => ({ n: p.n, img: p.img, qty: 1, p: p.p })), name: 'Jordan', email: 'jordan@example.com', c: 'CAD' };
    o.sub = o.sub ?? o.items.reduce((s, i) => s + i.p * i.qty, 0); o.ship = o.ship ?? 0; o.tax = o.tax ?? o.sub * 0.13; o.total = o.total ?? o.sub + o.tax;
    main().innerHTML = `<section class="sec"><div class="wrap narrow"><div class="thanks"><span class="tick">✓</span><div><span class="eyebrow">Order ${o.no}</span><h1>Thank you${o.name ? `, ${esc(o.name)}` : ''}!</h1></div></div>
      <div class="notice">Your order is confirmed. We've sent a confirmation to ${esc(o.email || 'your email')}. You'll receive tracking details when it ships; large items go by freight and we'll call to arrange delivery.</div>
      <ol class="steps"><li class="on"><b>Confirmed</b>Today</li><li class="on"><b>Processing</b>1–2 business days</li><li><b>Shipped</b>Typically 2–5 business days</li><li><b>Delivered</b>Inspect on arrival</li></ol>
      <div class="summary flat"><h2>Order summary</h2><ul class="mini">${o.items.map(i => `<li><img src="${i.img}" alt=""><span>${esc(i.n)} <small>× ${i.qty}</small></span><b>${money(i.p * i.qty, o.c)}</b></li>`).join('')}</ul>
      <dl><dt>Subtotal</dt><dd>${money(o.sub, o.c)}</dd><dt>Delivery</dt><dd>${o.ship ? money(o.ship, o.c) : 'Free'}</dd><dt>Tax</dt><dd>${money(o.tax, o.c)}</dd><dt class="big">Total</dt><dd class="big">${money(o.total, o.c)}</dd></dl></div>
      <div class="acts2"><a class="btn dark" href="${S.home}">Continue shopping</a><a class="btn line" href="${url('/contact/')}">Questions? Contact us</a></div></div></section>`;
  };

  R.account = () => {
    const signed = sessionStorage.getItem(`${S.id}_in`);
    if (!signed) {
      main().innerHTML = pagehead('My account', 'Track orders, save addresses and keep your wishlist on every device.', [['My account']]) + `<section class="sec tight"><div class="wrap two">
        <div class="panel"><h2>Sign in</h2>${form(field('le', 'Email', 'email', 'required') + field('lp', 'Password', 'password', 'required') + '<label class="chk"><input type="checkbox"> Remember me</label>', 'Sign in', '<a href="#" onclick="return false">Forgot your password?</a>')}</div>
        <div class="panel"><h2>Create an account</h2>${form(field('re', 'Email', 'email', 'required') + field('rp', 'Password', 'password', 'required'), 'Create account', 'Trade customers: apply for a trade account after signing up.')}</div></div></section>`;
      $$('[data-demo-form]').forEach(f => { f.removeAttribute('data-demo-form'); f.addEventListener('submit', e => { e.preventDefault(); sessionStorage.setItem(`${S.id}_in`, '1'); R.account(); }); });
      return;
    }
    let o; try { o = JSON.parse(localStorage.getItem(`${S.id}_last`)); } catch {}
    main().innerHTML = pagehead('My account', 'Hello! From here you can see your orders, addresses and account details.', [['My account']]) + `<section class="sec tight"><div class="wrap acc"><nav>${['Dashboard', 'Orders', 'Addresses', 'Account details', 'Wishlist'].map((t, i) => `<a href="${t === 'Wishlist' ? url('/wishlist/') : '#'}" ${i ? '' : 'aria-current="page"'} onclick="${t === 'Wishlist' ? '' : 'return false'}">${t}</a>`).join('')}<button class="ilink" data-out>Sign out</button></nav>
      <div><h2>Recent orders</h2><table class="cart"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>${o ? `<tr><td>#${o.no}</td><td>Today</td><td>Processing</td><td>${money(o.total, o.c)}</td></tr>` : '<tr><td colspan="4">No orders yet.</td></tr>'}</tbody></table>
      <div class="two" style="margin-top:28px"><div class="panel"><h3>Billing address</h3><p class="note">Add your billing address.</p></div><div class="panel"><h3>Shipping address</h3><p class="note">Add your shipping address.</p></div></div></div></div></section>`;
    $('[data-out]').onclick = () => { sessionStorage.removeItem(`${S.id}_in`); R.account(); };
  };

  R.wishlist = () => {
    const draw = () => {
      const list = G.wish().map(product).filter(Boolean);
      main().innerHTML = pagehead('Your wishlist', list.length ? `${list.length} saved items. Send the whole list to the showroom as one inquiry and a specialist will reply with prices and availability.` : '', [['Wishlist']]) +
        `<section class="sec tight"><div class="wrap">${list.length ? `<div class="wbar"><button class="btn dark" data-inq="">Send my list to the showroom ${arrow}</button><button class="btn line" data-share>Share list</button></div><div class="rail">${list.map(card).join('')}</div>` : `<div class="center"><p class="lead">Nothing saved yet.</p><p class="note">Tap the heart on any product to save it here.</p><a class="btn dark" href="${S.home}">Browse products</a></div>`}</div></section>`;
      $('[data-share]')?.addEventListener('click', () => toast('Link copied (prototype)'));
    };
    document.addEventListener('wish:change', draw); draw();
  };

  /* ================= content ================= */
  R.blog = () => {
    const posts = C.posts || [], cats = [...new Set(posts.flatMap(p => p.cats || []))];
    main().innerHTML = pagehead('Blog', 'Buying guides, comparisons and ideas for your bathroom and kitchen.', [['Blog']]) +
      `<section class="sec tight"><div class="wrap">${cats.length ? `<div class="chips"><a aria-current="page" href="#">All</a>${cats.map(c => `<a href="#" onclick="return false">${esc(c)}</a>`).join('')}</div>` : ''}
      <div class="posts">${posts.map((p, i) => `<a class="post${i ? '' : ' first'}" href="${url(p.live)}"><img src="${p.img}" alt="" loading="lazy"><div><small>${esc(p.d)}${p.cats?.length ? ' · ' + esc(p.cats[0]) : ''}</small><h2>${esc(p.t)}</h2><p>${esc(p.x)}</p><span class="more">Read more ${arrow}</span></div></a>`).join('')}</div>
      <nav class="pager"><span aria-current="page">1</span><a href="#" onclick="return false">2</a><a href="#" onclick="return false">Next →</a></nav></div></section>`;
  };

  R.post = () => {
    const p = (C.posts || []).find(x => x.live === live) || (C.posts || [])[0];
    const html = be && C.post ? C.post.html : `<p>${esc(p.x)}</p><p class="note">Prototype: the full article text from the live page goes here.</p>`;
    const title = be && C.post ? C.post.t : p.t;
    main().innerHTML = `<article><header class="ahead wrap narrow">${crumbs([['Blog', '/blog/'], [title]])}<small>${esc(p.d)}</small><h1>${esc(title)}</h1></header><figure class="ahero"><img src="${p.img}" alt=""></figure>
      <div class="wrap narrow prose article">${clean(html)}</div></article>` + rail('Shop the products', products().slice(0, 4)) +
      `<section class="sec"><div class="wrap"><div class="sh"><h2>More articles</h2></div><div class="posts three">${(C.posts || []).filter(x => x !== p).slice(0, 3).map(x => `<a class="post" href="${url(x.live)}"><img src="${x.img}" alt="" loading="lazy"><div><small>${esc(x.d)}</small><h2>${esc(x.t)}</h2></div></a>`).join('')}</div></div></section>`;
  };

  R.city = () => {
    const c = C.city, cities = ['Toronto', 'Markham', 'Richmond Hill', 'Vaughan', 'Mississauga', 'Brampton', 'Oakville', 'Ajax', 'Pickering', 'Whitby', 'Oshawa', 'Newmarket', 'Aurora', 'Scarborough', 'North York', 'Thornhill'];
    main().innerHTML = `<article><header class="ahead wrap narrow">${crumbs([['Blog', '/blog/'], [c.t]])}<span class="eyebrow">Serving ${esc(c.t.split(' for ').pop())}</span><h1>${esc(c.t)}</h1></header>${c.img ? `<figure class="ahero"><img src="${c.img}" alt=""></figure>` : ''}
      <div class="wrap narrow prose article">${clean(c.html)}</div></article>` + rail('Shop Blanco kitchen sinks', products().slice(0, 4)) +
      `<section class="sec tight"><div class="wrap narrow"><h2 class="h3">Also serving</h2><div class="chips">${cities.map(x => `<a href="${url(`/blanco-kitchen-sinks-for-${x.toLowerCase().replace(/\s+/g, '-')}/`)}">${x}</a>`).join('')}</div>
      <p class="note">All ${c.count.toLocaleString()} local pages keep their addresses, titles and text; only the design changes.</p></div></section>` + cta();
  };

  R.projects = () => {
    const tabs = be ? [['Bathrooms', '/bathrooms/'], ['Kitchens', '/kitchens-portfolio/'], ['Closets', '/closets-portfolio/'], ['Project videos', '/recent-project-videos/']] : [];
    if (be) {
      main().innerHTML = pagehead('Our projects', 'Bathrooms, kitchens and closets designed and supplied by Bath Emporium and Castle Kitchens.', [['Portfolio']]) +
        `<div class="wrap"><div class="chips">${tabs.map(([t, u]) => `<a href="${url(u)}" ${u === live ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</div></div>
        <section class="sec tight"><div class="wrap"><div class="masonry">${(C.projects || []).map(im => `<a href="#" data-lb="${im}"><img src="${im}" alt="" loading="lazy"></a>`).join('')}</div></div></section>` + cta('Start your project', 'Book a design consultation in our Markham showroom.');
      return;
    }
    const pg = C.pages.projects, names = pg.heads.slice(1, 7), gal = Object.values(C.galleries || {});
    main().innerHTML = pagehead('Projects', esc(pg.heads[0] || ''), [['Projects']]) + `<section class="sec tight"><div class="wrap"><div class="projlist">${names.map((n, i) => `<a href="${url(`/projects/${n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}/`)}"><img src="${(gal[i % gal.length] || [])[0] || 'img/kit-white-900.webp'}" alt="" loading="lazy"><b>${esc(n)}</b><span>View project ${arrow}</span></a>`).join('')}</div></div></section>` + cta('Plan your kitchen', 'Meet our designers in the Markham showroom.');
  };

  R.project = () => {
    const name = live.split('/').filter(Boolean).pop().replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const gal = Object.values(C.galleries || {})[0] || [];
    main().innerHTML = banner(gal[0] || 'img/kit-white-1800.webp', name, 'Custom cabinetry by Castle Kitchens, appliances by Castle Appliances.', 'Project') +
      `<div class="wrap">${crumbs([['Projects', '/projects/'], [name]])}</div><section class="sec tight"><div class="wrap facts"><div><b>Rooms</b>Kitchen, island, pantry</div><div><b>Cabinetry</b>Made in our factory</div><div><b>Location</b>Greater Toronto Area</div></div>
      <div class="wrap"><div class="masonry">${gal.map(im => `<a href="#" data-lb="${im}"><img src="${im}" alt="" loading="lazy"></a>`).join('')}</div></div></section>` + cta('Love this kitchen?', 'Book a design consultation and we will plan yours.');
  };

  R.gallery = () => {
    const names = { '/modern-kitchens/': 'Modern Kitchens', '/transitional-kitchens/': 'Transitional Kitchens', '/traditional-kitchens/': 'Traditional Kitchens', '/kitchen-islands/': 'Kitchen Island', '/bathroom-vanities/': 'Bathroom Vanities', '/closets-home-office-home-library/': 'Closets | Home Office | Home Library', '/bars-media-centers-fire-places/': 'Bars | Media Centers | Fire Places' };
    const n = names[live] || 'Modern Kitchens', pics = (C.galleries || {})[n] || [], pg = C.pages['modern-kitchens'];
    main().innerHTML = pagehead(n.replace(' | ', ', ').replace(' | ', ' & '), esc(sentences(pg.x, 2)), [['Portfolio', '/projects/'], [n]]) +
      `<div class="wrap"><div class="chips">${Object.entries(names).map(([u, t]) => `<a href="${url(u)}" ${u === live ? 'aria-current="page"' : ''}>${esc(t.split(' | ')[0])}</a>`).join('')}</div></div>
      <section class="sec tight"><div class="wrap"><div class="masonry">${pics.map(im => `<a href="#" data-lb="${im}"><img src="${im}" alt="" loading="lazy"></a>`).join('')}</div></div></section>
      <section class="sec stone"><div class="wrap narrow prose"><p>${esc(sentences(pg.x, 8))}</p></div></section>` + cta('Plan your kitchen', 'Book a design consultation in our Markham showroom.');
  };

  R.service = () => {
    if (be) {
      const p = { '/installation-services/': C.pages['installation-services'], '/getaquote/': C.pages.getaquote }[live] || C.pages['installation-services'];
      const title = { '/design-services/': 'Design services', '/bathroom-design-services/': 'Bathroom design', '/kitchen-design-services/': 'Kitchen design', '/installation-services/': 'Installation services', '/kitchen-cabinets/': 'Kitchen cabinets' }[live] || p.t;
      main().innerHTML = banner('img/bath-tub-1800.webp', title, 'From the first sketch to the final fitting, one team plans your bathroom and kitchen.', 'Services', `<a class="btn light" href="${url('/getaquote/')}">Get a quote ${arrow}</a>`) +
        `<div class="wrap">${crumbs([['Services', '/design-services/'], [title]])}</div><section class="sec tight"><div class="wrap two"><div class="prose"><p>${esc(sentences(p.x, 10))}</p></div>
        <ol class="howto"><li><b>Visit or call</b>Tell us about your space, style and budget.</li><li><b>Design</b>Our designers prepare layouts and product selections.</li><li><b>Quote</b>One clear quote for products and installation.</li><li><b>Install</b>Delivery and installation coordinated by our team.</li></ol></div></section>` + rail('Popular products', S.products.slice(0, 4)) + cta();
      return;
    }
    const p = C.pages['kitchen-remodeling-toronto'], title = (C.pages[live.replace(/\//g, '')] || {}).t || p.t;
    main().innerHTML = banner('img/kit-island-1800.webp', title, esc(sentences(p.x, 2)), 'Castle Kitchens', `<a class="btn light" href="${url('/contact/')}">Book a design consultation ${arrow}</a>`) +
      `<div class="wrap">${crumbs([['Custom kitchens', '/modern-kitchen-cabinets-toronto/'], [title]])}</div>` +
      p.heads.filter(h => !/video|tour/i.test(h)).slice(0, 4).map((h, i) => `<section class="sec ${i % 2 ? 'stone' : ''} tight"><div class="wrap media2 ${i % 2 ? 'rev' : ''}"><img src="${['img/kit-reveal-900.webp', 'img/kit-hood-900.webp', 'img/kit-aitken-900.webp', 'img/kit-king-900.webp'][i]}" alt="" loading="lazy"><div><h2>${esc(h)}</h2><p>${esc(sentences(p.x.split(/\s+/).slice(i * 40).join(' '), 3))}</p></div></div></section>`).join('') + cta('See our kitchens in person', 'Full kitchen displays with working appliances in our Markham showroom.');
  };

  R.about = () => {
    const key = live.replace(/\//g, ''), p = be ? null : (C.pages[key] || C.pages['our-factory']);
    const title = be ? 'About Bath Emporium' : p.t;
    main().innerHTML = banner(be ? 'img/bath-showroom-1800.webp' : 'img/kit-display-1800.webp', title, be ? 'One of the Toronto area\'s largest showrooms for bath and kitchen, together with Castle Kitchens and Castle Appliances.' : esc(sentences(p.x, 2)), be ? 'Our story' : 'Who we are') +
      `<div class="wrap">${crumbs([[title]])}</div><section class="sec tight"><div class="wrap two"><div class="prose"><p>${be ? 'Bath Emporium brings premium bathroom and kitchen brands together under one roof in Markham, alongside Castle Kitchens\' custom cabinetry and Castle Appliances. Homeowners, designers and builders can see, touch and compare everything in one visit, and our team coordinates design, supply and installation.' : esc(sentences(p.x, 9))}</p></div>
      <div class="facts col"><div><b>One showroom</b>Bath, kitchen and appliances under one roof</div><div><b>One team</b>Design, supply and installation coordinated</div><div><b>Authorized dealer</b>Full manufacturer warranties</div></div></div></section>` +
      (be ? '' : `<div class="wrap"><div class="chips">${[['Our factory', '/our-factory/'], ['Our process', '/our-process/'], ['Our standards', '/our-standards/'], ['What makes us different', '/what-makes-us-different/'], ['Architects & designers', '/custom-kitchens-for-architects-and-designers/'], ['Multi-housing projects', '/multi-housing-projects/'], ['New dealer', '/new-dealer/']].map(([t, u]) => `<a href="${url(u)}" ${u === live ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</div></div>`) + cta();
  };

  R.testimonials = () => {
    const parts = (C.pages.testimonials.x.match(/[^.!?]+[.!?]+/g) || []).reduce((a, s, i) => ((a[Math.floor(i / 3)] = (a[Math.floor(i / 3)] || '') + s), a), []).slice(0, 6);
    main().innerHTML = pagehead('Testimonials', 'What our clients say about their Castle Kitchens projects.', [['Testimonials']]) + `<section class="sec tight"><div class="wrap quotes">${parts.map(q => `<blockquote>“${esc(q.trim())}”</blockquote>`).join('')}</div><p class="wrap note">Prototype: the review text comes from the current Testimonials page; names are shown as on the live page.</p></section>` + cta();
  };

  R.contact = () => {
    main().innerHTML = pagehead('Contact us', 'Call, email or visit our Markham showroom. A specialist will reply within business hours.', [['Contact']]) + `<section class="sec tight"><div class="wrap two">
      <div class="panel">${form(`<div class="row2">${field('cn', 'Name', 'text', 'required')}${field('cp', 'Phone', 'tel')}</div>${field('ce', 'Email', 'email', 'required')}${field('cs', 'Topic', 'select', '<option>Product question</option><option>Order status</option><option>Design consultation</option><option>Trade account</option><option>Returns</option>')}${field('cm', 'Message', 'textarea')}`, 'Send message')}</div>
      <div><div class="facts col"><div><b>Showroom</b>5 Shields Court, Unit 100, Markham, ON L3R 0G3</div><div><b>Call</b>(905) 944-0060</div><div><b>Hours</b><span class="nw">Mon–Fri 9–7</span> · <span class="nw">Sat 9–5</span> · <span class="nw">Sun 12–5</span></div></div><img class="rounded" src="img/store-${be ? 'bath' : 'castle'}-900.webp" alt="The showroom at 5 Shields Court, Markham" loading="lazy"></div></div></section>`;
  };

  R.quote = () => {
    main().innerHTML = pagehead('Get a quote', esc(sentences(C.pages.getaquote?.x, 2)) || 'Tell us about your project and we will prepare a quote.', [['Get a quote']]) + `<section class="sec tight"><div class="wrap narrow panel">${form(`<div class="row2">${field('qn', 'Name', 'text', 'required')}${field('qp', 'Phone', 'tel')}</div>${field('qe', 'Email', 'email', 'required')}<div class="row2">${field('qr', 'Room', 'select', '<option>Bathroom</option><option>Kitchen</option><option>Both</option><option>Other</option>')}${field('qt', 'Timeline', 'select', '<option>As soon as possible</option><option>1–3 months</option><option>3–6 months</option><option>Just planning</option>')}</div>${field('qm', 'Tell us about the project', 'textarea')}${field('qf', 'Plans or photos (optional)', 'file', 'multiple')}`, 'Request a quote')}</div></section>`;
  };

  R.experience = () => {
    const vid = be ? 'video/bath-tour.mp4' : 'video/castle-tour.mp4';
    main().innerHTML = banner(be ? 'img/bath-showroom-1800.webp' : 'img/kit-display-1800.webp', 'The Experience Centre', 'See, touch and experience design: working bathrooms, full kitchens and premium appliances in one Markham showroom.', 'Bath Emporium · Castle Kitchens · Castle Appliances', `<a class="btn light" href="#book">Book your visit ${arrow}</a> <button class="btn light" data-video="${vid}">Watch the tour</button>`) +
      `<section class="sec"><div class="wrap"><div class="tiles">${[['Bath Emporium', 'img/bath-tub-900.webp', 'Freestanding tubs, smart toilets and showers you can try.'], ['Castle Kitchens', 'img/kit-reveal-900.webp', 'Full kitchen displays, door styles and countertops.'], ['Castle Appliances', 'img/app-oak-900.webp', 'Working ranges, ovens and refrigeration.'], ['Outdoor living', 'img/out-kitchen-900.webp', 'Outdoor kitchens, grills and pizza ovens.']].map(([t, im, p]) => `<div class="tile"><img src="${im}" alt="" loading="lazy"><div class="t"><b>${t}</b><p style="margin:6px 0 0;font-size:14px">${p}</p></div></div>`).join('')}</div></div></section>
      <section class="sec stone" id="book"><div class="wrap two"><div><h2 class="h2">Plan your visit</h2><p>Book a time and a designer will be ready for you, with samples for your project. Walk-ins are welcome too.</p><div class="facts col"><div><b>Address</b>5 Shields Court, Unit 100, Markham, ON</div><div><b>Hours</b><span class="nw">Mon–Fri 9–7</span> · <span class="nw">Sat 9–5</span> · <span class="nw">Sun 12–5</span></div></div></div>
      <div class="panel">${form(`<div class="row2">${field('vn', 'Name', 'text', 'required')}${field('vp', 'Phone', 'tel')}</div>${field('ve', 'Email', 'email', 'required')}<div class="row2">${field('vd', 'Date', 'date', 'required')}${field('vt', 'Time', 'select', '<option>Morning</option><option>Afternoon</option><option>Evening (weekdays)</option>')}</div>${field('vi', 'Interested in', 'select', '<option>Bathroom</option><option>Kitchen &amp; cabinetry</option><option>Appliances</option><option>Outdoor kitchen</option><option>Everything</option>')}`, 'Book my visit')}</div></div></section>`;
  };

  R.policy = () => {
    const key = { '/shipping/': 'shipping-info', '/shipping-info/': 'shipping-info', '/returns/': 'returns', '/privacy-policy/': 'privacy-policy', '/payment-methods/': 'payment-methods' }[live] || 'shipping-info';
    const P = (C.policies || {})[key] || { t: 'Policy', html: '' };
    const tabs = [['Shipping', S.shipLive], ['Returns', '/returns/'], ['Privacy & cookies', '/privacy-policy/'], ['Payment & security', '/payment-methods/']];
    main().innerHTML = pagehead(P.t, be ? 'Same policies and rules as Bliss Bath and Kitchen: delivery across Canada and the USA, prices in CAD or USD.' : 'Castle Kitchens and Castle Appliances: delivery within Ontario, prices and payments in Canadian dollars (CAD).', [[P.t]]) +
      `<div class="wrap narrow"><div class="chips">${tabs.map(([t, u]) => `<a href="${url(u)}" ${u === live ? 'aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</div></div>
      <section class="sec tight"><div class="wrap narrow prose policy-doc">${P.html}</div>
      <div class="wrap narrow"><p class="note">Adapted from the Bliss Bath and Kitchen policy pages${be ? ' (same rules).' : ', for Ontario-only delivery in CAD. The client confirms the final wording.'}</p></div></section>`;
  };


  R.showroom = () => {
    const addr = '5 Shields Court, Unit 100, Markham, ON L3R 0G3', q = encodeURIComponent('5 Shields Court Unit 100 Markham Ontario L3R 0G3');
    const dir = `https://www.google.com/maps/dir/?api=1&destination=${q}`, embed = `https://www.google.com/maps?q=${q}&output=embed`;
    const vid = be ? 'video/bath-tour.mp4' : 'video/castle-tour.mp4';
    main().innerHTML = banner(be ? 'img/bath-showroom-1800.webp' : 'img/kit-display-1800.webp', 'Visit our showroom', `See the quality, finishes and details in person: ${be ? 'bathroom fixtures, tubs, showers and vanities, with Castle Kitchens cabinetry and appliances' : 'full kitchen displays, door styles, countertops and premium appliances, with Bath Emporium fixtures'} under one roof in Markham.`, be ? 'Bath Emporium · Markham' : 'Castle Kitchens · Markham',
      `<a class="btn light" href="${dir}" target="_blank" rel="noopener">Get directions ${arrow}</a> <a class="btn light" href="#book">Book an appointment</a>`) +
      `<div class="wrap">${crumbs([['Showroom']])}</div>
      <section class="sec tight"><div class="wrap showgrid">
        <div class="sinfo"><h2 class="h2">Plan your visit</h2><p>Whether you're renovating one room or planning a whole home, our team helps you compare products, coordinate finishes and find the right selections for your style and budget.</p>
          <dl class="sdl"><dt>Address</dt><dd>${addr}<br><a href="${dir}" target="_blank" rel="noopener">Get directions ↗</a></dd>
            <dt>Hours</dt><dd><table class="hours"><tr><th>Monday – Friday</th><td>9 am – 7 pm</td></tr><tr><th>Saturday</th><td>9 am – 5 pm</td></tr><tr><th>Sunday</th><td>12 pm – 5 pm</td></tr></table></dd>
            <dt>Call</dt><dd>(905) 944-0060</dd><dt>Parking</dt><dd>Free parking at the door</dd></dl>
          <h3 class="h3">Visit us for</h3><ul class="ticks"><li>${be ? 'Bathroom and kitchen fixtures' : 'Custom kitchen cabinetry'}</li><li>${be ? 'Tubs, showers and smart toilets you can try' : 'Working appliance displays'}</li><li>Product and finish selections</li><li>Design and specification advice</li><li>Project and package pricing</li></ul></div>
        <div class="mapbox" data-map><img src="img/store-${be ? 'bath' : 'castle'}-1800.webp" alt="The showroom at 5 Shields Court, Markham" loading="lazy"><div class="mapcta"><p>The map is loaded from Google when you open it.</p><button class="btn dark" data-load-map="${embed}">Show map</button><a class="btn light" href="${dir}" target="_blank" rel="noopener">Directions</a></div></div>
      </div></section>
      <section class="split"><div class="media"><img src="img/${be ? 'bath-tub' : 'kit-reveal'}-1800.webp" alt="" loading="lazy"><a class="play" href="#" data-video="${vid}" aria-label="Watch the showroom tour">${ico.play}</a></div>
        <div class="body"><span class="eyebrow" style="color:#999">Showroom tour</span><h2>Take a look inside</h2><p>A two-minute walk through our displays before you visit.</p><div class="acts"><button class="btn light" data-video="${vid}">Watch the tour</button><a class="btn light" href="${url('/experience-centre/')}">The Experience Centre</a></div></div></section>
      <section class="sec stone" id="book"><div class="wrap two"><div><h2 class="h2">Book an appointment</h2><p>Stop by anytime, or book a time for dedicated one-on-one help with your project. We'll confirm by email or phone.</p></div>
        <div class="panel">${form(`<div class="row2">${field('sd', 'Preferred date', 'date', 'required')}${field('st', 'Preferred time', 'select', '<option>10:00 am</option><option>11:30 am</option><option>1:00 pm</option><option>2:30 pm</option><option>4:00 pm</option><option>6:00 pm (weekdays)</option>')}</div>
          <div><label>Visit length</label><div class="pills">${['30 min: quick selection', '1 hour: room planning', '2 hours: whole-home project'].map((t, i) => `<label><input type="radio" name="vl"${i ? '' : ' checked'}> ${t}</label>`).join('')}</div></div>
          <div><label>I'm planning</label><div class="pills">${(be ? ['Bathroom', 'Kitchen', 'Appliances', 'Whole home', 'Trade project'] : ['New kitchen', 'Renovation', 'Appliances', 'Outdoor kitchen', 'Trade project']).map(t => `<label><input type="checkbox"> ${t}</label>`).join('')}</div></div>
          <div class="row2">${field('sn', 'Name', 'text', 'required autocomplete="name"')}${field('sp', 'Phone', 'tel', 'autocomplete="tel"')}</div>${field('se', 'Email', 'email', 'required autocomplete="email"')}${field('sm', 'Anything we should prepare?', 'textarea')}`, 'Request appointment')}</div></div></section>`;
    main().addEventListener('click', e => { const b = e.target.closest('[data-load-map]'); if (!b) return; const box = b.closest('[data-map]'); box.innerHTML = `<iframe class="map" title="Map to the showroom" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${b.dataset.loadMap}"></iframe>`; });
  };

  R.notfound = () => {
    main().innerHTML = `<section class="sec"><div class="wrap narrow center"><span class="eyebrow">Error 404</span><h1 class="h1">This page has moved</h1><p class="lead">Try searching, or start from one of these.</p><form class="pform inline" action="${S.pre}-search.html"><input name="q" placeholder="Search products, brands or model #" aria-label="Search"><input type="hidden" name="live" value="/?s="><button class="btn dark">Search</button></form>
      <div class="chips">${S.menu.slice(0, 5).map(m => `<a href="${url(m.u || m.feat.u)}">${m.label}</a>`).join('')}</div></div></section>`;
  };

  /* ================= Castle landings ================= */
  R.appliances = () => {
    const root = (C.cats || []).find(c => c.n.startsWith('High End'));
    const kids = (C.cats || []).filter(c => c.parent === root?.id && c.count).sort((a, b) => b.count - a.count);
    main().innerHTML = banner('img/app-oak-1800.webp', 'Premium kitchen appliances', 'Thermador, Gaggenau, Miele, Monogram, Bertazzoni and more — see them working in our Markham showroom, buy online for Ontario delivery.', 'Castle Appliances') +
      `<div class="wrap">${crumbs([['Appliances']])}</div><section class="sec tight"><div class="wrap"><div class="cattiles">${kids.map(c => `<a href="${url(c.live)}">${c.img ? `<img src="${c.img}" alt="" loading="lazy">` : '<span class="ph"></span>'}<b>${esc(c.n)}</b><span>${c.count} products</span></a>`).join('')}</div></div></section>` +
      rail('Display clearance — buy online', (C.priced || []).slice(0, 8), `<a class="more" href="${url('/product-category/display-clearance/')}">All clearance ${arrow}</a>`) +
      `<section class="sec"><div class="wrap"><div class="sh"><h2>Current promotions</h2></div><div class="promos">${[['Thermador', '/thermador-promotion/'], ['Miele', '/miele-appliances/'], ['Monogram', '/monogram-promotion-deals/'], ['Bertazzoni', '/bertazzoni-canada-promotion/'], ['Viking', '/viking-range-canada-promotion/'], ['JennAir', '/jennair-canada-promotions/']].map(([t, u]) => `<a href="${url(u)}"><b>${t}</b><span>View offer ${arrow}</span></a>`).join('')}</div></div></section>` + cta();
  };

  R.promotion = () => {
    const p = C.pages['thermador-promotion'], brand = (live.match(/^\/([a-z]+)/) || [])[1] || 'thermador', B = brand.charAt(0).toUpperCase() + brand.slice(1);
    const items = (C.priced || []).filter(x => x.b.toLowerCase() === brand).concat(products().filter(x => x.b.toLowerCase() === brand)).slice(0, 8);
    main().innerHTML = banner('img/kit-white-1800.webp', live === '/thermador-promotion/' ? p.heads[0] : `${B} promotion`, live === '/thermador-promotion/' ? esc(p.heads[1] || '') : `Current ${B} offers at Castle Appliances.`, `${B} · limited time`, `<button class="btn light" data-inq="">Ask about this offer ${arrow}</button>`) +
      `<div class="wrap">${crumbs([['Promotions', '/special-offers-promotions/'], [`${B}`]])}</div>` +
      (live === '/thermador-promotion/' ? `<section class="sec tight"><div class="wrap promos">${p.heads.slice(2, 5).map(h => `<div><b>${esc(h)}</b><span>Package details from the current offer page</span></div>`).join('')}</div></section>` : '') +
      rail(`Shop ${B}`, items.length ? items : (C.priced || []).slice(0, 4)) + `<section class="sec"><div class="wrap narrow prose"><p>${esc(sentences(p.x, 6))}</p><p class="note">Offer terms as published by the manufacturer. Prototype text from the current promotion page.</p></div></section>` + cta();
  };


  R.materials = () => {
    const groups = { door: /door-styles|maple|birch|oak|walnut|mdf|melemine|high-gloss|thermo|etc/, counter: /countertops|quartz|granite|marble|edge-profiles/, acc: /accessories|spice|drawer|corner|island/ };
    const kind = Object.keys(groups).find(k => groups[k].test(live)) || 'door';
    const tabs = { door: [['All door styles', '/door-styles/'], ['Maple', '/maple/'], ['Birch', '/birch/'], ['Oak', '/oak/'], ['Walnut', '/walnut/'], ['MDF / painted', '/mdf/'], ['Melamine', '/melemine/'], ['High gloss', '/high-gloss/'], ['Thermo', '/thermo/']], counter: [['Countertops', '/kitchen-countertops/'], ['Quartz', '/quartz/'], ['Granite', '/granite/'], ['Marble', '/marble/'], ['Edge profiles', '/edge-profiles/']], acc: [['Accessories & organizers', '/kitchen-accessories-and-organizers/'], ['Spice racks', '/spice-racks/'], ['Drawer organizers', '/drawer-organizers/'], ['Corner solutions', '/corner-solutions/'], ['Kitchen islands', '/kitchen-island/']] }[kind];
    const cur = (tabs.find(([, u]) => u === live) || tabs[0])[0];
    const mat = (live.match(/^\/([a-z-]+)\/$/) || [])[1];
    const pick = (C.doors || []).filter(d => !mat || mat === 'door-styles' || d.mat === mat || (mat === 'mdf' && d.mat === 'painted'));
    const doors = pick.length ? pick : (C.doors || []);
    const ex = C.extra || {};
    const head = { door: ['Door styles', 'Choose the door that sets the tone: shaker, raised panel, slab or high gloss, in maple, oak, walnut, painted MDF and more. Every door is made to order in our own factory.'],
      counter: ['Countertops', 'Quartz, granite and marble, fabricated and installed with your cabinets. See full slabs and edge profiles in our Markham showroom.'],
      acc: ['Accessories & organizers', 'Pull-outs, spice racks, drawer organizers and corner solutions that make every cabinet work harder.'] }[kind];
    const cap = m => m === 'painted' ? 'Painted MDF' : m.charAt(0).toUpperCase() + m.slice(1);
    const grid = kind === 'door'
      ? doors.map(d => `<figure class="door"><a href="#" data-lb="${d.img}"><img src="${d.img}" alt="${esc(d.name)} door" loading="lazy"></a><figcaption><b>${esc(d.name)}</b><span>${esc(cap(d.mat))}${d.code ? ' · ' + esc(d.code) : ''}</span></figcaption></figure>`).join('')
      : (kind === 'counter' ? [...(ex['kitchen-countertops'] || []), ...(ex['edge-profiles'] || [])] : (ex['kitchen-island'] || [])).map(im => `<figure class="door wide"><a href="#" data-lb="${im}"><img src="${im}" alt="" loading="lazy"></a></figure>`).join('');
    const title = cur === tabs[0][0] ? head[0] : `${cur}${kind === 'door' ? ' kitchen cabinets' : ''}`;
    main().innerHTML = pagehead(title, head[1], [['Custom kitchens', '/modern-kitchen-cabinets-toronto/'], [cur]], 'Castle Kitchens · made in our factory') +
      `<div class="wrap"><div class="chips">${tabs.map(([t, u]) => `<a href="${url(u)}" ${u === live ? 'aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</div></div>
      <section class="sec tight"><div class="wrap"><div class="doors${kind === 'door' ? '' : ' big'}">${grid}</div>
      ${kind === 'door' ? (pick.length ? '' : '<p class="note">Prototype: photos for this material come from the client; maple and painted doors shown.</p>') + '<p class="note">Door photos from the current door-style pages. Each style comes in more colours and finishes; choose yours with a designer.</p>' : ''}</div></section>
      <section class="sec stone"><div class="wrap two"><div><h2 class="h2">Design it with us</h2><p>Book a design consultation: our designers draw your kitchen, help you pick doors, countertops and hardware, and plan the appliances from Castle Appliances at the same time.</p>
      <ol class="howto"><li><b>Consultation</b>In the showroom or on a call.</li><li><b>Design &amp; quote</b>Layouts, materials and one clear quote.</li><li><b>Made in our factory</b>Cabinets built to your measurements.</li><li><b>Installation</b>Delivered and installed by our team.</li></ol></div>
      <div class="panel">${form(`<div class="row2">${field('dn', 'Name', 'text', 'required')}${field('dp', 'Phone', 'tel')}</div>${field('de', 'Email', 'email', 'required')}${field('dr', 'Project', 'select', '<option>New kitchen</option><option>Kitchen renovation</option><option>Closet / home office</option><option>Bar / media centre</option><option>Bathroom vanity</option>')}${field('dm', 'Tell us about your space', 'textarea')}`, 'Book a design consultation')}</div></div></section>`;
  };

  R.outdoor = () => {
    const p = C.pages['outdoor-kitchens-toronto'];
    main().innerHTML = banner('img/out-kitchen-1800.webp', p.t, esc(sentences(p.x, 2)), 'Outdoor living', `<a class="btn light" href="${url('/contact/')}">Design my outdoor kitchen ${arrow}</a>`) +
      `<div class="wrap">${crumbs([['Outdoor living'], [p.t]])}</div>` +
      `<section class="sec tight"><div class="wrap"><div class="masonry">${(p.imgs || []).map(im => `<a href="#" data-lb="${im}"><img src="${im}" alt="" loading="lazy"></a>`).join('')}</div></div></section>` +
      `<section class="sec stone"><div class="wrap"><div class="promos">${p.heads.slice(0, 6).map(h => `<div><b>${esc(h)}</b></div>`).join('')}</div></div></section>` + cta('See outdoor kitchens in person', 'Grills, pizza ovens and outdoor cabinets on display.');
  };

  const map = { showroom: 'showroom', materials: 'materials', shop: 'shop', category: 'category', product: 'product', brands: 'brands', brand: 'brand', search: 'search', cart: 'cart', checkout: 'checkout', order: 'order', account: 'account', wishlist: 'wishlist', blog: 'blog', post: 'post', city: 'city', projects: 'projects', project: 'project', gallery: 'gallery', service: 'service', about: 'about', testimonials: 'testimonials', contact: 'contact', quote: 'quote', experience: 'experience', policy: 'policy', '404': 'notfound', appliances: 'appliances', promotion: 'promotion', outdoor: 'outdoor' };
  const page = document.body.dataset.page;
  if (map[page]) window.PAGE = () => { R[map[page]](); document.title = `${($('#main h1') || {}).textContent || S.name} — ${S.name} (prototype)`; };
})();
