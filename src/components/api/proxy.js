// pages/api/proxy/[...path].js
export default async function handler(req, res) {
  // Base de ton API Django
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // reconstruction du chemin : ['concerts','42'] → 'concerts/42'
  const { path = [] } = req.query;
  const pathSuffix = Array.isArray(path) ? path.join("/") : path;
  const apiUrl = `${API_BASE_URL}/${pathSuffix}`;

  console.log("📡 Proxy:", req.method, req.url, "→", apiUrl);

  // CORS
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
