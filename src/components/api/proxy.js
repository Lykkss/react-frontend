export default async function handler(req, res) {
    const API_URL = process.env.WP_API_URL;  // Variable d'environnement

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        console.log("Appel API vers:", API_URL);

        const response = await fetch(API_URL, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        console.log("Status API:", response.status);

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Données API récupérées:", data);

        res.status(200).json(data);
    } catch (error) {
        console.error("Erreur Proxy:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
}
