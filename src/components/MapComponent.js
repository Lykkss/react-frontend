import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";
const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const MapWithCheckboxFilters = () => {
  const [events, setEvents] = useState([]);
  const [geocodedEvents, setGeocodedEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState({}); // { Electro: true, Rock: false, etc. }

  // Récupération des événements
  useEffect(() => {
    axios.get(`${API_URL}/events`)
      .then((res) => {
        const evts = res.data.events || [];
        setEvents(evts);

        // Générer les filtres checkbox dynamiques
        const catMap = {};
        evts.forEach(e => {
          e.categories?.forEach(cat => {
            catMap[cat.name] = false;
          });
        });
        setCategoryFilters(catMap);
      })
      .catch((err) => console.error("Erreur chargement événements:", err));
  }, []);

  // Géocoder les adresses
  useEffect(() => {
    const geocodeEvents = async () => {
      const results = [];

      for (const event of events) {
        if (!event.venue?.address) continue;

        const addressFull = `${event.venue.address}, ${event.venue.city}, ${event.venue.country}`;
        const cacheKey = `geo-${addressFull}`;
        let coords = JSON.parse(localStorage.getItem(cacheKey) || "null");

        if (!coords) {
          try {
            const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
              params: { address: addressFull, key: GOOGLE_MAPS_API_KEY },
            });
            coords = res.data.results[0]?.geometry?.location;
            if (coords) localStorage.setItem(cacheKey, JSON.stringify(coords));
          } catch (err) {
            console.warn("Erreur géocodage:", addressFull, err);
          }
        }

        if (coords) {
          results.push({
            id: event.id,
            lat: coords.lat,
            lng: coords.lng,
            name: event.venue.venue,
            description: event.title,
            categories: event.categories?.map(c => c.name) || [],
            url: event.url,
          });
        }
      }

      setGeocodedEvents(results);
    };

    if (events.length) geocodeEvents();
  }, [events]);

  // Gestion des checkbox
  const toggleCategory = (cat) => {
    setCategoryFilters((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Filtrer les événements selon les catégories cochées
  const activeCategories = Object.entries(categoryFilters)
    .filter(([_, isChecked]) => isChecked)
    .map(([cat]) => cat);

  const filteredEvents = activeCategories.length === 0
    ? []
    : geocodedEvents.filter(event =>
        event.categories.some(cat => activeCategories.includes(cat))
      );

  return (
    <div>
      {/* ✅ Checkboxes dynamiques */}
      <div className="checkboxes" style={{ marginBottom: "10px" }}>
        {Object.entries(categoryFilters).map(([cat, checked]) => (
          <label key={cat} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleCategory(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* ✅ Carte */}
      <div style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map defaultCenter={parisCoordinates} defaultZoom={13} style={{ height: "100%", width: "100%" }}>
            {filteredEvents.map((event) => (
              <Marker
                key={event.id}
                position={{ lat: event.lat, lng: event.lng }}
                title={event.name}
                onClick={() => setSelectedLocation(event)}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  <a href={selectedLocation.url} target="_blank" rel="noreferrer">Voir l'événement</a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default MapWithCheckboxFilters;
