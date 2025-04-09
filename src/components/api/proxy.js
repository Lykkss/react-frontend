// pages/api/proxy.js

export default async function handler(req, res) {
  // Utilise NEXT_PUBLIC_API_URL défini dans votre .env
  // On s'assure d'enlever éventuellement un slash final si nécessaire.
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

  console.log("🔄 Requête entrante:", req.method, req.url);

  // CORS (vous pouvez adapter ou laisser cette partie selon vos besoins)
  res.setHeader("Access-Control-Allow-Origin", "https://react-frontend-6m66.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // En supposant que vous configurez vos routes dans Django sous /api,
    // on retire ici le préfixe "/api/proxy" pour générer le chemin approprié.
    const path = req.url.replace(/^\/api\/proxy/, "") || "/";
    // Concaténer l'URL de votre backend Django
    const apiUrl = `${API_BASE_URL}${path}`;

    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        // Reprenez la configuration d'authorization, si présente
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(500).json({ error: "Réponse non-JSON reçue depuis l'API." });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur dans le proxy:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec l’API." });
  }
}
