const mockData = {
    fashion: {
      filters: {
        priceRange: {
          min: 0,
          max: 100
        },
        isFeatured: false,
        isCollections: false,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: false,
        type: ['Handmade', 'Vintage', 'Print On Demand', 'all']
      },
      clothing: [
        {
          id: '261',
          name: "Clothing item",
          images: [
            { id: '1', source: require('./images/products/fashion/clothing/1.jpg') },
            { id: '2', source: require('./images/products/fashion/clothing/1.jpg') },
            { id: '3', source: require('./images/products/fashion/clothing/1.jpg') }
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
          type: 'Handmade'
        },
        {
          id: '262',
          name: "Clothing item",
          images: [
            { id: '1', source: require('./images/products/fashion/clothing/2.jpg') },
            { id: '2', source: require('./images/products/fashion/clothing/2.jpg') },
            { id: '3', source: require('./images/products/fashion/clothing/2.jpg') }
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
          type: 'Handmade'
        }
        // Additional clothing items can be added here
      ],
      footwear: [
        // Footwear items would follow a similar structure as clothing
      ],
      accessory: [
        // Accessory items would follow a similar structure as clothing
      ]
    },
    homeDecor: {
      filters: {
        priceRange: {
          min: 0,
          max: 100
        },
        isFeatured: false,
        isCollections: false,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: false,
        type: ['Handmade', 'Vintage', 'Print On Demand', 'all']
      },
      furniture: [
        // Furniture items would follow a similar structure as clothing
      ],
      kitchenware: [
        // Kitchenware items would follow a similar structure as clothing
      ],
      lighting: [
        // Lighting items would follow a similar structure as clothing
      ],
      walldecor: [
        // Wall decor items would follow a similar structure as clothing
      ]
    },
    hobbyLeisure: {
      filters: {
        priceRange: {
          min: 0,
          max: 100
        },
        isFeatured: false,
        isCollections: false,
        isNewArrivals: false,
        isBanner: false,
        isPrintOnDemand: false,
        type: ['Handmade', 'Vintage', 'Print On Demand', 'all']
      },
      creative: [
        // Creative items would follow a similar structure as clothing
      ],
      hobby: [
        // Hobby items would follow a similar structure as clothing
      ],
      leisure: [
        // Leisure items would follow a similar structure as clothing
      ]
    }
  };
  
  export default mockData;