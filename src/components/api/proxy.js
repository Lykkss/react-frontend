export default async function handler(req, res) {
    const API_URL = process.env.WP_API_URL;

    res.setHeader("Access-Control-Allow-Origin", "https://react-frontend-6m66.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Gérer les requêtes OPTIONS pour CORS preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Gérer uniquement les requêtes GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const response = await fetch(API_URL, {
            method: "GET",
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
