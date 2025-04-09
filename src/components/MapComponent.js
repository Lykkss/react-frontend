// src/components/MapComponent.js
import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

// Clé Google Maps depuis la variable d'environnement ou la valeur par défaut
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
// Utilisation de NEXT_PUBLIC_API_URL pour pointer vers votre back-end Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/proxy";
// Coordonnées par défaut (exemple : Paris)
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
 * Fonction de parsing qui attend une chaîne du format "<p>latitude | longitude</p>"
 * @param {string} rawString - La chaîne à parser
 * @returns {{ latitude: number, longitude: number }}
 * @throws {Error} Si le format est invalide ou les coordonnées sont non convertibles
 */
export function parseLocationString(rawString) {
  try {
    if (!rawString) throw new Error("Chaîne vide");

    // Supprime les balises HTML et espaces en trop
    const cleaned = rawString.replace(/<\/?[^>]+(>|$)/g, "").trim();
    const parts = cleaned.split("|").map(part => part.trim());

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
    console.error("Erreur lors du parsing de la chaîne :", error.message);
    throw error;
  }
}

const MapWithFilters = () => {
  const [showToilettes, setShowToilettes] = useState(false);
  const [showBuvettes, setShowBuvettes] = useState(false);
  const [concerts, setConcerts] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [categories, setCategories] = useState([]);

  // Récupération de la localisation utilisateur
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

  // Récupération des concerts depuis l'API Django
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        // Ici, nous appelons l'endpoint /concerts/ sur votre API
        const res = await axios.get(`${API_URL}/concerts`);
        // On suppose que l'API renvoie un tableau de concerts
        const data = res.data || [];
        setConcerts(data);

        // Récupération des catégories
        const cats = new Set();
        data.forEach((e) => {
          e.categories?.forEach((c) => cats.add(c.name));
        });
        setCategories(["all", ...Array.from(cats)]);
      } catch (err) {
        console.error("Erreur chargement concerts :", err);
      }
    };

    fetchConcerts();
  }, []);

  // Filtrage et parsing des coordonnées pour les concerts affichés sur la carte
  useEffect(() => {
    const filterAndParse = async () => {
      const results = await Promise.all(
        concerts.map(async (concert) => {
          // Filtrage par catégorie
          if (categoryFilter !== "all") {
            const catNames = concert.categories?.map((c) => c.name) || [];
            if (!catNames.includes(categoryFilter)) return null;
          }

          // Filtrage par date
          if (dateFilter) {
            const eventDate = new Date(concert.start_date).toISOString().split("T")[0];
            if (eventDate !== dateFilter) return null;
          }

          // Récupération des coordonnées à partir de la description de venue
          const rawLoc = concert.venue?.description;
          let coords = null;
          if (rawLoc) {
            try {
              const parsed = parseLocationString(rawLoc);
              coords = { lat: parsed.latitude, lng: parsed.longitude };
            } catch (err) {
              console.warn("📛 Parsing échoué pour le concert:", concert.title);
            }
          }
          if (coords) {
            return {
              id: concert.id,
              lat: coords.lat,
              lng: coords.lng,
              name: concert.venue?.venue || "Lieu inconnu",
              description: `🎤 ${concert.title}`,
              url: concert.url,
              icon: artistIcons[concert.id], // Ajustez selon votre logique d'icon
            };
          }
          return null;
        })
      );

      setFilteredConcerts(results.filter(Boolean));
    };

    if (concerts.length) filterAndParse();
  }, [concerts, categoryFilter, dateFilter]);

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>Catégorie : </label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
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
                  position={{ lat: 48.892265844185864, lng: 2.3908280829451645 }}
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
