const mockData = {
  fashion: {
    filters: {
        priceRange: { min: 0, max: 100 },
        isFeatured: false,
        isCollections: false,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: false,
        type: ['Handmade', 'Vintage', 'Print On Demand', 'all'],
      },
    clothing: [
      {
        id: '261',
        name: "Clothing item",
        images: [
          { id: '1', source: require('./images/products/fashion/clothing/1.jpg') },
          { id: '2', source: require('./images/products/fashion/clothing/1.jpg') },
          { id: '3', source: require('./images/products/fashion/clothing/1.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '262',
        name: "Clothing item",
        images: [
          { id: '1', source: require('./images/products/fashion/clothing/2.jpg') },
          { id: '2', source: require('./images/products/fashion/clothing/2.jpg') },
          { id: '3', source: require('./images/products/fashion/clothing/2.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '263',
        name: "Clothing item",
        images: [
          { id: '1', source: require('./images/products/fashion/clothing/3.jpg') },
          { id: '2', source: require('./images/products/fashion/clothing/3.jpg') },
          { id: '3', source: require('./images/products/fashion/clothing/3.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '264',
        name: "Clothing item",
        images: [
          { id: '1', source: require('./images/products/fashion/clothing/4.jpg') },
          { id: '2', source: require('./images/products/fashion/clothing/4.jpg') },
          { id: '3', source: require('./images/products/fashion/clothing/4.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    footwear: [
      {
        id: '21',
        name: "Clothing item",
        images: [
          { id: '1', source: require('./images/products/fashion/clothing/1.jpg') },
          { id: '2', source: require('./images/products/fashion/clothing/1.jpg') },
          { id: '3', source: require('./images/products/fashion/clothing/1.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '22',
        name: "footwear item",
        images: [
          { id: '1', source: require('./images/products/fashion/footwear/2.jpg') },
          { id: '2', source: require('./images/products/fashion/footwear/2.jpg') },
          { id: '3', source: require('./images/products/fashion/footwear/2.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '23',
        name: "footwear item",
        images: [
          { id: '1', source: require('./images/products/fashion/footwear/3.jpg') },
          { id: '2', source: require('./images/products/fashion/footwear/3.jpg') },
          { id: '3', source: require('./images/products/fashion/footwear/3.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '24',
        name: "footwear item",
        images: [
          { id: '1', source: require('./images/products/fashion/footwear/4.jpg') },
          { id: '2', source: require('./images/products/fashion/footwear/4.jpg') },
          { id: '3', source: require('./images/products/fashion/footwear/4.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    accessory: [
      {
        id: '41',
        name: "accessory item",
        images: [
          { id: '1', source: require('./images/products/fashion/accessory/1.jpg') },
          { id: '2', source: require('./images/products/fashion/accessory/1.jpg') },
          { id: '3', source: require('./images/products/fashion/accessory/1.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '42',
        name: "accessory item",
        images: [
          { id: '1', source: require('./images/products/fashion/accessory/2.jpg') },
          { id: '2', source: require('./images/products/fashion/accessory/2.jpg') },
          { id: '3', source: require('./images/products/fashion/accessory/2.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '43',
        name: "accessory item",
        images: [
          { id: '1', source: require('./images/products/fashion/accessory/3.jpg') },
          { id: '2', source: require('./images/products/fashion/accessory/3.jpg') },
          { id: '3', source: require('./images/products/fashion/accessory/3.jpg') },
        ],
        description: 'fashion themed.',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '44',
        name: "accessory item",
        images: [
          { id: '1', source: require('./images/products/fashion/accessory/4.jpg') },
          { id: '2', source: require('./images/products/fashion/accessory/4.jpg') },
          { id: '3', source: require('./images/products/fashion/accessory/4.jpg') },
        ],
        description: 'fashion themed.',
        price: 399,
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
  },
  homeDecor: {
    filters: {
      priceRange: { min: 0, max: 100 },
      isFeatured: false,
      isCollections: false,
      isNewArrivals: false,
      isBanner: false,
      isPrintOnDemand: false,
      type: ['Handmade', 'Vintage', 'Print On Demand', 'all'],
    },
    furniture: [
      {
        id: '101',
        name: "Furniture item",
        images: [
          { id: '1', source: require('./images/products/home_decor/furniture/1.jpg') },
          { id: '2', source: require('./images/products/home_decor/furniture/1.jpg') },
          { id: '3', source: require('./images/products/home_decor/furniture/1.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '102',
        name: "Furniture item",
        images: [
          { id: '1', source: require('./images/products/home_decor/furniture/2.jpg') },
          { id: '2', source: require('./images/products/home_decor/furniture/2.jpg') },
          { id: '3', source: require('./images/products/home_decor/furniture/2.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '103',
        name: "Furniture item",
        images: [
          { id: '1', source: require('./images/products/home_decor/furniture/3.jpg') },
          { id: '2', source: require('./images/products/home_decor/furniture/3.jpg') },
          { id: '3', source: require('./images/products/home_decor/furniture/3.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '104',
        name: "Furniture item",
        images: [
          { id: '1', source: require('./images/products/home_decor/furniture/4.jpg') },
          { id: '2', source: require('./images/products/home_decor/furniture/4.jpg') },
          { id: '3', source: require('./images/products/home_decor/furniture/4.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    kitchenware: [
      {
        id: '121',
        name: "Kitchenware item",
        images: [
          { id: '1', source: require('./images/products/home_decor/kitchenware/1.jpg') },
          { id: '2', source: require('./images/products/home_decor/kitchenware/1.jpg') },
          { id: '3', source: require('./images/products/home_decor/kitchenware/1.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '122',
        name: "Kitchenware item",
        images: [
          { id: '1', source: require('./images/products/home_decor/kitchenware/2.jpg') },
          { id: '2', source: require('./images/products/home_decor/kitchenware/2.jpg') },
          { id: '3', source: require('./images/products/home_decor/kitchenware/2.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '123',
        name: "Kitchenware item",
        images: [
          { id: '1', source: require('./images/products/home_decor/kitchenware/3.jpg') },
          { id: '2', source: require('./images/products/home_decor/kitchenware/3.jpg') },
          { id: '3', source: require('./images/products/home_decor/kitchenware/3.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '124',
        name: "Kitchenware item",
        images: [
          { id: '1', source: require('./images/products/home_decor/kitchenware/4.jpg') },
          { id: '2', source: require('./images/products/home_decor/kitchenware/4.jpg') },
          { id: '3', source: require('./images/products/home_decor/kitchenware/4.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    lighting: [
      {
        id: '141',
        name: "Lighting item",
        images: [
          { id: '1', source: require('./images/products/home_decor/lighting/1.jpg') },
          { id: '2', source: require('./images/products/home_decor/lighting/1.jpg') },
          { id: '3', source: require('./images/products/home_decor/lighting/1.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '142',
        name: "Lighting item",
        images: [
          { id: '1', source: require('./images/products/home_decor/lighting/2.jpg') },
          { id: '2', source: require('./images/products/home_decor/lighting/2.jpg') },
          { id: '3', source: require('./images/products/home_decor/lighting/2.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '143',
        name: "Lighting item",
        images: [
          { id: '1', source: require('./images/products/home_decor/lighting/3.jpg') },
          { id: '2', source: require('./images/products/home_decor/lighting/3.jpg') },
          { id: '3', source: require('./images/products/home_decor/lighting/3.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '144',
        name:

 "Lighting item",
        images: [
          { id: '1', source: require('./images/products/home_decor/lighting/4.jpg') },
          { id: '2', source: require('./images/products/home_decor/lighting/4.jpg') },
          { id: '3', source: require('./images/products/home_decor/lighting/4.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    walldecor: [
      {
        id: '161',
        name: "Wall Decor Item",
        images: [
          { id: '1', source: require('./images/products/home_decor/wall_decor/1.jpg') },
          { id: '2', source: require('./images/products/home_decor/wall_decor/1.jpg') },
          { id: '3', source: require('./images/products/home_decor/wall_decor/1.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '162',
        name: "Wall Decor Item",
        images: [
          { id: '1', source: require('./images/products/home_decor/wall_decor/2.jpg') },
          { id: '2', source: require('./images/products/home_decor/wall_decor/2.jpg') },
          { id: '3', source: require('./images/products/home_decor/wall_decor/2.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '163',
        name: "Wall Decor Item",
        images: [
          { id: '1', source: require('./images/products/home_decor/wall_decor/3.jpg') },
          { id: '2', source: require('./images/products/home_decor/wall_decor/3.jpg') },
          { id: '3', source: require('./images/products/home_decor/wall_decor/3.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '164',
        name: "Wall Decor Item",
        images: [
          { id: '1', source: require('./images/products/home_decor/wall_decor/4.jpg') },
          { id: '2', source: require('./images/products/home_decor/wall_decor/4.jpg') },
          { id: '3', source: require('./images/products/home_decor/wall_decor/4.jpg') },
        ],
        description: 'Home decor themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
  },
  hobbyLeisure: {
    filters: {
        priceRange: { min: 0, max: 100 },
        isFeatured: false,
        isCollections: false,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: false,
        type: ['Handmade', 'Vintage', 'Print On Demand', 'all'],
      },
    creative: [
      {
        id: '201',
        name: "creative item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/creative/1.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/creative/1.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/creative/1.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '202',
        name: "Creative Item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/creative/2.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/creative/2.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/creative/2.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '203',
        name: "Creative Item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/creative/3.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/creative/3.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/creative/3.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '204',
        name: "Creative Item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/creative/4.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/creative/4.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/creative/4.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    hobby: [
      {
        id: '221',
        name: "Hobby item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/hobby/1.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/hobby/1.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/hobby/1.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '222',
        name: "Hobby item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/hobby/2.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/hobby/2.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/hobby/2.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '223',
        name: "Hobby item",
        images: [
          { id: '1',

 source: require('./images/products/hobby_and_leisure/hobby/3.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/hobby/3.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/hobby/3.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '224',
        name: "Hobby item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/hobby/4.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/hobby/4.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/hobby/4.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
    leisure: [
      {
        id: '241',
        name: "Leisure item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/leisure/1.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/leisure/1.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/leisure/1.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '242',
        name: "Leisure item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/leisure/2.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/leisure/2.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/leisure/2.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: true,
        isCollections: false,
        isNewArrivals: false,
        isBanner: true,
        isPrintOnDemand: false,
        type: 'Handmade',
      },
      {
        id: '243',
        name: "Leisure item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/leisure/3.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/leisure/3.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/leisure/3.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: true,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: true,
        type: 'Print On Demand',
      },
      {
        id: '244',
        name: "Leisure item",
        images: [
          { id: '1', source: require('./images/products/hobby_and_leisure/leisure/4.jpg') },
          { id: '2', source: require('./images/products/hobby_and_leisure/leisure/4.jpg') },
          { id: '3', source: require('./images/products/hobby_and_leisure/leisure/4.jpg') },
        ],
        description: 'Hobby & Leisure themed',
       price: 399, 
        priceUnit: 'ETB',
        rating: 4.5,
        reviews: 50,
        isFeatured: false,
        isCollections: false,
        isNewArrivals: true,
        isBanner: false,
        isPrintOnDemand: false,
        type: 'Vintage',
      },
    ],
  },
};

export default mockData;