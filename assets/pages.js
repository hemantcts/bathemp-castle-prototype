/* Page templates for both sites. <body data-page="…"> picks the renderer; content comes from CONTENT (real, exported
   from the live sites) and SITE. Every link goes through G.url(live address) so it stays inside the prototype. */
(() => {
  const { $, $$, esc, url, qs, live, money, card, product, all, Cart, toast, ico, S, C } = window.G;
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
    const sample = c.live !== C.cat.live;
    let list = products().slice();
    const facets = {}; list.forEach(p => { facets.Brand = facets.Brand || {}; facets.Brand[p.b] = (facets.Brand[p.b] || 0) + 1; Object.entries(p.atts || {}).forEach(([k, v]) => { if (/brand/i.test(k)) return; (facets[k] = facets[k] || {}); v.forEach(x => facets[k][x] = (facets[k][x] || 0) + 1); }); });
    const desc = C.cat.desc || '';
    main().innerHTML = pagehead(c.n, esc(sentences(desc, 2)) || `Shop ${esc(c.n.toLowerCase())} online.`, [...(parent ? [[parent.n, parent.live]] : []), [c.n]]) +
      (kids.length ? `<div class="wrap"><div class="chips">${kids.map(k => `<a href="${url(k.live)}">${esc(k.n)} <small>${k.count}</small></a>`).join('')}</div></div>` : '') +
      `<section class="sec tight listing"><div class="wrap lgrid">
        <aside class="filters" aria-label="Filters"><div class="fh"><b>Filters</b><button class="ilink" data-clear>Clear all</button></div>
          ${be ? `<details open><summary>Price</summary><div class="opts">${['Under $500', '$500 – $1,000', '$1,000 – $2,500', '$2,500 and up'].map((t, i) => `<label><input type="checkbox" data-price="${i}"> ${t}</label>`).join('')}</div></details>` : `<details open><summary>Availability</summary><div class="opts"><label><input type="checkbox" data-priced> Buy online now</label><label><input type="checkbox" data-clear-only> Display clearance</label></div></details>`}
          ${Object.entries(facets).slice(0, 6).map(([k, v]) => `<details ${k === 'Brand' ? 'open' : ''}><summary>${esc(k)}</summary><div class="opts">${Object.entries(v).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([o, n]) => `<label><input type="checkbox" data-f="${esc(k)}" value="${esc(o)}"> ${esc(o)} <small>${n}</small></label>`).join('')}</div></details>`).join('')}
        </aside>
        <div><div class="toolbar"><span data-count></span><label>Sort <select data-sort><option value="">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name A–Z</option></select></label><button class="btn line sm" data-filters-open>Filters</button></div>
          ${sample ? `<p class="note">Prototype: products shown are a sample (Freestanding Bathtubs / Refrigerators); the live category keeps its own products and address.</p>` : ''}
          <div class="rail three" data-grid></div>
          <nav class="pager" aria-label="Pages"><span aria-current="page">1</span><a href="#" onclick="return false">2</a><a href="#" onclick="return false">3</a><a href="#" onclick="return false">Next →</a></nav></div>
      </div></section>
      <section class="sec guide"><div class="wrap narrow"><span class="eyebrow">Buying guide</span><div class="prose">${clean(desc)}</div></div></section>` + faq(C.cat.faq || []) + cta();
    const grid = $('[data-grid]'), cnt = $('[data-count]');
    const apply = () => {
      const f = $$('[data-f]:checked').reduce((a, i) => ((a[i.dataset.f] = a[i.dataset.f] || []).push(i.value), a), {});
      const pr = $$('[data-price]:checked').map(i => +i.dataset.price), ranges = [[0, 500], [500, 1000], [1000, 2500], [2500, 1e9]];
      let out = list.filter(p => Object.entries(f).every(([k, v]) => k === 'Brand' ? v.includes(p.b) : v.some(x => (p.atts?.[k] || []).includes(x))))
        .filter(p => !pr.length || (p.p && pr.some(i => p.p >= ranges[i][0] && p.p < ranges[i][1])));
      if ($('[data-priced]')?.checked) out = out.filter(p => p.p);
      const s = $('[data-sort]').value;
      if (s) out.sort((a, b) => s === 'az' ? a.n.localeCompare(b.n) : ((a.p || 1e9) - (b.p || 1e9)) * (s === 'lo' ? 1 : -1));
      grid._list = out; grid.innerHTML = out.map(card).join('') || '<p class="note">No products match these filters.</p>'; cnt.textContent = `${out.length} products`;
    };
    main().addEventListener('change', e => { if (e.target.closest('.filters,[data-sort]')) apply(); });
    $('[data-clear]').onclick = () => { $$('.filters input').forEach(i => i.checked = false); apply(); };
    $('[data-filters-open]').onclick = () => $('.filters').classList.toggle('open');
    document.addEventListener('cur:change', apply);
    apply();
  };

  R.product = () => {
    const d = findDetail(live) || (C.detail || [])[0], p = product(d.id) || d;
    const price = p.p || d.p;
    const finishes = Object.entries(d.atts || {}).find(([k]) => /finish/i.test(k))?.[1] || [];
    const specs = Object.entries(d.atts || {}).filter(([k]) => !/finish/i.test(k));
    const sku = (d.n.match(/\b[A-Z]{2,}[A-Z0-9-]{3,}\b/) || [''])[0];
    const cat = (C.cats || []).find(c => d.cats?.includes(c.n));
    const related = products().filter(x => x.id !== d.id).slice(0, 4);
    main().innerHTML = `<div class="wrap">${crumbs([...(cat ? [[cat.n, cat.live]] : []), [d.n]])}</div>
    <section class="pdp wrap">
      <div class="gal"><div class="main"><img src="${d.imgs[0]}" alt="${esc(d.n)}" data-main></div><div class="thumbs">${d.imgs.filter(Boolean).map((im, i) => `<button aria-label="Photo ${i + 1}" ${i ? '' : 'aria-current="true"'} data-thumb="${im}"><img src="${im}" alt=""></button>`).join('')}</div></div>
      <div class="info">
        <div class="br">${esc(d.b)}</div><h1>${esc(d.n)}</h1>${sku ? `<p class="sku">Model ${esc(sku)}</p>` : ''}
        <div class="price">${price ? money(price) : '<span class="por">Price on request</span>'}</div>
        ${be && price ? '<p class="note">Same price as at Bliss Bath and Kitchen: it updates automatically when the Bliss price changes.</p>' : ''}
        ${finishes.length ? `<div class="opt"><b>Finish: <span data-fin>${esc(finishes[0])}</span></b><div class="sw">${finishes.map((f, i) => `<button aria-pressed="${!i}" data-finish="${esc(f)}">${esc(f)}</button>`).join('')}</div></div>` : ''}
        <div class="buy">${price ? `<div class="qty"><button aria-label="Fewer" data-q="-1">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button aria-label="More" data-q="1">+</button></div><button class="btn dark" data-add="${d.id}">Add to cart</button>` : ''}
          <button class="btn ${price ? 'line' : 'dark'}" data-inq="${d.id}">Inquire now</button><button class="wish static" data-wish="${d.id}" aria-pressed="${G.wish().includes(d.id)}" aria-label="Save to wishlist">${ico.heart}</button></div>
        <ul class="perks"><li><b>Delivery</b> ${esc(S.shipping)}</li><li><b>Authorized dealer</b> Full manufacturer warranty.</li><li><b>See it first</b> On display in our Markham showroom — <a href="${url('/experience-centre/')}">plan a visit</a>.</li></ul>
        ${d.short ? `<div class="prose small">${clean(d.short)}</div>` : ''}
      </div>
    </section>
    <section class="sec tight"><div class="wrap narrow"><div class="tabs" role="tablist">${['Description', 'Specifications', 'Delivery & returns'].map((t, i) => `<button role="tab" aria-selected="${!i}" data-tab="${i}">${t}</button>`).join('')}</div>
      <div class="tabp prose" data-panel="0">${clean(d.desc) || '<p>Product description.</p>'}</div>
      <div class="tabp" data-panel="1" hidden><table class="specs">${specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v.join(', '))}</td></tr>`).join('')}${finishes.length ? `<tr><th>Finishes</th><td>${esc(finishes.join(', '))}</td></tr>` : ''}${d.weight ? `<tr><th>Shipping weight</th><td>${esc(d.weight)} lb</td></tr>` : ''}</table></div>
      <div class="tabp prose" data-panel="2" hidden><p>${esc(S.shipping)}</p><p>Returns are accepted within 14 days of delivery on unused, uninstalled items in the original packaging, with approval first. See the <a href="${url('/returns/')}">return policy</a>.</p></div>
    </div></section>` + rail('You may also like', related) + cta();
    main().addEventListener('click', e => {
      const t = e.target.closest('[data-thumb]'); if (t) { $('[data-main]').src = t.dataset.thumb; $$('[data-thumb]').forEach(b => b.removeAttribute('aria-current')); t.setAttribute('aria-current', 'true'); }
      const f = e.target.closest('[data-finish]'); if (f) { $$('[data-finish]').forEach(b => b.setAttribute('aria-pressed', String(b === f))); $('[data-fin]').textContent = f.dataset.finish; }
      const q = e.target.closest('[data-q]'); if (q) { const i = $('#qty'); i.value = Math.max(1, (+i.value || 1) + +q.dataset.q); }
      const tb = e.target.closest('[data-tab]'); if (tb) { $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b === tb))); $$('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== tb.dataset.tab); }
    });
    document.addEventListener('cur:change', () => { const pr = $('.pdp .price'); if (price) pr.innerHTML = money(price); });
  };

  R.brands = () => {
    const list = (C.brands || []).slice().sort((a, b) => a.n.localeCompare(b.n));
    const groups = list.reduce((g, b) => ((g[b.n[0].toUpperCase()] = g[b.n[0].toUpperCase()] || []).push(b), g), {});
    main().innerHTML = pagehead('Our brands', `${list.length} brands, all from authorized Canadian distributors with full manufacturer warranty.`) +
      `<section class="sec tight"><div class="wrap"><div class="logos big">${(S.featuredBrands || []).map(n => `<a href="${url(be ? `/brands/${n.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/` : '/our-brands/')}">${esc(n)}</a>`).join('')}</div>
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
    main().innerHTML = pagehead('Checkout', '', [['Cart', '/cart/'], ['Checkout']]) + `<section class="sec tight"><div class="wrap cartgrid"><form class="pform co" id="co">
      <h2>Contact</h2><div class="row2">${field('em', 'Email', 'email', 'required autocomplete="email"')}${field('ph', 'Phone', 'tel', 'autocomplete="tel"')}</div>
      <h2>Delivery address</h2><div class="row2">${field('fn', 'First name', 'text', 'required')}${field('ln', 'Last name', 'text', 'required')}</div>${field('ad', 'Address', 'text', 'required autocomplete="address-line1"')}
      <div class="row3">${field('ci', 'City', 'text', 'required')}${field('pv', be ? 'Province / State' : 'Province', 'select', provs.map(([v, t]) => `<option value="${v}">${t}</option>`).join('') + (be ? '<option value="US">United States (state)</option>' : ''))}${field('pc', 'Postal / ZIP code', 'text', 'required')}</div>
      ${be ? field('co2', 'Country', 'select', '<option value="CA">Canada</option><option value="US">United States</option>') : '<p class="note">Castle Appliances delivers within Ontario. For other provinces please <a data-inq="">contact the showroom</a>.</p>'}
      <h2>Delivery</h2><div class="radios"><label><input type="radio" name="sh" checked> ${be ? 'Standard shipping — free on items under 70 lb' : 'Ontario delivery (freight)'}</label><label><input type="radio" name="sh"> Pick up at our Markham showroom — free</label></div>
      <h2>Payment</h2><div class="radios pay"><label><input type="radio" name="pm" checked> Credit / debit card <small>Visa, Mastercard, Amex, Apple Pay, Google Pay</small></label><div class="cardbox">Card fields appear here (Stripe) — prototype, no payment is taken.</div><label><input type="radio" name="pm"> PayPal</label></div>
      <label class="chk"><input type="checkbox" required><span>I agree to the <a href="${url('/terms/')}">terms</a> and <a href="${url('/returns/')}">return policy</a>.</span></label>
      <button class="btn dark full">Place order ${arrow}</button></form>
      <aside class="summary"><h2>Your order</h2><ul class="mini">${items.map(i => `<li><img src="${i.p.img}" alt=""><span>${esc(i.p.n)} <small>× ${i.qty}</small></span><b>${money(i.p.p * i.qty)}</b></li>`).join('')}</ul><dl data-tot></dl><p class="note" data-curnote></p></aside></div></section>`;
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
      <div><div class="facts col"><div><b>Showroom</b>5 Shields Court, Unit 100, Markham, ON L3R 0G3</div><div><b>Call</b>(905) 944-0060 · Toll free 1-866-880-5446</div><div><b>Hours</b>Mon–Fri 9–7 · Sat 9–5 · Sun 12–5</div></div><img class="rounded" src="img/store-${be ? 'bath' : 'castle'}-900.webp" alt="The showroom at 5 Shields Court, Markham" loading="lazy"></div></div></section>`;
  };

  R.quote = () => {
    main().innerHTML = pagehead('Get a quote', esc(sentences(C.pages.getaquote?.x, 2)) || 'Tell us about your project and we will prepare a quote.', [['Get a quote']]) + `<section class="sec tight"><div class="wrap narrow panel">${form(`<div class="row2">${field('qn', 'Name', 'text', 'required')}${field('qp', 'Phone', 'tel')}</div>${field('qe', 'Email', 'email', 'required')}<div class="row2">${field('qr', 'Room', 'select', '<option>Bathroom</option><option>Kitchen</option><option>Both</option><option>Other</option>')}${field('qt', 'Timeline', 'select', '<option>As soon as possible</option><option>1–3 months</option><option>3–6 months</option><option>Just planning</option>')}</div>${field('qm', 'Tell us about the project', 'textarea')}${field('qf', 'Plans or photos (optional)', 'file', 'multiple')}`, 'Request a quote')}</div></section>`;
  };

  R.experience = () => {
    const vid = 'https://bathemp.ca/wp-content/uploads/2020/10/Bath-Emporium-Castle-Kitchens-Showroom-Tour.mp4';
    main().innerHTML = banner(be ? 'img/bath-showroom-1800.webp' : 'img/kit-display-1800.webp', 'The Experience Centre', 'See, touch and experience design: working bathrooms, full kitchens and premium appliances in one Markham showroom.', 'Bath Emporium · Castle Kitchens · Castle Appliances', `<a class="btn light" href="#book">Book your visit ${arrow}</a> <button class="btn light" data-video="${vid}">Watch the tour</button>`) +
      `<section class="sec"><div class="wrap"><div class="tiles">${[['Bath Emporium', 'img/bath-tub-900.webp', 'Freestanding tubs, smart toilets and showers you can try.'], ['Castle Kitchens', 'img/kit-reveal-900.webp', 'Full kitchen displays, door styles and countertops.'], ['Castle Appliances', 'img/app-oak-900.webp', 'Working ranges, ovens and refrigeration.'], ['Outdoor living', 'img/out-kitchen-900.webp', 'Outdoor kitchens, grills and pizza ovens.']].map(([t, im, p]) => `<div class="tile"><img src="${im}" alt="" loading="lazy"><div class="t"><b>${t}</b><p style="margin:6px 0 0;font-size:14px">${p}</p></div></div>`).join('')}</div></div></section>
      <section class="sec stone" id="book"><div class="wrap two"><div><h2 class="h2">Plan your visit</h2><p>Book a time and a designer will be ready for you, with samples for your project. Walk-ins are welcome too.</p><div class="facts col"><div><b>Address</b>5 Shields Court, Unit 100, Markham, ON</div><div><b>Hours</b>Mon–Fri 9–7 · Sat 9–5 · Sun 12–5</div></div></div>
      <div class="panel">${form(`<div class="row2">${field('vn', 'Name', 'text', 'required')}${field('vp', 'Phone', 'tel')}</div>${field('ve', 'Email', 'email', 'required')}<div class="row2">${field('vd', 'Date', 'date', 'required')}${field('vt', 'Time', 'select', '<option>Morning</option><option>Afternoon</option><option>Evening (weekdays)</option>')}</div>${field('vi', 'Interested in', 'select', '<option>Bathroom</option><option>Kitchen &amp; cabinetry</option><option>Appliances</option><option>Outdoor kitchen</option><option>Everything</option>')}`, 'Book my visit')}</div></div></section>`;
  };

  R.policy = () => {
    const key = live.replace(/\//g, '');
    const P = {
      'shipping-policy': ['Shipping & delivery', be ? [['Where we ship', 'Canada and the USA. US orders are charged in USD; Canadian orders in CAD.'], ['Cost', 'Items under 70 lb ship free. Items of 70 lb or more ship by freight; we confirm the cost with you before processing the order.'], ['Timing', 'In-stock items usually ship in 2–5 business days. Special-order items show their lead time on the product page.'], ['Pickup', 'Free pickup from our Markham showroom.'], ['Inspect on delivery', 'Please check every item before signing and report damage within 24 hours.']] : [['Where we deliver', 'Within Ontario. For other provinces, contact the showroom.'], ['Cost', 'Appliances ship by freight; the delivery cost is shown at checkout.'], ['Scheduling', 'We call you to book the delivery date.'], ['Pickup', 'Free pickup from our Markham showroom.']]],
      returns: ['Returns', [['Window', 'Eligible products can be returned within 14 days of delivery.'], ['Condition', 'Unused, uninstalled and unassembled, in the complete original packaging.'], ['Approval first', 'All returns need approval before anything is shipped back.'], ['Fees', 'Approved returns are subject to a 25% restocking fee plus shipping; return shipping is paid by the customer unless the return is our error or shipping damage.']]],
      'privacy-policy': ['Privacy policy', [['What we collect', 'The details you give us at checkout or in forms, and cookies you agree to.'], ['How we use it', 'To fulfil orders, answer questions and, with your consent, send offers.'], ['Your choices', 'Cookie preferences and email unsubscribe are always available.']]],
      terms: ['Terms & conditions', [['Prices', `Prices are in ${be ? 'CAD or USD' : 'CAD'} and exclude tax.`], ['Orders', 'An order is accepted when we confirm it by email.'], ['Warranty', 'Manufacturer warranties apply to every product.']]],
    }[key] || ['Policy', []];
    main().innerHTML = pagehead(P[0], '', [[P[0]]]) + `<section class="sec tight"><div class="wrap narrow"><p class="note">${be ? 'Draft based on the Bliss Bath and Kitchen policies (same rules).' : 'Draft for Castle Appliances — the client confirms the delivery fees and the return rules for appliances.'}</p><dl class="policy">${P[1].map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>
      <div class="chips">${[['Shipping', '/shipping-policy/'], ['Returns', '/returns/'], ['Privacy', '/privacy-policy/'], ['Terms', '/terms/']].map(([t, u]) => `<a href="${url(u)}" ${u === live ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</div></div></section>`;
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

  R.outdoor = () => {
    const p = C.pages['outdoor-kitchens-toronto'];
    main().innerHTML = banner('img/out-kitchen-1800.webp', p.t, esc(sentences(p.x, 2)), 'Outdoor living', `<a class="btn light" href="${url('/contact/')}">Design my outdoor kitchen ${arrow}</a>`) +
      `<div class="wrap">${crumbs([['Outdoor living'], [p.t]])}</div>` +
      `<section class="sec tight"><div class="wrap"><div class="masonry">${(p.imgs || []).map(im => `<a href="#" data-lb="${im}"><img src="${im}" alt="" loading="lazy"></a>`).join('')}</div></div></section>` +
      `<section class="sec stone"><div class="wrap"><div class="promos">${p.heads.slice(0, 6).map(h => `<div><b>${esc(h)}</b></div>`).join('')}</div></div></section>` + cta('See outdoor kitchens in person', 'Grills, pizza ovens and outdoor cabinets on display.');
  };

  const map = { shop: 'shop', category: 'category', product: 'product', brands: 'brands', brand: 'brand', search: 'search', cart: 'cart', checkout: 'checkout', order: 'order', account: 'account', wishlist: 'wishlist', blog: 'blog', post: 'post', city: 'city', projects: 'projects', project: 'project', gallery: 'gallery', service: 'service', about: 'about', testimonials: 'testimonials', contact: 'contact', quote: 'quote', experience: 'experience', policy: 'policy', '404': 'notfound', appliances: 'appliances', promotion: 'promotion', outdoor: 'outdoor' };
  const page = document.body.dataset.page;
  if (map[page]) window.PAGE = () => { R[map[page]](); document.title = `${($('#main h1') || {}).textContent || S.name} — ${S.name} (prototype)`; };
})();
