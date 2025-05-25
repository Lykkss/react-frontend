import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Programme() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Appel via ton proxy Next.js
        const response = await fetch("/api/proxy/concerts", { method: "GET" });
        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error("La réponse de l'API n'est pas du JSON.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // DRF renvoie typiquement un array pour GET /concerts/
        const data = await response.json();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          throw new Error("Format inattendu des données reçues.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      {/* Skip link */}
      <a
        href="#programme-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded"
      >
        Aller au programme
      </a>

      <main
        id="programme-content"
        role="main"
        aria-labelledby="programme-title"
        className="container mx-auto p-4"
      >
        {/* Title */}
        <h1
          id="programme-title"
          className="text-3xl font-bold sm:text-4xl text-center mb-8"
        >
          Programme
        </h1>

        {/* Loading and error states */}
        {loading && (
          <p role="status" aria-live="polite" className="text-center">
            Chargement des événements…
          </p>
        )}
        {error && (
          <p role="alert" className="text-center text-red-500">
            {error}
          </p>
        )}

        {/* Events grid */}
        {!loading && !error && (
          <section
            aria-labelledby="programme-list"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            <h2 id="programme-list" className="sr-only">
              Liste des événements
            </h2>
            {events.map((event) => {
              const startDate = event.start_date
                ? new Date(event.start_date)
                : null;
              const endDate = event.end_date
                ? new Date(event.end_date)
                : null;
              return (
                <article
                  key={event.id}
                  role="region"
                  aria-labelledby={`event-title-${event.id}`}
                  className="bg-white shadow-md text-center rounded-lg p-4 border-indigo-950 border-2 hover:border-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <h3
                    id={`event-title-${event.id}`}
                    className="text-xl font-semibold"
                  >
                    {event.title || "Titre non disponible"}
                  </h3>
                  {startDate ? (
                    <p className="text-gray-600">
                      Date de début :{" "}
                      <time dateTime={startDate.toISOString()}>
                        {startDate.toLocaleString("fr-FR")}
                      </time>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Date de début : Non spécifiée
                    </p>
                  )}
                  {endDate ? (
                    <p className="text-gray-600">
                      Date de fin :{" "}
                      <time dateTime={endDate.toISOString()}>
                        {endDate.toLocaleString("fr-FR")}
                      </time>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Date de fin : Non spécifiée
                    </p>
                  )}
                  <Link
                    to={`/groupe/${event.id}`}
                    className="mt-4 inline-block text-indigo-900 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label={`Voir plus d’informations sur ${event.title}`}
                  >
                    Voir plus
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}

export default Programme;
