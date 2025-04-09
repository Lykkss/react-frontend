// src/components/GroupeDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMoneyBillWave, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Image from '../assets/melissa-askew-AUXanrckXn0-unsplash.jpg';

// Utilisation de la variable d'environnement pour l'API Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/proxy";

const GroupeDetails = () => {
    const { id } = useParams();
    const [concert, setConcert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConcertDetails = async () => {
            try {
                // Appel vers l'endpoint /concerts/{id}/ sur votre back-end Django
                const response = await fetch(`${API_URL}/concerts/${id}/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error('Erreur de chargement des détails du concert');
                }
                const data = await response.json();
                setConcert(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
      
        fetchConcertDetails();
    }, [id]);

    if (loading) return <p className="text-center">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;
    if (!concert) return <p className="text-center">Aucun concert trouvé.</p>;

    return (
        <div>
            {/* Bannière en arrière-plan */}
            <div className="relative">
                <img
                    src={Image}
                    alt="Bannière"
                    className="w-full h-72 object-cover"
                />
            </div>

            {/* Détails du concert */}
            <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-2xl mt-20 z-10 mb-20">
                <h2 className="text-3xl font-bold mb-4">{concert.title}</h2>
                <p className="text-gray-700 mb-2">
                    <strong>Description :</strong> {concert.description?.trim() || 'Aucune description fournie'}
                </p>

                <div className="mb-4">
                    <p className="flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-600" />
                        <strong>Prix :</strong> {concert.price ? concert.price : 'Non spécifié'}
                    </p>
                    <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        <strong>Lieu :</strong> {concert.venue ? concert.venue.name : 'Non spécifié'}
                    </p>
                    <p className="flex items-center">
                        <FaUser className="mr-2 text-purple-600" />
                        <strong>Organisateur :</strong> {concert.organisateur ? concert.organisateur.name : 'Non spécifié'}
                    </p>
                </div>

                <p className="text-gray-500">
                    <strong>Date de début :</strong> {new Date(concert.start_date).toLocaleString()}
                </p>
                <p className="text-gray-500">
                    <strong>Date de fin :</strong> {new Date(concert.end_date).toLocaleString()}
                </p>

                <h2 className="font-bold mt-8">Commander son billet</h2>
                <a
                    href="https://www.ticketmaster.fr/fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-block rounded bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                    Get Started Today
                </a>
            </div>
        </div>
    );
};

export default GroupeDetails;
