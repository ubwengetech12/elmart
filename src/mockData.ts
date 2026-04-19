import { Product, Review, Order, Advertisement } from './types';

export const MOCK_ADS: Advertisement[] = [
  {
    id: 'ad1',
    companyName: 'Bank of Kigali',
    title: 'Grow Your Business with BK Loans',
    description: 'Special credit facilities for ELMART retailers. Apply now and stock up for the season.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt9V7aqorVV--UK-bgv1JNXm3hQJBD2CayPQ&s',
    ctaUrl: '#',
    type: 'banner'
  },
  {
    id: 'ad2',
    companyName: 'MTN Rwanda',
    title: 'Unstoppable MoMo Payments',
    description: 'Accept MoMo on ELMART and get 0% merchant fees for the first 3 months.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh1mfoPQOIpNSzJwDdB88pHcJdYPoEEO-Plg&s',
    ctaUrl: '#',
    type: 'banner'
  },
  {
    id: 'ad3',
    companyName: 'Volkswagen Rwanda',
    title: 'Electric Delivery Units',
    description: 'Eco-friendly logistics for your hub. Lease the ID.4 today.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf-PXeDiyrXVYdPLFpCGHSyLYeSM4JVSUnVA&s',
    ctaUrl: '#',
    type: 'banner'
  },
  {
    id: 'ad4',
    companyName: 'Elma Pro Studios',
    title: 'AI-Generated Professional Media',
    description: 'Elevate your brand with motion-integrated AI marketing assets. Real-time cinematic quality.',
    imageUrl: 'https://picsum.photos/seed/elma-ai/1200/300?blur=1',
    ctaUrl: '#',
    type: 'banner'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cimerwa Cement 50kg (Retail)',
    description: 'High-quality Portland cement for construction. Durable and strong for all weather conditions in Rwanda.',
    price: 13500,
    category: 'Construction',
    images: [
      'https://cimerwa.rw/wp-content/uploads/2022/09/Cimerwa.jpeg',
      'https://picsum.photos/seed/cement2/600/600',
      'https://picsum.photos/seed/cement3/600/600',
      'https://picsum.photos/seed/cement4/600/600',
      'https://picsum.photos/seed/cement5/600/600'
    ],
    supplierId: 's1',
    supplierName: 'Cimerwa PLC',
    stock: 5050,
    rating: 4.9,
    reviewsCount: 320,
    isArtisan: false,
    moq: 1,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    promoVideoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    intelligence: {
      durabilityScore: 9.8,
      priceCompetitiveness: 8.9,
      returnRate: 0.1,
      valueForMoney: 9.5
    }
  },
  {
    id: 'p1_bulk',
    name: 'Cimerwa Cement (Bulk Pallet)',
    description: 'Wholesale pallet of 40 bags (50kg each). Ideal for large-scale construction projects.',
    price: 520000,
    bulkPrice: 480000,
    minBulkOrder: 5,
    category: 'Construction',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZSdbJRIrnQmCc4cqMkwAGXyYuIt7eJcQIkhAohnC&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZSdbJRIrnQmCc4cqMkwAGXyYuIt7eJcQIkhAohnC&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZSdbJRIrnQmCc4cqMkwAGXyYuIt7eJcQIkhAohnC&s'
    ],
    supplierId: 's1',
    supplierName: 'Cimerwa PLC',
    stock: 50,
    rating: 4.8,
    reviewsCount: 45,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 9.9,
      priceCompetitiveness: 9.5,
      returnRate: 0.0,
      valueForMoney: 9.7
    }
  },
  {
    id: 'p2',
    name: 'Inyange Whole Milk (1L)',
    description: 'Pure, fresh cow milk from the heart of Rwanda. UHT processed for longer shelf life.',
    price: 1000,
    category: 'Beverages',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7I8mmEAMDiPjeIeZenDvZT7A4wFPfbFBog&s',
      'https://picsum.photos/seed/milk2/600/600',
      'https://picsum.photos/seed/milk3/600/600',
      'https://picsum.photos/seed/milk4/600/600',
      'https://picsum.photos/seed/milk5/600/600'
    ],
    supplierId: 's2',
    supplierName: 'Inyange Industries',
    stock: 1000,
    rating: 4.7,
    reviewsCount: 850,
    isArtisan: false,
    moq: 1,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
    promoVideoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
    intelligence: {
      durabilityScore: 7.5,
      priceCompetitiveness: 9.0,
      returnRate: 0.2,
      valueForMoney: 9.2
    }
  },
  {
    id: 'p2_bulk',
    name: 'Inyange Milk (Case of 12)',
    description: 'Value case for retailers. 12 packs of 1L Inyange UHT Milk.',
    price: 11500,
    bulkPrice: 10800,
    minBulkOrder: 10,
    category: 'Beverages',
    images: [
      'https://inyangeindustries.com/img/2023/new/Milk-banner-300x300.jpg',
      'https://inyangeindustries.com/img/2023/new/Milk-banner-300x300.jpg',
      'https://inyangeindustries.com/img/2023/new/Milk-banner-300x300.jpg'
    ],
    supplierId: 's2',
    supplierName: 'Inyange Industries',
    stock: 200,
    rating: 4.6,
    reviewsCount: 120,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 7.0,
      priceCompetitiveness: 9.8,
      returnRate: 0.5,
      valueForMoney: 8.8
    }
  },
  {
    id: 'p3',
    name: 'Rwanda Mountain Tea Premium',
    description: 'Exquisite black tea from the high mountains of Rwanda. Rich aroma and deep flavor.',
    price: 3500,
    category: 'Food',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeGswghTktZyQ5xzdfzSOcp5ASUB7FBSkDhA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeGswghTktZyQ5xzdfzSOcp5ASUB7FBSkDhA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeGswghTktZyQ5xzdfzSOcp5ASUB7FBSkDhA&s'
    ],
    supplierId: 's3',
    supplierName: 'Sorwathe Ltd',
    stock: 450,
    rating: 4.9,
    reviewsCount: 230,
    isArtisan: false,
    moq: 5,
    intelligence: {
      durabilityScore: 9.5,
      priceCompetitiveness: 9.2,
      returnRate: 0.2,
      valueForMoney: 9.4
    }
  },
  {
    id: 'p3_bulk',
    name: 'Rwanda Mountain Tea (10kg Sack)',
    description: 'Bulk wholesale sack for distributors and hotels. Freshly packed premium tea leaf.',
    price: 65000,
    bulkPrice: 58000,
    minBulkOrder: 5,
    category: 'Food',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rwanda_Mountain_Tea_Products.jpg/250px-Rwanda_Mountain_Tea_Products.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rwanda_Mountain_Tea_Products.jpg/250px-Rwanda_Mountain_Tea_Products.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rwanda_Mountain_Tea_Products.jpg/250px-Rwanda_Mountain_Tea_Products.jpg'
    ],
    supplierId: 's3',
    supplierName: 'Sorwathe Ltd',
    stock: 80,
    rating: 4.8,
    reviewsCount: 34,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 9.0,
      priceCompetitiveness: 9.5,
      returnRate: 0.1,
      valueForMoney: 9.6
    }
  },
  {
    id: 'p4',
    name: 'Bralirwa: Primus Beer (Crate)',
    description: 'A national icon. Refreshing lager made in Rwanda since 1959. Crate of 24 glass bottles.',
    price: 18500,
    category: 'Beverages',
    images: [
      'https://www.sebagroup.rw/images/slider/slider4.jpg',
      'https://www.sebagroup.rw/images/slider/slider4.jpg',
      'https://www.sebagroup.rw/images/slider/slider4.jpg'
    ],
    supplierId: 's4',
    supplierName: 'Bralirwa PLC',
    stock: 300,
    rating: 4.5,
    reviewsCount: 1500,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 7.0,
      priceCompetitiveness: 9.5,
      returnRate: 4.5,
      valueForMoney: 8.0
    }
  },
  {
    id: 'p5',
    name: 'Bralirwa: Mutzig Beer (Crate of 24)',
    description: 'The premium choice. A rich, golden lager with a distinct hop aroma. Crate of 24 bottles.',
    price: 21000,
    category: 'Beverages',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbxBQd-o5o1MyZq9euLaxUy-B1JkyUDFuVkw&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbxBQd-o5o1MyZq9euLaxUy-B1JkyUDFuVkw&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbxBQd-o5o1MyZq9euLaxUy-B1JkyUDFuVkw&s'
    ],
    supplierId: 's4',
    supplierName: 'Bralirwa PLC',
    stock: 150,
    rating: 4.7,
    reviewsCount: 920,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 7.2,
      priceCompetitiveness: 8.5,
      returnRate: 3.2,
      valueForMoney: 8.5
    }
  },
  {
    id: 'p6',
    name: 'Bralirwa: Coca-Cola (Case)',
    description: 'Global taste, locally produced. Case of 12 plastic bottles (500ml).',
    price: 7200,
    category: 'Beverages',
    images: [
      'hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfYx-SrniQZXvK6SkWM6AkNxzsC5ZOPRbC9w&s',
      'hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfYx-SrniQZXvK6SkWM6AkNxzsC5ZOPRbC9w&s',
      'hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfYx-SrniQZXvK6SkWM6AkNxzsC5ZOPRbC9w&s'
    ],
    supplierId: 's4',
    supplierName: 'Bralirwa PLC',
    stock: 500,
    rating: 4.8,
    reviewsCount: 2000,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 6.5,
      priceCompetitiveness: 9.2,
      returnRate: 0.1,
      valueForMoney: 8.0
    }
  },
  {
    id: 'p7',
    name: 'Bralirwa: Fanta Orange (Case)',
    description: 'Refreshing fruit flavor. Locally produced orange soda. Case of 12 bottles.',
    price: 7200,
    category: 'Beverages',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cz8B_NQ1XgUkb0IO9wALfqhG_EtJbKxY8g&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cz8B_NQ1XgUkb0IO9wALfqhG_EtJbKxY8g&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cz8B_NQ1XgUkb0IO9wALfqhG_EtJbKxY8g&s'
    ],
    supplierId: 's4',
    supplierName: 'Bralirwa PLC',
    stock: 450,
    rating: 4.6,
    reviewsCount: 1800,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 6.5,
      priceCompetitiveness: 9.2,
      returnRate: 0.1,
      valueForMoney: 8.0
    }
  },
  {
    id: 'p8',
    name: 'Moshions Umwitero (Premium)',
    description: 'A masterpiece of Rwandan fashion. Hand-crafted wrap with traditional geometric patterns.',
    price: 85000,
    bulkPrice: 75000,
    category: 'Fashion',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbE9CrIJCE6VThOn0t96F806emf7fsw0w4Q&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbE9CrIJCE6VThOn0t96F806emf7fsw0w4Q&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbE9CrIJCE6VThOn0t96F806emf7fsw0w4Q&s'
    ],
    supplierId: 's5',
    supplierName: 'Moshions',
    stock: 20,
    rating: 5.0,
    reviewsCount: 88,
    isArtisan: true,
    moq: 1,
    intelligence: {
      durabilityScore: 9.8,
      priceCompetitiveness: 6.5,
      returnRate: 0.5,
      valueForMoney: 9.0
    }
  },
  {
    id: 'p9',
    name: 'Moshions Classic Shirt',
    description: 'Elegance redefined. Tailored high-quality cotton shirt with cultural accents.',
    price: 45000,
    category: 'Fashion',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbE9CrIJCE6VThOn0t96F806emf7fsw0w4Q&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbE9CrIJCE6VThOn0t96F806emf7fsw0w4Q&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbE9CrIJCE6VThOn0t96F806emf7fsw0w4Q&s'
    ],
    supplierId: 's5',
    supplierName: 'Moshions',
    stock: 35,
    rating: 4.9,
    reviewsCount: 56,
    isArtisan: true,
    moq: 1,
    intelligence: {
      durabilityScore: 9.2,
      priceCompetitiveness: 7.0,
      returnRate: 1.2,
      valueForMoney: 8.8
    }
  },
  {
    id: 'p10',
    name: 'C&H Garments T-Shirts (Pack 50)',
    description: 'High-quality cotton T-shirts for retail or corporate branding. Wholesale pack.',
    price: 150000,
    bulkPrice: 135000,
    minBulkOrder: 10,
    category: 'Fashion',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGi1UyjmyzOwQFdFo8GLXm-I4DzGKgYem8eg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGi1UyjmyzOwQFdFo8GLXm-I4DzGKgYem8eg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGi1UyjmyzOwQFdFo8GLXm-I4DzGKgYem8eg&s'
    ],
    supplierId: 's6',
    supplierName: 'C&H Garments',
    stock: 100,
    rating: 4.4,
    reviewsCount: 42,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 8.0,
      priceCompetitiveness: 9.5,
      returnRate: 2.5,
      valueForMoney: 9.0
    }
  },
  {
    id: 'p11',
    name: 'Haute Baso Beaded Necklace',
    description: 'Contemporary Rwandan jewelry. Hand-beaded by women artisan cooperatives.',
    price: 12000,
    category: 'Fashion',
    images: [
      'https://www.blueruby.com/cdn/shop/files/Filter_Charms_Pendants_269c386b-ebba-45a5-9446-628a09d1e2e5.jpg?crop=center&height=1080&v=1761864822&width=1350',
      'https://www.blueruby.com/cdn/shop/files/Filter_Charms_Pendants_269c386b-ebba-45a5-9446-628a09d1e2e5.jpg?crop=center&height=1080&v=1761864822&width=1350',
      'https://www.blueruby.com/cdn/shop/files/Filter_Charms_Pendants_269c386b-ebba-45a5-9446-628a09d1e2e5.jpg?crop=center&height=1080&v=1761864822&width=1350'
    ],
    supplierId: 's7',
    supplierName: 'Haute Baso',
    stock: 150,
    rating: 4.9,
    reviewsCount: 78,
    isArtisan: true,
    moq: 5,
    intelligence: {
      durabilityScore: 8.5,
      priceCompetitiveness: 8.0,
      returnRate: 0.5,
      valueForMoney: 9.2
    }
  },
  {
    id: 'p12',
    name: 'Sulfo: Clear Soap (Pack 10)',
    description: 'Classic antibacterial soap for household hygiene. Reliable and affordable.',
    price: 3500,
    category: 'Home',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNtKXa2TY5eBT7zMUPMpEOF6BQy7o0GCRGWg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNtKXa2TY5eBT7zMUPMpEOF6BQy7o0GCRGWg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNtKXa2TY5eBT7zMUPMpEOF6BQy7o0GCRGWg&s'
    ],
    supplierId: 's8',
    supplierName: 'Sulfo Rwanda Industries',
    stock: 1200,
    rating: 4.6,
    reviewsCount: 340,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 9.0,
      priceCompetitiveness: 9.8,
      returnRate: 0.1,
      valueForMoney: 9.9
    }
  },
  {
    id: 'p13',
    name: 'Sulfo: detergents (5kg)',
    description: 'Powerful cleaning for colored and white laundry. Bulk economy pack.',
    price: 6500,
    bulkPrice: 6000,
    category: 'Home',
    images: [
      'https://sulfo.com/wp-content/uploads/2024/02/Sulfo-5l-2.jpg',
      'https://sulfo.com/wp-content/uploads/2024/02/Sulfo-5l-2.jpg',
      'https://sulfo.com/wp-content/uploads/2024/02/Sulfo-5l-2.jpg'
    ],
    supplierId: 's8',
    supplierName: 'Sulfo Rwanda Industries',
    stock: 450,
    rating: 4.7,
    reviewsCount: 150,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 8.5,
      priceCompetitiveness: 9.5,
      returnRate: 0.4,
      valueForMoney: 9.4
    }
  },
  {
    id: 'p14',
    name: 'Akabanga Chili Oil (Pack 20)',
    description: 'Rwandan legendary heat. Concentrated chili oil dropper bottles. Original formula.',
    price: 15000,
    category: 'Food',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/812JrtcaIeL._AC_UL495_SR435,495_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/812JrtcaIeL._AC_UL495_SR435,495_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/812JrtcaIeL._AC_UL495_SR435,495_.jpg'
    ],
    supplierId: 's9',
    supplierName: 'SINA Gerard / Enterprise Urwibutso',
    stock: 1000,
    rating: 5.0,
    reviewsCount: 3500,
    isArtisan: true,
    moq: 1,
    intelligence: {
      durabilityScore: 9.9,
      priceCompetitiveness: 9.0,
      returnRate: 0.0,
      valueForMoney: 10.0
    }
  },
  {
    id: 'p15',
    name: 'Gorilla Coffee Bourbon (500g)',
    description: 'Specialty coffee from Rwandan highlands. Medium-dark roast with fruity notes.',
    price: 6500,
    category: 'Beverages',
    images: [
      'https://gorillascoffee.com/wp-content/uploads/2024/05/Untitled-design-10.png',
      'https://gorillascoffee.com/wp-content/uploads/2024/05/Untitled-design-10.png',
      'https://gorillascoffee.com/wp-content/uploads/2024/05/Untitled-design-10.png'
    ],
    supplierId: 's10',
    supplierName: 'Rwanda Farmers Coffee Co.',
    stock: 500,
    rating: 4.9,
    reviewsCount: 890,
    isArtisan: false,
    moq: 2,
    intelligence: {
      durabilityScore: 8.8,
      priceCompetitiveness: 8.5,
      returnRate: 0.3,
      valueForMoney: 9.2
    }
  },
  {
    id: 'p16',
    name: 'Kinazi Cassava Flour (25kg)',
    description: 'Premium quality cassava flour. Staple food for millions. Finely milled and dry.',
    price: 18000,
    bulkPrice: 16500,
    category: 'Food',
    images: [
      'https://i5.walmartimages.com/asr/e4512666-b0b2-4da7-ada5-b753967ee238.838783e13c7ab13591c8f38a93b639ef.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
      'https://i5.walmartimages.com/asr/e4512666-b0b2-4da7-ada5-b753967ee238.838783e13c7ab13591c8f38a93b639ef.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
      'https://i5.walmartimages.com/asr/e4512666-b0b2-4da7-ada5-b753967ee238.838783e13c7ab13591c8f38a93b639ef.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF'
    ],
    supplierId: 's11',
    supplierName: 'Kinazi Cassava Plant',
    stock: 200,
    rating: 4.8,
    reviewsCount: 420,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 8.2,
      priceCompetitiveness: 9.5,
      returnRate: 0.8,
      valueForMoney: 9.4
    }
  },
  {
    id: 'p17',
    name: 'Skol Lager (Crate 6)',
    description: 'Refreshing international quality lager brewed in Rwanda. Crisp and clean taste.',
    price: 17500,
    category: 'Beverages',
    images: [
      'https://tafonzu.com/wp-content/uploads/2025/01/5352201391377.jpg',
      'https://tafonzu.com/wp-content/uploads/2025/01/5352201391377.jpg',
      'https://tafonzu.com/wp-content/uploads/2025/01/5352201391377.jpg'
    ],
    supplierId: 's12',
    supplierName: 'Skol Brewery Ltd Rwanda',
    stock: 400,
    rating: 4.6,
    reviewsCount: 1100,
    isArtisan: false,
    moq: 1,
    intelligence: {
      durabilityScore: 6.8,
      priceCompetitiveness: 9.5,
      returnRate: 3.5,
      valueForMoney: 8.2
    }
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    buyerId: 'b1',
    buyerName: 'Jean Bosco (Wholesale)',
    buyerEmail: 'bosco@example.rw',
    buyerType: 'LARGE_SCALE',
    supplierId: 's1',
    items: [
      { productId: 'p1_bulk', productName: 'Cimerwa Cement (Bulk Pallet)', quantity: 10, price: 480000 }
    ],
    total: 4800000,
    status: 'DELIVERED',
    currentStep: 4,
    paymentMethod: 'HYBRID',
    createdAt: '2026-04-18T10:00:00Z',
    invoices: [
      { id: 'inv1', orderId: 'o1', type: 'TAX_INVOICE', url: '#', createdAt: '2026-04-18T10:05:00Z' }
    ]
  },
  {
    id: 'o2',
    buyerId: 'b2',
    buyerName: 'Marie Claire',
    buyerEmail: 'claire@example.rw',
    buyerType: 'SMALL_SCALE',
    supplierId: 's1',
    items: [
      { productId: 'p2', productName: 'Inyange Whole Milk (1L)', quantity: 5, price: 1000 }
    ],
    total: 5000,
    status: 'PAID',
    currentStep: 2,
    paymentMethod: 'MOMO',
    createdAt: '2026-04-19T08:30:00Z',
    invoices: [
      { id: 'inv2', orderId: 'o2', type: 'PAYMENT_CONFIRMATION', url: '#', createdAt: '2026-04-19T08:35:00Z' }
    ]
  },
  {
    id: 'o3',
    buyerId: 'b3',
    buyerName: 'Kigali Logistics Hub',
    buyerEmail: 'hub@kigali.rw',
    buyerType: 'LARGE_SCALE',
    supplierId: 's1',
    items: [
      { productId: 'p1_bulk', productName: 'Cimerwa Cement (Bulk Pallet)', quantity: 2, price: 480000 }
    ],
    total: 960000,
    status: 'PENDING',
    currentStep: 1,
    paymentMethod: 'CARD',
    createdAt: '2026-04-19T09:45:00Z',
    invoices: []
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: 'Alice Umutoni',
    rating: 5,
    comment: 'The quality is amazing. I love the intricate patterns!',
    date: '2024-03-15'
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u2',
    userName: 'Jean-Claude Havugimana',
    rating: 4,
    comment: 'Beautiful piece, but took a bit longer to deliver than expected.',
    date: '2024-03-10'
  }
];
