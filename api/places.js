export default async function handler(req, res) {
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
    // Foursquare Places Search API
    const params = new URLSearchParams({
      query,
      limit: "12",
      fields: "name,location,categories,rating,description,website,photos",
    });
    if (near) params.set("near", near);

    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?${params}`,
      {
        headers: {
          Authorization: fsKey,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Foursquare error" });
    }

    // Map Foursquare results to our place format
    const places = (data.results || []).map(p => {
      const loc = p.location || {};
      const cat = p.categories?.[0];
      return {
        name: p.name,
        category: cat ? `${cat.icon?.prefix?.split("/icons")[0]?.split("/").pop() || "📍"} ${cat.name}` : "📍 Place",
        city: loc.locality || loc.city || "",
        neighborhood: loc.neighborhood || loc.cross_street || "",
        address: [loc.address, loc.locality, loc.region].filter(Boolean).join(", "),
        description: p.description || "",
        website: p.website || "",
        rating: p.rating ? `${p.rating}/10` : null,
        fsqId: p.fsq_id,
      };
    });

    return res.status(200).json({ places });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
