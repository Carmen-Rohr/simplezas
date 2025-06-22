const axios = require("axios");
exports.handler = async function () {
  const folder = "artesanias";
  const cloudName = process.env.CLOUD_NAME;
  const apiKey = process.env.CLOUD_API_KEY;
  const apiSecret = process.env.CLOUD_API_SECRET;

  const url = `https://${cloudName}:${apiSecret}@api.cloudinary.com/v1_1/${cloudName}/resources/image`;
  const result = await axios.get(url, {
    params: {
      type: "upload",
      prefix: folder + "/",
      max_results: 100
    },
    auth: {
      username: apiKey,
      password: apiSecret
    }
  });

  const images = result.data.resources.map(r => r.secure_url);
  return {
    statusCode: 200,
    body: JSON.stringify(images)
  };
};
