import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMoneyBillWave, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Image from '../assets/melissa-askew-AUXanrckXn0-unsplash.jpg';

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy";

const GroupeDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/events/${id}`);
        if (!response.ok) {
          throw new Error('Impossible de charger les détails de l’événement.');
        }
        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupDetails();
  }, [id]);

  if (loading) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-center mt-10"
      >
        Chargement…
      </p>
    );
  }
  if (error) {
    return (
      <p
        role="alert"
        className="text-center text-red-600 mt-10"
      >
        Erreur : {error}
      </p>
    );
  }
  if (!group) {
    return (
      <p className="text-center mt-10">
        Aucune donnée trouvée pour cet événement.
      </p>
    );
  }

  return (
    <>
      {/* Skip link pour passer directement au contenu */}
      <a
        href="#event-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded"
      >
        Aller au contenu de l’événement
      </a>

      <header role="banner">
        {/* Bouton retour accessible */}
        <nav aria-label="Navigation secondaire" className="p-4">
          <Link
            to="/events"
            className="inline-block text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            ← Retour à la liste des événements
          </Link>
        </nav>
      </header>

      <main id="event-content" className="px-4">
        {/* Bannière décorative */}
        <figure className="relative">
          <img
            src={Image}
            alt=""
            aria-hidden="true"
            className="w-full h-72 object-cover rounded-b-lg"
          />
          <figcaption className="sr-only">
            Image décorative représentant un billet d’événement
          </figcaption>
        </figure>

        {/* Contenu principal */}
        <article className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-2xl -mt-24 mb-20 z-10">
          <h1 className="text-3xl font-bold mb-4">{group.title}</h1>

          <section aria-labelledby="desc-title" className="mb-6">
            <h2 id="desc-title" className="sr-only">
              Description de l’événement
            </h2>
            <p className="text-gray-700">
              <strong>Description :</strong>{' '}
              {group.description?.trim() || 'Aucune description fournie.'}
            </p>
          </section>

          <section aria-labelledby="details-title" className="mb-6">
            <h2 id="details-title" className="text-2xl font-semibold mb-4">
              Détails Pratiques
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FaMoneyBillWave
                  aria-hidden="true"
                  className="mr-2 text-green-600"
                />
                <strong className="mr-1">Coût :</strong>{' '}
                <span>{group.cost?.trim() || 'Non spécifié'}</span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt
                  aria-hidden="true"
                  className="mr-2 text-blue-600"
                />
                <strong className="mr-1">Lieu :</strong>{' '}
                <span>{group.venue?.venue || 'Non spécifié'}</span>
              </li>
              <li className="flex items-center">
                <FaUser
                  aria-hidden="true"
                  className="mr-2 text-purple-600"
                />
                <strong className="mr-1">Organisateur :</strong>{' '}
                <span>
                  {group.organizer?.[0]?.organizer || 'Non spécifié'}
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="schedule-title">
            <h2 id="schedule-title" className="sr-only">
              Dates et horaires
            </h2>
            <p className="text-gray-500 mb-1">
              <strong>Date de début :</strong>{' '}
              <time
                dateTime={new Date(group.start_date).toISOString()}
              >
                {new Date(group.start_date).toLocaleString('fr-FR')}
              </time>
            </p>
            <p className="text-gray-500">
              <strong>Date de fin :</strong>{' '}
              <time
                dateTime={new Date(group.end_date).toISOString()}
              >
                {new Date(group.end_date).toLocaleString('fr-FR')}
              </time>
            </p>
          </section>
        </article>
      </main>

      <footer role="contentinfo" className="text-center py-6">
        <p className="text-sm text-gray-500">
          © <time dateTime={new Date().getFullYear().toString()}>
            {new Date().getFullYear()}
          </time>{' '}
          Live Event™. Tous droits réservés.
        </p>
      </footer>
    </>
  );
};

export default GroupeDetails;
