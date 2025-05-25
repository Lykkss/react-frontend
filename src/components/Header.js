import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    return (
        <header role="banner" className="flex justify-between items-center p-5 bg-black text-white">
            {/* Logo et lien vers l'accueil avec aria-label */}
            <div className="header-left">
                <Link
                    to="/"
                    aria-label="Aller à la page d’accueil Live Event"
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                    <h1 className="ml-9 font-semibold text-xl">Live Event</h1>
                </Link>
            </div>

            {/* Navigation principale avec aria-label */}
            <nav className="header-right" aria-label="Navigation principale">
                <ul className="flex gap-4 m-0 p-0">
                    <li>
                        <Link
                            to="/festival"
                            className="text-white no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            aria-current={location.pathname === '/festival' ? 'page' : undefined}
                        >
                            Festival
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/programme"
                            className="text-white no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            aria-current={location.pathname === '/programme' ? 'page' : undefined}
                        >
                            Programme
                        </Link>
                    </li>
                    <li>
                        <a
                            href="https://www.ticketmaster.fr/fr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            aria-label="Billetterie (ouvre dans un nouvel onglet)"
                        >
                            Billetterie
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
