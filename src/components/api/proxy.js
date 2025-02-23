export default async function handler(req, res) {
    const API_URL = process.env.WP_API_URL;  // Utilisation de la variable d'environnement

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

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
}
