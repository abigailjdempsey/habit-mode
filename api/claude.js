module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.VITE_ANTHROPIC_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  if (req.body && req.body.mode === "fetch-url") {
    const { url } = req.body;
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      const finalUrl = response.url;
      const html = await response.text();
      const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || "";
      const ogTitle = (html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) || [])[1] || "";
      const ogDesc = (html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i) || [])[1] || "";
      const bodySnippet = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);
      return res.status(200).json({ finalUrl, title: title.trim(), ogTitle: ogTitle.trim(), ogDesc: ogDesc.trim(), bodySnippet });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
