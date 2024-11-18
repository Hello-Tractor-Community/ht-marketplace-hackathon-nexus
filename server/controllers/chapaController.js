const chapaHelper = require('../utils/chapaHelper');

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const production = process.env.NODE_ENV === 'production';
const CLIENT_URL = production ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
// console.log('CLIENT_URL..',CLIENT_URL);

const SERVER_URL = production ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;
exports.initializeTransaction = async (req, res) => {
    console.log("Initializing transaction...");

    const chapa_secret = process.env.CHAPA_SECRET_KEY;
    const txRef = "chewatatest-" + Date.now(); 
    const data = {
        amount: "100",
        currency: "ETB",
        email: "abebech_bekele@gmail.com",
        first_name: "Bilen",
        last_name: "Gizachew",
        phone_number: "0912345678",
        tx_ref: txRef,
        callback_url: `${SERVER_URL}/transaction/status`,
        return_url: `${CLIENT_URL}/orderConfirmation`,
        customization: {
            title: "Payment merchant",
            description: "I love online payments"
        }
    };

    try {
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', data, {
            headers: {
                'Authorization': `Bearer ${chapa_secret}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Request successful!');
        console.log('return url..',response.data);
        console.log(response.data.data.checkout_url); // This will contain the checkout URL
        
       

      // Send the checkout URL back to the client
      res.status(200).json({ 
        checkout_url: response.data.data.checkout_url,
        tx_ref: txRef // Send this back to the client
      });

    } catch (error) {
        if (error.response) {
            console.log('Request failed with status code:', error.response.status);
            console.log(error.response.data); // This may contain error messages or additional information
            res.status(error.response.status).json({ message: 'Transaction initialization failed.', error: error.response.data });
        } else {
            console.error('Error occurred:', error.message);
            res.status(500).json({ message: 'An error occurred while initializing transaction.' });
        }
    }
};

exports.orderConfirmation = async (req, res) => {
  res.redirect(`${CLIENT_URL}/orderConfirmation`);
};

exports.handlePaymentStatus = async (req, res) => {
  console.log("Payment status callback received");

  // console.log('req.body..',req.body);
  
  // Extract relevant information from the callback
  const { status, trx_ref } = req.body;

  // Log the received data
  console.log('Payment Status:', status);
  console.log('Transaction Reference:', trx_ref);

  // Verify the transaction using the tx_ref
  try {
    const verificationResponse = await chapaHelper.makeRequest('GET', `https://api.chapa.co/v1/transaction/verify/${trx_ref}`);
    const verificationData = JSON.parse(verificationResponse);
    
    console.log('verificationData..',verificationData);
    // Check if the payment was successful
    if (verificationData.status === 'success' && verificationData.data.status === 'success') {
      // Payment was successful
      console.log('Payment verified successfully');
      res.redirect(`${CLIENT_URL}/orderConfirmation?status=success`);
      // Here you can update your database or perform any other necessary actions
      // For example, update order status, send confirmation email, etc.
    } else {
      // Payment was not successful
      console.log('Payment verification failed');
      res.redirect(`${CLIENT_URL}/orderConfirmation?status=failed`);
      // Handle the failed payment (e.g., update order status, notify the user)
    }

    // Send a response to acknowledge receipt of the callback
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).send('Error processing payment status');
  }
};


exports.webHook = async (req, res) => {
  console.log("Webhook request received!");
  const secretHash = process.env.CHAPA_SECRET_HASH;
  const hash = crypto.createHmac('sha256', secretHash).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['Chapa-Signature']) {
    // Retrieve the request's body
    const event = req.body;
    console.log("event..", event); 
    res.send(200);
    }
    else {
      // Signature is invalid
      res.status(403).send('Invalid signature');
    }
   
};

exports.verifyTransaction = async (req, res) => {
  // console.log("Verifying transaction server...");
  try {
    const { txRef } = req.params;
    const response = await chapaHelper.makeRequest('GET', `https://api.chapa.co/v1/transaction/verify/${txRef}`);
    // console.log(response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSubaccount = async (req, res) => {
  try {
    const options = {
      body: {
        "business_name": "Abebe Souq",
        "account_name": "Abebe Bikila ",
        "bank_code": "96e41186-29ba-4e30-b013-4ca26d7g2025",
        "account_number": "0123456789",
        "split_value": 0.2,
        "split_type": "percentage"
      }
    };

    const response = await chapaHelper.makeRequest('POST', 'https://api.chapa.co/v1/subaccount', options.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.initiatePayment = async (req, res) => {
  try {
    const options = {
      body: {
        public_key: process.env.CHAPA_PUBLIC_KEY, // Replace with your Chapa public key
        tx_ref: 'negade-tx-12345678sss9',
        amount: '100',
        currency: 'ETB',
        email: 'israel@negade.et',
        first_name: 'Israel',
        last_name: 'Goytom',
        title: 'Let us do this',
        description: 'Paying with Confidence with cha',
        logo: 'https://chapa.link/asset/images/chapa_swirl.svg',
        callback_url: 'https://api.chapa.co/v1/transaction/verify/chewatatest-6669',
        return_url: 'https://example.com/returnurl',
        meta: { title: 'test' },
      },
    };

    const response = await chapaHelper.makeRequest('POST', 'https://api.chapa.co/v1/transaction/initialize', options.body);
    const { data } = JSON.parse(response);

    // Redirect the user to Chapa's hosted checkout page
    // res.redirect(data.checkout_url);
    res.redirect('https://api.chapa.co/v1/hosted/pay');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};