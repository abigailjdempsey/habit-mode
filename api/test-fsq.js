module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const fsKey = process.env.FOURSQUARE_KEY;
  if (!fsKey) return res.status(200).json({ error: "no key", keys: Object.keys(process.env).filter(k => k.toLowerCase().includes("four")) });
 
  try {
    const response = await fetch(
      "https://api.foursquare.com/v3/places/search?query=coffee&near=New+York&limit=1",
      {
        method: "GET",
        headers: {
          "Authorization": fsKey,
          "Accept": "application/json",
        },
      }
    );
    const text = await response.text();
    return res.status(200).json({ 
      http_status: response.status,
      key_starts: fsKey.slice(0, 8),
      body: text.slice(0, 500)
    });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
};
 
