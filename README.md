# Bath Emporium + Castle Kitchens: homepage prototype

Branch `bathemp-castle-homepage`. Static prototype of the new homepages for bathemp.ca and castlekitchens.ca,
after the client's mockup (shared three-brand header, collections tiles, showroom band, projects, brands, visit)
and kohler.ca (oversized hero, mega menu, black / white / grey).

- `bathemp.html`, `castle.html`: one page per site; each sets `window.SITE` (menu, products, footer).
- `group.css`, `group.js`: shared design system, header, mega menu, phone menu, product cards, wishlist/cart counters,
  Inquire-now pop-up, showroom video pop-up, CAD/USD switch (Bath Emporium only, fixed 0.75 like Bliss).
- Photos: real project and showroom photos from both live sites, resized (`img/`), products in `img/p/`.
- Menu and card links point at the real live URLs, so the final mega menu keeps every link the sites have today.
- Prices on Bath Emporium cards are the matching Bliss prices; Castle has no prices yet, so every card shows Inquire now.
- The showroom tour video plays from bathemp.ca (not copied here).

View: `python -m http.server 5173` from the prototype folder, then open `/group/bathemp.html`. Pages are `noindex`.
