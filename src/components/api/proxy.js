// pages/api/proxy/[...path].js
export default async function handler(req, res) {
  // Vos variables d’env “spécifiques” – notez bien qu'elles contiennent
  // déjà l’URL complète avec `/api/.../`
  const {
    NEXT_PUBLIC_CATEGORIES_ENDPOINT,
    NEXT_PUBLIC_CONCERTS_ENDPOINT,
    NEXT_PUBLIC_LIEUX_ENDPOINT,
    NEXT_PUBLIC_ORGANISATEURS_ENDPOINT,
    NEXT_PUBLIC_API_URL
  } = process.env;

  // On reconstruit le “path” capturé par Next.js
  const { path = [] } = req.query;               // ex: ['concerts','42']
  const resource = path[0];                      // ex: 'concerts'
  const id = path[1];                            // ex: '42'

  // Mapping de “resource” → URL d’endpoint
  const ENDPOINTS = {
    categories: NEXT_PUBLIC_CATEGORIES_ENDPOINT,
    concerts:   NEXT_PUBLIC_CONCERTS_ENDPOINT,
    lieux:      NEXT_PUBLIC_LIEUX_ENDPOINT,
    organisateurs: NEXT_PUBLIC_ORGANISATEURS_ENDPOINT,
    // ... ajoutez d’autres si nécessaire
  };

  // Choix de l’URL de base en priorité sur un endpoint spécifique,
  // sinon fallback vers NEXT_PUBLIC_API_URL + resource
  let apiUrl;
  if (ENDPOINTS[resource]) {
    apiUrl = ENDPOINTS[resource];
    // S’il y a un id, on l’appende (en retirant le slash final s’il existe)
    if (id) {
      apiUrl = apiUrl.replace(/\/$/, "") + `/${id}/`;
    }
  } else {
    // fallback générique : http://…/api/{resource}/{id?}
    const suffix = path.join("/");
    apiUrl = `${NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${suffix}`;
  }

  console.log("📡 Proxy:", req.method, req.url, "→", apiUrl);

  // ---- CORS ----
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

  // ---- Proxy the request ----
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
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
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erreur lors de la communication avec l’API." });
  }
}
