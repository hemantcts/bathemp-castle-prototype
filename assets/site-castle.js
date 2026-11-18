/* Castle Kitchens / Castle Appliances: menus, footer, homepage products and the address map.
   Every link is written as the LIVE address it will keep (SEO); group.js turns it into the matching prototype page. */
window.SITE = {
  id: 'castle', pre: 'ck', home: 'castle.html', other: 'bathemp.html', active: ['kitchens', 'appliances'], usd: false, legal: 'Castle Kitchens', name: 'Castle Kitchens',
  util: 'CAD pricing · Delivery across Ontario',
  menu: [
    { label: 'Custom kitchens', mega: [
      { h: 'Kitchens', links: [['Modern kitchen cabinets','/modern-kitchen-cabinets-toronto/'],['White kitchen cabinets','/white-kitchen-cabinets/'],['Kitchen remodeling','/kitchen-remodeling-toronto/'],['Kitchen renovation','/kitchen-renovation-in-toronto/'],['Storage solutions','/storage-solutions/']] },
      { h: 'Design &amp; materials', links: [['Door styles','/door-styles/'],['Maple','/maple/'],['Painted MDF','/mdf/'],['Countertops','/kitchen-countertops/'],['Quartz','/quartz/'],['Accessories &amp; organizers','/kitchen-accessories-and-organizers/']] },
      { h: 'Portfolio', links: [['Modern kitchens','/modern-kitchens/'],['Transitional kitchens','/transitional-kitchens/'],['Traditional kitchens','/traditional-kitchens/'],['Kitchen islands','/kitchen-islands/'],['Closets &amp; home office','/closets-home-office-home-library/'],['Bars &amp; media centres','/bars-media-centers-fire-places/']] },
      { h: 'Who we are', links: [['Our factory','/our-factory/'],['Our process','/our-process/'],['Our standards','/our-standards/'],['What makes us different','/what-makes-us-different/'],['Testimonials','/testimonials/']] },
      { h: 'Trades', links: [['Architects &amp; designers','/custom-kitchens-for-architects-and-designers/'],['Multi-housing projects','/multi-housing-projects/'],['New dealer','/new-dealer/']] },
    ], feat: { t: 'Kitchen projects', u: '/projects/', img: 'img/kit-aitken-900.webp' } },
    { label: 'Appliances', mega: [
      { h: 'Cooking', links: [['Ranges &amp; stoves','/product-category/appliances/ranges/'],['Wall ovens','/product-category/appliances/wall-ovens/'],['Cooktops','/product-category/appliances/cooktops/'],['Range tops','/product-category/appliances/ranges/range-tops/'],['Microwaves','/product-category/appliances/microwaves/'],['Coffee machines','/product-category/coffee-machines/']] },
      { h: 'Refrigeration', links: [['Refrigerators','/product-category/appliances/refrigerators/'],['Built-in refrigerators','/product-category/appliances/refrigerators/built-in-refrigerators/'],['French door','/product-category/appliances/refrigerators/french-door-refrigerators/'],['Freezers','/product-category/appliances/freezers/'],['Wine storage','/product-category/appliances/wine-storage/']] },
      { h: 'Cleaning &amp; air', links: [['Dishwashers','/product-category/appliances/dishwashers/'],['Ventilation','/product-category/appliances/ventilation/'],['Custom range hoods','/product-category/appliances/ventilation/custom-range-hoods/'],['Washers &amp; dryers','/product-category/appliances/washers-and-dryers/']] },
      { h: 'Offers', links: [['All deals &amp; promotions','/special-offers-promotions/'],['Thermador promotion','/thermador-promotion/'],['Miele','/miele-appliances/'],['Monogram','/monogram-promotion-deals/'],['Display clearance','/product-category/display-clearance/']] },
    ], feat: { t: 'All appliances', u: '/appliances/', img: 'img/app-oak-900.webp' } },
    { label: 'Outdoor living', mega: [
      { h: 'Outdoor kitchens', links: [['Outdoor kitchens Toronto','/outdoor-kitchens-toronto/'],['Backyard kitchens','/backyard-kitchens/'],['Outdoor kitchen cabinets','/product-category/outdoor-kitchens/outdoor-kitchen-cabinets/'],['Outdoor promotions','/outdoor-kitchens-promotions/']] },
      { h: 'Grills &amp; ovens', links: [['Built-in grills','/product-category/outdoor-kitchens/built-in-grills/'],['Freestanding grills','/product-category/outdoor-kitchens/freestanding-grills/'],['Pellet grills','/product-category/outdoor-kitchens/pellet-grills/'],['Pizza ovens','/product-category/outdoor-kitchens/outdoor-pizza-ovens/']] },
    ], feat: { t: 'Outdoor kitchens', u: '/outdoor-kitchens-toronto/', img: 'img/out-kitchen-900.webp' } },
    { label: 'Projects', u: '/projects/' },
    { label: 'Brands', u: '/our-brands/' },
    { label: 'Experience Centre', u: '/experience-centre/' },
    { label: 'Contact', u: '/contact/' },
    { label: 'Display clearance', u: '/product-category/display-clearance/', sale: true },
  ],
  // Homepage cards: real clearance prices (from the live product titles) can be bought; the rest Inquire now
  // until Sukhjinder's price list is loaded.
  products: [
    { id: '4480', b: 'Thermador', n: 'Thermador PRD606WCSG 60" Pro Grand Dual Fuel Steam Range', img: 'img/p/ck-4480.webp', live: '/product/thermador-prd606wcsg/' },
    { id: '15289', b: 'Gaggenau', n: 'Gaggenau GO470720 Expressive Series 24" Smart Oven', img: 'img/p/ck-15289.webp', live: '/product/gaggenau-go470720-oven/' },
    { id: '9110', b: 'Miele', n: 'Miele CVA 7845 Built-In Coffee Machine', img: 'img/p/ck-9110.webp', live: '/product/miele-cva-7845-coffee-machine/' },
    { id: '3802', b: 'Monogram', n: 'Monogram ZDP366NPSS 36" Dual Fuel Pro Range, 6 Burners', img: 'img/p/ck-3802.webp', live: '/product/monogram-zdp366npss/' },
    { id: '4045', b: 'Monogram', n: 'Monogram ZWE23ESHSS Counter-Depth French-Door Refrigerator', img: 'img/p/ck-4045.webp', live: '/product/monogram-zwe23eshss/' },
    { id: '2766', b: 'Liebherr', n: 'Liebherr HWS1800 24" Built-In Fully Integrated Wine Cabinet', img: 'img/p/ck-2766.webp', live: '/product/liebherr-hws1800/' },
    { id: '9063', b: 'Miele', n: 'Miele KF 2812 Vi 30" MasterCool Bottom-Mount Fridge Freezer', img: 'img/p/ck-9063.webp', live: '/product/miele-kf-2812-vi-30-inch-fridge/' },
    { id: '14560', b: 'Monogram', n: 'Monogram ZTS90DPSNSS 30" Statement Built-In Single Oven', p: 4999, badge: 'Display clearance', img: 'img/p/ck-14560.webp', live: '/product/monogram-30-inch-oven/' },
  ],
  featuredBrands: ['Thermador', 'Gaggenau', 'Miele', 'Monogram', 'Bertazzoni', 'Liebherr', 'Viking Range'],
  footer: [
    { h: 'Kitchens', links: [['Custom kitchens','/modern-kitchen-cabinets-toronto/'],['Kitchen remodeling','/kitchen-remodeling-toronto/'],['Projects','/projects/'],['Our factory','/our-factory/']] },
    { h: 'Appliances', links: [['All appliances','/appliances/'],['Brands','/our-brands/'],['Promotions','/special-offers-promotions/'],['Display clearance','/product-category/display-clearance/']] },
    { h: 'Help', links: [['Delivery','/shipping-policy/'],['Returns','/returns/'],['My account','/my-account/'],['Testimonials','/testimonials/'],['Contact','/contact/']] },
  ],
  shipping: 'Delivery within Ontario. Appliances ship by freight; the delivery cost is shown at checkout from the weight. Free pickup from our Markham showroom.',
};
