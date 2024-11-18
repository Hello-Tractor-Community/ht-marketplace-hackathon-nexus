// utils/geocoder.js
const opencage = require('opencage-api-client');

const geocode = async (address) => {
  try {
    const data = await opencage.geocode({ q: address });

    if (data.status.code === 200 && data.results.length > 0) {
      const place = data.results[0];
      console.log('Geocoded address:', place.geometry.lat, place.geometry.lng);
      return {
        formattedAddress: place.formatted,
        latitude: place.geometry.lat,
        longitude: place.geometry.lng,
        city: place.components.city || place.components.town || place.components.village,
        state: place.components.state,
        zipcode: place.components.postcode,
        country: place.components.country_code.toUpperCase()
      };
    } else {
      throw new Error(`Geocoding failed: ${data.status.message}`);
    }
  } catch (error) {
    console.error('Error in geocoding:', error.message);
    throw error;
  }
};

module.exports = { geocode };
