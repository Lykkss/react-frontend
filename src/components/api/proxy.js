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
        headers: { "User-Agent": "Mozilla/5.0" }
      });
  
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Données API récupérées:", data);
  
      // S'assure que 'events' est toujours présent dans la réponse
      const events = Array.isArray(data.events) ? data.events : [];
      res.status(200).json({ events });
    } catch (error) {
      console.error("Erreur Proxy:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
  }
  