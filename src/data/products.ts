import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Abakaliki Stone-Free Parboiled Rice - Premium Quality (50kg)',
    price: 72000,
    originalPrice: 78000,
    rating: 4.8,
    reviewsCount: 245,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Grains & Cereals',
    stock: 25,
    initialStock: 50,
    isExpress: true,
    description: 'Sourced directly from the fertile agricultural fields of Ebonyi State, our Abakaliki Parboiled Rice is 100% stone-free, thoroughly sorted, and parboiled under high-standard hygienic conditions. It cooks easily with a non-sticky texture, rich nutritional profile, and amazing taste.',
    specs: [
      '100% Stone-free and dust-free parboiled white rice',
      'High swelling capacity with non-sticky elegant grain structure',
      'Naturally rich in fiber, vitamins, and minerals',
      'Standard 50kg wholesale packaging',
      'Sourced and milled locally in Ebonyi State, Nigeria'
    ]
  },
  {
    id: 'prod-2',
    title: 'Premium Sun-Dried Cocoa Beans - Export Grade (25kg Bag)',
    price: 95000,
    originalPrice: 110000,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Grains & Cereals',
    stock: 15,
    initialStock: 30,
    isExpress: true,
    isExportGrade: true,
    exportCertifications: ['NAFDAC Export Cleared', 'Phytosanitary Certificate', 'SGS Quality Inspected'],
    description: 'Top-tier fermentated and thoroughly sun-dried Cocoa beans sourced from cooperative farms in Ondo State. Perfect for small-scale local processors or chocolate crafters. Meets rigorous moisture content and bean count requirements.',
    specs: [
      'Grade 1 Fermented Cocoa Beans with deep chocolate aroma',
      'Moisture content: less than 7.5%',
      'Bean count: 100 to 110 per 100 grams',
      'Sourced directly from certified Ondo cooperative farms',
      'Packaged in durable, breathable jute bags'
    ]
  },
  {
    id: 'prod-3',
    title: 'Delta Yellow Garri - Sweet & Extra Crispy Grain (50kg Bag)',
    price: 24500,
    originalPrice: 28000,
    rating: 4.7,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Fresh Produce & Tubers',
    stock: 40,
    initialStock: 100,
    isExpress: true,
    description: 'Traditional yellow cassava flakes processed with premium palm oil from Delta State. This Garri is exceptionally crispy, sour-sweet, perfectly fried, and has zero sand particles. Perfect for drinking with groundnut or making hot Eba.',
    specs: [
      'Crispy, coarse dry grains that rise magnificently in hot water',
      'Fortified with organic red palm oil for rich vitamin A',
      'Sieved to eliminate lumps and sand impurities',
      '50kg dry storage woven sack',
      'High starch stability and prolonged shelf-life'
    ]
  },
  {
    id: 'prod-4',
    title: 'NPK 15-15-15 Fertilizer - Golden Agricultural Grade (50kg Bag)',
    price: 28000,
    originalPrice: 32000,
    rating: 4.6,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Fertilizers & Agro-Chemicals',
    stock: 50,
    initialStock: 150,
    isExpress: false,
    description: 'NPK 15-15-15 is a premium grade balanced multi-nutrient fertilizer containing equal amounts of Nitrogen, Phosphorus, and Potassium. Ideal for general crops, vegetables, cereals, and orchard establishment across Nigerian soil types.',
    specs: [
      'Balanced NPK formula (15% Nitrogen, 15% Phosphate, 15% Potash)',
      'Improves vegetative growth, root development, and fruit yields',
      'Fast-dissolving granular structure for easy broadcasting',
      'Reduces soil acidity when used with standard instructions',
      'Manufactured by leading national blending plants'
    ]
  },
  {
    id: 'prod-5',
    title: 'Premium Abuja Yam Tubers - Giant Sweet Variety (Pack of 5)',
    price: 18000,
    originalPrice: 22000,
    rating: 4.5,
    reviewsCount: 154,
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Fresh Produce & Tubers',
    stock: 12,
    initialStock: 30,
    isExpress: true,
    description: 'Sourced from the best yam farmers in Niger and Abuja FCT. These giant tubers of white yams are sweet, dry-textured, and exceptionally mealy when boiled or pounded. Absolutely no rotten cores or insect boring.',
    specs: [
      'Pack of 5 jumbo sweet white yams (approx. 3.5kg - 5kg per tuber)',
      'Mealy and starchy texture – perfect for Pounded Yam',
      'Sourced from the current harvest season',
      'Inspected for maximum shelf storage ability',
      'Delivered fresh in ventilated crates'
    ]
  },
  {
    id: 'prod-6',
    title: 'Broiler Starter Crumbly Feed - Vital Feed Premium (25kg)',
    price: 19500,
    originalPrice: 22500,
    rating: 4.8,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Livestock & Poultry',
    stock: 30,
    initialStock: 80,
    isExpress: true,
    description: 'Vital Feed Broiler Starter is premium formulated crumbly feed designed to stimulate early feed intake, optimal gut development, and high growth rate in day-old chicks. Fortified with essential amino acids, coccidiostats, and vitamins.',
    specs: [
      'High protein density (21% - 22% Crude Protein)',
      'Formulated with vital digestible vitamins, lysine, and methionine',
      'Crumbly form minimizes feed wastage and dusty particles',
      'Contains organic growth promoters and intestinal health safeguards',
      'Standard 25kg moisture-proof woven bag'
    ]
  },
  {
    id: 'prod-7',
    title: 'Pure Organic Poultry Manure - Triple Screened Compost (25kg)',
    price: 7500,
    originalPrice: 9500,
    rating: 4.4,
    reviewsCount: 43,
    image: 'https://images.unsplash.com/photo-1532499016264-12542e527bb6?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1532499016264-12542e527bb6?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Fertilizers & Agro-Chemicals',
    stock: 60,
    initialStock: 120,
    isExpress: false,
    description: '100% natural, fully decomposed, and triple-screened poultry manure composted for over 12 weeks. High in active nitrogen, phosphorus, and organic carbon matter. Enriches soil biodiversity and water retention with zero harsh chemical odor.',
    specs: [
      'Thoroughly composted to destroy weed seeds and pathogens',
      'Screened fine particles - ready for mixing with topsoil',
      'High organic carbon content (over 35%)',
      'Perfect for vegetables, lawns, and tree crops',
      'Stored in breathable, heat-treated sacks'
    ]
  },
  {
    id: 'prod-8',
    title: 'Hybrid Roma Tomato Seeds - Disease Resistant (10,000 Seeds Pack)',
    price: 12500,
    originalPrice: 15000,
    rating: 4.7,
    reviewsCount: 135,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Farm Tools & Seeds',
    stock: 100,
    initialStock: 300,
    isExpress: true,
    description: 'Professional high-yielding Hybrid Roma VF tomato seeds. Specifically engineered to resist Fusarium Wilt, Verticillium Wilt, and Nematodes in tropical environments. Produces heavy, fleshy, deep-red tomatoes with superb storage transit life.',
    specs: [
      '95% germination rate under standard greenhouse controls',
      'Disease resistance: Fol 1 & 2, V, Nematodes',
      'Matures within 70 to 75 days after transplantation',
      'Determinate growth habit with thick foliage canopy',
      'Hermetically sealed foil packet containing 10,000 seeds'
    ]
  },
  {
    id: 'prod-9',
    title: 'Grade A Red Palm Oil - Fresh Unadulterated (25 Litre Jerrycan)',
    price: 32000,
    originalPrice: 36000,
    rating: 4.8,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1613063372218-468b12e12f61?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1613063372218-468b12e12f61?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Fresh Produce & Tubers',
    stock: 22,
    initialStock: 50,
    isExpress: true,
    description: 'Freshly pressed palm oil from quality agricultural oil palms in Edo State. Naturally processed with zero artificial colorants, dilution, or chemical preservatives. Highly fluid, beautiful golden-red color, and exceptionally low free fatty acid levels.',
    specs: [
      '100% Pure, unadulterated cold-pressed palm oil',
      'Extremely low moisture content preventing foaming or souring',
      'Rich in natural Vitamin E and Beta-Carotenes',
      'Sturdy, leak-proof 25-litre plastic jerrycan',
      'Tested and certified for kitchen consumption and industrial use'
    ]
  },
  {
    id: 'prod-10',
    title: 'Dry White Maize Grains - High Quality Feed & Milling Grade (50kg)',
    price: 38500,
    originalPrice: 42000,
    rating: 4.6,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1551754626-7ed702cd452f?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1551754626-7ed702cd452f?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Grains & Cereals',
    stock: 45,
    initialStock: 120,
    isExpress: true,
    description: 'Premium dry white maize grains sourced from farm belts in Kaduna State. Machine threshed and sun-dried to low moisture levels. Free from mold, weevils, and heavy chaff. Perfect for animal feed processing or processing into cornflour.',
    specs: [
      'Sun-dried Kaduna white maize grains',
      'Moisture level: strictly below 13%',
      'Negligible insect or weevil damage (less than 1%)',
      'Excellent bulk source of carbohydrates for broiler/layer feeds',
      'Double woven polypropylene packaging (50kg net weight)'
    ]
  },
  {
    id: 'prod-11',
    title: 'Dried Split Ginger - Export Grade A (50kg Bag)',
    price: 88000,
    originalPrice: 98000,
    rating: 4.9,
    reviewsCount: 104,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Fresh Produce & Tubers',
    stock: 18,
    initialStock: 40,
    isExpress: false,
    isExportGrade: true,
    exportCertifications: ['Federal Quarantine Certified', 'Phytosanitary Certificate', 'FDA Registered Facility'],
    description: 'Highly pungent, thoroughly sun-dried split ginger rhizomes sourced from southern Kaduna. Prepared meticulously for the international market with minimal extraneous matter, excellent oil content, and optimal moisture level.',
    specs: [
      'Export Grade A Dried Split Ginger',
      'Moisture content: strictly under 12%',
      'Total ash: less than 8%; Acid insoluble ash: less than 1%',
      'Excellent volatile oil content (minimum 1.5ml/100g)',
      'Direct Kaduna farm cooperative trade'
    ]
  },
  {
    id: 'prod-12',
    title: 'Raw Cashew Nuts (RCN) - Premium Ogbomosho Quality (50kg Bag)',
    price: 92000,
    originalPrice: 105000,
    rating: 4.8,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=400'
    ],
    category: 'Grains & Cereals',
    stock: 14,
    initialStock: 35,
    isExpress: true,
    isExportGrade: true,
    exportCertifications: ['NAFDAC Certified', 'SGS Nut Quality Report', 'USDA Phytosanitary Certificate'],
    description: 'High-quality Raw Cashew Nuts (RCN) harvested in the famous Ogbomosho belt, known globally for large nut size and excellent out-turn quality. Properly dried and graded for international export or domestic processors.',
    specs: [
      'Raw Cashew Nuts - Ogbomosho Origin',
      'Nut Count: 180 to 200 nuts per kg (Jumbo category)',
      'Kernel Out-Turn Ratio (KOR): 48 to 52 lbs per bag',
      'Moisture content: less than 8%',
      'Packaged in standard 50kg export-ready jute sacks'
    ]
  }
];

export const STATES_DELIVERY_FEES: Record<string, number> = {
  'Lagos': 1500,
  'Abuja (FCT)': 2500,
  'Rivers (Port Harcourt)': 3000,
  'Oyo (Ibadan)': 2000,
  'Ogun (Abeokuta)': 1800,
  'Kano': 3500,
  'Enugu': 2800,
  'Delta': 2800,
  'Edo (Benin)': 2400,
  'Anambra': 2800,
  'Other States': 4000
};

export const INTERNATIONAL_DELIVERY_FEES: Record<string, number> = {
  'United States': 75000,
  'United Kingdom': 68000,
  'Germany': 72000,
  'Netherlands': 70000,
  'China': 65000,
  'South Africa': 48000,
  'Ghana': 32000,
  'Canada': 80000,
  'Other Countries': 90000
};
