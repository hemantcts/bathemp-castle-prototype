"""Writes every template page (be-*.html, ck-*.html) with the same head, updates the two homepages to the shared
assets, and writes index.html: the template list with the live addresses each template keeps (the SEO map).
Run after changing the template list: python -I tools/build.py"""
import pathlib, re, html
R = pathlib.Path(__file__).resolve().parent.parent

SITES = {
    'be': dict(site='bathemp', name='Bath Emporium', fav='<link rel="icon" href="img/be-favicon-32.png" sizes="32x32"><link rel="icon" href="img/be-favicon-192.png" sizes="192x192"><link rel="apple-touch-icon" href="img/be-favicon-180.png">'),
    'ck': dict(site='castle', name='Castle Kitchens', fav='<link rel="icon" href="img/ck-favicon.svg" type="image/svg+xml"><link rel="icon" href="img/ck-favicon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="img/ck-favicon-180.png">'),
}
# file, page renderer, sample live address, template name, live addresses it covers (count on the live site)
PAGES = {
    'be': [
        ('bathemp.html', None, '/', 'Home', '/', '1'),
        ('be-shop.html', 'shop', '/bathroom-products-categories/', 'Shop / department', '/shop/, /bathroom-products-categories/, /kitchen-products-categories/', '3'),
        ('be-category.html', 'category', '/product-category/bathtubs/freestanding-bathtubs/', 'Product category', '/product-category/…/', '159'),
        ('be-product.html', 'product', '/product/riobel-zotq54c-shower-kit/', 'Product', '/product/…/', '2,417'),
        ('be-brands.html', 'brands', '/our-brands/', 'All brands', '/our-brands/', '1'),
        ('be-brand.html', 'brand', '/brands/riobel/', 'Brand', '/brands/…/', '60'),
        ('be-search.html', 'search', '/?s=', 'Search results', '/?s=…', '—'),
        ('be-blog.html', 'blog', '/blog/', 'Blog', '/blog/', '1'),
        ('be-post.html', 'post', '', 'Article', '/{article}/', '101'),
        ('be-city.html', 'city', '/blanco-kitchen-sinks-for-ajax/', 'Local SEO article (city page)', '/{brand-product}-for-{city}/', '2,286'),
        ('be-projects.html', 'projects', '/bathrooms/', 'Portfolio', '/portfolio/, /bathrooms/, /kitchens-portfolio/, /closets-portfolio/ …', '9'),
        ('be-service.html', 'service', '/installation-services/', 'Service page', '/design-services/, /installation-services/, /kitchen-cabinets/ …', '5'),
        ('be-quote.html', 'quote', '/getaquote/', 'Get a quote', '/getaquote/', '1'),
        ('be-about.html', 'about', '/aboutus/', 'About', '/aboutus/', '1'),
        ('be-contact.html', 'contact', '/contact/', 'Contact', '/contact/', '1'),
        ('be-experience.html', 'experience', '/experience-centre/', 'Experience Centre', '/experience-centre/ (new page)', 'new'),
        ('be-cart.html', 'cart', '/cart/', 'Cart', '/cart/ (exists, unused today)', 'new'),
        ('be-checkout.html', 'checkout', '/checkout/', 'Checkout', '/checkout/ (exists, unused today)', 'new'),
        ('be-order.html', 'order', '/checkout/order-received/175450/', 'Order confirmed', '/checkout/order-received/…/', 'new'),
        ('be-account.html', 'account', '/my-account/', 'My account', '/my-account/', 'new'),
        ('be-wishlist.html', 'wishlist', '/wishlist/', 'Wishlist', '/wishlist/', '1'),
        ('be-policy.html', 'policy', '/shipping/', 'Policy pages', '/shipping/ (existing), /returns/, /privacy-policy/, /payment-methods/ (new, from Bliss)', '1 + 3 new'),
        ('be-404.html', '404', '/404/', 'Page not found', '(any missing address)', '—'),
    ],
    'ck': [
        ('castle.html', None, '/', 'Home', '/', '1'),
        ('ck-appliances.html', 'appliances', '/appliances/', 'Appliances landing', '/appliances/', '1'),
        ('ck-category.html', 'category', '/product-category/appliances/refrigerators/', 'Product category', '/product-category/…/', '49'),
        ('ck-product.html', 'product', '/product/thermador-prd606wcsg/', 'Product', '/product/…/', '858'),
        ('ck-brands.html', 'brands', '/our-brands/', 'All brands', '/our-brands/', '1'),
        ('ck-promotion.html', 'promotion', '/thermador-promotion/', 'Brand promotion', '/thermador-promotion/, /miele-appliances/, /special-offers-promotions/ …', '19'),
        ('ck-outdoor.html', 'outdoor', '/outdoor-kitchens-toronto/', 'Outdoor kitchens landing', '/outdoor-kitchens-toronto/, /backyard-kitchens/, /lynx-grills-toronto-canada/ …', '8'),
        ('ck-service.html', 'service', '/kitchen-remodeling-toronto/', 'Kitchen service page', '/kitchen-remodeling-toronto/, /white-kitchen-cabinets/, /kitchen-countertops/ …', '6'),
        ('ck-materials.html', 'materials', '/door-styles/', 'Door styles / countertops / accessories', '/door-styles/, /maple/, /oak/, /mdf/ …, /kitchen-countertops/, /quartz/, /granite/, /marble/, /edge-profiles/, /kitchen-accessories-and-organizers/ …', '19'),
        ('ck-gallery.html', 'gallery', '/modern-kitchens/', 'Portfolio gallery', '/modern-kitchens/, /transitional-kitchens/, /kitchen-islands/ …', '7'),
        ('ck-projects.html', 'projects', '/projects/', 'Projects', '/projects/, /kitchen-bathroom-project-videos/', '2'),
        ('ck-project.html', 'project', '/projects/mcvean-manor-project/', 'Single project', '/projects/{project}/ (new)', 'new'),
        ('ck-about.html', 'about', '/our-factory/', 'Company / trade page', '/our-factory/, /our-process/, /our-standards/, /custom-kitchens-for-architects-and-designers/ …', '7'),
        ('ck-testimonials.html', 'testimonials', '/testimonials/', 'Testimonials', '/testimonials/', '1'),
        ('ck-blog.html', 'blog', '/blog/', 'Blog', '/blog/', '1'),
        ('ck-post.html', 'post', '', 'Article', '/{article}/', '31'),
        ('ck-contact.html', 'contact', '/contact/', 'Contact', '/contact/', '1'),
        ('ck-experience.html', 'experience', '/experience-centre/', 'Experience Centre', '/experience-centre/ (new page)', 'new'),
        ('ck-search.html', 'search', '/?s=', 'Search results', '/?s=…', '—'),
        ('ck-cart.html', 'cart', '/cart/', 'Cart', '/cart/ (new)', 'new'),
        ('ck-checkout.html', 'checkout', '/checkout/', 'Checkout', '/checkout/ (new)', 'new'),
        ('ck-order.html', 'order', '/checkout/order-received/175450/', 'Order confirmed', '/checkout/order-received/…/', 'new'),
        ('ck-account.html', 'account', '/my-account/', 'My account', '/my-account/', '1'),
        ('ck-wishlist.html', 'wishlist', '/wishlist/', 'Wishlist', '/wishlist/ (new)', 'new'),
        ('ck-policy.html', 'policy', '/shipping-info/', 'Policy pages', '/shipping-info/, /returns/, /privacy-policy/, /payment-methods/ (new, from Bliss, Ontario + CAD)', 'new'),
        ('ck-404.html', '404', '/404/', 'Page not found', '(any missing address)', '—'),
    ],
}
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500&family=Inter:wght@400;600&family=Montserrat:wght@500;600&display=swap" rel="stylesheet">'
CSS = '<link rel="stylesheet" href="assets/group.css"><link rel="stylesheet" href="assets/pages.css">'
def scripts(site): return f'<script src="assets/site-{site}.js"></script><script src="assets/content-{site}.js"></script><script src="assets/group.js"></script><script src="assets/pages.js"></script>'

