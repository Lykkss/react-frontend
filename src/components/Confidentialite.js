import React from 'react';

const Confidentialite = () => {
  return (
    <>
      {/* Lien de saut pour navigation clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 p-4 bg-white text-blue-600"
      >
        Passer au contenu
      </a>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
        <section className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">

          <header>
            <h1
              id="policy-title"
              className="text-3xl font-semibold text-center mb-6 text-gray-800"
            >
              Politique de Confidentialité
            </h1>
          </header>

          <main id="main-content" aria-labelledby="policy-title">
            <article className="text-gray-700 space-y-6">
              <p>
                Nous accordons une grande importance à la protection de vos
                données personnelles. Cette politique de confidentialité
                explique comment nous collectons, utilisons et protégeons vos
                informations personnelles lorsque vous utilisez notre site web
                ou nos services.
              </p>

              <section aria-labelledby="collecte-heading">
                <h2
                  id="collecte-heading"
                  className="text-2xl font-semibold text-gray-800"
                >
                  1. Collecte des Informations
                </h2>
                <p>
                  Nous collectons des informations lorsque vous vous inscrivez
                  sur notre site, remplissez un formulaire ou interagissez
                  avec nos services. Les informations recueillies peuvent
                  inclure votre nom, adresse e-mail, informations de paiement,
                  etc.
                </p>
              </section>

              <section aria-labelledby="utilisation-heading">
                <h2
                  id="utilisation-heading"
                  className="text-2xl font-semibold text-gray-800"
                >
                  2. Utilisation des Informations
                </h2>
                <p>
                  Nous utilisons vos informations pour vous fournir un service
                  personnalisé, traiter vos demandes et améliorer nos produits
                  et services.
                </p>
              </section>

              <section aria-labelledby="protection-heading">
                <h2
                  id="protection-heading"
                  className="text-2xl font-semibold text-gray-800"
                >
                  3. Protection des Informations
                </h2>
                <p>
                  Nous mettons en place des mesures de sécurité pour protéger
                  vos informations personnelles contre tout accès non
                  autorisé, altération ou destruction.
                </p>
              </section>

              <section aria-labelledby="partage-heading">
                <h2
                  id="partage-heading"
                  className="text-2xl font-semibold text-gray-800"
                >
                  4. Partage des Informations
                </h2>
                <p>
                  Nous ne vendons ni ne partageons vos informations
                  personnelles avec des tiers sans votre consentement, sauf
                  lorsque cela est nécessaire pour vous fournir nos services.
                </p>
              </section>

              <section aria-labelledby="droits-heading">
                <h2
                  id="droits-heading"
                  className="text-2xl font-semibold text-gray-800"
                >
                  5. Vos Droits
                </h2>
                <p>
                  Vous avez le droit d'accéder à vos informations personnelles,
                  de les corriger ou de les supprimer à tout moment. Pour
                  exercer ces droits, veuillez nous contacter via notre page
                  de support.
                </p>
              </section>

              <section aria-labelledby="modifications-heading">
                <h2
                  id="modifications-heading"
                  className="text-2xl font-semibold text-gray-800"
                >
                  6. Modifications de cette Politique
                </h2>
                <p>
                  Nous nous réservons le droit de modifier cette politique de
                  confidentialité à tout moment. Les modifications seront
                  publiées sur cette page avec la date de mise à jour.
                </p>
              </section>
            </article>
          </main>

          <footer>
            <p className="mt-6 text-center text-gray-600">
              Dernière mise à jour : Avril 2025
            </p>
          </footer>

        </section>
      </div>
    </>
  );
};

export default Confidentialite;