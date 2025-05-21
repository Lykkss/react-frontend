import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="flex justify-between items-center p-5 bg-black text-white">
            <div className="header-left">
                <Link to="/" className="text-white no-underline hover:underline">
                    <h1 className="ml-9 font-semibold">Live Event</h1>
                </Link>
            </div>
            <nav className="header-right">
                <ul className="flex list-none m-0 p-0 gap-4">
                    <li>
                        <a
                            className="text-white no-underline hover:underline"
                            href="/festival"
                        >
                            Festival
                        </a>
                    </li>
                    <li>
                        <Link
                            to="/Programme" 
                            className="text-white no-underline hover:underline"
                        >
                            Programme
                        </Link>
                    </li>
                    <li>
                        <a
                            className="text-white no-underline hover:underline"
                            href="https://www.ticketmaster.fr/fr"
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
