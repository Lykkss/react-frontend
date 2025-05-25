import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950" role="contentinfo">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Logo / Accueil */}
          <div className="mb-6 md:mb-0">
            <a
              href="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Aller à la page d’accueil Live Event"
            >
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Live Event
              </span>
            </a>
          </div>

          {/* Liens de navigation groupés dans des <nav> */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <nav aria-label="Ressources">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Ressources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a
                    href="/festival"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Festival
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="/programme"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Programme
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-label="Suivez-nous">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Suivez-nous
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a
                    href="https://github.com/Lykkss"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com/"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-label="Légal">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Légal
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a
                    href="/confidentialite"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Politique de confidentialité
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="/mentions-legales"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Contactez-nous
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          {/* Date enveloppée dans <time> */}
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            ©{' '}
            <time dateTime={currentYear.toString()}>
              {currentYear}
            </time>{' '}
            <a
              href="/"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Live Event™
            </a>
            . Tous droits réservés.
          </span>

          {/* Réseaux sociaux avec aria-label et focus */}
          <div className="flex mt-4 sm:mt-0 ml-auto space-x-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {/* icône décorative */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.675 0h-21.35C.599 0 0 .6 0 1.326v21.348C0 23.4.599 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.412c0-3.1 1.893-4.787 4.658-4.787 1.325 0 2.464.099 2.797.143v3.245l-1.919.001c-1.505 0-1.796.715-1.796 1.764v2.31h3.591l-.467 3.622h-3.124V24h6.126c.726 0 1.325-.6 1.325-1.326V1.326C24 .6 23.401 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M24 4.557a9.832 9.832 0 0 1-2.828.775 4.943 4.943 0 0 0 2.165-2.724 9.868 9.868 0 0 1-3.127 1.195A4.927 4.927 0 0 0 16.616 3c-2.736 0-4.948 2.218-4.948 4.946 0 .39.043.765.126 1.126A14.015 14.015 0 0 1 1.671 3.149a4.935 4.935 0 0 0-.67 2.482c0 1.712.87 3.223 2.188 4.108a4.928 4.928 0 0 1-2.238-.616v.062c0 2.393 1.698 4.386 3.946 4.842a4.945 4.945 0 0 1-2.229.084c.63 1.964 2.449 3.392 4.604 3.43a9.874 9.874 0 0 1-6.102 2.104c-.397 0-.788-.023-1.175-.067a13.94 13.94 0 0 0 7.545 2.212c9.056 0 14.01-7.5 14.01-13.986 0-.213-.004-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-gray-500 hover:text-pink-500 dark:hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.258.057 2.093.272 2.57.456.635.24 1.09.53 1.57 1.01.48.48.77.935 1.01 1.57.184.477.399 1.312.456 2.57.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.057 1.258-.272 2.093-.456 2.57-.24.635-.53 1.09-1.01 1.57-.48.48-.935.77-1.57 1.01-.477.184-1.312.399-2.57.456-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.258-.057-2.093-.272-2.57-.456-.635-.24-1.09-.53-1.57-1.01-.48-.48-.77-.935-1.01-1.57-.184-.477-.399-1.312-.456-2.57C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.057-1.258.272-2.093.456-2.57.24-.635.53-1.09 1.01-1.57.48-.48.935-.77 1.57-1.01.477-.184 1.312-.399 2.57-.456 1.266-.058 1.646-.07 4.85-.07M12 0c-3.257 0-3.667.014-4.947.072-1.281.059-2.169.27-2.933.58a6.43 6.43 0 0 0-2.287 1.479A6.43 6.43 0 0 0 .653 5.32c-.312.764-.521 1.653-.58 2.933C.015 8.57 0 8.98 0 12c0 3.257.014 3.667.072 4.947.059 1.281.27 2.169.58 2.933a6.43 6.43 0 0 0 1.479 2.287A6.43 6.43 0 0 0 5.32 23.347c.764.312 1.653.521 2.933.58C8.57 23.985 8.98 24 12 24c3.257 0 3.667-.014 4.947-.072 1.281-.059 2.169-.27 2.933-.58a6.43 6.43 0 0 0 2.287-1.479 6.43 6.43 0 0 0 1.479-2.287c.312-.764.521-1.653.58-2.933.058-1.28.072-1.69.072-4.947 0-3.257-.014-3.667-.072-4.947-.059-1.281-.27-2.169-.58-2.933a6.43 6.43 0 0 0-1.479-2.287A6.43 6.43 0 0 0 19.62.653c-.764-.312-1.653-.521-2.933-.58C15.667.014 15.257 0 12 0z"/><circle cx="12" cy="12" r="3.2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
