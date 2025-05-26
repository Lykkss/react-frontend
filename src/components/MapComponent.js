import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
const API_URL = process.env.REACT_APP_API_URL;
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

export function parseLocationString(rawString) {
  if (!rawString) throw new Error("Chaîne vide");
  const cleaned = rawString.replace(/<\/?[^>]+(>|$)/g, "").trim();
  const parts = cleaned.split("|").map((p) => p.trim());
  if (parts.length !== 2) throw new Error(`Format invalide : "${cleaned}"`);
  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error(`Coordonnées non valides : ${parts[0]}, ${parts[1]}`);
  }
  return { latitude, longitude };
}

const MapWithFilters = () => {
  const [venues, setVenues]                       = useState([]);
  const [events, setEvents]                       = useState([]);
  const [filteredConcerts, setFilteredConcerts]   = useState([]);
  const [selectedLocation, setSelectedLocation]   = useState(null);
  const [userLocation, setUserLocation]           = useState(null);
  const [venueFilter, setVenueFilter]             = useState("all");
  const [dateFilter, setDateFilter]               = useState("");
  const [showToilettes, setShowToilettes]         = useState(false);
  const [showBuvettes, setShowBuvettes]           = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => {}
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, eRes] = await Promise.all([
          axios.get(`${API_URL}/lieux/`),
          axios.get(`${API_URL}/concerts/`),
        ]);
        setVenues(vRes.data);
        setEvents(eRes.data);
      } catch (err) {
        console.error("Erreur chargement:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = events
      .filter((e) => {
        if (venueFilter !== "all" && e.lieu.toString() !== venueFilter) return false;
        if (dateFilter) {
          const d = new Date(e.start_date).toISOString().split("T")[0];
          if (d !== dateFilter) return false;
        }
        return true;
      })
      .map((e) => {
        const venueObj = venues.find((v) => v.id === e.lieu);
        if (!venueObj) return null;
        try {
          const { latitude, longitude } = parseLocationString(venueObj.description);
          return {
            id: e.id,
            lat: latitude,
            lng: longitude,
            name: e.title,
            description: `🎤 ${e.title}`,
            venueName: venueObj.name,
            url: e.url,
            iconUrl: artistIcons[e.id],  // <-- URL de l'icône
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    setFilteredConcerts(result);
  }, [events, venues, venueFilter, dateFilter]);

  return (
    <div>
      <button
        onClick={() => {
          setVenueFilter("all");
          setDateFilter("");
        }}
        className="mb-2 px-3 py-1 bg-indigo-600 text-white rounded"
      >
        Afficher tous les lieux
      </button>

      <div className="mb-4 flex items-center">
        <label className="mr-4">
          Lieu :
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            <option value="all">Tous les lieux</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date :
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="ml-2 p-1 border rounded"
          />
        </label>
      </div>

      <div className="mb-4 flex">
        <label className="mr-4">
          <input
            type="checkbox"
            checked={showToilettes}
            onChange={() => setShowToilettes((v) => !v)}
            className="mr-1"
          />
          Toilettes
        </label>
        <label>
          <input
            type="checkbox"
            checked={showBuvettes}
            onChange={() => setShowBuvettes((v) => !v)}
            className="mr-1"
          />
          Buvettes
        </label>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
            style={{ width: "100%", height: "100%" }}
          >
            {showToilettes &&
              [
                { lat: 48.85341, lng: 2.3488, name: "Toilette B" },
                { lat: 48.89227, lng: 2.39083, name: "Toilette A" },
              ].map((loc) => (
                <Marker
                  key={loc.name}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  icon={{
                    url: iconwcandfood.toilets,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() => setSelectedLocation({ ...loc, description: "Toilettes publiques 🚻" })}
                />
              ))}

            {showBuvettes &&
              [
                { lat: 48.88912, lng: 2.39518, name: "Buvette A" },
                { lat: 48.8936, lng: 2.39441, name: "Buvette B" },
              ].map((loc) => (
                <Marker
                  key={loc.name}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  icon={{
                    url: iconwcandfood.buvette,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() => setSelectedLocation({ ...loc, description: "Buvette disponible 🍻" })}
                />
              ))}

            {filteredConcerts.map((loc) => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                title={loc.name}
                icon={
                  loc.iconUrl
                    ? {
                        url: loc.iconUrl,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }
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
                  <h3 className="font-bold">{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  <p>
                    <strong>Lieu :</strong> {selectedLocation.venueName}
                  </p>
                  {selectedLocation.url && (
                    <p>
                      <a href={selectedLocation.url} target="_blank" rel="noopener noreferrer">
                        En savoir plus
                      </a>
                    </p>
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
