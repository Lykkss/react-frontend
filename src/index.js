import React from 'react';
import { createRoot } from 'react-dom/client'; 
import './index.css'; 
import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement); 
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

const festivalPage = "/festival";
const programPage = "/programme";
const ticketPage = "https://www.ticketmaster.fr/fr";


const headerElement = document.getElementById('react-header');
if (headerElement) {
    const headerRoot = createRoot(headerElement); 
    headerRoot.render(
        <Header
            title="Mon Titre de Header"
            festivalPage={festivalPage}
            programPage={programPage}
            ticketPage={ticketPage}
        />
    );
}


const legalPage = "/mentions-legales";
const privacyPage = "/confidentialite";
const contactPage = "/contact";


const footerElement = document.getElementById('react-footer');
if (footerElement) {
    const footerRoot = createRoot(footerElement); 
    footerRoot.render(
        <Footer
            legalPage={legalPage}
            privacyPage={privacyPage}
            contactPage={contactPage}

        />
    );
}
