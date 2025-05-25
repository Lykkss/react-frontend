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
        if (!response.ok) throw new Error('Impossible de charger les détails de l’événement.');
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

  return (
    <>
      {/* Bannière */}
      <header role="banner">
        <figure className="relative">
          <img
            src={Image}
            alt=""
            aria-hidden="true"
            className="w-full h-72 object-cover rounded-b-lg"
          />
        </figure>
      </header>

      {/* Lien de retour sous la bannière */}
      <div className="p-4">
        <Link
          to="/events"
          className="inline-block text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          ← Retour à la liste des événements
        </Link>
      </div>

      <main id="event-content" className="px-4">
        {/* États chargement et erreur sans balises <p> */}
        {loading && (
          <div role="status" aria-live="polite" className="text-center mt-10">
            Chargement…
          </div>
        )}
        {error && (
          <div role="alert" className="text-center text-red-600 mt-10">
            Erreur : {error}
          </div>
        )}
        {!group && !loading && !error && (
          <div className="text-center mt-10">Aucune donnée trouvée pour cet événement.</div>
        )}

        {/* Contenu de l'événement */}
        {group && (
          <article className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-2xl mb-20 z-10">
            <h1 className="text-3xl font-bold mb-4">{group.title}</h1>

            {/* Description sans balises <p> */}
            <section aria-labelledby="desc-title" className="mb-6">
              <h2 id="desc-title" className="sr-only">Description de l’événement</h2>
              <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{
                __html: group.description
                  ? group.description
                      .trim()
                      .replace(/<\/?p[^>]*>/g, '')
                  : 'Aucune description fournie.'
              }} />
            </section>

            {/* Détails pratiques */}
            <section aria-labelledby="details-title" className="mb-6">
              <h2 id="details-title" className="text-2xl font-semibold mb-4">
                Détails Pratiques
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <FaMoneyBillWave aria-hidden="true" className="mr-2 text-green-600" />
                  <strong className="mr-1">Coût :</strong>
                  <span>{group.cost?.trim() || 'Non spécifié'}</span>
                </li>
                <li className="flex items-center">
                  <FaMapMarkerAlt aria-hidden="true" className="mr-2 text-blue-600" />
                  <strong className="mr-1">Lieu :</strong>
                  <span>{group.venue?.venue || 'Non spécifié'}</span>
                </li>
                <li className="flex items-center">
                  <FaUser aria-hidden="true" className="mr-2 text-purple-600" />
                  <strong className="mr-1">Organisateur :</strong>
                  <span>{group.organizer?.[0]?.organizer || 'Non spécifié'}</span>
                </li>
              </ul>
            </section>

            {/* Dates */}
            <section aria-labelledby="schedule-title">
              <h2 id="schedule-title" className="sr-only">Dates et horaires</h2>
              <div className="text-gray-500 mb-1">
                <strong>Date de début :</strong>{' '}
                <time dateTime={new Date(group.start_date).toISOString()}>
                  {new Date(group.start_date).toLocaleString('fr-FR')}
                </time>
              </div>
              <div className="text-gray-500">
                <strong>Date de fin :</strong>{' '}
                <time dateTime={new Date(group.end_date).toISOString()}>
                  {new Date(group.end_date).toLocaleString('fr-FR')}
                </time>
              </div>
            </section>
          </article>
        )}
      </main>

      <footer role="contentinfo" className="text-center py-6">
        <div className="text-sm text-gray-500">
          ©{' '}
          <time dateTime={new Date().getFullYear().toString()}>{new Date().getFullYear()}</time>{' '}
          Live Event™. Tous droits réservés.
        </div>
      </footer>
    </>
  );
};

export default GroupeDetails;
