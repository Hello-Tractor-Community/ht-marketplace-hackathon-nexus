const request = require('request');

require('dotenv').config();

const chapa_secret = process.env.CHAPA_SECRET_KEY;

exports.makeRequest = (method, url, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      url,
      headers: {
        'Authorization': chapa_secret, // Replace with your test key
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null
    };

    request(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.body);
      }
    });
  });
};