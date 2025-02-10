export default async function handler(req, res) {
    const API_URL = "http://projet-live-event.infinityfreeapp.com/wp-json/tribe/events/v1/events";
  
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des événements depuis WordPress");
      }
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Impossible de récupérer les événements" });
    }
  }
  