import json as _j
for _pre, _site in (('be','bathemp'),('ck','castle')):
    _t=(R/f'assets/content-{_site}.js').read_text(encoding='utf-8'); _d=_j.JSONDecoder().raw_decode(_t[_t.index('{'):])[0]
    PAGES[_pre]=[(a,b,(_d['posts'][0]['live'] if b=='post' else c),*rest) for a,b,c,*rest in PAGES[_pre]]
for pre, pages in PAGES.items():
    s = SITES[pre]
    for f, page, live, name, *_ in pages:
        if not page: continue
        (R / f).write_text(f'''<!doctype html>
<html lang="en-CA"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(name)} — {s["name"]} (prototype)</title>
<meta name="robots" content="noindex,nofollow">
{FONTS}
{s["fav"]}
{CSS}
</head><body data-page="{page}" data-live="{live}">
<div id="hdr"></div>
<main id="main"></main>
<div id="ftr"></div>
{scripts(s["site"])}
</body></html>
''', encoding='utf-8')

# homepages: shared assets, no inline SITE, links as data-live (never to the live sites)
for pre, f in (('be', 'bathemp.html'), ('ck', 'castle.html')):
    p = R / f; t = p.read_text(encoding='utf-8')
    t = t.replace('<link rel="stylesheet" href="group.css">', CSS)
    t = re.sub(r'<body[^>]*>', '<body data-page="home" data-live="/">', t, count=1)
    t = re.sub(r'<div class="proto">.*?</div>\n', '', t, count=1)
    t = re.sub(r'<script>\s*window\.SITE = .*?</script>\s*<script src="group\.js"></script>', scripts(SITES[pre]['site']), t, flags=re.S)
    def link(m):
        host, path = m.group(1), m.group(2) or '/'
        target = ('' if (host == 'bathemp') == (pre == 'be') else ('be:' if host == 'bathemp' else 'ck:')) + path
        return f'href="#" data-live="{target}"'
    t = re.sub(r'href="https?://(?:www\.)?(bathemp|castlekitchens)\.ca(/[^"]*)?"', lambda m: link(m) if not m.group(0).endswith('.mp4"') else 'href="#"', t)
    t = re.sub(r'href="https?://(?:www\.)?(bathemp|castlekitchens)\.ca[^"]*\.mp4"', 'href="#"', t)
    t = t.replace('href="#visit"', 'href="#" data-live="/experience-centre/"') if False else t
    p.write_text(t, encoding='utf-8')

