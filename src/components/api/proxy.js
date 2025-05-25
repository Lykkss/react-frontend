export default async function handler(req, res) {
  // On récupère la base API depuis NEXT_PUBLIC_API_URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL;

  console.log("🔄 Requête entrante:", req.method, req.url);

  // CORS pour votre front déployé
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://react-frontend-mspr2.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // /api/proxy/events/123 → /events/123
    const path = req.url.replace(/^\/api\/proxy/, "") || "/";
    const apiUrl = `${API_BASE_URL}${path}`;

    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
      // n’envoyez un body que pour les méthodes qui en ont besoin
      body:
        ["POST", "PUT", "PATCH"].includes(req.method) &&
        JSON.stringify(req.body),
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return res
        .status(500)
        .json({ error: "Réponse non-JSON reçue depuis l'API." });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la communication avec l’API." });
  }
}
