import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMoneyBillWave, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Image from '../assets/melissa-askew-AUXanrckXn0-unsplash.jpg';

const GroupeDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await fetch(`https://projet-live-event.infinityfreeapp.com/wp-json/tribe/events/v1/events${id}`);
                if (!response.ok) {
                    throw new Error('Erreur de chargement des détails du groupe');
                }
                const data = await response.json();
                console.log(data);
                setGroup(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [id]);

    if (loading) return <p className="text-center">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;
    if (!group) return <p className="text-center">Aucun groupe trouvé.</p>;

    return (
        <div>
            {/* Bannière en arrière-plan */}
            <div className="relative">
                <img
                   style={{ backgroundImage: `url(${Image})` }}
                    className="w-full h-72 bg-middle bg-cover bg-no-repeat"
                />
            </div>
            {/* Carte au premier plan */}
            <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-2xl mt-20 z-10 mb-20">
                <h2 className="text-3xl font-bold mb-4">{group.title}</h2>
                <p className="text-gray-700 mb-2">
                    <strong>Description :</strong> {group.description && group.description.trim() !== '' ? group.description : 'Aucune description fournie'}
                </p>
                <div className="mb-4">
                    <p className="flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-600" />
                        <strong>Coût :</strong> {group.cost && group.cost.trim() !== '' ? group.cost : 'Non spécifié'}
                    </p>
                    <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        <strong>Lieu :</strong> 
                        {group.venue && group.venue.venue ? group.venue.venue : 'Non spécifié'}
                    </p>
                    <p className="flex items-center">
                        <FaUser className="mr-2 text-purple-600" />
                        <strong>Organisateur :</strong> 
                        {group.organizer && group.organizer.length > 0 ? group.organizer[0].organizer : 'Non spécifié'}
                    </p>
                </div>
                <p className="text-gray-500">
                    <strong>Date de début :</strong> {new Date(group.start_date).toLocaleString()}
                </p>
                <p className="text-gray-500">
                    <strong>Date de fin :</strong> {new Date(group.end_date).toLocaleString()}
                </p>
                <h2 className="font-bold mt-8">Commander son billet</h2>
                <a href="https://www.ticketmaster.fr/fr" 
                    className="mt-8 inline-block rounded bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                    Get Started Today
                </a>
            </div>
        </div>
    );
};

export default GroupeDetails;
