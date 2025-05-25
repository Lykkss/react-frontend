import React from 'react';
import Programme from './Programme';
import MapComponent from './MapComponent';
import Image from '../assets/yvette-de-wit-NYrVisodQ2M-unsplash.jpg';  
import FoodPartner1 from '../assets/food-partner1.jpg';
import FoodPartner2 from '../assets/food-partner2.jpg';
import StorePartner1 from '../assets/store-partner1.jpg';
import StorePartner2 from '../assets/partenaire3.jpg';
import MusicPartner1 from '../assets/partenaire1.png';
import MusicPartner2 from '../assets/partenaire2.jpg';

const TemplateAccueil = () => {
    return (
        <>
            {/* Skip link pour accéder au contenu principal */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded"
            >
                Aller au contenu principal
            </a>

            <header role="banner">
                {/* Vous pouvez ajouter logo et nav ici si nécessaire */}
            </header>

            <main id="main-content" role="main">
                {/* Section d'accueil avec image de fond */}
                <section
                    role="region"
                    aria-labelledby="welcome-title"
                    className="relative bg-cover bg-center bg-no-repeat bg-fixed contrast-125"
                    style={{ backgroundImage: `url(${Image})` }}
                >
                    <div
                        className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25"
                        aria-hidden="true"
                    />
                    <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
                        <div className="max-w-xl text-center sm:text-left">
                            <h1
                                id="welcome-title"
                                className="text-3xl font-extrabold text-gray-850 sm:text-5xl"
                            >
                                WELCOME TO THE
                                <strong className="block font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-950 to-indigo-500">
                                    Live Event Festival!
                                </strong>
                            </h1>
                            <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
                                Bienvenue sur notre site web. Découvrez les événements à venir et réservez vos billets dès aujourd'hui.
                            </p>
                            <div className="mt-8 flex justify-center sm:justify-start">
                                <a
                                    href="/Programme"
                                    className="inline-block rounded bg-indigo-950 hover:bg-blue-700 text-white font-medium px-8 py-3 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    aria-label="Commencer avec le programme"
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Billetterie */}
                <section
                    role="region"
                    aria-labelledby="ticketing-title"
                >
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-full" aria-hidden="true">
                            <img
                                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                alt="Image de billet d'événement"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                        <div className="lg:py-24">
                            <h2
                                id="ticketing-title"
                                className="text-3xl font-bold sm:text-4xl"
                            >
                                Billetterie
                            </h2>
                            <p className="mt-4 text-gray-600">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui hic atque tenetur quis eius quos ea neque sunt, accusantium soluta minus veniam tempora deserunt? Molestiae eius quidem quam repellat.
                            </p>
                            <div className="mt-8">
                                <a
                                    href="https://www.ticketmaster.fr/fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block rounded bg-indigo-950 hover:bg-blue-700 text-white font-medium px-8 py-3 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    aria-label="Ouvrir la billetterie dans un nouvel onglet"
                                >
                                    Get Started Today
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partenaires */}
                <section
                    role="region"
                    aria-labelledby="partners-title"
                    className="bg-indigo-950 text-white"
                >
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 text-center">
                        <h2
                            id="partners-title"
                            className="text-3xl font-bold sm:text-4xl"
                        >
                            Nos partenaires
                        </h2>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { src: FoodPartner1, alt: 'Partenaire Food 1', title: 'Partner 1' },
                                { src: FoodPartner2, alt: 'Partenaire Food 2', title: 'Partner 2' },
                                { src: StorePartner1, alt: 'Partenaire Store 1', title: 'Partner 3' },
                                { src: StorePartner2, alt: 'Partenaire Store 2', title: 'Partner 4' },
                                { src: MusicPartner1, alt: 'Partenaire Musique 1', title: 'Partner 5' },
                                { src: MusicPartner2, alt: 'Partenaire Musique 2', title: 'Partner 6' },
                            ].map((partner, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="block rounded-xl border border-gray-950 p-8 shadow-xl transition hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    aria-label={`En savoir plus sur ${partner.title}`}
                                >
                                    <img
                                        src={partner.src}
                                        alt={partner.alt}
                                        className="w-16 h-16 object-cover rounded-full mx-auto mb-4"
                                    />
                                    <h3 className="text-xl font-bold mb-1">{partner.title}</h3>
                                    <p className="text-sm text-gray-300">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci distinctio alias voluptatum blanditiis laudantium.
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Programme */}
                <section
                    role="region"
                    aria-labelledby="programme-section-title"
                    className="py-12 bg-gray-100"
                >
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                        <h2
                            id="programme-section-title"
                            className="sr-only"
                        >
                            Programme des événements
                        </h2>
                        <Programme />
                    </div>
                </section>

                {/* Carte des lieux */}
                <section
                    role="region"
                    aria-labelledby="map-section-title"
                    className="py-12 bg-white-100 text-center"
                >
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                        <h2
                            id="map-section-title"
                            className="text-3xl font-bold sm:text-4xl mb-6"
                        >
                            Carte des Lieux
                        </h2>
                        <MapComponent />
                    </div>
                </section>
            </main>

            <footer role="contentinfo">
                {/* Contenu du footer */}
            </footer>
        </>
    );
};

export default TemplateAccueil;