import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyBp3CW6pCqZU-zFe-oL2zL7NF2ZPJ6B-1c";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy";
const parisCoordinates = { lat: 48.89243438749084, lng: 2.3940741223491946 };

// icônes pour événements et commodités
const artistIcons = {
  48: "https://img.icons8.com/color/48/dj.png",
  50: "https://img.icons8.com/color/48/rock-music.png",
  // ...
};
const iconWcAndFood = {
  toilets: "https://img.icons8.com/ios-filled/50/wc.png",
  buvette: "https://img.icons8.com/color/48/beer.png",
};

export function parseLocationString(rawString) {
  // ... parsing code unchanged ...
}

const MapWithFilters = () => {
  const [showToilettes, setShowToilettes] = useState(false);
  const [showBuvettes, setShowBuvettes] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [categories, setCategories] = useState([]);

  // géolocalisation utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Erreur de géolocalisation :", error)
      );
    }
  }, []);

  // récupération des événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        const data = res.data.events || [];
        setEvents(data);
        const cats = new Set();
        data.forEach(e => e.categories?.forEach(c => cats.add(c.name)));
        setCategories(["all", ...Array.from(cats)]);
      } catch (err) {
        console.error("Erreur chargement événements:", err);
      }
    };
    fetchEvents();
  }, []);

  // filtrage et parsing des coordonnées
  useEffect(() => {
    const filterAndParse = async () => {
      const results = await Promise.all(events.map(async event => {
        if (categoryFilter !== "all") {
          const catNames = event.categories?.map(c => c.name) || [];
          if (!catNames.includes(categoryFilter)) return null;
        }
        if (dateFilter) {
          const eventDate = new Date(event.start_date).toISOString().split("T")[0];
          if (eventDate !== dateFilter) return null;
        }
        let coords = null;
        if (event.venue?.description) {
          try { coords = parseLocationString(event.venue.description); }
          catch (_) { /* warning logged */ }
        }
        if (coords) {
          return {
            id: event.id,
            lat: coords.latitude,
            lng: coords.longitude,
            name: event.venue?.venue || "Lieu inconnu",
            description: `🎤 ${event.title}`,
            url: event.url,
            icon: artistIcons[event.id],
          };
        }
        return null;
      }));
      setFilteredConcerts(results.filter(Boolean));
    };
    if (events.length) filterAndParse();
  }, [events, categoryFilter, dateFilter]);

  return (
    <div>
      {/* Formulaire de filtres accessible */}
      <form
        className="mb-4"
        aria-labelledby="filters-legend"
        role="search"
      >
        <fieldset>
          <legend id="filters-legend" className="sr-only">
            Filtres de la carte
          </legend>

          <label htmlFor="category-select" className="mr-2">
            Catégorie :
          </label>
          <select
            id="category-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label htmlFor="date-filter" className="ml-6 mr-2">
            Date :
          </label>
          <input
            type="date"
            id="date-filter"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          />
        </fieldset>

        <fieldset className="mt-3">
          <legend className="font-semibold mb-1">
            Commodités
          </legend>
          <label htmlFor="toilettes-checkbox" className="mr-4">
            <input
              type="checkbox"
              id="toilettes-checkbox"
              checked={showToilettes}
              onChange={() => setShowToilettes(!showToilettes)}
              className="mr-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            />
            Toilettes
          </label>

          <label htmlFor="buvettes-checkbox">
            <input
              type="checkbox"
              id="buvettes-checkbox"
              checked={showBuvettes}
              onChange={() => setShowBuvettes(!showBuvettes)}
              className="mr-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            />
            Buvettes
          </label>
        </fieldset>
      </form>

      {/* Carte interactive */}
      <div
        role="application"
        aria-label="Carte interactive du festival">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ height: "500px", width: "100%" }}
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
          >
            {/* Markers toilettes */}
            {showToilettes && (
              <>
                <Marker
                  position={{ lat: 48.85341, lng: 2.3488 }}
                  title="Toilettes publiques" />
                <Marker
                  position={{ lat: 48.8922658, lng: 2.390828 }}
                  title="Toilettes publiques" />
              </>
            )}
            {/* Markers buvettes */}
            {showBuvettes && (
              <>
                <Marker
                  position={{ lat: 48.889119, lng: 2.395181 }}
                  title="Buvette" />
                <Marker
                  position={{ lat: 48.893596, lng: 2.394414 }}
                  title="Buvette" />
              </>
            )}
            {/* Markers événements filtrés */}
            {filteredConcerts.map(loc => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                title={loc.name}
                onClick={() => setSelectedLocation(loc)}
              />
            ))}

            {/* Infobulle accessible */}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h2 className="font-semibold">{selectedLocation.name}</h2>
                  <p>{selectedLocation.description}</p>
                  {selectedLocation.url && (
                    <a
                      href={selectedLocation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Plus d'infos
                    </a>
                  )}
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
