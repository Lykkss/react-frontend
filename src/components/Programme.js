import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Programme = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Appel API avec fetch
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Vérifie si la réponse est du JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("❌ Réponse non-JSON reçue :", text);
          throw new Error("La réponse de l'API n'est pas du JSON.");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Données reçues:", data);

        if (data && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error("⚠️ Données 'events' manquantes ou incorrectes:", data);
          setError("Aucun événement trouvé ou format incorrect.");
        }
      } catch (err) {
        console.error("🚨 Erreur lors de la récupération des événements:", err);
        setError("Erreur lors de la récupération des événements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]); // Déclenche le useEffect uniquement quand l'URL change

  // Gestion des états : chargement, erreur et affichage des données
  if (loading) return <p>Chargement des événements...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold sm:text-4xl text-center mb-8">Programme</h1>
      {Array.isArray(events) && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id || Math.random()} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{event.title || "Titre non disponible"}</h2>
              <p className="text-gray-600">
                Date de début : {event.start_date ? new Date(event.start_date).toLocaleString() : "Non spécifiée"}
              </p>
              <p className="text-gray-600">
                Date de fin : {event.end_date ? new Date(event.end_date).toLocaleString() : "Non spécifiée"}
              </p>
              <Link to={`/groupe/${event.id}`} className="mt-4 inline-block text-indigo-900 hover:underline">
                Voir plus sur ce groupe
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun événement trouvé ou données incorrectes.</p>
      )}
    </div>
  );
};

export default Programme;
