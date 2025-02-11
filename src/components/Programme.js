import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Ajoute l'import d'axios

const Programme = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://projet-live-event.infinityfreeapp.com/wp-json/tribe/events/v1/events"
        );
        setEvents(response.data.events); // Met à jour les événements
      } catch (err) {
        setError("Erreur lors de la récupération des événements");
        console.error(err);
      } finally {
        setLoading(false); // Désactive le chargement
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Chargement des événements...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold sm:text-4xl text-center mb-8">Programme</h1>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">
                Date de début : {new Date(event.start_date).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Date de fin : {new Date(event.end_date).toLocaleString()}
              </p>
              <Link
                to={`/groupe/${event.id}`}
                className="mt-4 inline-block text-indigo-900 hover:underline"
              >
                Voir plus sur ce groupe
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun événement trouvé.</p>
      )}
    </div>
  );
};

export default Programme;
