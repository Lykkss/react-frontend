import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";
const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const MapWithFilters = () => {
  const [events, setEvents] = useState([]);
  const [geocodedEvents, setGeocodedEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categories, setCategories] = useState([]);

  // 1. Récupération des événements
  useEffect(() => {
    axios.get(`${API_URL}/events`)
      .then(res => {
        setEvents(res.data.events || []);

        // Extraire toutes les catégories
        const cats = new Set();
        res.data.events.forEach(e => {
          e.categories?.forEach(cat => cats.add(cat.name));
        });
        setCategories(["all", ...Array.from(cats)]);
      })
      .catch(err => console.error("Erreur récupération events :", err));
  }, []);

  // 2. Géocodage
  useEffect(() => {
    const fetchGeocoded = async () => {
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
            console.warn("Erreur géocodage :", addressFull, err);
          }
        }

        if (coords) {
          results.push({
            id: event.id,
            lat: coords.lat,
            lng: coords.lng,
            name: event.venue.venue,
            description: event.title,
            category: event.categories?.[0]?.name || "Autres",
            url: event.url,
          });
        }
      }

      setGeocodedEvents(results);
    };

    if (events.length) fetchGeocoded();
  }, [events]);

  // 3. Filtrage par catégorie
  const filteredEvents = selectedCategory === "all"
    ? geocodedEvents
    : geocodedEvents.filter(e => e.category === selectedCategory);

  return (
    <div>
      {/* Sélecteur de catégorie */}
      <div style={{ marginBottom: 10 }}>
        <label>Catégorie : </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Carte */}
      <div style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map defaultZoom={13} defaultCenter={parisCoordinates} style={{ height: "100%", width: "100%" }}>
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
                  <a href={selectedLocation.url} target="_blank">Voir +</a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default MapWithFilters;
