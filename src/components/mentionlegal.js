import React from 'react';

const MentionsLegal = () => {
  return (
    <>
      {/* Skip link pour accéder directement au contenu principal */}
      <a
        href="#mentions-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded"
      >
        Aller au contenu des mentions légales
      </a>

      <main id="mentions-content" className="min-h-screen bg-gray-100 flex items-center justify-center py-10" role="main">
        <section
          className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full"
          aria-labelledby="mentions-title"
        >
          <header>
            <h1
              id="mentions-title"
              className="text-3xl font-semibold text-center mb-6 text-gray-800"
            >
              Mentions Légales
            </h1>
          </header>

          <article className="text-gray-700 space-y-6">
            <section aria-labelledby="legal-intro">
              <h2 id="legal-intro" className="sr-only">
                Introduction
              </h2>
              <p>
                En conformité avec les dispositions de la loi n° 2004-575 du 21 juin
                2004 pour la confiance dans l'économie numérique, les informations
                suivantes sont fournies aux utilisateurs du site :
              </p>
            </section>

            <section aria-labelledby="site-editor">
              <h2
                id="site-editor"
                className="text-2xl font-semibold text-gray-800"
              >
                1. Éditeur du Site
              </h2>
              <address className="not-italic">
                <p>
                  <strong>Nom de l'éditeur :</strong> Sound Nation
                </p>
                <p>
                  <strong>Adresse :</strong> [Adresse de votre société]
                </p>
                <p>
                  <strong>Téléphone :</strong> [Numéro de téléphone]
                </p>
                <p>
                  <strong>Email :</strong> <a href="mailto:[Adresse email de contact]" className="underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">[Adresse email de contact]</a>
                </p>
              </address>
            </section>

            <section aria-labelledby="site-hosting">
              <h2
                id="site-hosting"
                className="text-2xl font-semibold text-gray-800"
              >
                2. Hébergement du Site
              </h2>
              <p>
                Le site est hébergé par <strong>[Nom de l'hébergeur]</strong>, situé à
                <strong> [adresse de l'hébergeur]</strong>. Vous pouvez les contacter
                au numéro <strong>[numéro de téléphone de l'hébergeur]</strong>.
              </p>
            </section>

            <section aria-labelledby="intellectual-property">
              <h2
                id="intellectual-property"
                className="text-2xl font-semibold text-gray-800"
              >
                3. Propriété Intellectuelle
              </h2>
              <p>
                Le contenu du site, incluant mais non limité aux textes, images, et
                graphiques, est la propriété de <strong>[Nom de votre société]</strong>
                et est protégé par les lois françaises et internationales relatives à la
                propriété intellectuelle.
              </p>
            </section>

            <section aria-labelledby="liability">
              <h2
                id="liability"
                className="text-2xl font-semibold text-gray-800"
              >
                4. Limitation de Responsabilité
              </h2>
              <p>
                <strong>[Nom de votre société]</strong> décline toute responsabilité quant
                aux dommages directs ou indirects pouvant résulter de l'utilisation de
                ce site. L'utilisateur est seul responsable de la protection de ses
                données et de ses équipements.
              </p>
            </section>

            <footer>
              <p className="mt-6 text-center text-gray-500">
                Dernière mise à jour :{' '}
                <time dateTime="2024-11">Novembre 2024</time>
              </p>
            </footer>
          </article>
        </section>
      </main>
    </>
  );
};

export default MentionsLegal;