# index: template list + SEO address map
rows = lambda pre: ''.join(f'<tr><td><a href="{f}">{html.escape(n)}</a></td><td><code>{html.escape(c)}</code></td><td class="r">{k}</td></tr>' for f, _, _, n, c, k in PAGES[pre])
(R / 'index.html').write_text(f'''<!doctype html>
<html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bath Emporium · Castle Kitchens — prototype templates</title><meta name="robots" content="noindex,nofollow">
<link rel="icon" href="img/be-favicon-32.png" sizes="32x32">
{FONTS}
<style>body{{margin:0;background:#0b0b0b;color:#eee;font:15px/1.55 Inter,system-ui,sans-serif}}main{{max-width:1180px;margin:0 auto;padding:48px 20px 80px}}
h1{{font:500 clamp(22px,3vw,32px) Cinzel,serif;letter-spacing:.1em;text-transform:uppercase;margin:0 0 8px}}h2{{font:600 13px Montserrat,sans-serif;letter-spacing:.18em;text-transform:uppercase;margin:44px 0 12px;color:#fff}}
p{{color:#aaa;max-width:80ch}}.home{{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:26px 0}}.home a{{border:1px solid #333;padding:22px;display:flex;gap:14px;align-items:center;font:600 13px Montserrat;letter-spacing:.14em;text-transform:uppercase}}.home a:hover{{background:#fff;color:#000}}.home img{{width:40px;border-radius:7px}}
a{{color:inherit}}table{{width:100%;border-collapse:collapse;font-size:14px}}th,td{{text-align:left;border-bottom:1px solid #262626;padding:10px 8px;vertical-align:top}}th{{font:600 11px Montserrat;letter-spacing:.14em;text-transform:uppercase;color:#888}}
td a{{color:#fff;font-weight:600}}code{{color:#d9c39a;font-size:13px;word-break:break-word}}.r{{text-align:right;white-space:nowrap}}.k{{background:#151515;border:1px solid #262626;padding:18px 22px;margin-top:22px}}.k li{{margin:4px 0;color:#bbb}}
@media(max-width:640px){{.home{{grid-template-columns:1fr}}td:nth-child(2){{display:none}}}}</style></head>
<body><main><h1>Prototype templates</h1><p>Bath Emporium and Castle Kitchens / Castle Appliances · new design and online store, for client approval. Not the live sites: every link stays inside the prototype, and every page is marked "noindex".</p>
<div class="home"><a href="bathemp.html"><img src="img/be-favicon-180.png" alt="">Bath Emporium homepage</a><a href="castle.html"><img src="img/ck-favicon-180.png" alt="">Castle Kitchens homepage</a></div>
<div class="k"><b>How SEO is kept</b><ul><li>Each template replaces the design only. The live address in the second column stays exactly the same, with the same page title, description, heading and text.</li><li>Every page of the prototype shows, in the bar at the top, which live address it stands for.</li><li>The menus carry every link the live menus have today, so no page loses its internal links.</li><li>"New" pages are added by the online store (cart, checkout, account) or by the brief (Experience Centre).</li></ul></div>
<h2>Bath Emporium · bathemp.ca</h2><table><tr><th>Template</th><th>Live addresses it keeps</th><th class="r">Pages today</th></tr>{rows('be')}</table>
<h2>Castle Kitchens · castlekitchens.ca</h2><table><tr><th>Template</th><th>Live addresses it keeps</th><th class="r">Pages today</th></tr>{rows('ck')}</table>
<p style="margin-top:30px">Content, products and photos are real, exported from the live sites on 18 Nov 2026. Prices on Bath Emporium follow Bliss; Castle shows real display-clearance prices and "Inquire now" for the rest until the price list arrives.</p>
</main></body></html>
''', encoding='utf-8')
print('ok', sum(1 for pages in PAGES.values() for p in pages if p[1]), 'templates')
