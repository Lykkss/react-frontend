import React, { useState, useEffect } from "react";
import { Map, APIProvider, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import axios from "axios";

// Utilisation des variables d'environnement
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_FALLBACK_KEY";
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "/api/proxy/events";

const parisCoordinates = { lat: 48.8566, lng: 2.3522 };

const MapWithCheckboxes = () => {
  const [showToilettes, setShowToilettes] = useState(false);
  const [showBuvettes, setShowBuvettes] = useState(false);
  const [showConcerts, setShowConcerts] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Charger les événements depuis l'API WordPress via le proxy
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL);
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
      }
    };

    fetchEvents();
  }, []);

  // Localiser l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Erreur de géolocalisation", error)
      );
    }
  }, []);

  // Filtrer les concerts avec coordonnées valides
  const getConcerts = () => {
    return events
      .filter((event) => event.venue && event.venue.latitude && event.venue.longitude)
      .map((event) => ({
        id: event.id,
        lat: parseFloat(event.venue.latitude),
        lng: parseFloat(event.venue.longitude),
        name: event.venue.venue,
        description: `Concert: ${event.title}`,
        url: event.url,
      }));
  };

  // Calculer l'itinéraire vers la destination
  const calculateRoute = (destination) => {
    if (userLocation && destination && mapInstance) {
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
            console.error("Erreur lors du calcul de l'itinéraire : ", status);
          }
        }
      );
    } else {
      alert("Géolocalisation non activée ou destination invalide !");
    }
  };

  // Nettoyer l'itinéraire
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

      {/* Carte Google Maps */}
      <div className="map-container" style={{ height: "500px", width: "100%" }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            mapContainerStyle={{ height: "100%", width: "100%" }}
            zoom={13}
            center={userLocation || parisCoordinates}
            onLoad={(map) => setMapInstance(map)}
          >
            {/* Marqueurs pour les toilettes */}
            {showToilettes && (
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

            {/* Marqueurs pour les buvettes */}
            {showBuvettes && (
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

            {/* Marqueurs pour les concerts */}
            {showConcerts &&
              getConcerts().map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  title={location.name}
                  onClick={() => setSelectedLocation(location)}
                />
              ))}

            {/* InfoWindow pour afficher les détails du marqueur sélectionné */}
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
