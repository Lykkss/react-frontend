import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
} from 'react-icons/fa';
import Image from '../assets/melissa-askew-AUXanrckXn0-unsplash.jpg';

const API_URL = process.env.REACT_APP_API_URL;

export default function GroupeDetails() {
  const { id } = useParams();
  const [group, setGroup]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Récupère le concert
        const concertRes = await fetch(`${API_URL}/concerts/${id}/`);
        if (!concertRes.ok) throw new Error(`Status ${concertRes.status}`);
        const concert = await concertRes.json();

        // 2) Récupère le lieu
        const lieuRes = await fetch(`${API_URL}/lieux/${concert.lieu}/`);
        const lieuData = lieuRes.ok ? await lieuRes.json() : {};

        // 3) Récupère l’organisateur
        const orgRes = await fetch(
          `${API_URL}/organisateurs/${concert.organisateur}/`
        );
        const orgData = orgRes.ok ? await orgRes.json() : {};

        setGroup({
          ...concert,
          lieu: lieuData,
          organisateur: orgData,
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les détails de l'événement.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const parseDate = (raw) => {
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const startDate = parseDate(group?.DateStart);
  const endDate   = parseDate(group?.DateEnd);

  // Helper pour récupérer le nom d'un objet (lieu ou organisateur)
  const getName = (obj, ...keys) => {
    for (let key of keys) {
      if (obj?.[key]) return obj[key];
    }
    return null;
  };

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

      {/* Retour */}
      <div className="p-4">
        <Link
          to="/programme"
          className="inline-block text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          ← Retour à la liste des événements
        </Link>
      </div>

      <main id="event-content" className="px-4">
        {loading && (
          <div role="status" aria-live="polite" className="text-center mt-10">
            Chargement…
          </div>
        )}
        {error && (
          <div role="alert" className="text-center text-red-600 mt-10">
            {error}
          </div>
        )}
        {!group && !loading && !error && (
          <div className="text-center mt-10">
            Aucune donnée trouvée pour cet événement.
          </div>
        )}

        {group && (
          <article className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-2xl mb-20 z-10">
            <h1 className="text-3xl font-bold mb-4">{group.title}</h1>

            {/* Description */}
            <section aria-labelledby="desc-title" className="mb-6">
              <h2 id="desc-title" className="sr-only">
                Description
              </h2>
              <div
                className="text-gray-700 mt-2"
                dangerouslySetInnerHTML={{
                  __html: group.description
                    ? group.description.trim()
                    : 'Aucune description fournie.',
                }}
              />
            </section>

            {/* Détails pratiques */}
            <section aria-labelledby="details-title" className="mb-6">
              <h2 id="details-title" className="text-2xl font-semibold mb-4">
                Détails Pratiques
              </h2>
              <ul className="space-y-3">
                {/* Coût */}
                <li className="flex items-center">
                  <FaMoneyBillWave aria-hidden="true" className="mr-2 text-green-600" />
                  <strong className="mr-1">Coût :</strong>
                  <span>
                    {group.price != null ? `${group.price} €` : 'Non spécifié'}
                  </span>
                </li>

                {/* Lieu */}
                <li className="flex items-center">
                  <FaMapMarkerAlt aria-hidden="true" className="mr-2 text-blue-600" />
                  <strong className="mr-1">Lieu :</strong>
                  <span>
                    {getName(
                      group.lieu,
                      'venue',
                      'name',
                      'nom',
                      'lieuName'
                    ) || 'Non spécifié'}
                  </span>
                </li>

                {/* Organisateur */}
                <li className="flex items-center">
                  <FaUser aria-hidden="true" className="mr-2 text-purple-600" />
                  <strong className="mr-1">Organisateur :</strong>
                  <span>
                    {getName(
                      group.organisateur,
                      'organizer',
                      'name',
                      'nom',
                      'organisateur'
                    ) || 'Non spécifié'}
                  </span>
                </li>

                {/* Date de début */}
                <li className="flex items-center">
                  <FaCalendarAlt aria-hidden="true" className="mr-2 text-gray-600" />
                  <strong className="mr-1">Début :</strong>
                  {startDate ? (
                    <time dateTime={startDate.toISOString()} className="ml-1">
                      {startDate.toLocaleString('fr-FR')}
                    </time>
                  ) : (
                    <span className="ml-1">Non spécifié</span>
                  )}
                </li>

                {/* Date de fin */}
                <li className="flex items-center">
                  <FaCalendarAlt aria-hidden="true" className="mr-2 text-gray-600" />
                  <strong className="mr-1">Fin :</strong>
                  {endDate ? (
                    <time dateTime={endDate.toISOString()} className="ml-1">
                      {endDate.toLocaleString('fr-FR')}
                    </time>
                  ) : (
                    <span className="ml-1">Non spécifié</span>
                  )}
                </li>
              </ul>
            </section>
          </article>
        )}
      </main>
    </>
  );
}
