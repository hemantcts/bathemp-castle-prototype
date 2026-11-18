/* Bath Emporium: menus, footer, homepage products and the address map.
   Every link is written as the LIVE address it will keep (SEO); group.js turns it into the matching prototype page. */
window.SITE = {
  id: 'bathemp', pre: 'be', home: 'bathemp.html', other: 'castle.html', active: ['bath'], usd: true, legal: 'Bath Emporium', name: 'Bath Emporium',
  util: 'Free shipping on most items · Canada &amp; USA',
  menu: [
    { label: 'Bathroom', mega: [
      { h: 'Bathroom products', links: [['Bathtubs','/product-category/bathtubs/'],['Freestanding bathtubs','/product-category/bathtubs/freestanding-bathtubs/'],['Bathroom vanities','/product-category/bathroom-vanities/'],['Bathroom faucets','/product-category/bathroom-faucet/'],['Toilets','/product-category/bathroom-toilets/'],['Smart toilets','/product-category/bathroom-toilets/intelligent-smart-toilets/'],['Bathroom sinks','/product-category/bathroom-sinks/']] },
      { h: 'Shower', links: [['Shower kits','/product-category/bathroom-faucet/bath-shower-kit-geo/'],['Shower columns','/product-category/bathroom/bathroom-bathroom-shower-columns/'],['Shower doors','/product-category/bathroom/bathroom-shower-doors/'],['Shower bases','/product-category/bathroom-shower-bases/'],['Shower drains','/product-category/bathroom/bathroom-bathroom-shower-drains/']] },
      { h: 'Wall mounted', links: [['Wall-mounted faucets','/product-category/bathroom-faucet/wall-mounted-bathroom-faucets/'],['Wall-mounted tub fillers','/product-category/bathroom-faucet/wall-mounted-tub-fillers/'],['Steam units','/product-category/bathroom/bathroom-bathroom-steam-units/']] },
      { h: 'Accessories', links: [['LED mirrors','/product-category/bathroom/bath-accessories/bathroom-mirrors/'],['Medicine cabinets','/product-category/bathroom/bath-accessories/bathroom-medicine-cabinets/'],['Towel &amp; floor warmers','/product-category/bathroom/bathroom-towelfloor-warmers/'],['Bath accessories','/product-category/bathroom/bath-accessories/']] },
    ], feat: { t: 'All bathroom products', u: '/bathroom-products-categories/', img: 'img/bath-neorest-900.webp' } },
    { label: 'Kitchen', mega: [
      { h: 'Kitchen', links: [['Kitchen sinks','/product-category/kitchen/kitchen-sink-geo/'],['Workstation sinks','/product-category/kitchen/kitchen-sink-geo/workstation-kitchen-sinks/'],['Kitchen faucets','/product-category/kitchen-faucets-geo/'],['Pot fillers','/product-category/kitchen-faucets-geo/pot-fillers/'],['Soap dispensers','/product-category/kitchen/kitchen-soap-dispensers/'],['Kitchen accessories','/product-category/kitchen/kitchen-kitchen-accessories/']] },
      { h: 'Castle Kitchens', links: [['Custom kitchen cabinets','/kitchen-cabinets/'],['Kitchen appliances','ck:/appliances/']] },
      { h: 'Outdoor', links: [['Outdoor kitchens','ck:/outdoor-kitchens-toronto/'],['Outdoor cabinets','ck:/product-category/outdoor-kitchens/outdoor-kitchen-cabinets/'],['Outdoor appliances','ck:/product-category/outdoor-kitchens/']] },
    ], feat: { t: 'All kitchen products', u: '/kitchen-products-categories/', img: 'img/kit-reveal-900.webp' } },
    { label: 'Services', mega: [
      { h: 'Design', links: [['Bathroom design','/bathroom-design-services/'],['Kitchen design','/kitchen-design-services/'],['Installation services','/installation-services/'],['Get a quote','/getaquote/']] },
      { h: 'Portfolio', links: [['Bathroom projects','/bathrooms/'],['Kitchen projects','/kitchens-portfolio/'],['Closets','/closets-portfolio/'],['Project videos','/recent-project-videos/']] },
    ], feat: { t: 'Our projects', u: '/portfolio/', img: 'img/bath-stone-900.webp' } },
    { label: 'Brands', u: '/our-brands/' },
    { label: 'Experience Centre', u: '/experience-centre/' },
    { label: 'Blog', u: '/blog/' },
    { label: 'Contact', u: '/contact/' },
    { label: 'Sale', u: '/product-category/sale-items/', sale: true },
    { label: 'Display clearance', u: '/product-category/display-clearance/', sale: true },
  ],
  // Homepage cards. Prices = the matching Bliss price (they follow Bliss automatically). No price = Inquire now.
  products: [
    { id: '3700', b: 'Riobel', n: 'Riobel Zendo ZOTQ54C Pressure Balance Shower Kit', p: 640.50, img: 'img/p/be-3700.webp', live: '/product/riobel-zotq54c-shower-kit/' },
    { id: '146006', b: 'TOTO', n: 'TOTO MS644114CEFG Carolina II One-Piece Toilet, Elongated', p: 1299, img: 'img/p/be-146006.webp', live: '/product/toto-carolina-2-one-piece-high-efficiency-toilet-with-sanagloss-1-28gpf-ms644114cefg/' },
    { id: '170418', b: 'ROHL', n: 'ROHL Amahle Widespread Bathroom Faucet With C-Spout', p: 880.60, img: 'img/p/be-170418.webp', live: '/product/rohl-am08d3iwapc-amahle-faucet/' },
    { id: '170375', b: 'Blanco', n: 'Blanco 402043 Panera Kitchen Faucet With Pullout Spray', p: 823.20, img: 'img/p/be-170375.webp', live: '/product/blanco-402043-panera-faucet/' },
    { id: '3669', b: 'Riobel', n: 'Riobel ZSOP01 Single Hole Lavatory Open Spout Faucet', p: 421, img: 'img/p/be-3669.webp', live: '/product/riobel-zsop01c-single-hole-lavatory-open-spout-faucet/' },
    { id: '172756', b: 'Grohe', n: 'Grohe Rainshower GrohTherm Thermostatic Shower Kit', p: 1722, img: 'img/p/be-172756.webp', live: '/product/grohe-1030690000-rainshower-shower-kit/' },
    { id: '172134', b: 'Duravit', n: 'Duravit D-Neo Wall Mounted Rimless Toilet', p: 282, img: 'img/p/be-172134.webp', live: '/product/duravit-2577090092-d-neo-wall-mounted-toilet/' },
    { id: '142503', b: 'Fleurco', n: 'Fleurco Aria Voce Grande Freestanding Tub — display model', badge: 'Display clearance', img: 'img/p/be-142503.webp', live: '/product/fleurco-aria-voce/' },
  ],
  featuredBrands: ['Riobel','TOTO','Victoria + Albert','BainUltra','Brizo','ROHL','Blanco'],
  logos: [['Riobel','img/logos/riobel.webp','/brands/riobel/'],['TOTO','img/logos/toto.webp','/brands/toto/'],['Victoria + Albert','img/logos/victoria-and-albert.webp','/brands/victoria-and-albert/'],['BainUltra','img/logos/bainultra.webp','/brands/bainultra/'],['Brizo','img/logos/brizo.webp','/brands/brizo/'],['ROHL','img/logos/rohl.webp','/brands/rohl/'],['Blanco','img/logos/blanco.webp','/brands/blanco/']], // real brand logos (Bliss brand logos / Castle's brands page)
  footer: [
    { h: 'Shop', links: [['Bathroom','/bathroom-products-categories/'],['Kitchen','/kitchen-products-categories/'],['Brands','/our-brands/'],['Sale','/product-category/sale-items/'],['Display clearance','/product-category/display-clearance/']] },
    { h: 'Services', links: [['Design services','/design-services/'],['Installation','/installation-services/'],['Get a quote','/getaquote/'],['Portfolio','/portfolio/']] },
    { h: 'Help', links: [['Shipping','/shipping-policy/'],['Returns','/returns/'],['My account','/my-account/'],['About us','/aboutus/'],['Contact','/contact/']] },
  ],
  shipping: 'Free shipping on items under 70 lb across Canada and the USA. Heavier items ship by freight, cost confirmed before we process the order. Free pickup from our Markham showroom.',
};
