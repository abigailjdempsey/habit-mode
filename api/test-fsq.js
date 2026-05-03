module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const fsKey = process.env.FOURSQUARE_KEY;
  if (!fsKey) return res.status(200).json({ error: "no key" });
  try {
    const response = await fetch(
      "https://places-api.foursquare.com/places/search?query=coffee&near=New+York&limit=1",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${fsKey}`,
          "Accept": "application/json",
          "X-Places-Api-Version": "2025-06-17",
        },
      }
    );
    const text = await response.text();
    return res.status(200).json({ http_status: response.status, key_starts: fsKey.slice(0,8), body: text.slice(0,500) });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
};
