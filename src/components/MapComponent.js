// src/components/mapComponent.js
import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { parseLocationString } from "./helpers"; // supposons que parseLocationString soit exporté depuis un helper
import config from "../config";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const defaultCenter = { lat: 48.89243438749084, lng: 2.3940741223491946 };

const MapWithFilters = () => {
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Exemple : récupération des concerts via fetch (vous pouvez utiliser Axios comme dans apiClient)
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/concerts/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        // Ici, on attend que data soit un tableau de concerts avec une propriété venue.description à parser
        const concertsParsed = data.map((concert) => {
          let coords = null;
          try {
            coords = parseLocationString(concert.venue?.description || "");
          } catch (err) {
            console.warn("Échec du parsing pour", concert.title);
          }
          return coords ? { id: concert.id, ...coords, title: concert.title } : null;
        }).filter(Boolean);
        setFilteredConcerts(concertsParsed);
      } catch (error) {
        console.error("Erreur lors du chargement des concerts :", error);
      }
    };

    fetchConcerts();
  }, []);

  return (
    <div className="map-container" style={{ height: "500px", width: "100%" }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map style={{ height: "100%", width: "100%" }} defaultZoom={13} defaultCenter={defaultCenter}>
          {filteredConcerts.map((loc) => (
            <Marker
              key={loc.id}
              position={{ lat: loc.latitude, lng: loc.longitude }}
              title={loc.title}
              onClick={() => setSelectedLocation(loc)}
            />
          ))}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3>{selectedLocation.title}</h3>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapWithFilters;
