export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  // Show which env vars are present (not their values, just whether they exist)
  return res.status(200).json({
    FOURSQUARE_KEY: !!process.env.FOURSQUARE_KEY,
    FOURSQUARE_KEY_value_start: process.env.FOURSQUARE_KEY?.slice(0, 6) || "MISSING",
    VITE_ANTHROPIC_KEY: !!process.env.VITE_ANTHROPIC_KEY,
    all_keys: Object.keys(process.env).filter(k => !k.startsWith("npm_") && !k.startsWith("NODE") && !k.startsWith("PATH") && !k.startsWith("HOME")),
  });
}
