export default async function handler(req, res) {
    const API_URL = process.env.WP_API_URL;
  
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    try {
      const response = await fetch(API_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        res.status(200).json(data);
      } else {
        throw new Error("La réponse n'est pas en JSON");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
  }
  