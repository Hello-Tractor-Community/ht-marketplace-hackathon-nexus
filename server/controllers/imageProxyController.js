const axios = require('axios');

exports.getImage = async (req, res) => {
  const { imageUrl } = req.params;

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', response.headers['content-type']);
     // Log the Content-Type header
    console.log('Response Content-Type:', response.headers['content-type']);
      // Log the Content-Type header
    console.log('Response data:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Error fetching image' });
  }
};