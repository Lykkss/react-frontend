import React from 'react';
import MapComponent from './MapComponent';
import eventTicketImage from '../assets/melissa-askew-AUXanrckXn0-unsplash.jpg';

function FestivalTemplate() {
  return (
    <>
      {/* Skip link pour accéder directement au contenu principal */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded"
      >
        Aller au contenu
      </a>

      {/* En-tête de page */}
      <header role="banner">
        {/* Votre nav ou logo ici si besoin */}
      </header>

      <main id="main-content" className="text-black bg-white">
        
        {/* Hero */}
        <section
          role="region"
          aria-labelledby="hero-title"
          className="relative overflow-hidden"
        >
          {/* image de fond purement décorative */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={eventTicketImage}
              alt=""
              className="w-full h-full object-cover brightness-75"
            />
          </div>

          <div className="relative max-w-3xl mx-auto py-32 px-4 text-center">
            <h1
              id="hero-title"
              className="text-5xl font-extrabold text-white mb-4"
            >
              Le Festival
            </h1>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Musique, art et culture se rencontrent pour une expérience
              inoubliable.
            </p>
            <a
              href="/programme"
              className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              aria-label="Voir le programme complet du festival"
            >
              Voir le programme
            </a>
          </div>
        </section>
        
        {/* Carte des lieux */}
        <section
          role="region"
          aria-labelledby="map-title"
          className="py-12 bg-white-100"
        >
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
            <h2
              id="map-title"
              className="text-3xl font-bold sm:text-4xl"
            >
              Carte des Lieux
            </h2>
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <MapComponent />
            </div>
          </div>
        </section>

        {/* Informations Pratiques */}
        <section
          role="region"
          aria-labelledby="infos-title"
          className="py-16 bg-blue-50"
        >
          <div className="max-w-screen-xl mx-auto px-4">
            <h2
              id="infos-title"
              className="text-3xl font-bold mb-12 text-center"
            >
              Informations Pratiques
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Horaires & Lieu',
                  items: [
                    { icon: '🕒', label: 'Horaires', text: '10h00 – 23h00 chaque jour' },
                    { icon: '📍', label: 'Adresse', text: 'Parc des Expositions, 123 Rue du Festival, 75000 Paris' },
                  ],
                },
                {
                  title: 'Tarifs',
                  items: [
                    { text: 'Pass journée : 25 €' },
                    { text: 'Pass 3 jours : 60 €' },
                    { text: 'Pass VIP : 120 € (backstage + goodies)' },
                  ],
                },
                {
                  title: 'Transports',
                  items: [
                    { icon: '🚇', text: 'Métro ligne 4 – station “Festival” (200 m)' },
                    { icon: '🚌', text: 'Bus n°27 et n°62 – arrêt “Expositions”' },
                  ],
                },
                {
                  title: 'Parking & Accessibilité',
                  items: [
                    { icon: '🚗', text: 'Parking gratuit (2 000 places)' },
                    { icon: '♿', text: 'Accessible aux PMR' },
                  ],
                },
              ].map((section, i) => (
                <div
                  key={i}
                  className="p-6 bg-blue-50 border-2 border-indigo-950 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold mb-4 text-indigo-950 text-center">
                    {section.title}
                  </h3>

                  {/* Liste sémantique */}
                  <ul className="space-y-2 text-indigo-950">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start">
                        {item.icon && (
                          <span className="mr-2 text-xl leading-none" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        <div>
                          {item.label && (
                            <strong className="block text-indigo-950">
                              {item.label}:
                            </strong>
                          )}
                          <span>{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer role="contentinfo">
        {/* Vos mentions légales, contacts, etc. */}
      </footer>
    </>
  );
}

export default FestivalTemplate;
