const cloudinary = require('cloudinary').v2;
require('../utils/config');
require('dotenv').config();
const crypto = require('crypto');

const cloudName = cloudinary.config().cloud_name;
const apiKey = cloudinary.config().api_key;
const apiSecret = cloudinary.config().api_secret;
// const uploadPreset = cloudinary.config().upload_preset;



const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;


const serverLogs = [];



// const generateSignature = (timestamp, uploadPreset, apiSecret) =>
//   cloudinary.utils.api_sign_request(
//     { timestamp, upload_preset: uploadPreset },
//     apiSecret
//   );

exports.getUploadSignature = (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  console.log("in get uploadSignature .. timestamp", timestamp);
  console.log("apiSecret", apiSecret);
  
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    source: 'uw',
    folder: 'products'}, apiSecret);
  
   console.log("signature", signature);
   console.log("timestamp", timestamp);
   res.json({ signature, timestamp, cloudName, apiKey});
  
};

exports.uploadImage = async (req, res) => {
  console.log('Cloudinary.. uploading image');
  try {
      const fileData = req.file.buffer; // Ensure req.file.buffer contains the file data
      const originalFilename = req.file.originalname;
      console.log(`Uploading file: ${originalFilename}`);
      const uploadResponse = await cloudinary.uploader.upload_stream(
          {
              upload_preset: CLOUDINARY_UPLOAD_PRESET,
              folder: process.env.CLOUDINARY_UPLOAD_PRODUCT_FOLDER,
              use_filename: true,
              unique_filename: false,
              api_key: process.env.CLOUDINARY_API_KEY,
              public_id: originalFilename,
          },
          (error, result) => {
              if (error) {
                  console.error('Error uploading image:', error);
                  res.status(500).json({ error: 'Error uploading image', logs: [error.message] });
                  return;
              }
              console.log('Uploaded image URL:', result.secure_url);
              res.json({ url: result.secure_url });
          }
      );

      // This part is necessary to pipe the file buffer to the upload_stream method
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileData);
      bufferStream.pipe(uploadResponse);
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Error uploading image', logs: [error.message] });
  }
};
