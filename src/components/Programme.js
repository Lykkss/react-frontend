import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Programme = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy";

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Fetching events from API:", API_URL);
      try {
        const response = await axios.get(API_URL);
        console.log("API Raw Response:", response);
        console.log("API Response Data:", response.data);
  
        // Vérifie si la réponse est bien formatée
        if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else {
          console.error("Les données 'events' sont manquantes ou mal formatées.", response.data);
          setError("Aucun événement trouvé ou format incorrect.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des événements:", err);
        setError("Erreur lors de la récupération des événements.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);  

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
