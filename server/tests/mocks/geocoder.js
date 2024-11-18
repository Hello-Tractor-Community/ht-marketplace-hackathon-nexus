const mockGeocoder = {
    geocode: jest.fn().mockResolvedValue([{
      latitude: 9.0252,
      longitude: 38.7578,
      country: 'Ethiopia',
      city: 'Addis Ababa',
      state: 'Addis Ababa',
      zipcode: '1000',
      streetName: 'Test Street',
      streetNumber: '123',
      countryCode: 'ET',
      provider: 'test'
    }])
  };
  
  module.exports = () => mockGeocoder;