export default async function handler(req, res) {
    try {
        const response = await fetch("https://projet-live-event.infinityfreeapp.com/wp-json/tribe/events/v1/events", {
            headers: { "Origin": "https://react-frontend-6m66.vercel.app" } // Essaye d'imiter une requête depuis Vercel
        });

        const data = await response.json();
        res.setHeader("Access-Control-Allow-Origin", "*"); // Ajoute CORS sur Vercel
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
}
