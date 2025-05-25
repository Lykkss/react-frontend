import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import FestivalTemplate from './components/FestivalTemplate';
import TemplateAccueil from './components/TemplateAccueil';
import Programme from './components/Programme';
import GroupeDetails from './components/GroupeDetails';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Confidentialite from './components/Confidentialite';
import Mentionlegal from './components/mentionlegal';
import FAQ from './components/faq';
import CookieConsent from "react-cookie-consent";

function App() {
  // … votre state et useEffect …

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header /* ...props... *//>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<TemplateAccueil />} />
            <Route path="/Festival" element={<FestivalTemplate />} />
            <Route path="/Programme" element={<Programme />} />
            <Route path="/groupe/:id" element={<GroupeDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/mentions-legales" element={<Mentionlegal />} />
+           <Route path="/faq" element={<FAQ />} />   {/* ← nouvelle route */}
          </Routes>
        </main>
          {/* Bannière de consentement aux cookies */}
          <CookieConsent
                    location="bottom"
                    buttonText="J'accepte"
                    declineButtonText="Je refuse"
                    cookieName="myAwesomeCookieConsent"
                    style={{ background: "#2B373B", color: "#fff" }}
                    buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                    declineButtonStyle={{ color: "#fff", background: "#6c757d", fontSize: "13px" }}
                    expires={150}
                    enableDeclineButton
                    onAccept={() => {
                        console.log("Cookies acceptés !");
                    }}
                    onDecline={() => {
                        console.log("Cookies refusés.");
                    }}
                >
                    Ce site utilise des cookies pour améliorer votre expérience utilisateur. Consultez notre <a href="/confidentialite" style={{ color: "#4CAF50" }}>Politique de confidentialité</a> pour en savoir plus.
                </CookieConsent>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
