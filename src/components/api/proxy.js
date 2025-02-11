export default async function handler(req, res) {
    try {
        const response = await fetch("https://projet-live-event.infinityfreeapp.com/wp-json/tribe/events/v1/events", {
            headers: {
                "User-Agent": "Mozilla/5.0", // Ajoute un User-Agent pour éviter certains blocages
            },
        });

        const data = await response.json();

        res.setHeader("Access-Control-Allow-Origin", "*"); // Active CORS
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
}
