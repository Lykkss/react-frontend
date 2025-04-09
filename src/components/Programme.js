import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Programme = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilise NEXT_PUBLIC_API_URL qui doit pointer vers votre back-end Django
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/proxy";

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        // Appel à l'endpoint /concerts/ sur le back-end Django
        const response = await fetch(`${API_URL}/concerts/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Vous pouvez ajouter l'authentification ici si nécessaire, par exemple :
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });

        // Vérifie que la réponse est du JSON
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

        // On suppose ici que l'API renvoie directement un tableau de concerts
        if (data && Array.isArray(data)) {
          setConcerts(data);
        } else {
          console.error("⚠️ Données incorrectes :", data);
          setError("Aucun concert trouvé ou format incorrect.");
        }
      } catch (err) {
        console.error("🚨 Erreur lors de la récupération des concerts:", err);
        setError("Erreur lors de la récupération des concerts.");
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, [API_URL]);

  // Gestion des états : chargement, erreur et affichage
  if (loading) return <p>Chargement des concerts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold sm:text-4xl text-center mb-8">Programme</h1>
      {concerts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {concerts.map((concert) => (
            <div key={concert.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">
                {concert.title || "Titre non disponible"}
              </h2>
              <p className="text-gray-600">
                Date de début : {concert.start_date ? new Date(concert.start_date).toLocaleString() : "Non spécifiée"}
              </p>
              <p className="text-gray-600">
                Date de fin : {concert.end_date ? new Date(concert.end_date).toLocaleString() : "Non spécifiée"}
              </p>
              <Link to={`/concerts/${concert.id}`} className="mt-4 inline-block text-indigo-900 hover:underline">
                Voir plus sur ce concert
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun concert trouvé ou données incorrectes.</p>
      )}
    </div>
  );
};

export default Programme;
