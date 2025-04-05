import React, { useState, useEffect, useCallback } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";
const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const MapWithCheckboxes = () => {
  const [filters, setFilters] = useState({
    toilettes: false,
    buvettes: false,
    concerts: false,
  });
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // ✅ Gérer les filtres
  const toggleFilter = (key) =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));

  // ✅ Récupération des événements
  useEffect(() => {
    axios
      .get(`${API_URL}/events`)
      .then((res) => setEvents(res.data.events || []))
      .catch((err) => console.error("❌ Erreur lors de la récupération des événements :", err));
  }, []);

  // ✅ Géolocalisation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => console.error("❌ Erreur de géolocalisation :", err)
    );
  }, []);

  // ✅ Extraction des concerts avec coordonnées
  const getConcerts = useCallback(() =>
    events
      .filter((e) => e.venue?.latitude && e.venue?.longitude)
      .map((e) => ({
        id: e.id,
        lat: parseFloat(e.venue.latitude),
        lng: parseFloat(e.venue.longitude),
        name: e.venue.venue,
        description: `Concert: ${e.title}`,
        url: e.url,
      })), [events]);

  // ✅ Calcul d’itinéraire
  const calculateRoute = (destination) => {
    if (!window.google || !userLocation || !destination || !mapInstance) {
      alert("Géolocalisation ou carte non disponible.");
      return;
    }

    const service = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer({ map: mapInstance });

    service.route(
      {
        origin: userLocation,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          renderer.setDirections(result);
          setDirectionsRenderer(renderer);
        } else {
          console.error("❌ Échec de l'itinéraire :", status);
        }
      }
    );
  };

  const clearRoute = () => {
    directionsRenderer?.setMap(null);
    setDirectionsRenderer(null);
  };

  return (
    <div>
      {/* ✅ Filtres */}
      <div className="checkboxes" style={{ marginBottom: "10px" }}>
        {["toilettes", "buvettes", "concerts"].map((type) => (
          <label key={type} style={{ marginLeft: type !== "toilettes" ? "10px" : 0 }}>
            <input
              type="checkbox"
              checked={filters[type]}
              onChange={() => toggleFilter(type)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      {/* ✅ Carte */}
      <div className="map-container" style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
            onLoad={setMapInstance}
          >
            {filters.toilettes && (
              <Marker
                position={{ lat: 48.857, lng: 2.352 }}
                title="Toilettes 1"
                onClick={() =>
                  setSelectedLocation({
                    name: "Toilettes 1",
                    description: "Toilettes publiques.",
                    lat: 48.857,
                    lng: 2.352,
                  })
                }
              />
            )}
            {filters.buvettes && (
              <Marker
                position={{ lat: 48.858, lng: 2.353 }}
                title="Buvette 1"
                onClick={() =>
                  setSelectedLocation({
                    name: "Buvette 1",
                    description: "Petite buvette.",
                    lat: 48.858,
                    lng: 2.353,
                  })
                }
              />
            )}
            {filters.concerts &&
              getConcerts().map((loc) => (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  title={loc.name}
                  onClick={() => setSelectedLocation(loc)}
                />
              ))}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={clearRoute}
              >
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  <button onClick={() => calculateRoute(selectedLocation)}>Y aller</button>
                  <button onClick={clearRoute} style={{ marginLeft: "10px" }}>
                    Effacer
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default MapWithCheckboxes;
