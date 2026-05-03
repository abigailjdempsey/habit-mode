export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const fsKey = process.env.FOURSQUARE_KEY || process.env.foursquare_key;
  if (!fsKey) return res.status(500).json({ error: "Foursquare key not configured" });

  const { query, near } = req.body;
  if (!query) return res.status(400).json({ error: "query required" });

  try {
    const params = new URLSearchParams({ query, limit: "12" });
    params.set("fields", "fsq_place_id,name,location,categories,rating,description,website");
    if (near) params.set("near", near);

    const url = `https://places-api.foursquare.com/places/search?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${fsKey}`,
        "Accept": "application/json",
        "X-Places-Api-Version": "2025-06-17",
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { return res.status(500).json({ error: "Bad JSON from Foursquare", raw: text.slice(0, 300) }); }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.detail || `Foursquare error ${response.status}`,
        detail: data
      });
    }

    const places = (data.results || []).map(p => {
      const loc = p.location || {};
      const cat = p.categories?.[0];
      const catName = cat?.name || "Place";
      const emoji =
        catName.toLowerCase().includes("restaurant") || catName.toLowerCase().includes("food") ? "🍽️"
        : catName.toLowerCase().includes("cafe") || catName.toLowerCase().includes("coffee") ? "☕"
        : catName.toLowerCase().includes("bar") || catName.toLowerCase().includes("cocktail") || catName.toLowerCase().includes("nightlife") ? "🍸"
        : catName.toLowerCase().includes("shop") || catName.toLowerCase().includes("store") || catName.toLowerCase().includes("market") ? "🛍️"
        : catName.toLowerCase().includes("park") || catName.toLowerCase().includes("garden") || catName.toLowerCase().includes("outdoor") ? "🌿"
        : catName.toLowerCase().includes("museum") || catName.toLowerCase().includes("gallery") || catName.toLowerCase().includes("art") ? "🎨"
        : catName.toLowerCase().includes("hotel") ? "🏨"
        : catName.toLowerCase().includes("gym") || catName.toLowerCase().includes("spa") || catName.toLowerCase().includes("yoga") ? "💆"
        : catName.toLowerCase().includes("music") || catName.toLowerCase().includes("club") || catName.toLowerCase().includes("venue") ? "🎵"
        : catName.toLowerCase().includes("taco") || catName.toLowerCase().includes("mexican") ? "🌮"
        : catName.toLowerCase().includes("pizza") ? "🍕"
        : catName.toLowerCase().includes("burger") ? "🍔"
        : catName.toLowerCase().includes("ramen") || catName.toLowerCase().includes("japanese") || catName.toLowerCase().includes("sushi") ? "🍜"
        : "📍";

      return {
        name: p.name,
        category: `${emoji} ${catName}`,
        city: loc.locality || loc.city || "",
        neighborhood: loc.neighborhood || loc.cross_street || "",
        address: loc.formatted_address || [loc.address, loc.locality, loc.region].filter(Boolean).join(", "),
        description: p.description || "",
        website: p.website || "",
        url: p.website || "",
        rating: p.rating ? `${(p.rating / 2).toFixed(1)}/5` : null,
        fsqId: p.fsq_place_id,
      };
    });

    return res.status(200).json({ places });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
