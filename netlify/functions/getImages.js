require('dotenv').config();
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const CLOUD_NAME = process.env.CLOUD_NAME;
  const API_KEY = process.env.CLOUD_API_KEY;
  const API_SECRET = process.env.CLOUD_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Faltan variables de entorno de Cloudinary' })
    };
  }

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;

  const body = {
    expression: 'folder:artesanias AND resource_type:image',
    sort_by: [{ created_at: 'desc' }],
    max_results: 100
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: errText }) };
    }

    const data = await resp.json();

    const urls = data.resources.map(img => {
      // Agrega los parámetros justo después de /upload/
      return img.secure_url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
    });

    return {
      statusCode: 200,
      body: JSON.stringify(urls)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
