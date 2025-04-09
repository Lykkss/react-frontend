export default async function handler(req, res) {
  const API_BASE_URL = process.env.WP_API_URL?.replace(/\/events$/, "") || "http://158.69.54.81:84/wp-json/tribe/events/v1";

  console.log("🔄 Requête entrante:", req.method, req.url);

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://react-frontend-6m66.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();
  

  try {
    const path = req.url.replace(/^\/api\/proxy/, "") || "/";
    const apiUrl = `${API_BASE_URL}${path}`;

    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(500).json({ error: "Réponse non-JSON reçue depuis l'API WordPress." });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la communication avec l’API WordPress." });
  }
}
