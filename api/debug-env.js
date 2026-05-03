module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    FOURSQUARE_KEY: !!process.env.FOURSQUARE_KEY,
    FOURSQUARE_KEY_start: process.env.FOURSQUARE_KEY ? process.env.FOURSQUARE_KEY.slice(0, 6) : "MISSING",
    VITE_ANTHROPIC_KEY: !!process.env.VITE_ANTHROPIC_KEY,
    foursquare_related: Object.keys(process.env).filter(k => k.toLowerCase().includes("four")),
  });
};
