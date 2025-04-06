import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyBp3CW6pCqZU-zFe-oL2zL7NF2ZPJ6B-1c";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy";
const parisCoordinates = { lat: 48.89243438749084, lng: 2.3940741223491946 };

const artistIcons = {
  48: "https://img.icons8.com/color/48/dj.png",
  50: "https://img.icons8.com/color/48/rock-music.png",
  71: "https://img.icons8.com/emoji/48/musical-note-emoji.png",
  63: "https://img.icons8.com/color/48/orchestra.png",
  69: "https://img.icons8.com/color/48/music.png",
};

export function parseLocationString(rawString) {
  try {
    if (!rawString) throw new Error("Chaîne vide");
    const cleaned = rawString.replace(/<\/?[^>]+(>|$)/g, "").trim();
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

    return { latitude, longitude };
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
  const [toilettesData, setToilettesData] = useState([]);
  const [buvettesData, setBuvettesData] = useState([]);
  const [scenesData, setScenesData] = useState([]);
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
        const toilettes = [];
        const buvettes = [];
        const scenes = [];

        data.forEach((e) => {
          e.categories?.forEach((c) => cats.add(c.name));

          const rawLoc = e.venue?.description;
          if (!rawLoc) return;

          try {
            const { latitude, longitude } = parseLocationString(rawLoc);
            const base = {
              id: e.id,
              lat: latitude,
              lng: longitude,
              name: e.venue?.venue || e.title,
              description: e.title,
              url: e.url,
              icon: artistIcons[e.id],
            };

            const title = e.title.toLowerCase();
            if (title.includes("toilette")) {
              toilettes.push(base);
            } else if (title.includes("buvette")) {
              buvettes.push(base);
            } else if (title.includes("scène") || title.includes("scene")) {
              scenes.push(base);
            }
          } catch (err) {
            console.warn("Erreur de parsing pour:", e.title);
          }
        });

        setCategories(["all", ...Array.from(cats)]);
        setToilettesData(toilettes);
        setBuvettesData(buvettes);
        setScenesData(scenes);
      } catch (err) {
        console.error("Erreur chargement événements:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const filterConcerts = async () => {
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
        if (!rawLoc) return null;

        try {
          const parsed = parseLocationString(rawLoc);
          return {
            id: event.id,
            lat: parsed.latitude,
            lng: parsed.longitude,
            name: event.venue?.venue || event.title,
            url: event.url,
            icon: artistIcons[event.id],
          };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(promises);
      setFilteredConcerts(results.filter(Boolean));
    };

    if (events.length) filterConcerts();
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
            defaultCenter={userLocation || parisCoordinates}
          >
            {/* Concerts */}
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

            {/* Toilettes */}
            {showToilettes &&
              toilettesData.map((t) => (
                <Marker
                  key={t.id}
                  position={{ lat: t.lat, lng: t.lng }}
                  title={t.name}
                  onClick={() => setSelectedLocation(t)}
                />
              ))}

            {/* Buvettes */}
            {showBuvettes &&
              buvettesData.map((b) => (
                <Marker
                  key={b.id}
                  position={{ lat: b.lat, lng: b.lng }}
                  title={b.name}
                  onClick={() => setSelectedLocation(b)}
                />
              ))}

            {/* Scènes */}
            {scenesData.map((s) => (
              <Marker
                key={s.id}
                position={{ lat: s.lat, lng: s.lng }}
                title={s.name}
                onClick={() => setSelectedLocation(s)}
              />
            ))}

            {/* InfoWindow */}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  {selectedLocation.url && (
                    <a href={selectedLocation.url} target="_blank" rel="noreferrer">
                      Voir plus
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
