import React from 'react';

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Politique de Confidentialité
        </h1>
        <div className="text-gray-700 space-y-6">
          <p>
            Nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web ou nos services.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800">1. Collecte des Informations</h2>
          <p>
            Nous collectons des informations lorsque vous vous inscrivez sur notre site, remplissez un formulaire ou interagissez avec nos services. Les informations recueillies peuvent inclure votre nom, adresse e-mail, informations de paiement, etc.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800">2. Utilisation des Informations</h2>
          <p>
            Nous utilisons vos informations pour vous fournir un service personnalisé, traiter vos demandes et améliorer nos produits et services.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800">3. Protection des Informations</h2>
          <p>
            Nous mettons en place des mesures de sécurité pour protéger vos informations personnelles contre tout accès non autorisé, altération ou destruction.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800">4. Partage des Informations</h2>
          <p>
            Nous ne vendons ni ne partageons vos informations personnelles avec des tiers sans votre consentement, sauf lorsque cela est nécessaire pour vous fournir nos services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">5. Vos Droits</h2>
          <p>
            Vous avez le droit d'accéder à vos informations personnelles, de les corriger ou de les supprimer à tout moment. Pour exercer ces droits, veuillez nous contacter via notre page de support.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800">6. Modifications de cette Politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour.
          </p>

          <p className="mt-6 text-center text-gray-500">
            Dernière mise à jour : Avril 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confidentialite;
