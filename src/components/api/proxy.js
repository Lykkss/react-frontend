// pages/api/proxy.js
export default async function handler(req, res) {
  // Utilisation de la variable d'environnement pour l'API Django
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://158.69.54.81:8500/api";

  console.log("🔄 Requête entrante:", req.method, req.url);

  // Définir les headers CORS pour autoriser les requêtes depuis votre front-end
  res.setHeader("Access-Control-Allow-Origin", "https://react-frontend-mspr2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // Retirer le préfixe "/api/proxy" pour obtenir le chemin vers l'API Django
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
      return res.status(500).json({ error: "Réponse non-JSON reçue depuis l'API Django." });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur dans le proxy:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec l’API Django." });
  }
}
