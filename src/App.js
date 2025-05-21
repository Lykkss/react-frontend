import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Posts from './components/Posts';
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
            <Route path="/posts" element={<Posts />} />
            <Route path="/Programme" element={<Programme />} />
            <Route path="/groupe/:id" element={<GroupeDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/mentions-legales" element={<Mentionlegal />} />
+           <Route path="/faq" element={<FAQ />} />   {/* ← nouvelle route */}
          </Routes>
        </main>
        <CookieConsent /* ...props... */ />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
