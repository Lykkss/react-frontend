import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_FALLBACK_KEY";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";
const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const MapWithCheckboxes = () => {
  const [showToilettes, setShowToilettes] = useState(false);
  const [showBuvettes, setShowBuvettes] = useState(false);
  const [showConcerts, setShowConcerts] = useState(false);
  const [events, setEvents] = useState([]);
  const [geocodedConcerts, setGeocodedConcerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("❌ Clé API Google Maps manquante !");
    }
  }, []);

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des événements :", error);
      }
    };
    fetchEvents();
  }, []);

  // Géolocalisation utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("❌ Erreur de géolocalisation :", error)
      );
    } else {
      console.error("❌ La géolocalisation n'est pas supportée.");
    }
  }, []);

  // Géocoder les concerts dynamiquement
  useEffect(() => {
    const geocodeEvents = async () => {
      const result = [];

      for (const event of events) {
        const venue = event.venue;
        if (!venue || !venue.address || !venue.city) continue;

        const fullAddress = `${venue.address}, ${venue.city}, ${venue.country}`;
        const cacheKey = `geo-${fullAddress}`;
        let coords = JSON.parse(localStorage.getItem(cacheKey) || "null");

        if (!coords) {
          try {
            const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
              params: { address: fullAddress, key: GOOGLE_MAPS_API_KEY },
            });
            coords = geoRes.data.results[0]?.geometry?.location;
            if (coords) {
              localStorage.setItem(cacheKey, JSON.stringify(coords));
            }
          } catch (err) {
            console.warn("⚠️ Échec géocodage:", fullAddress, err);
            continue;
          }
        }

        if (coords) {
          result.push({
            id: event.id,
            lat: coords.lat,
            lng: coords.lng,
            name: venue.venue,
            description: `Concert: ${event.title}`,
            url: event.url,
          });
        }
      }

      setGeocodedConcerts(result);
    };

    if (events.length) {
      geocodeEvents();
    }
  }, [events]);

  // Calculer l'itinéraire
  const calculateRoute = (destination) => {
    if (window.google && userLocation && destination && mapInstance) {
      const directionsService = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(mapInstance);

      directionsService.route(
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
            console.error("❌ Erreur de calcul d'itinéraire :", status);
          }
        }
      );
    } else {
      alert("🧭 Géolocalisation non activée ou destination invalide.");
    }
  };

  // Nettoyer itinéraire
  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
  };

  return (
    <div>
      {/* Filtres */}
      <div className="checkboxes" style={{ marginBottom: "10px" }}>
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
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={showConcerts}
            onChange={() => setShowConcerts(!showConcerts)}
          />
          Concerts
        </label>
      </div>

      {/* Carte */}
      <div className="map-container" style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={13}
            defaultCenter={userLocation || parisCoordinates}
            onLoad={(map) => setMapInstance(map)}
          >
            {/* Toilettes */}
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

            {/* Buvettes */}
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

            {/* Concerts */}
            {showConcerts &&
              geocodedConcerts.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  title={location.name}
                  onClick={() => setSelectedLocation(location)}
                />
              ))}

            {/* InfoWindow */}
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
