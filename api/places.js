module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const fsKey = process.env.FOURSQUARE_KEY;
  if (!fsKey) return res.status(500).json({ error: "Foursquare key not configured" });

  const { query, near } = req.body;
  if (!query) return res.status(400).json({ error: "query required" });

  try {
    const params = new URLSearchParams({ query, limit: "12" });
    // Request all useful fields
    params.set("fields", "fsq_place_id,name,location,categories,rating,description,website,latitude,longitude");
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
    catch { return res.status(500).json({ error: "Bad JSON", raw: text.slice(0, 300) }); }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.detail || "Foursquare error " + response.status,
        detail: data
      });
    }

    const places = (data.results || []).map(p => {
      // New API has location as an object but also top-level lat/lng
      const loc = p.location || {};
      const cat = p.categories && p.categories[0];
      const catName = cat ? cat.name : "Place";
      const cn = catName.toLowerCase();
      const emoji =
        cn.includes("restaurant") || cn.includes("food") ? "🍽️"
        : cn.includes("cafe") || cn.includes("coffee") ? "☕"
        : cn.includes("bar") || cn.includes("cocktail") || cn.includes("nightlife") ? "🍸"
        : cn.includes("shop") || cn.includes("store") || cn.includes("market") ? "🛍️"
        : cn.includes("park") || cn.includes("garden") || cn.includes("outdoor") ? "🌿"
        : cn.includes("museum") || cn.includes("gallery") || cn.includes("art") ? "🎨"
        : cn.includes("hotel") ? "🏨"
        : cn.includes("gym") || cn.includes("spa") || cn.includes("yoga") ? "💆"
        : cn.includes("music") || cn.includes("club") || cn.includes("venue") ? "🎵"
        : cn.includes("taco") || cn.includes("mexican") ? "🌮"
        : cn.includes("pizza") ? "🍕"
        : cn.includes("burger") ? "🍔"
        : cn.includes("ramen") || cn.includes("japanese") || cn.includes("sushi") ? "🍜"
        : cn.includes("bagel") || cn.includes("bakery") || cn.includes("deli") ? "🥯"
        : cn.includes("ice cream") || cn.includes("dessert") ? "🍦"
        : cn.includes("thai") ? "🍜"
        : cn.includes("indian") ? "🍛"
        : cn.includes("chinese") || cn.includes("dim sum") ? "🥡"
        : cn.includes("french") || cn.includes("bistro") ? "🥐"
        : cn.includes("italian") ? "🍝"
        : cn.includes("korean") ? "🥩"
        : "📍";

      // city/neighborhood — new API may put these differently
      const city = loc.locality || loc.city || loc.region || "";
      const neighborhood = loc.neighborhood
        || (loc.cross_street ? loc.cross_street : "")
        || "";
      const address = loc.formatted_address
        || [loc.address, loc.locality, loc.region].filter(Boolean).join(", ")
        || "";

      return {
        name: p.name,
        category: emoji + " " + catName,
        city,
        neighborhood,
        address,
        description: p.description || "",
        website: p.website || "",
        url: p.website || "",
        rating: p.rating ? (p.rating / 2).toFixed(1) + "/5" : null,
        fsqId: p.fsq_place_id,
      };
    });

    return res.status(200).json({ places });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
