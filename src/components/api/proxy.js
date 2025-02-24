export default async function handler(req, res) {
  const API_BASE_URL = "http://158.69.54.81:84/wp-json/tribe/events/v1";

  console.log("🔄 Requête entrante vers le proxy:", req.method, req.url);

  // En-têtes CORS pour Vercel
  res.setHeader("Access-Control-Allow-Origin", "https://react-frontend-6m66.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Gestion des requêtes OPTIONS (pré-vol CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Corrige la construction du chemin API
    const path = req.url.startsWith('/api/proxy') ? req.url.replace('/api/proxy', '') : '/events';
    const apiUrl = `${API_BASE_URL}${path}`;
    console.log("📡 Appel API WordPress :", apiUrl);

    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0",
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
    });

    console.log("✅ Réponse API WordPress:", response.status);
    console.log("🔑 Headers API WordPress:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur API WordPress:", response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Réponse non-JSON reçue :", text);
      return res.status(500).json({ error: "Réponse non-JSON reçue depuis l'API WordPress." });
    }

    const data = await response.json();
    console.log("📋 Données API:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("🚨 Erreur lors de la récupération des événements:", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des événements" });
  }
}
