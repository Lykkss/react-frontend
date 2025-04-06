import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy";
const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const artistIcons = {
  48: "https://img.icons8.com/color/48/dj.png",
  50: "https://img.icons8.com/color/48/rock-music.png",
  71: "https://img.icons8.com/color/48/techno.png",
  63: "https://img.icons8.com/color/48/orchestra.png",
  69: "https://img.icons8.com/color/48/music.png",
};

function MapWithFilters() {
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
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("Erreur de géolocalisation:", err)
      );
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        const data = res.data.events || [];
        setEvents(data);

        const uniqueCategories = new Set();
        data.forEach((event) =>
          event.categories?.forEach((cat) => uniqueCategories.add(cat.name))
        );
        setCategories(["all", ...Array.from(uniqueCategories)]);
      } catch (err) {
        console.error("Erreur chargement des événements:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const geocodeAddress = async (venue) => {
      const fullAddress = `${venue.address}, ${venue.city}, ${venue.country}`;
      const cacheKey = `geo-${fullAddress}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      try {
        const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: {
            address: fullAddress,
            key: GOOGLE_MAPS_API_KEY,
          },
        });

        const coords = res.data.results[0]?.geometry?.location;
        if (coords) {
          localStorage.setItem(cacheKey, JSON.stringify(coords));
          return coords;
        }
      } catch (err) {
        console.warn("Erreur géocodage:", fullAddress, err.message);
      }
      return null;
    };

    const filterAndGeocode = async () => {
      const filtered = [];

      for (const event of events) {
        if (categoryFilter !== "all") {
          const catNames = event.categories?.map((c) => c.name) || [];
          if (!catNames.includes(categoryFilter)) continue;
        }

        if (dateFilter) {
          const eventDate = new Date(event.start_date).toISOString().split("T")[0];
          if (eventDate !== dateFilter) continue;
        }

        const venue = event.venue;
        if (!venue) continue;

        const coords = await geocodeAddress(venue);
        if (!coords) continue;

        filtered.push({
          id: event.id,
          lat: coords.lat,
          lng: coords.lng,
          name: venue.venue,
          description: `🎤 ${event.title}`,
          url: event.url,
          icon: artistIcons[event.id],
        });
      }

      setFilteredConcerts(filtered);
    };

    if (events.length > 0) {
      filterAndGeocode();
    }
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

      <div style={{ marginBottom: 10 }}>
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

      <div style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
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
                  loc.icon && typeof window !== "undefined" && window.google
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
                  <a href={selectedLocation.url} target="_blank" rel="noreferrer">
                    Voir l'événement
                  </a>
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
