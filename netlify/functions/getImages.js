
// netlify/functions/getImages.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const CLOUD_NAME = process.env.CLOUD_NAME;
  const API_KEY = process.env.CLOUD_API_KEY;
  const API_SECRET = process.env.CLOUD_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Faltan variables de entorno para Cloudinary' }),
    };
  }

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&prefix=artesanias&max_results=100&direction=desc&order_by=created_at`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorBody }),
      };
    }

    const data = await response.json();

    // Extraer solo las URLs seguras
    const imageUrls = data.resources.map(img => img.secure_url);

    return {
      statusCode: 200,
      body: JSON.stringify(imageUrls),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
