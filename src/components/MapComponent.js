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

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
        (err) => console.error("Géo failed:", err)
      );
    }
  }, []);

  // Récup des events via le proxy
  useEffect(() => {
    axios
      .get("/api/proxy/events")
      .then((res) => {
        // si ton API WP renvoie { events: [...] }, sinon adapte
        const data = res.data.events || res.data || [];
        setEvents(data);

        const cats = new Set();
        data.forEach((e) =>
          e.categories?.forEach((c) => cats.add(c.name))
        );
        setCategories(["all", ...cats]);
      })
      .catch((err) =>
        console.error("Erreur chargement événements:", err)
      );
  }, []);

  // Filtrage + parsing des coords
  useEffect(() => {
    const doFilter = async () => {
      const arr = await Promise.all(
        events.map((event) => {
          if (categoryFilter !== "all") {
            const names = event.categories?.map((c) => c.name) || [];
            if (!names.includes(categoryFilter)) return null;
          }
          if (dateFilter) {
            const d = new Date(event.start_date)
              .toISOString()
              .split("T")[0];
            if (d !== dateFilter) return null;
          }
          const raw = event.venue?.description;
          if (!raw) return null;
          try {
            const { latitude, longitude } = parseLocationString(raw);
            return {
              id: event.id,
              lat: latitude,
              lng: longitude,
              name: event.venue?.venue || "Lieu inconnu",
              description: `🎤 ${event.title}`,
              url: event.url,
              icon: artistIcons[event.id],
            };
          } catch {
            console.warn("Parsing coords failed for", event.title);
            return null;
          }
        })
      );
      setFilteredConcerts(arr.filter(Boolean));
    };
    if (events.length) doFilter();
  }, [events, categoryFilter, dateFilter]);

  return (
    <div>
      {/* Filtres */}
      <div className="flex items-center mb-4 space-x-4">
        <label>
          Catégorie:
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            checked={showToilettes}
            onChange={() => setShowToilettes(!showToilettes)}
            className="mr-1"
          />
          Toilettes
        </label>
        <label>
          <input
            type="checkbox"
            checked={showBuvettes}
            onChange={() => setShowBuvettes(!showBuvettes)}
            className="mr-1"
          />
          Buvettes
        </label>
      </div>

      {/* Carte */}
      <div className="h-[500px] w-full">
        <APIProvider apiKey={GOOGLE_MAPS_API}>
          <Map
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Sanitaires */}
            {showToilettes && (
              <>
                <Marker
                  position={{ lat: 48.85341, lng: 2.3488 }}
                  title="Toilette B"
                  icon={{
                    url: iconwcandfood.toilets,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() =>
                    setSelectedLocation({
                      name: "Toilette B",
                      description: "Toilettes publiques 🚻",
                      lat: 48.85341,
                      lng: 2.3488,
                    })
                  }
                />
                <Marker
                  position={{
                    lat: 48.892265844185864,
                    lng: 2.3908280829451645,
                  }}
                  title="Toilette A"
                  icon={{
                    url: iconwcandfood.toilets,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() =>
                    setSelectedLocation({
                      name: "Toilette A",
                      description: "Toilettes publiques 🚻",
                      lat: 48.892265844185864,
                      lng: 2.3908280829451645,
                    })
                  }
                />
              </>
            )}

            {/* Buvettes */}
            {showBuvettes && (
              <>
                <Marker
                  position={{ lat: 48.889119253507474, lng: 2.3951812985797716 }}
                  title="Buvette A"
                  icon={{
                    url: iconwcandfood.buvette,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() =>
                    setSelectedLocation({
                      name: "Buvette A",
                      description: "Buvette disponible ici 🍻",
                      lat: 48.889119253507474,
                      lng: 2.3951812985797716,
                    })
                  }
                />
                <Marker
                  position={{ lat: 48.89359608003054, lng: 2.3944138241471657 }}
                  title="Buvette B"
                  icon={{
                    url: iconwcandfood.buvette,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() =>
                    setSelectedLocation({
                      name: "Buvette B",
                      description: "Buvette disponible ici 🍻",
                      lat: 48.89359608003054,
                      lng: 2.3944138241471657,
                    })
                  }
                />
              </>
            )}

            {/* Événements */}
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

            {/* InfoWindow */}
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
};

export default MapWithFilters;
