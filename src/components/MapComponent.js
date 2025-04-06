import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyBp3CW6pCqZU-zFe-oL2zL7NF2ZPJ6B-1c";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy";
const parisCoordinates = { lat: 48.89243438749084, lng: 2.3940741223491946 };

const artistIcons = {
  48: "https://img.icons8.com/color/48/dj.png",
  50: "https://img.icons8.com/color/48/rock-music.png",
  71: "https://img.icons8.com/emoji/48/musical-note-emoji.png"
  63: "https://img.icons8.com/color/48/orchestra.png",
  69: "https://img.icons8.com/color/48/music.png",
};

/**
 * Parse une chaîne de type "description | longitude | latitude"
 * @param {string} rawString - La chaîne brute à parser
 * @returns {{ description: string, longitude: number, latitude: number }}
 * @throws {Error} Si le format est invalide ou les coordonnées ne sont pas convertibles
 */
/**
 * Parse une chaîne de type "<p>latitude | longitude</p>"
 * @param {string} rawString - La chaîne brute à parser
 * @returns {{ latitude: number, longitude: number }}
 * @throws {Error} Si le format est invalide ou les coordonnées ne sont pas convertibles
 */
export function parseLocationString(rawString) {
  try {
    if (!rawString) throw new Error("Chaîne vide");

    // Nettoyage de la balise <p> et autres caractères HTML
    const cleaned = rawString
      .replace(/<\/?[^>]+(>|$)/g, "") // supprime les balises HTML
      .trim();

    const parts = cleaned.split('|').map(part => part.trim());

    if (parts.length !== 2) {
      throw new Error(`Format invalide. Attendu: "latitude | longitude". Reçu: "${cleaned}"`);
    }

    const [latStr, lonStr] = parts;
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lonStr);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error(`Latitude ou longitude non valides. latitude: "${latStr}", longitude: "${lonStr}"`);
    }

    return {
      latitude,
      longitude
    };
  } catch (error) {
    console.error('Erreur lors du parsing de la chaîne :', error.message);
    throw error;
  }
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        const data = res.data.events || [];
        setEvents(data);

        const cats = new Set();
        data.forEach((e) => {
          e.categories?.forEach((c) => cats.add(c.name));
        });
        setCategories(["all", ...Array.from(cats)]);
      } catch (err) {
        console.error("Erreur chargement événements:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const geocodeAddress = async (venue) => {
      if (!venue || !venue.address || !venue.city || !venue.country) {
        console.warn("Adresse incomplète ou manquante", venue);
        return null;
      }

      const fullAddress = `${venue.address}, ${venue.city}, ${venue.country}`;
      const cacheKey = `geo-${fullAddress}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      try {
        const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: { address: fullAddress, key: GOOGLE_MAPS_API_KEY },
        });

        if (res.data.status !== "OK") {
          console.warn("Erreur geocoding Google:", res.data.error_message);
          return null;
        }

        const coords = res.data.results[0]?.geometry?.location;
        if (coords) {
          localStorage.setItem(cacheKey, JSON.stringify(coords));
          return coords;
        }
      } catch (err) {
        console.error("❌ Geocoding FAILED:", err.message);
      }
      return null;
    };

    const filterAndGeocode = async () => {
      const promises = events.map(async (event) => {
        if (categoryFilter !== "all") {
          const catNames = event.categories?.map((c) => c.name) || [];
          if (!catNames.includes(categoryFilter)) return null;
        }

        if (dateFilter) {
          const eventDate = new Date(event.start_date).toISOString().split("T")[0];
          if (eventDate !== dateFilter) return null;
        }

        const rawLoc = event.venue?.description;
        let coords = null;

        if (rawLoc) {
          try {
            const parsed = parseLocationString(rawLoc);
            coords = { lat: parsed.latitude, lng: parsed.longitude };
          } catch (err) {
            console.warn("📛 Parsing échoué pour l'événement :", event.title);
          }
        }

        if (!coords) {
          coords = await geocodeAddress(event.venue);
        }

        if (coords) {
          return {
            id: event.id,
            lat: coords.lat,
            lng: coords.lng,
            name: event.venue?.venue || "Lieu inconnu",
            url: event.url,
            icon: artistIcons[event.id],
          };
        }

        return null;
      });

      const results = await Promise.all(promises);
      setFilteredConcerts(results.filter(Boolean));
    };

    if (events.length) filterAndGeocode();
  }, [events, categoryFilter, dateFilter]);

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>Catégorie : </label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Date : </label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="checkboxes" style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={showToilettes}
            onChange={() => setShowToilettes(!showToilettes)}
          />
          Toilettes
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={showBuvettes}
            onChange={() => setShowBuvettes(!showBuvettes)}
          />
          Buvettes
        </label>
      </div>

      <div className="map-container" style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={13}
            defaultCenter={parisCoordinates}
          >
            {showToilettes && (
              <Marker
                position={{ lat: 48.857, lng: 2.352 }}
                title="Toilettes 1"
                onClick={() =>
                  setSelectedLocation({
                    name: "Toilettes 1",
                    description: "Toilettes publiques",
                    lat: 48.857,
                    lng: 2.352,
                  })
                }
              />
            )}

            {showBuvettes && (
              <Marker
                position={{ lat: 48.858, lng: 2.353 }}
                title="Buvette 1"
                onClick={() =>
                  setSelectedLocation({
                    name: "Buvette 1",
                    description: "Petite buvette",
                    lat: 48.858,
                    lng: 2.353,
                  })
                }
              />
            )}

            {filteredConcerts.map((loc) => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                title={loc.name}
                icon={
                  loc.icon
                    ? { url: loc.icon, scaledSize: new window.google.maps.Size(40, 40) }
                    : undefined
                }
                onClick={() => setSelectedLocation(loc)}
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

export default MapWithFilters;
