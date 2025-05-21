import React from 'react';
import MapComponent from './MapComponent';
import eventTicketImage from '../assets/melissa-askew-AUXanrckXn0-unsplash.jpg';

function FestivalTemplate() {
  return (
    <div className="text-black bg-white">
      
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={eventTicketImage}
            alt="Event ticket"
            className="w-full h-full object-cover brightness-75"
          />
        </div>
        <div className="relative max-w-3xl mx-auto py-32 px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">Le Festival</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Musique, art et culture se rencontrent pour une expérience inoubliable.
          </p>
          <a
            href="/programme"
            className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition"
          >
            Voir le programme
          </a>
        </div>
      </section>
      
      {/* Carte des lieux */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Carte des lieux
          </h2>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <MapComponent />
          </div>
        </div>
      </section>

      {/* Informations Pratiques */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-12 text-center">
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
                className="p-6 bg-white border-l-4 border-blue-600 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-700">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-gray-800">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start">
                      {item.icon && (
                        <span className="mr-2 text-xl leading-none">{item.icon}</span>
                      )}
                      <div>
                        {item.label && (
                          <strong className="block text-blue-600">
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

          <div className="mt-12 text-center">
            <a
              href="https://www.ticketmaster.fr/fr"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition"
            >
              Acheter mes billets
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FestivalTemplate;
