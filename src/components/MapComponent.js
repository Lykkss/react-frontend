import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;  // ta clé
const parisCoordinates = { lat: 48.89243438749084, lng: 2.3940741223491946 };

const artistIcons = {
  48: "https://img.icons8.com/color/48/dj.png",
  50: "https://img.icons8.com/color/48/rock-music.png",
  71: "https://img.icons8.com/emoji/48/musical-note-emoji.png",
  63: "https://img.icons8.com/color/48/orchestra.png",
  69: "https://img.icons8.com/color/48/music.png",
};

const iconwcandfood = {
  toilets: "https://img.icons8.com/ios-filled/50/wc.png",
  buvette: "https://img.icons8.com/color/48/beer.png",
};

/**
 * Parse "<p>lat | lon</p>" en { latitude, longitude }
 */
export function parseLocationString(rawString) {
  if (!rawString) throw new Error("Chaîne vide");
  const cleaned = rawString.replace(/<\/?[^>]+(>|$)/g, "").trim();
  const parts = cleaned.split("|").map((p) => p.trim());
  if (parts.length !== 2) {
    throw new Error(`Format invalide: "${cleaned}"`);
  }
  const [latStr, lonStr] = parts;
  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lonStr);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error(`Coordonnées invalides: ${latStr}, ${lonStr}`);
  }
  return { latitude, longitude };
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
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => console.error("Géo failed:", err)
    );
  }, []);

  // --- appel à Django via notre proxy Next.js ---
  useEffect(() => {
    axios
      .get("/api/proxy/concerts")               // <-- note le "s"
      .then((res) => {
        // Django te renvoie direct un array
        const data = Array.isArray(res.data) ? res.data : [];
        setEvents(data);

        // collecte des catégories
        const cats = new Set();
        data.forEach((e) => {
          // selon ton serializer, ça peut être e.categories (M2M) ou e.category name,
          // ici on suppose que tu as un champ categories = [{ name: "Techno" }, ...]
          e.categories?.forEach((c) => cats.add(c.name));
        });
        setCategories(["all", ...cats]);
      })
      .catch((err) => console.error("Erreur chargement événements:", err));
  }, []);

  // filtrage + parsing
  useEffect(() => {
    if (!events.length) return;

    const arr = events
      .filter((e) => {
        if (categoryFilter !== "all") {
          const names = e.categories?.map((c) => c.name) || [];
          if (!names.includes(categoryFilter)) return false;
        }
        if (dateFilter) {
          const d = new Date(e.start_date).toISOString().split("T")[0];
          if (d !== dateFilter) return false;
        }
        return true;
      })
      .map((e) => {
        try {
          const { latitude, longitude } = parseLocationString(
            e.venue?.description
          );
          return {
            id: e.id,
            lat: latitude,
            lng: longitude,
            name: e.venue?.venue || "Lieu inconnu",
            description: `🎤 ${e.title}`,
            url: e.url,
            icon: artistIcons[e.id],
          };
        } catch {
          console.warn("Parsing coords failed for", e.title);
          return null;
        }
      })
      .filter(Boolean);

    setFilteredConcerts(arr);
  }, [events, categoryFilter, dateFilter]);

  return (
    <div>
      {/* ... tes filtres inchangés ... */}

      <div className="h-[500px] w-full">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Sanitaires, buvettes, markers… inchangés */}

            {filteredConcerts.map((loc) => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                title={loc.name}
                icon={
                  loc.icon
                    ? {
                        url: loc.icon,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }
                    : undefined
                }
                onClick={() => setSelectedLocation(loc)}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h3 className="font-bold">{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  {selectedLocation.url && (
                    <a
                      href={selectedLocation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir l’événement
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
}

export default MapWithFilters;
